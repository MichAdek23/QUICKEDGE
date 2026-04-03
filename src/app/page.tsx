import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Background blobs for premium feel */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'var(--primary)', filter: 'blur(150px)', opacity: 0.15, borderRadius: '50%', zIndex: -1 }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'var(--accent)', filter: 'blur(150px)', opacity: 0.1, borderRadius: '50%', zIndex: -1 }}></div>

      <div className="animate-fade-in" style={{ maxWidth: '800px', zIndex: 1, marginTop: '4rem' }}>
        <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.875rem', marginBottom: '1.5rem', color: '#a78bfa' }}>
          🚀 Revolutionize your learning
        </div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>
          Master Your Craft with <br />
          <span className="gradient-text">Quickedge</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#a1a1aa', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
          Get exclusive access to premium resources, personalized guidance, and a community of high-achievers. Unlock your potential for just <b>1,500 NGN/month</b>.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/login" className="btn-primary">
            Start Your Journey
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <a href="#features" className="btn-secondary">
            Learn More
          </a>
        </div>
      </div>

      <div id="features" className="glass-panel animate-fade-in" style={{ marginTop: '5rem', marginBottom: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'left', animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
        <div>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(109, 40, 217, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#a78bfa' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Affordable Excellence</h3>
          <p style={{ color: '#a1a1aa', fontSize: '0.95rem' }}>Get top-tier consultancy and materials for an accessible monthly subscription of 1500 NGN.</p>
        </div>
        <div>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#34d399' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Premium Materials</h3>
          <p style={{ color: '#a1a1aa', fontSize: '0.95rem' }}>Access high-quality PDFs, comprehensive videos, and interactive learning resources instantly.</p>
        </div>
        <div>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(244, 114, 182, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#f472b6' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Monitor Progress</h3>
          <p style={{ color: '#a1a1aa', fontSize: '0.95rem' }}>Stay on top of your learning goals with built-in tracking that monitors your curriculum progression.</p>
        </div>
      </div>
    </main>
  );
}
