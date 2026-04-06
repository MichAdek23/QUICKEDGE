import { createClient } from '@/utils/supabase/server';

export default async function AdminDashboardOverview() {
  const supabase = await createClient();

  // Aggregate Data
  const { count: studentCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student');
  const { count: premiumCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_subscribed', true);
  
  const { data: payments } = await supabase.from('payments').select('amount').eq('status', 'success');
  const totalRevenue = payments?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

  const { count: materialsCount } = await supabase.from('materials').select('*', { count: 'exact', head: true });
  const { count: activeQuizzes } = await supabase.from('quizzes').select('*', { count: 'exact', head: true });

  const { data: recentProfiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(6);

  const conversionRate = studentCount ? ((premiumCount || 0) / studentCount * 100).toFixed(1) : '0.0';

  return (
    <main style={{ padding: '3rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>
      <style>{`
        .admin-analytics-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        @media (max-width: 1023px) {
          .admin-analytics-cards {
            display: flex;
            overflow-x: auto;
            padding-bottom: 1rem;
            gap: 1rem;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .admin-analytics-cards::-webkit-scrollbar {
            display: none;
          }
          .admin-analytics-cards > .glass-panel {
            flex: 0 0 auto;
            min-width: 280px;
            scroll-snap-align: start;
          }
        }
      `}</style>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Global Analytics</h1>
      <p style={{ color: '#a1a1aa', fontSize: '1.1rem', marginBottom: '3rem' }}>Real-time telemetry for the Quick-Hedge ecosystem.</p>

      <div className="admin-analytics-cards">
        
        <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid #ef4444' }}>
          <h3 style={{ color: '#a1a1aa', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Gross Revenue</h3>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: '#f4f4f5' }}>
            ₦{totalRevenue.toLocaleString()}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid #10b981' }}>
          <h3 style={{ color: '#a1a1aa', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Conversion Rate</h3>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: '#f4f4f5', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            {premiumCount} <span style={{ fontSize: '1rem', color: '#10b981' }}>({conversionRate}% paid)</span>
          </div>
          <p style={{ color: '#52525b', fontSize: '0.8rem', marginTop: '0.5rem' }}>out of {studentCount} total students</p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid #8b5cf6' }}>
          <h3 style={{ color: '#a1a1aa', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Active Infrastructure</h3>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f4f4f5', marginBottom: '0.5rem' }}>
            {materialsCount} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#a1a1aa' }}>Materials Deployed</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f4f4f5' }}>
            {activeQuizzes} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#a1a1aa' }}>Quizzes Live</span>
          </div>
        </div>

      </div>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Recent Platform Ledger</h2>
      <div className="glass-panel" style={{ overflow: 'hidden', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--card-border)' }}>
               <th style={{ padding: '1rem 1.5rem', color: '#a1a1aa', fontSize: '0.9rem' }}>Amount</th>
               <th style={{ padding: '1rem 1.5rem', color: '#a1a1aa', fontSize: '0.9rem' }}>Status</th>
               <th style={{ padding: '1rem 1.5rem', color: '#a1a1aa', fontSize: '0.9rem' }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {(payments || []).slice(0, 8).map((p: any, i: number) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                 <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>₦{Number(p.amount).toLocaleString()}</td>
                 <td style={{ padding: '1rem 1.5rem' }}><span style={{ color: '#34d399', background: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>Success</span></td>
                 <td style={{ padding: '1rem 1.5rem', color: '#a1a1aa', fontSize: '0.9rem' }}>Recent</td>
              </tr>
            ))}
            {!payments || payments.length === 0 && (
              <tr><td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: '#a1a1aa' }}>No payments processed yet.</td></tr>
            )}
           </tbody>
        </table>
      </div>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '4rem', marginBottom: '1.5rem' }}>Recent User Signups</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {(recentProfiles || []).map((prof: any) => (
           <div key={prof.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f4f4f5', fontWeight: 'bold' }}>
                 {prof.full_name ? prof.full_name[0].toUpperCase() : 'U'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                 <div style={{ fontWeight: 600, color: '#f4f4f5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prof.full_name || 'Anonymous User'}</div>
                 <div style={{ fontSize: '0.8rem', color: prof.role === 'admin' ? '#ef4444' : '#a1a1aa', textTransform: 'uppercase' }}>{prof.role}</div>
              </div>
           </div>
        ))}
        {!recentProfiles || recentProfiles.length === 0 && (
           <p style={{ color: '#a1a1aa' }}>No user profiles detected.</p>
        )}
      </div>
    </main>
  );
}
