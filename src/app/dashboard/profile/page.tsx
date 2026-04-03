import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { updateProfile } from '@/app/auth/actions';
import ProfileClient from './ProfileClient';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function ProfilePage(props: { searchParams: SearchParams }) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;
  
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const searchParams = await props.searchParams;
  const message = searchParams?.message as string | undefined;
  const error = searchParams?.error as string | undefined;

  return (
    <div className="dashboard-container">
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>My Profile</h1>
        <p style={{ color: '#a1a1aa' }}>Manage your account settings and personal information.</p>
      </header>

      {message && (
        <div style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.9rem' }}>
          {message}
        </div>
      )}
      
      {error && (
        <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <ProfileClient userId={user.id} currentAvatarUrl={profile?.avatar_url} />

        <form action={updateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingTop: '2.5rem', marginTop: '2.5rem', borderTop: '1px solid var(--card-border)' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#e4e4e7' }}>Email Address (Non-editable)</label>
            <input type="email" value={user.email} className="input-field" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#e4e4e7' }}>Full Name</label>
            <input type="text" name="full_name" defaultValue={profile?.full_name || ''} className="input-field" placeholder="John Doe" required />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#e4e4e7' }}>Account Role</label>
            <input type="text" value={profile?.role.toUpperCase()} className="input-field" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} />
          </div>

          <div style={{ paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary" style={{ minWidth: '150px' }}>Save Changes</button>
          </div>
        </form>
      </div>
      
      <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
         <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Subscription Status</h3>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: '#a1a1aa' }}>Current tier:</p>
            {profile?.is_subscribed ? (
              <span style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', borderRadius: '4px', fontSize: '1rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                PREMIUM
              </span>
            ) : (
              <span style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(244, 114, 182, 0.1)', color: '#f472b6', borderRadius: '4px', fontSize: '1rem', border: '1px solid rgba(244, 114, 182, 0.3)' }}>
                FREE ACCESS
              </span>
            )}
         </div>
      </div>
    </div>
  );
}
