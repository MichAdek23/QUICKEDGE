import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminDashboardPage() {
  let supabase;
  let students: any[] = [];
  let user;
  
  try {
    supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    user = authData.user;
    
    if (!user) {
      redirect('/login');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      redirect('/dashboard');
    }

    // Fetch all student profiles
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('*')
      .neq('role', 'admin')
      .order('created_at', { ascending: false });

    if (profilesData) students = profilesData;

  } catch (error) {
     console.error('Database connection failed.');
  }

  return (
    <main style={{ minHeight: '100vh', padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Admin Dashboard</h1>
          <p style={{ color: '#a1a1aa' }}>Monitor your students and platform metrics.</p>
        </div>
        <a href="/dashboard" className="btn-secondary">Back to App</a>
      </header>

      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Registered Students</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
              <th style={{ padding: '1rem', color: '#a1a1aa' }}>Name / ID</th>
              <th style={{ padding: '1rem', color: '#a1a1aa' }}>Status</th>
              <th style={{ padding: '1rem', color: '#a1a1aa' }}>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: '#a1a1aa' }}>
                  No students found.
                </td>
              </tr>
            ) : (
              students.map(student => (
                <tr key={student.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600 }}>{student.full_name || 'Anonymous User'}</div>
                    <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>{student.id.substring(0, 8)}...</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {student.is_subscribed ? (
                      <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', borderRadius: '999px', fontSize: '0.85rem' }}>
                        Subscribed (1500 NGN)
                      </span>
                    ) : (
                      <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'rgba(244, 114, 182, 0.2)', color: '#f472b6', borderRadius: '999px', fontSize: '0.85rem' }}>
                        Unpaid
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', color: '#a1a1aa' }}>
                    {new Date(student.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
