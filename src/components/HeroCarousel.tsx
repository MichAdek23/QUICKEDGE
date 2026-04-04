'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeroCarousel({ 
  preTitle, 
  title, 
  gradientSpan, 
  subtitle, 
  primaryBtn, 
  secondaryBtn 
}: {
  preTitle?: string;
  title: string;
  gradientSpan?: string;
  subtitle: string;
  primaryBtn?: { label: string, href: string };
  secondaryBtn?: { label: string, href: string };
}) {
  const images = [
    '/images/hero-1.png',
    '/images/hero-2.png',
    '/images/hero-3.png'
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
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
          {preTitle && (
            <div style={{ display: 'inline-block', padding: '0.4rem 1.2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)', color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1.5rem', backdropFilter: 'blur(10px)' }}>
               {preTitle}
            </div>
          )}
          <h1 style={{ fontSize: '5rem', fontWeight: 900, lineHeight: 1.1, color: '#ffffff', letterSpacing: '-0.03em', marginBottom: '1.5rem', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
             {title}<br />
             {gradientSpan && <span style={{ backgroundImage: 'linear-gradient(to right, #f43f5e, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{gradientSpan}</span>}
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#e4e4e7', maxWidth: '600px', margin: '0 auto 3rem auto', lineHeight: 1.6, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
             {subtitle}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
             {primaryBtn && (
                <Link href={primaryBtn.href} className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1rem', background: '#e11d48' }}>
                   {primaryBtn.label}
                </Link>
             )}
             {secondaryBtn && (
                <a href={secondaryBtn.href} className="btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1rem', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                   {secondaryBtn.label}
                </a>
             )}
          </div>
        </motion.div>
      </div>
      
      {/* Gradient Fade to Black base */}
      <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '30vh', background: 'linear-gradient(to top, #0a0a0c, transparent)', zIndex: 1, pointerEvents: 'none' }}></div>
    </section>
  );
}
