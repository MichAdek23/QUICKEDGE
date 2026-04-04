import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import StrictQuizRunner from './StrictQuizRunner';
import Link from 'next/link';

export default async function ExamGatewayPage(props: { params: Promise<{ quizId: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;
  
  if (!user) redirect('/login');

  // 1. Fetch Quiz Configuration & Ensure it Exists
  const { data: quiz, error: quizError } = await supabase
     .from('quizzes')
     .select('*, quiz_questions(*)')
     .eq('id', params.quizId)
     .single();

  if (quizError || !quiz) {
     return <div className="dashboard-container"><h1>Assessment Engine Error</h1><p>Quiz node completely invalid or deleted.</p></div>;
  }

  // 2. DEFENSIVE CHECK: Did the student already complete this?
  const { data: attempts } = await supabase
     .from('quiz_attempts')
     .select('id, score, total, created_at')
     .eq('quiz_id', quiz.id)
     .eq('user_id', user.id);

  if (attempts && attempts.length > 0) {
     const attemptData = attempts[0];
     const percentage = (attemptData.score / attemptData.total) * 100;
     const passed = percentage >= 70;

     return (
       <div className="dashboard-container" style={{ paddingBottom: '6rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginTop: '4rem' }}>
          <div className="glass-panel" style={{ padding: '4rem 2rem', borderTop: passed ? '4px solid #10b981' : '4px solid #ef4444' }}>
             <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={passed ? "#10b981" : "#ef4444"} strokeWidth="1.5" style={{ margin: '0 auto 1.5rem auto' }}><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M12 11v6"/><path d="M19 8V2"/><path d="M5 8V2"/><rect x="2" y="8" width="20" height="14" rx="2"/></svg>
             <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: passed ? '#10b981' : '#ef4444' }}>Assessment Completed</h1>
             <p style={{ color: '#e4e4e7', fontSize: '1.1rem', marginBottom: '2rem' }}>You have already utilized your single attempt for <strong>{quiz.title}</strong>.</p>
             
             <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--card-border)', display: 'inline-block', textAlign: 'left', minWidth: '300px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                   <span style={{ color: '#a1a1aa' }}>Score Segment:</span>
                   <span style={{ fontWeight: 800 }}>{attemptData.score} / {attemptData.total}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                   <span style={{ color: '#a1a1aa' }}>Final Percentage:</span>
                   <span style={{ fontWeight: 800, color: passed ? '#10b981' : '#ef4444' }}>{percentage.toFixed(0)}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                   <span style={{ color: '#a1a1aa' }}>Log Date:</span>
                   <span style={{ fontWeight: 600 }}>{new Date(attemptData.created_at).toLocaleDateString()}</span>
                </div>
             </div>

             <div style={{ marginTop: '3rem' }}>
                <Link href="/dashboard/scores" className="btn-primary" style={{ textDecoration: 'none', padding: '0.75rem 2rem' }}>Directory Portal</Link>
             </div>
          </div>
       </div>
     );
  }

  // 3. Initiate Safe Engine
  return (
    <div className="dashboard-container" style={{ paddingBottom: '6rem', maxWidth: '800px', margin: '0 auto' }}>
       <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Secure Assessment Gateway</h1>
          <p style={{ color: '#a1a1aa' }}>Ensure stable network connection.</p>
       </div>

       <StrictQuizRunner quiz={quiz} />
    </div>
  );
}
