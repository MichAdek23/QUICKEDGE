import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import QuizBuilder from './QuizBuilder';
import { forceDeleteQuizAttempt } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminQuizzesPage() {
  const supabaseAdmin = createSupabaseAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch materials for dropdown
  const { data: materials } = await supabaseAdmin.from('materials').select('id, title, type').order('created_at', { ascending: false });

  // Fetch massive attempt telemetry
  const { data: attempts } = await supabaseAdmin
    .from('quiz_attempts')
    .select(`
       id,
       score,
       total,
       created_at,
       profiles ( full_name, mat_number ),
       quizzes ( title, materials ( title ) )
    `)
    .order('created_at', { ascending: false });

  return (
    <main style={{ padding: '3rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Institutional Quizzes & Telemetry</h1>
        <p style={{ color: '#a1a1aa', fontSize: '1.1rem' }}>Forge assessments, connect them to curriculum content, and monitor precise matriculation results.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) minmax(300px, 1fr)', gap: '3rem', alignItems: 'start' }}>
         
         {/* QUItz FORGE */}
         <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
               Quiz Forge
            </h2>
            <QuizBuilder materials={materials || []} />
         </div>

         {/* TELEMETRY BOARD */}
         <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
               Live Scores Stream
            </h2>
            
            <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ maxHeight: '800px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ position: 'sticky', top: 0, background: 'rgba(15, 15, 17, 0.95)', backdropFilter: 'blur(10px)', zIndex: 10 }}>
                    <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                      <th style={{ padding: '1.2rem', color: '#a1a1aa', fontSize: '0.8rem', textTransform: 'uppercase' }}>Candidate</th>
                      <th style={{ padding: '1.2rem', color: '#a1a1aa', fontSize: '0.8rem', textTransform: 'uppercase' }}>Assessment</th>
                      <th style={{ padding: '1.2rem', color: '#a1a1aa', fontSize: '0.8rem', textTransform: 'uppercase', textAlign: 'right' }}>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attempts?.map((a: any) => {
                       const percentage = (a.score / a.total) * 100;
                       const passed = percentage >= 70;
                       const prof = a.profiles || {};
                       const quiz = a.quizzes || {};
                       
                       return (
                         <tr key={a.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: passed ? 'rgba(16, 185, 129, 0.02)' : 'rgba(239, 68, 68, 0.02)' }}>
                           <td style={{ padding: '1.2rem' }}>
                             <div style={{ fontWeight: 600, color: '#f4f4f5' }}>{prof.full_name || 'Ghost Node'}</div>
                             {prof.mat_number && <div style={{ fontSize: '0.75rem', color: '#a1a1aa', fontFamily: 'monospace', marginTop: '0.2rem' }}>{prof.mat_number}</div>}
                           </td>
                           <td style={{ padding: '1.2rem' }}>
                              <div style={{ color: '#d4d4d8', fontSize: '0.9rem', fontWeight: 500 }}>{quiz.title || 'ARCHIVED QUIZ'}</div>
                              {quiz.materials?.title && <div style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '0.2rem' }}>Linked: {quiz.materials.title}</div>}
                           </td>
                           <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: passed ? '#10b981' : '#ef4444' }}>{percentage.toFixed(0)}%</div>
                              <form action={forceDeleteQuizAttempt}>
                                 <input type="hidden" name="attempt_id" value={a.id} />
                                 <button type="submit" style={{ background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: '0.7rem', textDecoration: 'underline', marginTop: '0.3rem' }}>Wipe Record</button>
                              </form>
                           </td>
                         </tr>
                       )
                    })}
                    {(!attempts || attempts.length === 0) && (
                       <tr><td colSpan={3} style={{ padding: '4rem', textAlign: 'center', color: '#a1a1aa' }}>Awaiting initial student transmissions...</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
         </div>

      </div>
    </main>
  );
}
