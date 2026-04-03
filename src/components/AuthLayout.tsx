import Image from 'next/image';

export default function AuthLayout({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--background)' }}>
      {/* Left side: Premium Image Panel (Hidden on mobile, visible on desktop) */}
      <div style={{ flex: 1, position: 'relative', display: 'none' }} className="auth-image-panel">
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(109, 40, 217, 0.2)', zIndex: 1, mixBlendMode: 'overlay' }}></div>
        <Image 
          src="/auth-bg.png" 
          alt="Consultancy Background" 
          fill 
          style={{ objectFit: 'cover' }} 
          priority 
        />
        <div style={{ position: 'absolute', bottom: '10%', left: '10%', zIndex: 2, padding: '2rem', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'white' }}>Quickedge Consultancy</h2>
          <p style={{ color: '#e4e4e7', fontSize: '0.9rem' }}>Elevate your skills and career with premium, curated resources and expert guidance.</p>
        </div>
      </div>

      {/* Right side: Form Panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px', background: 'var(--primary)', filter: 'blur(100px)', opacity: 0.15, borderRadius: '50%', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '300px', height: '300px', background: 'var(--accent)', filter: 'blur(100px)', opacity: 0.1, borderRadius: '50%', zIndex: 0 }}></div>
        
        <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '450px', zIndex: 1, padding: '3rem 2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' }}>{title}</h2>
          <p style={{ color: '#a1a1aa', textAlign: 'center', marginBottom: '2rem' }}>{subtitle}</p>
          
          {children}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 1024px) {
          .auth-image-panel {
            display: block !important;
          }
        }
      `}} />
    </main>
  );
}
