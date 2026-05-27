import { useState } from 'react';
import { PRODUCTS } from '../data/products';

interface ProductListProps {
  highlightedIds?: string[];
}

export default function ProductList({ highlightedIds = [] }: ProductListProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['all', 'phone', 'laptop', 'earbuds'];

  // Filter products based on active category and search query
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.8rem' }}>📦</span> Active Product Catalog
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Explore the live catalog below. Recommendations are strictly matched against these items.
        </p>
      </div>

      {/* Catalog Controls: Filter & Search */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.05)',
                color: activeCategory === cat ? '#ffffff' : 'var(--text-primary)',
                border: `1px solid ${activeCategory === cat ? 'var(--color-primary)' : 'var(--border-light)'}`,
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'capitalize',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
              }}
            >
              {cat}s
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search products by name, brand, or feature..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input"
          style={{ padding: '10px 14px', fontSize: '0.9rem' }}
        />
      </div>

      {/* Product Catalog Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '16px',
          maxHeight: '520px',
          overflowY: 'auto',
          paddingRight: '4px',
          marginTop: '8px',
        }}
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const isHighlighted = highlightedIds.includes(product.id);
            return (
              <div
                key={product.id}
                style={{
                  padding: '16px',
                  background: isHighlighted ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '12px',
                  border: isHighlighted 
                    ? '1.5px solid var(--color-primary)' 
                    : '1px solid var(--border-light)',
                  boxShadow: isHighlighted ? 'var(--shadow-glow)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  transition: 'var(--transition-smooth)',
                  position: 'relative',
                }}
                className={isHighlighted ? 'glow-card' : ''}
              >
                {/* Highlights Badge */}
                {isHighlighted && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                      color: 'white',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      boxShadow: '0 2px 6px rgba(6, 182, 212, 0.3)',
                      zIndex: 2,
                    }}
                  >
                    Match
                  </div>
                )}

                {/* Product Image */}
                <div style={{
                  width: '100%',
                  height: '140px',
                  borderRadius: '8px',
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

                {/* Brand & Category */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dark)', textTransform: 'uppercase' }}>
                    {product.brand}
                  </span>
                  <span className={`tag tag-${product.category}`}>
                    {product.category}
                  </span>
                </div>

                {/* Product Name */}
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '-4px' }}>
                  {product.name}
                </h3>

                {/* Price & Rating */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    ${product.price}
                  </span>
                  <span className="rating-badge">
                    ★ {product.rating.toFixed(1)}
                  </span>
                </div>

                {/* Features List */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                  {product.features.map((feature, idx) => (
                    <span key={idx} className="tag tag-feature">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>🔍</span>
            No products match your filters. Try clearing search or choosing another category.
          </div>
        )}
      </div>
    </div>
  );
}
