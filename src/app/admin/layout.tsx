import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import Sidebar from './Sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  
  if (!authData.user) {
    redirect('/login');
  }

  // Force strict Server-side verify bypassing RLS completely via backend service role
  const supabaseAdmin = createSupabaseAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('role, full_name, avatar_url')
    .eq('id', authData.user.id)
    .single();

  console.log('--- ADMIN ACCESS DIAGNOSTICS ---');
  console.log('Current Authenticated User ID:', authData.user.id);
  console.log('Resolved Profile Database Match:', profile);
  console.log('Database Error Code (if any):', error);

  if (profile?.role !== 'admin') {
    console.log('VERDICT: REJECTED - Transporting back to User Dashboard.');
    redirect('/dashboard');
  } else {
    console.log('VERDICT: APPROVED - Admin portal unlocked.');
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <style>{`
        [data-admin-container] main::-webkit-scrollbar {
          width: 0;
          height: 0;
        }
        [data-admin-container] main::-webkit-scrollbar-track {
          background: transparent;
        }
        [data-admin-container] main::-webkit-scrollbar-thumb {
          background: transparent;
        }
        [data-admin-container] main {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
      <Sidebar adminProfile={profile} />
      <main style={{ flexGrow: 1, height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
        {children}
      </main>
    </div>
  );
}
