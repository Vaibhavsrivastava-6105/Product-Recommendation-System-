import React, { useState } from 'react';

interface PreferenceFormProps {
  onSubmit: (preference: string) => void;
  isLoading: boolean;
}

export default function PreferenceForm({ onSubmit, isLoading }: PreferenceFormProps) {
  const [preference, setPreference] = useState('');

  const samplePrompts = [
    { text: "Phone under $500 with a good camera", emoji: "📸" },
    { text: "Noise cancelling earbuds for work and travel", emoji: "🎧" },
    { text: "A high-performance gaming laptop with RTX graphics", emoji: "🎮" },
    { text: "Affordable phone with a long-lasting battery", emoji: "🔋" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (preference.trim() && !isLoading) {
      onSubmit(preference.trim());
    }
  };

  const handlePromptClick = (text: string) => {
    setPreference(text);
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Form Title & Instruction */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.8rem' }}>🧠</span> Find Your Perfect Match
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Describe what you are looking for in natural language. Our AI recommender will parse your intent and match it against the catalog.
          </p>
        </div>

        {/* Text Input Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <textarea
            placeholder="Type your preferences here... (e.g. 'I want a phone under $500 with good camera and oled screen')"
            value={preference}
            onChange={(e) => setPreference(e.target.value)}
            disabled={isLoading}
            className="form-input"
            rows={3}
            style={{ minHeight: '100px' }}
            required
          />
        </div>

        {/* Recommendations Prompt Chips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Quick Templates
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePromptClick(prompt.text)}
                disabled={isLoading}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-light)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                }}
              >
                <span>{prompt.emoji}</span>
                <span>{prompt.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Action Button */}
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading || !preference.trim()}
          style={{ width: '100%', marginTop: '4px' }}
        >
          {isLoading ? (
            <>
              <div className="spinner" />
              <span>Analyzing Preferences...</span>
            </>
          ) : (
            <>
              <span>✨ Recommend Products</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
}
