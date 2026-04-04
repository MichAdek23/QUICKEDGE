import HeroCarousel from '@/components/HeroCarousel';

export default function ContactPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0c', color: '#f4f4f5' }}>
      <HeroCarousel 
         preTitle="Get In Touch"
         title="Establish"
         gradientSpan="Comms."
         subtitle="Need support or want to negotiate an enterprise implementation? Our team is permanently standing by."
      />
      <div style={{ maxWidth: '800px', margin: '-5rem auto 0 auto', position: 'relative', zIndex: 5, padding: '0 2rem 6rem' }}>
         <div className="glass-panel" style={{ padding: '3rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', color: '#ffffff' }}>Contact Form</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <div>
                 <label style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '0.5rem', display: 'block' }}>Email Address</label>
                 <input type="email" readOnly className="input-field" placeholder="Target Email..." />
               </div>
               <div>
                 <label style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '0.5rem', display: 'block' }}>Message Payload</label>
                 <textarea readOnly className="input-field" rows={5} placeholder="Transmit your request here..."></textarea>
               </div>
               <button type="button" disabled className="btn-primary" style={{ marginTop: '1rem', opacity: 0.5 }}>Transmission Offline in Demo</button>
            </form>
         </div>
      </div>
    </main>
  );
}
