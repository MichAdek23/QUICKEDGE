'use client';

import { useState } from 'react';
import { submitContactMessage } from './actions';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  async function handleAction(formData: FormData) {
     setLoading(true);
     setStatus(null);
     
     const result = await submitContactMessage(formData);
     
     if (result.error) {
        setStatus({ type: 'error', message: result.error });
     } else {
        setStatus({ type: 'success', message: 'Transmission successful. Over and out.' });
        // Clear the form visually since it's uncontrolled
        (document.getElementById('contact-form') as HTMLFormElement)?.reset();
     }
     
     setLoading(false);
  }

  return (
    <form id="contact-form" action={handleAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
       {status && (
          <div style={{
            padding: '1rem',
            borderRadius: '8px',
            background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: status.type === 'success' ? '#10b981' : '#ef4444',
            border: `1px solid ${status.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
            fontSize: '0.9rem'
          }}>
             {status.message}
          </div>
       )}

       <div>
         <label style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '0.5rem', display: 'block', fontWeight: 600 }}>Your Designation / Name</label>
         <input type="text" name="name" required className="input-field" placeholder="John Doe" disabled={loading} />
       </div>
       <div>
         <label style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '0.5rem', display: 'block', fontWeight: 600 }}>Return Email Address</label>
         <input type="email" name="email" required className="input-field" placeholder="Target Email..." disabled={loading} />
       </div>
       <div>
         <label style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '0.5rem', display: 'block', fontWeight: 600 }}>Message Payload</label>
         <textarea name="message" required className="input-field" rows={5} placeholder="Transmit your request here..." disabled={loading}></textarea>
       </div>
       
       <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '0.5rem' }}>
          {loading ? 'Transmitting...' : 'Send Transmission'}
       </button>
    </form>
  );
}
