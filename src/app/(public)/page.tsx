'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import HeroCarousel from '@/components/HeroCarousel';

export default function LandingPage() {
  const featureCards = [
    { title: 'Affordable Excellence', desc: 'Top-tier sports consultancy & analytics for just 1500 NGN.', icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
    { title: 'Premium Data Sets', desc: 'Access highly confidential PDF reports and internal breakdown videos.', icon: 'M2 12h4l3-9 5 18 3-9h5' },
    { title: 'Intense Tracking', desc: 'Built-in platform diagnostics that score your progression aggressively.', icon: 'M18 20V10M12 20V4M6 20v-6' }
  ];

  return (
    <main style={{ minHeight: '200vh', background: '#0a0a0c' }}>
      <HeroCarousel 
         preTitle="Next-Generation Performance"
         title="Master Your Craft."
         gradientSpan="Dominate The Field."
         subtitle="Join an elite consultancy tier. Unlock highly aggressive algorithmic metrics, tailored regimens, and insider datasets."
         primaryBtn={{ label: 'Deploy Now', href: '/login' }}
         secondaryBtn={{ label: 'View Intel', href: '#features' }}
      />

      {/* Features Grid that animates repeatedly */}
      <section id="features" style={{ padding: '8rem 2rem', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
         <motion.div 
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: false, amount: 0.2 }}
           transition={{ duration: 0.6 }}
           style={{ textAlign: 'center', marginBottom: '5rem' }}
         >
            <h2 style={{ fontSize: '3rem', fontWeight: 800, color: '#f4f4f5' }}>Core Protocol</h2>
            <p style={{ color: '#a1a1aa', fontSize: '1.1rem', marginTop: '1rem' }}>The architectural foundation of our premium methodology.</p>
         </motion.div>

         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
            {featureCards.map((card, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="glass-panel"
                style={{ textAlign: 'center', padding: '3rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(225,29,72,0.2), rgba(139,92,246,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', color: '#f43f5e' }}>
                     <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={card.icon} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f4f4f5', marginBottom: '1rem' }}>{card.title}</h3>
                  <p style={{ color: '#a1a1aa', lineHeight: 1.6 }}>{card.desc}</p>
              </motion.div>
            ))}
         </div>
      </section>

      {/* Massive Call To Action trigger */}
      <section style={{ padding: '10rem 2rem', textAlign: 'center', background: 'linear-gradient(to bottom, #0a0a0c, #110e1a)' }}>
         <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: false, amount: 0.3 }}
           transition={{ duration: 0.6, type: 'spring' }}
         >
           <h2 style={{ fontSize: '4rem', fontWeight: 900, color: '#ffffff', marginBottom: '1.5rem' }}>Elevate Immediately.</h2>
           <p style={{ color: '#a1a1aa', fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem auto' }}>Stop guessing. Start measuring. Enter the QUICK-HEDGE portal today.</p>
           <Link href="/signup" className="btn-primary" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem', background: '#e11d48', borderRadius: '999px', boxShadow: '0 0 40px rgba(225, 29, 72, 0.4)' }}>Initiate Access Sequence</Link>
         </motion.div>
      </section>
    </main>
  );
}
