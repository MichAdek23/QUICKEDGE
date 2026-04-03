'use client';

import { motion } from 'framer-motion';

export default function ContactPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0c', padding: '10rem 2rem 5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        className="glass-panel"
        style={{ maxWidth: '600px', width: '100%', padding: '4rem', background: 'rgba(15, 15, 20, 0.6)', border: '1px solid rgba(255,255,255,0.05)' }}
      >
         <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ffffff', marginBottom: '1rem', textAlign: 'center' }}>Deploy Comms</h1>
         <p style={{ color: '#a1a1aa', textAlign: 'center', marginBottom: '3rem', fontSize: '1.1rem' }}>Enter the direct channel to the Quickedge elite consultancy team.</p>

         <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={(e) => e.preventDefault()}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase' }}>Classification (Name)</label>
                <input type="text" className="input-field" placeholder="John Doe" style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.1)' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase' }}>Secure Ping (Email)</label>
                <input type="email" className="input-field" placeholder="hacker@terminal.com" style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.1)' }} />
              </div>
            </div>

            <div>
               <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase' }}>Encrypted Payload (Message)</label>
               <textarea className="input-field" rows={5} placeholder="Initiate parameters for structural breakdown..." style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.1)', resize: 'vertical' }}></textarea>
            </div>

            <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="btn-primary" 
               style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', background: '#e11d48', marginTop: '1rem' }}
            >
               Transmit Message
            </motion.button>
         </form>

      </motion.div>
    </main>
  );
}
