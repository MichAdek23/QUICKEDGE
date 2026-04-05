import HeroCarousel from '@/components/HeroCarousel';

export default function AboutPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0c', color: '#f4f4f5' }}>
      <HeroCarousel 
         preTitle="Who We Are"
         title="The Architecture of"
         gradientSpan="Excellence."
         subtitle="We are not just a consultancy. We are a quantified performance syndicate built to elevate your exact position in the market."
      />
      <div style={{ maxWidth: '1000px', margin: '-5rem auto 0 auto', position: 'relative', zIndex: 5, padding: '0 2rem 6rem' }}>
         <div className="glass-panel" style={{ padding: '4rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', color: '#ffffff' }}>Our Mission</h2>
            <p style={{ fontSize: '1.2rem', color: '#a1a1aa', lineHeight: 1.8, marginBottom: '2rem' }}>
               Quick-Hedge was forged for one reason: bridging the gap between average performance and elite market execution. Through aggressive tracking, premium analytics, and tailored frameworks, we tear down traditional barriers.
            </p>
         </div>
      </div>
    </main>
  );
}
