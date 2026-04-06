'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Sidebar({ profileRole, profileName, avatarUrl, logoutForm, accountTag }: { profileRole: string, profileName: string, avatarUrl?: string, logoutForm: React.ReactNode, accountTag: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'S';
  };

  return (
    <>
      <div className="mobile-top-bar">
        <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem', marginLeft: '-0.5rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        {accountTag}
      </div>

      {isOpen && (
         <div onClick={() => setIsOpen(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 45 }} />
      )}

      <aside className={`sidebar-wrapper ${isOpen ? 'open' : ''}`} style={{ overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', justifyContent: 'center' }}>
            <img src="/logo12.png" alt="QuickEdge" style={{ width: '100px', height: '40px' }} />
          </div>

          {avatarUrl ? (
             <img src={avatarUrl} alt="Avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.1)', flexShrink: 0, marginBottom: '1rem' }} />
          ) : (
             <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.8rem', color: 'white', border: '3px solid rgba(255,255,255,0.1)', flexShrink: 0, boxShadow: '0 4px 10px rgba(109, 40, 217, 0.3)', marginBottom: '1rem' }}>
               {getInitials(profileName)}
             </div>
          )}

          <div style={{ overflow: 'hidden', width: '100%' }}>
            <p style={{ fontSize: '1.05rem', color: '#e4e4e7', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '0.75rem' }}>{profileName}</p>
            {accountTag}
          </div>
        </div>
        
        <nav style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
          <Link href="/dashboard" className="sidebar-link" onClick={() => setIsOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink: 0}}><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Material Catalogue
          </Link>
          <Link href="/dashboard/scores" className="sidebar-link" onClick={() => setIsOpen(false)}>
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink: 0}}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            Assessment Scores
          </Link>
          <Link href="/dashboard/billing" className="sidebar-link" onClick={() => setIsOpen(false)}>
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink: 0}}><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            Payment History
          </Link>
          <Link href="/dashboard/profile" className="sidebar-link" onClick={() => setIsOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink: 0}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            My Profile
          </Link>

          {profileRole === 'admin' && (
            <Link href="/admin" className="sidebar-link" style={{ marginTop: '2rem', color: '#f472b6' }} onClick={() => setIsOpen(false)}>
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink: 0}}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
               Admin Settings
            </Link>
          )}
        </nav>
        
        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--card-border)' }}>
            {logoutForm}
        </div>
      </aside>
      
      <style dangerouslySetInnerHTML={{__html: `
        .sidebar-wrapper::-webkit-scrollbar {
          width: 0;
          height: 0;
        }
        .sidebar-wrapper {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          color: #a1a1aa;
          text-decoration: none;
          font-size: 0.9rem;
          border-radius: 8px;
          transition: all 0.2s;
        }
        .sidebar-link:hover {
          background-color: rgba(255,255,255,0.05);
          color: white;
        }
      `}} />
    </>
  );
}
