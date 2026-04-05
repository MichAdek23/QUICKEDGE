'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isReadyForInstall, setIsReadyForInstall] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    // Check if the trap caught it before hydration
    if ((window as any).deferredPWAInstallPrompt) {
      setDeferredPrompt((window as any).deferredPWAInstallPrompt);
      setIsReadyForInstall(true);
    }

    // Still listen in case it fires later
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsReadyForInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt safely triggered by a user action
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsReadyForInstall(false);
    
    console.log(`PWA Installation verdict: ${outcome}`);
  };

  const handleDismiss = () => {
     setHasDismissed(true);
     setIsReadyForInstall(false);
  };

  if (!isReadyForInstall || hasDismissed) return null;

  return (
    <AnimatePresence>
      <style>{`
        /* Mobile Responsive Styles for Install Prompt */
        @media (max-width: 480px) {
          .install-prompt-container {
            bottom: 1rem !important;
            width: calc(100% - 1rem) !important;
            max-width: none !important;
          }
          .install-prompt-content {
            padding: 1rem !important;
          }
          .install-prompt-icon {
            width: 40px !important;
            height: 40px !important;
          }
          .install-prompt-icon svg {
            width: 20px !important;
            height: 20px !important;
          }
          .install-prompt-title {
            font-size: 1rem !important;
          }
          .install-prompt-text {
            font-size: 0.8rem !important;
          }
          .install-prompt-button {
            padding: 0.7rem !important;
            font-size: 0.9rem !important;
          }
        }
      `}</style>
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="install-prompt-container"
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          width: 'calc(100% - 2rem)',
          maxWidth: '450px'
        }}
      >
        <div className="install-prompt-content" style={{
          background: 'rgba(15, 15, 17, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
           {/* Subtle glow effect */}
           <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(167, 139, 250, 0.8), transparent)' }}></div>
           
           <button 
             onClick={handleDismiss}
             style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}
           >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
           </button>

           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="install-prompt-icon" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #a78bfa, #6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 10px rgba(109, 40, 217, 0.4)' }}>
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </div>
              <div>
                <h3 className="install-prompt-title" style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>Install Quick-Hedge</h3>
                <p className="install-prompt-text" style={{ margin: 0, fontSize: '0.85rem', color: '#a1a1aa', marginTop: '0.2rem' }}>Experience zero-latency operations natively on your device.</p>
              </div>
           </div>
           
           <button 
              onClick={handleInstallApp}
              className="btn-primary install-prompt-button" 
              style={{ width: '100%', padding: '0.75rem', fontWeight: 700 }}
           >
              Download App
           </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
