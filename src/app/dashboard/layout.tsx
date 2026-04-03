import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { logout } from '@/app/auth/actions';

import Sidebar from './Sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;
  
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_subscribed, full_name, role, avatar_url')
    .eq('id', user.id)
    .single();

  const isSubscribed = profile?.is_subscribed || profile?.role === 'admin';

  const logoutForm = (
      <form action={logout}>
          <button type="submit" className="sidebar-link" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
             Log Out
          </button>
      </form>
  );

  const accountTag = isSubscribed ? (
     <span style={{ display: 'inline-block', padding: '0.4rem 1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', borderRadius: '999px', fontSize: '0.75rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>Premium Active</span>
  ) : (
     <span style={{ display: 'inline-block', padding: '0.4rem 1rem', background: 'rgba(244, 114, 182, 0.1)', color: '#f472b6', borderRadius: '999px', fontSize: '0.75rem', border: '1px solid rgba(244, 114, 182, 0.3)' }}>Free Tier</span>
  );

  return (
    <div className="dashboard-layout">
      
      <Sidebar profileRole={profile?.role || 'student'} profileName={profile?.full_name || 'Student'} avatarUrl={profile?.avatar_url} logoutForm={logoutForm} accountTag={accountTag} />

      {/* Main Content */}
      <main style={{ flex: 1, position: 'relative', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
