'use client';

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function FloatingNavbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setIsSignedIn(!!user);
      } catch (error) {
        setIsSignedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    // Don't hide the nav if the mobile menu is currently open
    if (!isMobileMenuOpen && latest > previous && latest > 150) {
      setHidden(true); // scrolling down
    } else {
      setHidden(false); // scrolling up
    }
  });

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <style>{`
        .nav-desktop-menu { display: flex; gap: 2.5rem; align-items: center; }
        .nav-mobile-toggle { display: none; background: none; border: none; cursor: pointer; color: white; padding: 0.5rem; }
        .nav-desktop-btn { display: block; }
        .nav-container {
           width: 90%;
           max-width: 1200px;
           justify-content: space-between;
           box-sizing: border-box;
        }
        
        @media (max-width: 768px) {
          .nav-desktop-menu { display: none; }
          .nav-mobile-toggle { display: block; }
          .nav-desktop-btn { display: none; }
          .nav-container {
             width: calc(100% - 2rem);
             padding: 0.75rem 1.25rem !important;
          }
        }
      `}</style>
      
      <motion.nav
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: "-150%", opacity: 0 }
        }}
        initial="visible"
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="nav-container"
        style={{
          position: 'fixed',
          top: '1.5rem',
          left: '50%',
          x: '-50%',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          padding: '0.75rem 1.5rem',
          background: 'rgba(15, 15, 17, 0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '999px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{ width: '28px', height: '28px', background: 'linear-gradient(45deg, #ef4444, #8b5cf6)', borderRadius: '50%' }}></div>
          <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>QUICK-HEDGE</span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-desktop-menu">
          {links.map((item) => {
            const isActive = item.path === '/' ? pathname === '/' : pathname?.startsWith(item.path);
            return (
              <Link key={item.path} href={item.path} style={{ color: isActive ? '#f4f4f5' : '#a1a1aa', fontWeight: isActive ? 600 : 400, textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.95rem' }}>
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Desktop Button */}
        <div className="nav-desktop-btn">
          {!isLoading && (
            isSignedIn ? (
              <Link href="/dashboard" className="btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>
                Dashboard
              </Link>
            ) : (
              <Link href="/signup" className="btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>
                Get Started
              </Link>
            )
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button className="nav-mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isMobileMenuOpen ? (
               <>
                 <line x1="18" y1="6" x2="6" y2="18"></line>
                 <line x1="6" y1="6" x2="18" y2="18"></line>
               </>
            ) : (
               <>
                 <line x1="3" y1="12" x2="21" y2="12"></line>
                 <line x1="3" y1="6" x2="21" y2="6"></line>
                 <line x1="3" y1="18" x2="21" y2="18"></line>
               </>
            )}
          </svg>
        </button>
      </motion.nav>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: '5.5rem',
              left: '50%',
              x: '-50%',
              zIndex: 99,
              width: 'calc(100% - 2rem)',
              background: 'rgba(15, 15, 17, 0.95)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}
          >
            {links.map((item) => {
              const isActive = item.path === '/' ? pathname === '/' : pathname?.startsWith(item.path);
              return (
                <Link 
                  key={item.path} 
                  href={item.path} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ 
                    color: isActive ? '#ffffff' : '#a1a1aa', 
                    fontWeight: isActive ? 700 : 500, 
                    textDecoration: 'none', 
                    fontSize: '1.1rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  {item.name}
                </Link>
              );
            })}
            
            {!isLoading && (
              isSignedIn ? (
                <Link 
                  href="/dashboard" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary" 
                  style={{ padding: '0.8rem', fontSize: '1rem', textAlign: 'center', marginTop: '0.5rem' }}
                >
                  Dashboard
                </Link>
              ) : (
                <Link 
                  href="/signup" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary" 
                  style={{ padding: '0.8rem', fontSize: '1rem', textAlign: 'center', marginTop: '0.5rem' }}
                >
                  Get Started
                </Link>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
