import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function StudentScoresDashboard() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;
  
  if (!user) redirect('/login');

  const { data: attempts } = await supabase
     .from('quiz_attempts')
     .select(`
        id,
        score,
        total,
        created_at,
        quizzes ( title, materials ( id, title ) )
     `)
     .eq('user_id', user.id)
     .order('created_at', { ascending: false });

  return (
    <div className="dashboard-container" style={{ paddingBottom: '6rem', maxWidth: '1000px', margin: '0 auto' }}>
       <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Assessment Scores</h1>
          <p style={{ color: '#a1a1aa', fontSize: '1.05rem' }}>Personal telemetry and grading history of all mandatory tests executed in the strict testing environment.</p>
       </header>

       <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
          {attempts && attempts.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
               <thead>
                 <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--card-border)' }}>
                   <th style={{ padding: '1.5rem', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase' }}>Assessment Reference</th>
                   <th style={{ padding: '1.5rem', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase' }}>Execution Date</th>
                   <th style={{ padding: '1.5rem', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase' }}>Score Metrics</th>
                   <th style={{ padding: '1.5rem', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Status</th>
                 </tr>
               </thead>
               <tbody>
                 {attempts.map((attempt: any) => {
                    const percentage = (attempt.score / attempt.total) * 100;
                    const passed = percentage >= 70;
                    const qData = attempt.quizzes || {};

                    return (
                      <tr key={attempt.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: passed ? 'transparent' : 'rgba(239, 68, 68, 0.02)' }}>
                         <td style={{ padding: '1.5rem' }}>
                            <div style={{ fontWeight: 600, color: '#f4f4f5', fontSize: '1.05rem' }}>{qData.title || 'Archived Assessment'}</div>
                            {qData.materials && (
                               <Link href={`/dashboard/materials/${qData.materials.id}`} style={{ color: '#8b5cf6', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem', opacity: 0.8 }}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                  {qData.materials.title}
                               </Link>
                            )}
                         </td>
                         <td style={{ padding: '1.5rem', color: '#a1a1aa' }}>
                            {new Date(attempt.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                         </td>
                         <td style={{ padding: '1.5rem' }}>
                            <div style={{ color: '#e4e4e7', fontWeight: 600 }}>{attempt.score} / {attempt.total}</div>
                            <div style={{ color: '#71717a', fontSize: '0.8rem' }}>{percentage.toFixed(0)}%</div>
                         </td>
                         <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                            {passed ? (
                               <span style={{ padding: '0.35rem 0.8rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Passed</span>
                            ) : (
                               <span style={{ padding: '0.35rem 0.8rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Failed</span>
                            )}
                         </td>
                      </tr>
                    )
                 })}
               </tbody>
            </table>
          ) : (
            <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
               <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1rem auto' }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
               <h3 style={{ fontSize: '1.25rem', color: '#e4e4e7', marginBottom: '0.5rem' }}>No Scores Recorded</h3>
               <p style={{ color: '#a1a1aa', fontSize: '0.95rem' }}>You have not completed any mandatory assessments yet.</p>
            </div>
          )}
       </div>
    </div>
  );
}
