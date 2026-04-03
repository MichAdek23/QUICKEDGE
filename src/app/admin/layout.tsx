import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Sidebar from './Sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  
  if (!authData.user) {
    redirect('/login');
  }

  // Force strict Server-side verify that this is absolutely an admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', authData.user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flexGrow: 1, maxHeight: '100vh', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}
