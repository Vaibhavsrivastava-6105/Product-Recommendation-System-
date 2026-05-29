# 🎯 AI Product Recommendation System (`ai-product-recommender-vercel`)

**🚀 Live Demo:** [https://project-recommendation-system.vercel.app](https://project-recommendation-system.vercel.app)

A production-ready, beautifully designed, and highly optimized full-stack **AI Product Recommendation System** built as a single deployable Vercel project. It couples a modern, responsive Vite + React + TypeScript frontend with a secure Vercel Node.js Serverless Function backend.

The system parses user criteria (e.g. *"I want a phone under $500 with good camera"*) in natural language, maps them to a structured user intent, and recommends matching products from an active local database with clear, AI-generated reasoning—all while enforcing a strict anti-hallucination filter.

---

## 💎 Features & UX Highlights

1. **Premium Glassmorphic Design**: Sleek dark-mode aesthetic utilizing modern radial gradients, custom Google Fonts (`Outfit` & `Inter`), glowing border cards, loading shimmers, and micro-animations.
2. **Dynamic Product Catalog**: A live, searchable, and category-filtered product catalog showcasing prices, ratings, and detailed feature badges. Recommended items automatically light up with a glowing border and a neon "Match" tag in the catalog.
3. **Intent Parsing Dashboard**: Displays a visual breakdown of the inferred search attributes (Category, Budget caps, and Must-Have features).
4. **Strict Safety Safeguards (Anti-Hallucination)**: The backend serverless handler strictly validates all recommended product IDs against the verified database. **Any hallucinated IDs returned by the model are instantly dropped** before returning data to the client, guaranteeing that only authentic products are recommended.
5. **Secure Serverless Architecture**: Keeps the API key completely hidden on the server. The frontend communicates with the AI strictly through a relative route `/api/recommend`.
6. **Multi-Provider Compliant**: Engineered using standard, lightweight `fetch` queries, allowing you to swap from OpenAI to DeepSeek, Gemini, or Groq with simple configuration.

---

## 🛠️ Tech Stack

- **Frontend**: Vite, React 19, TypeScript, Vanilla CSS3 (Custom Glassmorphism)
- **Backend**: Vercel Serverless Functions (Node.js runtime + TypeScript compiler)
- **AI Integration**: Standard OpenAI-compatible Chat Completions API
- **Type Safety**: Fully typed requests, responses, datasets, and serverless handlers

---

## 🚀 Local Development Guide

Since this project contains Vercel Serverless Functions, the **strongly recommended** way to run and test it locally is using the Vercel CLI, which hosts both the static frontend assets and the serverless functions under a single port.

### Prerequisite: Install Vercel CLI
If you don't have it already, install the Vercel CLI globally:
```bash
npm install -g vercel
```

### Step 1: Clone and Install Dependencies
```bash
# Navigate to the project directory
cd ai-product-recommender-vercel

# Install NPM packages
npm install
```

### Step 2: Configure Environment Variables
Create a `.env.local` file in the root directory (an `.env.example` has been created for you).
Add your OpenAI or OpenAI-compatible credentials:
```env
# Required: Your AI API credentials
AI_API_KEY=your_actual_api_key_here

# Optional: Base URL (Defaults to OpenAI if omitted)
AI_BASE_URL=https://api.openai.com/v1

# Optional: Model selection (Defaults to gpt-4o-mini if omitted)
AI_MODEL=gpt-4o-mini
```

### Step 3: Run the Application
Start the development server using the Vercel compiler:
```bash
vercel dev
```
This will compile the TypeScript functions, start Vite, and open your application at **`http://localhost:3000`**. Calls to `/api/recommend` will automatically route to the local serverless execution sandbox!

*(Alternative: You can run `npm run dev` to start only the Vite frontend, but API calls will require proxy configurations or a separate function runner).*

---

## ☁️ Vercel Deployment Guide

Deploying this application is seamless and takes less than 2 minutes.

### Option A: Deployment via Vercel Dashboard (Recommended)
1. Commit the code and push it to your **GitHub / GitLab / Bitbucket** repository.
2. Go to the [Vercel Dashboard](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. **Environment Variables**: Expand the environment variables tab and add:
   - `AI_API_KEY` (Required - your API key)
   - `AI_BASE_URL` (Optional - if using alternative endpoints)
   - `AI_MODEL` (Optional - if using alternative models)
5. Click **"Deploy"**. Vercel will automatically detect the Vite build settings, build the `/api/recommend.ts` serverless function, and give you a single public URL!

### Option B: Deployment via Vercel CLI
1. Log in to Vercel in your terminal:
   ```bash
   vercel login
   ```
2. Run the deployment command from the project root:
   ```bash
   vercel --prod
   ```
3. Follow the CLI prompt setups. Make sure to specify the environment variables when prompted or configure them in your Vercel Project Dashboard afterward.

---

## 📝 Example Testing Prompts

Try pasting these prompts into the text field to watch the AI intent parser and catalog matching in action:

1. **Budget-constrained Phone Search**:
   > *"I want a phone under $500 with a good camera"*
   * (Expected: Recommends `PixelMax Lite` ($499) and `NovaPhone A1` ($399). Explains why `NovaPhone A1 Pro` ($549) was omitted due to budget constraints).

2. **Premium Noise-Cancelling Earbuds**:
   > *"Earbuds with excellent noise cancellation and wireless charging"*
   * (Expected: Recommends `SoundBuds Pro` ($179). Highlights features).

3. **High-End Gaming Rig**:
   > *"A gaming laptop with rtx graphics and fast screen"*
   * (Expected: Recommends `GameBox G7` ($1299). Explains high performance specifications).

4. **No-Matches Out of Budget Boundary**:
   > *"I want a laptop under $300 with 16gb ram"*
   * (Expected: Returns 0 recommendations gracefully. Explains that no laptops fit under the $300 boundary, as the cheapest is `UltraBook 14` ($999)).
