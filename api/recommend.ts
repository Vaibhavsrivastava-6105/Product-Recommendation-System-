import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PRODUCTS } from '../src/data/products.js';
import type { Product } from '../src/data/products.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Accept only POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed. Only POST is supported.` });
  }

  try {
    const { preference, products: frontendProducts } = req.body;

    // 2. Validate inputs
    if (!preference || typeof preference !== 'string' || preference.trim() === '') {
      return res.status(400).json({ error: 'Missing or invalid "preference" field. It must be a non-empty string.' });
    }

    // Determine the product catalog to use (use frontend list if valid, fallback to backend list)
    let catalog: Product[] = PRODUCTS;
    if (frontendProducts && Array.isArray(frontendProducts)) {
      // Basic validation of frontend products structure
      const isValid = frontendProducts.every(p => 
        p && 
        typeof p.id === 'string' &&
        typeof p.name === 'string' &&
        typeof p.price === 'number' &&
        typeof p.category === 'string' &&
        Array.isArray(p.features) &&
        typeof p.rating === 'number'
      );
      if (isValid) {
        catalog = frontendProducts;
      }
    }

    // 3. Check for API Credentials
    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      console.error('Server Configuration Error: AI_API_KEY environment variable is not set.');
      return res.status(500).json({ 
        error: 'API key is missing on the server. Please define AI_API_KEY in your environment.' 
      });
    }

    const baseUrl = (process.env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '');
    const model = process.env.AI_MODEL || 'gpt-4o-mini';

    // 4. Construct System and User Prompts
    const systemPrompt = `You are a precise, machine-readable AI Product Recommendation Engine.
You are given a list of products in JSON format.
Your task is to analyze the user's preference and recommend at most 3 products from the provided list that best match their intent.

CRITICAL RULES:
1. ONLY recommend products that are explicitly in the provided dataset. Never invent, hallucinate, or make up product IDs.
2. If no products in the dataset match the user's preferences, return an empty array for "recommendedProductIds" and explain why in the "reasons" object under a "general" key.
3. Infer the user's intent:
   - "category": 'phone', 'laptop', 'earbuds', or null.
   - "maxPrice": number (max budget) if mentioned, or null.
   - "mustHaveFeatures": list of features (e.g., ["5g", "oled", "good camera"]) derived from the preference.
4. Rank the matches by match quality. Use the product rating as a tie-breaker.
5. Return ONLY a strict JSON object matching the exact schema below. Do not output any markdown formatting, preambles, or postscripts.

JSON Output Schema:
{
  "recommendedProductIds": ["id1", "id2"],
  "reasons": {
    "id1": "Explanation of why this product fits the user's criteria.",
    "id2": "Explanation of why this product fits the user's criteria."
  },
  "parsedUserIntent": {
    "category": "phone" | "laptop" | "earbuds" | null,
    "maxPrice": number | null,
    "mustHaveFeatures": ["feature1", "feature2"]
  }
}`;

    const userPrompt = `Product Catalog Dataset:
${JSON.stringify(catalog, null, 2)}

User Preference:
"${preference}"

Provide your recommendation in strict JSON format.`;

    // 5. Query the AI Provider
    const apiEndpoint = `${baseUrl}/chat/completions`;
    const requestBody = {
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.1, // Keep temperature very low for deterministic JSON
      response_format: { type: "json_object" } // Tell OpenAI-compatible endpoints to return JSON
    };

    const apiResponse = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error(`AI API call failed with status ${apiResponse.status}:`, errorText);
      return res.status(500).json({ 
        error: `AI provider API error (Status ${apiResponse.status}). Please check your API credentials and endpoints.` 
      });
    }

    const apiJson = (await apiResponse.json()) as any;
    const assistantContent = apiJson.choices?.[0]?.message?.content;

    if (!assistantContent) {
      return res.status(500).json({ error: 'AI provider returned an empty or invalid completion response.' });
    }

    // 6. Robust JSON Parsing
    let recommendationResult;
    try {
      // Remove potential markdown code blocks (```json ... ```)
      let cleanedContent = assistantContent.trim();
      if (cleanedContent.startsWith('```')) {
        const matches = cleanedContent.match(/^```(?:json)?([\s\S]*?)```$/);
        if (matches && matches[1]) {
          cleanedContent = matches[1].trim();
        }
      }
      recommendationResult = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse AI output as JSON. Raw output:', assistantContent);
      return res.status(500).json({ 
        error: 'The AI model output could not be parsed as valid JSON.',
        rawOutput: assistantContent 
      });
    }

    // 7. Input Schema Normalization
    const recommendedProductIds: string[] = recommendationResult.recommendedProductIds || [];
    const reasons: Record<string, string> = recommendationResult.reasons || {};
    const parsedUserIntent = recommendationResult.parsedUserIntent || {
      category: null,
      maxPrice: null,
      mustHaveFeatures: []
    };

    // 8. CRITICAL ANTI-HALLUCINATION SAFEGUARD
    // Map catalog IDs to a quick-lookup set
    const validProductIds = new Set(catalog.map(p => p.id));
    
    // Filter out any IDs returned by the model that do not exist in our catalog!
    const filteredRecommendedIds = recommendedProductIds.filter(id => {
      const isValid = validProductIds.has(id);
      if (!isValid) {
        console.warn(`Anti-Hallucination Triggered: Filtered out invalid product ID "${id}" recommended by model.`);
      }
      return isValid;
    });

    // Clean up reasons to only include valid IDs
    const filteredReasons: Record<string, string> = {};
    for (const id of filteredRecommendedIds) {
      filteredReasons[id] = reasons[id] || 'This product matches your requirements.';
    }
    if (reasons.general) {
      filteredReasons.general = reasons.general;
    }

    // 9. Return structured response
    return res.status(200).json({
      recommendedProductIds: filteredRecommendedIds,
      reasons: filteredReasons,
      parsedUserIntent
    });

  } catch (error: any) {
    console.error('Error handling recommendation request:', error);
    return res.status(500).json({ 
      error: 'An unexpected internal server error occurred while processing recommendations.',
      details: error.message 
    });
  }
}
