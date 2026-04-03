import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic'; // Ensures this page checks fresh payments

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;
  
  if (!user) redirect('/login');

  // Supabase Realtime will eventually power the local state, but for Next.js SSR we fetch the raw ledger
  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="dashboard-container">
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Payment History</h1>
        <p style={{ color: '#a1a1aa' }}>Transparent audit log of all your historical transactions.</p>
      </header>

      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
              <th style={{ padding: '1rem', color: '#a1a1aa' }}>Reference ID</th>
              <th style={{ padding: '1rem', color: '#a1a1aa' }}>Amount</th>
              <th style={{ padding: '1rem', color: '#a1a1aa' }}>Status</th>
              <th style={{ padding: '1rem', color: '#a1a1aa' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {!payments || payments.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#a1a1aa' }}>
                  No payment history found. Once you subscribe, it will appear here instantly!
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem', fontFamily: 'monospace', color: '#e4e4e7' }}>{p.reference}</td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{p.amount} NGN</td>
                  <td style={{ padding: '1rem' }}>
                     <span style={{ display: 'inline-block', padding: '0.25rem 0.6rem', background: p.status === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: p.status === 'success' ? '#34d399' : '#ef4444', borderRadius: '4px', fontSize: '0.8rem', textTransform: 'capitalize' }}>
                       {p.status}
                     </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#a1a1aa', fontSize: '0.9rem' }}>
                    {new Date(p.created_at).toLocaleDateString()} at {new Date(p.created_at).toLocaleTimeString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
