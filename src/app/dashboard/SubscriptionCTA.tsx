'use client';

import { useState } from 'react';

export default function SubscriptionCTA({ userEmail, userId }: { userEmail: string | undefined, userId: string }) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, userId }),
      });

      const data = await response.json();

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        alert(data.error || 'Failed to initialize payment');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert('Network error while processing payment');
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ maxWidth: '500px', textAlign: 'center' }}>
      <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(109, 40, 217, 0.2)', margin: '0 auto 1.5rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
      </div>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>Premium Access Required</h2>
      <p style={{ color: '#a1a1aa', marginBottom: '2rem', lineHeight: 1.6 }}>
        Unlock an exclusive library of PDFs, detailed video courses, and specialized knowledge by subscribing today for only <b>1500 NGN/month</b>.
      </p>
      
      <button 
        onClick={handleSubscribe} 
        disabled={loading} 
        className="btn-primary" 
        style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
      >
        {loading ? 'Initializing Paystack...' : 'Subscribe via Paystack (1500 NGN)'}
      </button>
    </div>
  );
}
