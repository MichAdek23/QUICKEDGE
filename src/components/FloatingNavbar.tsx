'use client';

import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FloatingNavbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true); // scrolling down
    } else {
      setHidden(false); // scrolling up
    }
  });

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
  ];

  return (
    <motion.nav
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-150%", opacity: 0 }
      }}
      initial="visible"
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      style={{
        position: 'fixed',
        top: '2rem',
        left: '50%',
        x: '-50%',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        padding: '0.75rem 1.5rem',
        gap: '3rem',
        background: 'rgba(15, 15, 17, 0.65)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '999px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      }}
    >
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
        <div style={{ width: '28px', height: '28px', background: 'linear-gradient(45deg, #ef4444, #8b5cf6)', borderRadius: '50%' }}></div>
        <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>QUICKEDGE</span>
      </Link>

      <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
        {links.map((item) => {
          // Normalize paths for matching (since '/' might match everything if not careful)
          const isActive = item.path === '/' ? pathname === '/' : pathname?.startsWith(item.path);
          return (
            <Link key={item.path} href={item.path} style={{ color: isActive ? '#f4f4f5' : '#a1a1aa', fontWeight: isActive ? 600 : 400, textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.95rem' }}>
              {item.name}
            </Link>
          );
        })}
      </div>

      <Link href="/contact" className="btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>
         Get in Touch
      </Link>
    </motion.nav>
  );
}
