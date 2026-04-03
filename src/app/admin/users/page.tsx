import { createClient } from '@/utils/supabase/server';
import UserRow from './UserRow';

export default async function UsersDirectoryPage() {
  const supabase = await createClient();

  // Fetch users with their corresponding quiz attempt telemetry
  const { data: users } = await supabase
    .from('profiles')
    .select(`
      *,
      quiz_attempts (
        id,
        score,
        total,
        created_at,
        quizzes (
          title
        )
      )
    `)
    .order('created_at', { ascending: false });

  return (
    <main style={{ padding: '3rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>User Directory</h1>
          <p style={{ color: '#a1a1aa', fontSize: '1.1rem' }}>Manage roles, memberships, and view exact learning telemetry telemetry. Click any user to expand records.</p>
        </div>
      </header>

      <div className="glass-panel" style={{ overflow: 'hidden', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
           <thead>
             <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--card-border)' }}>
               <th style={{ padding: '1.5rem 1.2rem', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User Profile</th>
               <th style={{ padding: '1.5rem 1.2rem', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subscription</th>
               <th style={{ padding: '1.5rem 1.2rem', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Role</th>
               <th style={{ padding: '1.5rem 1.2rem', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
             </tr>
           </thead>
           <tbody>
             {users?.map(user => (
               <UserRow key={user.id} user={user} />
             ))}
           </tbody>
        </table>
      </div>
    </main>
  );
}
