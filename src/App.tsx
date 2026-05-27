import { useState } from 'react';
import ProductList from './components/ProductList';
import PreferenceForm from './components/PreferenceForm';
import Recommendations from './components/Recommendations';
import { PRODUCTS } from './data/products';

interface UserIntent {
  category: string | null;
  maxPrice: number | null;
  mustHaveFeatures: string[];
}

interface RecommendationResponse {
  recommendedProductIds: string[];
  reasons: Record<string, string>;
  parsedUserIntent: UserIntent;
}

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);

  const handleRecommend = async (preference: string) => {
    setIsLoading(true);
    setError(null);
    setRecommendation(null);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preference,
          products: PRODUCTS, // Sent to backend as requested in prompt spec
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch recommendations from the server.');
      }

      setRecommendation(data);
    } catch (err: any) {
      console.error('Error fetching recommendations:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      
      {/* Header Panel */}
      <header className="header-section">
        <h1 className="header-title text-gradient-rainbow">
          SmartAI Recommendation Engine
        </h1>
        <p className="header-subtitle">
          A sleek full-stack AI recommendation portal leveraging a secure serverless backend.
          Enter your buying preferences below to find your perfect tech match.
        </p>
      </header>

      {/* Primary Layout Grid */}
      <main className="main-layout">
        
        {/* Left Column: Form & Recommendation results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <PreferenceForm onSubmit={handleRecommend} isLoading={isLoading} />

          {/* Loading Shimmer State */}
          {isLoading && (
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="shimmer-bg" style={{ height: '24px', width: '200px', borderRadius: '4px' }}></div>
                <div className="shimmer-bg" style={{ height: '20px', width: '80px', borderRadius: '10px' }}></div>
              </div>
              <div className="shimmer-bg" style={{ height: '80px', width: '100%', borderRadius: '12px', marginTop: '8px' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                <div className="shimmer-bg" style={{ height: '140px', width: '100%', borderRadius: '16px' }}></div>
                <div className="shimmer-bg" style={{ height: '140px', width: '100%', borderRadius: '16px' }}></div>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div 
              className="animate-fade-in"
              style={{
                padding: '20px',
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}
            >
              <span style={{ fontSize: '1.5rem', marginTop: '-2px' }}>❌</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f87171' }}>
                  Recommendation Failed
                </h4>
                <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  {error}
                </p>
                <button 
                  onClick={() => setError(null)}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    marginTop: '8px',
                    width: 'fit-content',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Active AI Recommendations */}
          {recommendation && !isLoading && (
            <Recommendations 
              recommendedProductIds={recommendation.recommendedProductIds}
              reasons={recommendation.reasons}
              parsedUserIntent={recommendation.parsedUserIntent}
            />
          )}

        </div>

        {/* Right Column: Catalog Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <ProductList highlightedIds={recommendation?.recommendedProductIds || []} />
        </div>

      </main>

      {/* Footer Branding */}
      <footer style={{ marginTop: '64px', textAlign: 'center', color: 'var(--text-dark)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p>© 2026 SmartAI Product Recommender Corp. Powered by Vercel Serverless.</p>
        <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80' }}></span>
          Vercel Single-Project Compliant
        </p>
      </footer>

    </div>
  );
}
