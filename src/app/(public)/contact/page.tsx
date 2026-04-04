import HeroCarousel from '@/components/HeroCarousel';
import ContactForm from './ContactForm';

export default function ContactPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0c', color: '#f4f4f5' }}>
      <HeroCarousel 
         preTitle="Get In Touch"
         title="Establish"
         gradientSpan="Comms."
         subtitle="Need support or want to negotiate an enterprise implementation? Our team is permanently standing by."
      />
      
      <div style={{ maxWidth: '1200px', width: '90%', margin: '-5rem auto 0 auto', position: 'relative', zIndex: 5, padding: '0 0 6rem 0' }}>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            
            {/* Left Column: Interactive Contact Form */}
            <div className="glass-panel" style={{ padding: '3rem', background: 'rgba(15, 15, 17, 0.8)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px' }}>
               <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem', color: '#ffffff' }}>Direct Transmission</h2>
               <ContactForm />
            </div>

            {/* Right Column: Contact Details & Metadata */}
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '3rem', justifyContent: 'center' }}>
               <div>
                 <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.5rem' }}>Headquarters</h3>
                 <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', color: '#8b5cf6' }}>
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    </div>
                    <div>
                       <p style={{ margin: 0, fontWeight: 600, color: '#f4f4f5', fontSize: '1.1rem' }}>Quickedge Base</p>
                       <p style={{ margin: '0.2rem 0 0 0', color: '#a1a1aa', lineHeight: 1.5 }}>
                          123 Education Boulevard,<br />
                          Tech District, Silicon Valley,<br />
                          CA 94000
                       </p>
                    </div>
                 </div>
               </div>

               <div>
                 <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.5rem' }}>Direct Line</h3>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: '#ef4444' }}>
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    </div>
                    <div>
                       <p style={{ margin: 0, fontWeight: 600, color: '#f4f4f5', fontSize: '1.1rem' }}>+1 (800) 123-4567</p>
                       <p style={{ margin: '0.2rem 0 0 0', color: '#a1a1aa' }}>Mon-Fri, 9am - 6pm EST</p>
                    </div>
                 </div>

                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: '#10b981' }}>
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </div>
                    <div>
                       <p style={{ margin: 0, fontWeight: 600, color: '#f4f4f5', fontSize: '1.1rem' }}>hello@quickedge.com</p>
                       <p style={{ margin: '0.2rem 0 0 0', color: '#a1a1aa' }}>Online Support available 24/7</p>
                    </div>
                 </div>
               </div>
            </div>

         </div>
      </div>
    </main>
  );
}
