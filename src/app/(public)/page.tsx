'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import HeroCarousel from '@/components/HeroCarousel';

export default function LandingPage() {
  const featureCards = [
    { title: 'Affordable Excellence', desc: 'Top-tier sports consultancy & analytics for just 1500 NGN.', icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
    { title: 'Premium Data Sets', desc: 'Access highly confidential PDF reports and internal breakdown videos.', icon: 'M2 12h4l3-9 5 18 3-9h5' },
    { title: 'Intense Tracking', desc: 'Built-in platform diagnostics that score your progression aggressively.', icon: 'M18 20V10M12 20V4M6 20v-6' },
    { title: 'Real-Time Analytics', desc: 'Monitor your performance metrics with live dashboards and detailed insights.', icon: 'M3 12h18M9 5h6v14H9z' },
    { title: 'Expert Consultants', desc: 'Direct access to industry veterans who mentor your success journey.', icon: 'M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z' },
    { title: 'Certification Programs', desc: 'Earn recognized credentials in sports analytics and market trading.', icon: 'M22 10v6m0 0l-8.5-4.35m8.5 4.35l-8.5 4.35M2 10v6m0 0l8.5-4.35m-8.5 4.35l8.5 4.35' }
  ];

  return (
    <main style={{ minHeight: '300vh', background: '#0a0a0c' }}>
      <style>{`
        /* Mobile Responsive Styles */
        @media (min-width: 769px) {
          .ceo-section { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 768px) {
          .hero-title { font-size: 3rem !important; }
          .hero-subtitle { font-size: 1rem !important; }
          .section-padding { padding: 4rem 1rem !important; }
          .section-title { font-size: 2rem !important; }
          .section-subtitle { font-size: 1rem !important; }
          .feature-card { padding: 2rem 1.5rem !important; }
          .feature-title { font-size: 1.1rem !important; }
          .feature-desc { font-size: 0.95rem !important; }
          .ceo-section { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .ceo-image { font-size: 3rem !important; }
          .ceo-title { font-size: 2rem !important; }
          .ceo-text { font-size: 1rem !important; }
          .stats-section { padding: 4rem 1rem !important; }
          .stats-number { font-size: 2.5rem !important; }
          .how-it-works { padding: 4rem 1rem !important; }
          .step-number { font-size: 2.5rem !important; }
          .step-title { font-size: 1.1rem !important; }
          .cta-section { padding: 6rem 1rem !important; }
          .cta-title { font-size: 2.5rem !important; }
          .cta-subtitle { font-size: 1rem !important; }
          .btn-mobile { padding: 1rem 2rem !important; font-size: 1rem !important; }
        }
        
        @media (max-width: 480px) {
          .hero-title { font-size: 2.5rem !important; }
          .section-title { font-size: 1.8rem !important; }
          .section-padding { padding: 3rem 1rem !important; }
          .feature-card { padding: 1.5rem 1rem !important; }
          .ceo-title { font-size: 1.8rem !important; }
          .ceo-image { font-size: 2.5rem !important; }
          .stats-section { padding: 3rem 1rem !important; }
          .stats-number { font-size: 2rem !important; }
          .how-it-works { padding: 3rem 1rem !important; }
          .cta-section { padding: 4rem 1rem !important; }
          .cta-title { font-size: 2rem !important; }
          .step-number { font-size: 2rem !important; }
        }
      `}</style>

      <HeroCarousel 
         preTitle="Next-Generation Performance"
         title="Master Your Craft."
         gradientSpan="Dominate The Field."
         subtitle="Join an elite consultancy tier. Unlock highly aggressive algorithmic metrics, tailored regimens, and insider datasets."
         primaryBtn={{ label: 'Get Started', href: '/signup' }}
         secondaryBtn={{ label: 'View Intel', href: '#features' }}
      />

      {/* Features Grid that animates repeatedly */}
      <section id="features" className="section-padding" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
         <motion.div 
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: false, amount: 0.2 }}
           transition={{ duration: 0.6 }}
           style={{ textAlign: 'center', marginBottom: '5rem' }}
         >
            <h2 className="section-title" style={{ fontWeight: 800, color: '#f4f4f5' }}>Core Protocol</h2>
            <p className="section-subtitle" style={{ color: '#a1a1aa', marginTop: '1rem' }}>The architectural foundation of our premium methodology.</p>
         </motion.div>

         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
            {featureCards.map((card, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="glass-panel feature-card"
                style={{ textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(225,29,72,0.2), rgba(139,92,246,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', color: '#f43f5e' }}>
                     <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={card.icon} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <h3 className="feature-title" style={{ fontWeight: 700, color: '#f4f4f5', marginBottom: '1rem' }}>{card.title}</h3>
                  <p className="feature-desc" style={{ color: '#a1a1aa', lineHeight: 1.6 }}>{card.desc}</p>
              </motion.div>
            ))}
         </div>
      </section>

      {/* CEO Message Section */}
      <section className="section-padding" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
         <div className="ceo-section" style={{ display: 'grid', gap: '4rem', alignItems: 'center' }}>
            {/* CEO Image/Avatar */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <div style={{ 
                width: '100%', 
                aspectRatio: '1', 
                borderRadius: '20px', 
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                boxShadow: '0 20px 60px rgba(139, 92, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700
              }} className="ceo-image">
                CEO
              </div>
            </motion.div>

            {/* CEO Message */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="ceo-title" style={{ fontWeight: 800, color: '#f4f4f5', marginBottom: '1.5rem' }}>A Word From Our Founder</h2>
              <p className="ceo-text" style={{ color: '#a1a1aa', lineHeight: 1.8, marginBottom: '2rem' }}>
                "Quick-Hedge was born from a simple observation: the gap between average practitioners and elite performers isn't talent—it's data. We've spent years building technology that captures every nuance of performance, translating complexity into clarity. Today, we're democratizing access to the insights that previously only the top 1% could afford. Our mission is simple: equip you with the metrics that matter, the mentorship that shapes winners, and the confidence to dominate your field."
              </p>
              <p style={{ fontSize: '1rem', color: '#71717a', fontWeight: 600 }}>— Founder & CEO, Quick-Hedge</p>
              <div style={{ marginTop: '2rem' }}>
                <Link href="/signup" className="btn-primary btn-mobile" style={{ background: 'linear-gradient(45deg, #8b5cf6, #ec4899)', borderRadius: '999px' }}>
                  Get Started Today
                </Link>
              </div>
            </motion.div>
         </div>
      </section>

      {/* Stats/Metrics Section */}
      <section className="stats-section" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))', borderRadius: '20px', maxWidth: '1200px', margin: '4rem auto' }}>
         <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: false, amount: 0.3 }}
           transition={{ duration: 0.6 }}
           style={{ textAlign: 'center', marginBottom: '4rem' }}
         >
           <h2 className="section-title" style={{ fontWeight: 800, color: '#f4f4f5', marginBottom: '1rem' }}>Proven Results</h2>
           <p className="section-subtitle" style={{ color: '#a1a1aa' }}>Join thousands of athletes and traders who've elevated their performance</p>
         </motion.div>

         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'center' }}>
           {[
             { number: '5000+', label: 'Active Users' },
             { number: '98%', label: 'Satisfaction Rate' },
             { number: '24/7', label: 'Support Available' },
             { number: '150+', label: 'Expert Mentors' }
           ].map((stat, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, scale: 0.8 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: false, amount: 0.3 }}
               transition={{ duration: 0.5, delay: i * 0.1 }}
             >
               <h3 className="stats-number" style={{ fontWeight: 900, color: '#ec4899', marginBottom: '0.5rem' }}>{stat.number}</h3>
               <p style={{ color: '#a1a1aa', fontSize: '1rem' }}>{stat.label}</p>
             </motion.div>
           ))}
         </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
         <motion.div 
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: false, amount: 0.2 }}
           transition={{ duration: 0.6 }}
           style={{ textAlign: 'center', marginBottom: '5rem' }}
         >
            <h2 className="section-title" style={{ fontWeight: 800, color: '#f4f4f5' }}>How It Works</h2>
            <p className="section-subtitle" style={{ color: '#a1a1aa', marginTop: '1rem' }}>Your journey to elite performance in 4 simple steps.</p>
         </motion.div>

         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>
           {[
             { step: '01', title: 'Sign Up', desc: 'Create your account and set up your performance profile in minutes.' },
             { step: '02', title: 'Get Matched', desc: 'Our AI matches you with the perfect mentor and learning path.' },
             { step: '03', title: 'Track Progress', desc: 'Monitor your metrics in real-time with our advanced dashboard.' },
             { step: '04', title: 'Transform', desc: 'Apply insights, achieve results, and dominate your field.' }
           ].map((item, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 40 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: false, amount: 0.2 }}
               transition={{ duration: 0.5, delay: i * 0.15 }}
               style={{ position: 'relative', padding: '2.5rem 2rem' }}
             >
               <div className="step-number" style={{ 
                 position: 'absolute', 
                 top: '-20px', 
                 left: '0', 
                 fontWeight: 900, 
                 color: 'rgba(139, 92, 246, 0.2)'
               }}>
                 {item.step}
               </div>
               <h3 className="step-title" style={{ fontWeight: 700, color: '#f4f4f5', marginBottom: '1rem', marginTop: '0.5rem' }}>{item.title}</h3>
               <p style={{ color: '#a1a1aa', lineHeight: 1.6 }}>{item.desc}</p>
             </motion.div>
           ))}
         </div>
      </section>

      {/* Massive Call To Action trigger */}
      <section className="cta-section" style={{ textAlign: 'center', background: 'linear-gradient(to bottom, #0a0a0c, #110e1a)' }}>
         <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: false, amount: 0.3 }}
           transition={{ duration: 0.6, type: 'spring' }}
         >
           <h2 className="cta-title" style={{ fontWeight: 900, color: '#ffffff', marginBottom: '1.5rem' }}>Elevate Immediately.</h2>
           <p className="cta-subtitle" style={{ color: '#a1a1aa', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem auto' }}>Stop guessing. Start measuring. Enter the QUICK-HEDGE portal today.</p>
           <Link href="/signup" className="btn-primary btn-mobile" style={{ background: '#e11d48', borderRadius: '999px', boxShadow: '0 0 40px rgba(225, 29, 72, 0.4)' }}>Get Started Now</Link>
         </motion.div>
      </section>
    </main>
  );
}
