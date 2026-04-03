'use client';

import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0c', padding: '10rem 2rem 5rem 2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
        >
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#ffffff', marginBottom: '1rem', letterSpacing: '-0.02em' }}>About <span style={{ color: '#e11d48' }}>Quickedge</span></h1>
          <p style={{ fontSize: '1.3rem', color: '#a1a1aa', lineHeight: 1.6, marginBottom: '4rem' }}>
            A premier consultancy dedicated to pushing the absolute boundaries of human performance through intense algorithmic optimization and personalized premium methodology.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="glass-panel"
          style={{ marginBottom: '3rem', background: 'linear-gradient(45deg, rgba(225,29,72,0.05), rgba(139,92,246,0.05))', border: '1px solid rgba(225,29,72,0.1)' }}
        >
           <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f4f4f5', marginBottom: '1rem' }}>Our Mission</h2>
           <p style={{ color: '#e4e4e7', lineHeight: 1.8 }}>We systematically strip away the noise. The amateur approach relies on feeling. We rely on empirical data matrices, interactive telemetry feedback loops, and highly secretive premium pipelines. QUICKEDGE guarantees evolution.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {[
            { metric: '98%', label: 'Top Tier Conversion' },
            { metric: '500+', label: 'Proprietary PDF Sets' },
            { metric: '24/7', label: 'Algorithmic Tracking' }
          ].map((stat, i) => (
             <motion.div
               key={stat.label}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: false }}
               transition={{ duration: 0.4, delay: i * 0.15 }}
               style={{ padding: '2.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}
             >
                <div style={{ fontSize: '3rem', fontWeight: 900, color: '#f43f5e', marginBottom: '0.5rem' }}>{stat.metric}</div>
                <div style={{ color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.85rem' }}>{stat.label}</div>
             </motion.div>
          ))}
        </div>

      </div>
    </main>
  );
}
