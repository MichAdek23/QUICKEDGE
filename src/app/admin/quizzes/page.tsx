import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { forceDeleteQuizAttempt } from './actions';
import ScoreBoardClient from './ScoreBoardClient';

export const dynamic = 'force-dynamic';

export default async function AdminScoresPage() {
  const supabaseAdmin = createSupabaseAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

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
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
           <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Student Telemetry Stream</h1>
           <p style={{ color: '#a1a1aa', fontSize: '1.1rem' }}>Monitor precise matriculation results and examination pass rates.</p>
        </div>
        <Link href="/admin/quizzes/forge" className="btn-primary" style={{ textDecoration: 'none', padding: '0.75rem 2rem' }}>
           Go To Quiz Forge
        </Link>
      </header>

      {/* TELEMETRY BOARD */}
      <div>
         <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Live Scores Stream
         </h2>
         
         <ScoreBoardClient initialAttempts={attempts || []} />
      </div>
    </main>
  );
}
