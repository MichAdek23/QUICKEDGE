import { createClient } from '@/utils/supabase/server';
import { toggleAdminSignup } from './actions';

export default async function SettingsPage() {
  const supabase = await createClient();
  
  const { data: setting } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'admin_signup_enabled')
    .single();

  const isEnabled = setting?.value === 'true';

  return (
    <main style={{ padding: '3rem 4rem', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Platform Settings</h1>
        <p style={{ color: '#a1a1aa', fontSize: '1.1rem' }}>Manage global configurations.</p>
      </header>

      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#f4f4f5', marginBottom: '0.5rem' }}>Allow Admin Registrations</h2>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', maxWidth: '400px' }}>
              If disabled, users cannot hit the `/admin-signup` route even if they have the master code. Useful for locking down onboarding.
            </p>
         </div>
         
         <form action={async () => {
           'use server';
           await toggleAdminSignup(!isEnabled);
         }}>
           <button type="submit" className={isEnabled ? "btn-secondary" : "btn-primary"} style={{ padding: '0.75rem 2rem' }}>
              {isEnabled ? "Disable Feature" : "Enable Feature"}
           </button>
         </form>
      </div>
    </main>
  );
}
