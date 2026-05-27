import { PRODUCTS } from '../data/products';
import type { Product } from '../data/products';

interface RecommendationsProps {
  recommendedProductIds: string[];
  reasons: Record<string, string>;
  parsedUserIntent: {
    category: string | null;
    maxPrice: number | null;
    mustHaveFeatures: string[];
  };
}

export default function Recommendations({ 
  recommendedProductIds, 
  reasons, 
  parsedUserIntent 
}: RecommendationsProps) {
  
  // Find full product details for each recommended ID
  const recommendedProducts = recommendedProductIds
    .map(id => PRODUCTS.find(p => p.id === id))
    .filter((p): p is Product => !!p);

  const hasRecommendations = recommendedProducts.length > 0;
  const generalReason = reasons.general || '';

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Panel Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.8rem' }}>🎯</span> AI Recommendation Results
        </h2>
        <span 
          style={{
            background: hasRecommendations ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: hasRecommendations ? '#4ade80' : '#f87171',
            border: `1px solid ${hasRecommendations ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
          }}
        >
          {hasRecommendations ? `${recommendedProducts.length} Match(es)` : 'No Matches'}
        </span>
      </div>

      {/* 1. Parsed Intent Analytics Dashboard */}
      <div 
        style={{ 
          background: 'rgba(255, 255, 255, 0.02)', 
          border: '1px solid var(--border-light)', 
          borderRadius: '12px', 
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Parsed User Intent Analytics
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          
          {/* Category Pill */}
          <div className="intent-pill">
            <span className="label">Category</span>
            <span className="value" style={{ textTransform: 'capitalize' }}>
              {parsedUserIntent.category || 'Any Category'}
            </span>
          </div>

          {/* Max Price Pill */}
          <div className="intent-pill">
            <span className="label">Budget Cap</span>
            <span className="value" style={{ color: parsedUserIntent.maxPrice ? '#4ade80' : 'var(--text-primary)' }}>
              {parsedUserIntent.maxPrice ? `$${parsedUserIntent.maxPrice}` : 'Unlimited'}
            </span>
          </div>

          {/* Must Have Features Pill */}
          <div className="intent-pill" style={{ flexGrow: 1 }}>
            <span className="label">Inferred Specs</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
              {parsedUserIntent.mustHaveFeatures && parsedUserIntent.mustHaveFeatures.length > 0 ? (
                parsedUserIntent.mustHaveFeatures.map((feat, idx) => (
                  <span key={idx} className="tag tag-feature" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', borderColor: 'rgba(99,102,241,0.2)' }}>
                    {feat}
                  </span>
                ))
              ) : (
                <span className="value" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>None specified</span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 2. Recommendations List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {hasRecommendations ? (
          recommendedProducts.map((product) => {
            const reasonText = reasons[product.id] || 'Matches your criteria closely.';
            return (
              <div 
                key={product.id}
                className="glow-card"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  padding: '20px',
                  transition: 'var(--transition-smooth)',
                }}
              >
                
                {/* Product Image */}
                <div style={{
                  width: '100%',
                  height: '180px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  marginBottom: '4px'
                }}>
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    loading="lazy"
                  />
                </div>

                {/* Product Summary Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                        {product.brand}
                      </span>
                      <span className={`tag tag-${product.category}`}>
                        {product.category}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {product.name}
                    </h4>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      ${product.price}
                    </span>
                    <span className="rating-badge">
                      ★ {product.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Specs/Features tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {product.features.map((feature, idx) => (
                    <span key={idx} className="tag tag-feature">
                      {feature}
                    </span>
                  ))}
                </div>

                {/* AI Reasoning Panel */}
                <div 
                  style={{
                    background: 'rgba(99, 102, 241, 0.05)',
                    borderLeft: '3px solid var(--color-primary)',
                    borderRadius: '0 8px 8px 0',
                    padding: '12px 16px',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    color: '#cbd5e1',
                  }}
                >
                  <span style={{ display: 'block', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '4px', letterSpacing: '0.05em' }}>
                    💡 AI Recommendation Rationale
                  </span>
                  {reasonText}
                </div>

              </div>
            );
          })
        ) : (
          /* Empty / No Matches State */
          <div 
            style={{ 
              padding: '32px', 
              textAlign: 'center', 
              background: 'rgba(239, 68, 68, 0.02)', 
              border: '1px dashed rgba(239, 68, 68, 0.2)', 
              borderRadius: '12px' 
            }}
          >
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px' }}>⚠️</span>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f87171', marginBottom: '8px' }}>
              No Catalog Matches Found
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto', lineHeight: '1.5' }}>
              {generalReason || "We couldn't find any products matching your specific preferences in our database. Try expanding your budget or asking for different specifications!"}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
