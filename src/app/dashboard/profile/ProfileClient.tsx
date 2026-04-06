'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function ProfileClient({ userId, currentAvatarUrl, isSocialUser }: { userId: string, currentAvatarUrl?: string, isSocialUser: boolean }) {
  const supabase = createClient();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [linking, setLinking] = useState(false);
  const [password, setPassword] = useState('');
  const [settingPassword, setSettingPassword] = useState(false);

  // Set Password handler
  const handleSetPassword = async () => {
    try {
       setSettingPassword(true);
       const { error } = await supabase.auth.updateUser({ password });
       if (error) throw error;
       alert('Password updated successfully! You can now use your email and this password to log in.');
       setPassword('');
    } catch (err: any) {
       alert(err.message || 'Error updating password.');
    } finally {
       setSettingPassword(false);
    }
  };

  // Upload handler
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;
      
      router.refresh();
    } catch (error) {
      alert('Error uploading avatar!');
    } finally {
      setUploading(false);
    }
  };

  // Link handler
  const handleConnectGoogle = async () => {
    try {
      setLinking(true);
      const { error } = await supabase.auth.linkIdentity({ provider: 'google', options: {
         redirectTo: `${window.location.origin}/auth/callback`
      }});
      if (error) alert(error.message);
    } catch (err) {
       console.error(err);
    } finally {
      setLinking(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
       {/* Avatar UI */}
       <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {currentAvatarUrl ? (
             <img src={currentAvatarUrl} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} />
          ) : (
             <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--card-border)', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
               <span style={{ margin: 'auto', color: '#a1a1aa' }}>None</span>
             </div>
          )}
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#e4e4e7', cursor: 'pointer', width: 'fit-content' }} className="btn-secondary">
               {uploading ? 'Uploading...' : 'Upload New Avatar'}
               <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
            </label>
            <p style={{ fontSize: '0.8rem', color: '#a1a1aa', marginTop: '0.5rem' }}>File size must be below 2MB (JPG, PNG)</p>
          </div>
       </div>

       {/* Link Button */}
       <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--card-border)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#e4e4e7' }}>Connected Accounts</h3>
          <p style={{ fontSize: '0.9rem', color: '#a1a1aa', marginBottom: '1.5rem' }}>Link your Google account to enable secure single sign-on.</p>
          <button onClick={handleConnectGoogle} disabled={linking || isSocialUser} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', width: 'fit-content', opacity: isSocialUser ? 0.5 : 1, cursor: isSocialUser ? 'not-allowed' : 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {isSocialUser ? 'Google already linked' : (linking ? 'Connecting...' : 'Connect Google Account')}
          </button>
          {isSocialUser && (
            <p style={{ color: '#a1a1aa', marginTop: '0.75rem', fontSize: '0.85rem' }}>Google login is already enabled for this account. You can still set a password below.</p>
          )}
       </div>

       {/* Set / Update Password Button */}
       <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--card-border)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#e4e4e7' }}>Password Settings</h3>
          <p style={{ fontSize: '0.9rem', color: '#a1a1aa', marginBottom: '1.5rem' }}>Set a password to enable email login if you originally used Google, or update your existing password.</p>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
             <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password" style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.5)', color: 'white', flexGrow: 1, maxWidth: '300px' }} />
             <button onClick={handleSetPassword} disabled={settingPassword || !password} className="btn-secondary">
               {settingPassword ? 'Saving...' : 'Save Password'}
             </button>
          </div>
       </div>
    </div>
  );
}
