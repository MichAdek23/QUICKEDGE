'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function Sidebar({ adminProfile }: { adminProfile?: { full_name?: string, avatar_url?: string } }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const adminName = adminProfile?.full_name || 'Administrator';

  const menu = [
    { name: 'Analytics', path: '/admin', icon: <g><path d="M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z"/></g> },
    { name: 'Inbox / Comms', path: '/admin/messages', icon: <g><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></g> },
    { name: 'Users & Telemetry', path: '/admin/users', icon: <g><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></g> },
    { name: 'Quizzes & Scores', path: '/admin/quizzes', icon: <g><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></g> },
    { name: 'Content Library', path: '/admin/materials', icon: <g><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></g> },
    { name: 'Blog Engine', path: '/admin/blog', icon: <g><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></g> },
    { name: 'Settings', path: '/admin/settings', icon: <g><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></g> },
  ];

  return (
    <aside style={{ width: '280px', borderRight: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', background: 'rgba(10, 10, 12, 0.8)', backdropFilter: 'blur(10px)', padding: '2rem 1.5rem' }}>
       <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
         {adminProfile?.avatar_url ? (
           <img src={adminProfile.avatar_url} alt="Admin" style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)' }} />
         ) : (
           <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(45deg, #ef4444, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
             {getInitials(adminName)}
           </div>
         )}
         <div style={{ overflow: 'hidden' }}>
           <h2 style={{ fontSize: '1rem', fontWeight: 800, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{adminName}</h2>
           <p style={{ color: '#ef4444', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>COMMAND CENTER</p>
         </div>
       </div>

       <nav style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
         {menu.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '12px', background: isActive ? 'rgba(239, 68, 68, 0.1)' : 'transparent', color: isActive ? '#ef4444' : '#a1a1aa', border: isActive ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid transparent', textDecoration: 'none', transition: 'all 0.2s', fontWeight: isActive ? 600 : 400 }}>
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{item.icon}</svg>
                 {item.name}
              </Link>
            )
         })}
       </nav>

       <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem' }}>
         <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', color: '#e4e4e7', textDecoration: 'none', fontSize: '0.9rem' }}>
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
           Back to App
         </Link>
         <button onClick={handleLogout} style={{ border: 'none', background: 'none', color: '#ef4444', width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', fontSize: '0.9rem', cursor: 'pointer', marginTop: '0.5rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
            End Session
         </button>
       </div>
    </aside>
  );
}
