'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const images = [
  '/images/hero-1.png',
  '/images/hero-2.png',
  '/images/hero-3.png'
];

export default function LandingPage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const featureCards = [
    { title: 'Affordable Excellence', desc: 'Top-tier sports consultancy & analytics for just 1500 NGN.', icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
    { title: 'Premium Data Sets', desc: 'Access highly confidential PDF reports and internal breakdown videos.', icon: 'M2 12h4l3-9 5 18 3-9h5' },
    { title: 'Intense Tracking', desc: 'Built-in platform diagnostics that score your progression aggressively.', icon: 'M18 20V10M12 20V4M6 20v-6' }
  ];

  return (
    <main style={{ minHeight: '200vh', background: '#0a0a0c' }}>
      {/* Dynamic 100vh Hero Carousel */}
      <section style={{ height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <AnimatePresence>
          <motion.img 
            key={index}
            src={images[index]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
          />
        </AnimatePresence>

        {/* Hero Content Overlay */}
        <div style={{ position: 'absolute', zIndex: 1, textAlign: 'center', padding: '0 2rem' }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div style={{ display: 'inline-block', padding: '0.4rem 1.2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)', color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1.5rem', backdropFilter: 'blur(10px)' }}>
               Next-Generation Performance
            </div>
            <h1 style={{ fontSize: '5rem', fontWeight: 900, lineHeight: 1.1, color: '#ffffff', letterSpacing: '-0.03em', marginBottom: '1.5rem', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
               Master Your Craft.<br />
               <span style={{ backgroundImage: 'linear-gradient(to right, #f43f5e, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dominate The Field.</span>
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#e4e4e7', maxWidth: '600px', margin: '0 auto 3rem auto', lineHeight: 1.6, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
               Join an elite consultancy tier. Unlock highly aggressive algorithmic metrics, tailored regimens, and insider datasets.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
               <Link href="/login" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1rem', background: '#e11d48' }}>
                  Deploy Now
               </Link>
               <a href="#features" className="btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1rem', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                  View Intel
               </a>
            </div>
          </motion.div>
        </div>
        
        {/* Gradient Fade to Black base */}
        <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '30vh', background: 'linear-gradient(to top, #0a0a0c, transparent)', zIndex: 1 }}></div>
      </section>

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
           <p style={{ color: '#a1a1aa', fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem auto' }}>Stop guessing. Start measuring. Enter the QUICKEDGE portal today.</p>
           <Link href="/signup" className="btn-primary" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem', background: '#e11d48', borderRadius: '999px', boxShadow: '0 0 40px rgba(225, 29, 72, 0.4)' }}>Initiate Access Sequence</Link>
         </motion.div>
      </section>
    </main>
  );
}
