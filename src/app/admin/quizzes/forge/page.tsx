import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import QuizCMSClient from './QuizCMSClient';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminForgePage() {
  const supabaseAdmin = createSupabaseAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch materials for dropdown
  const { data: materials } = await supabaseAdmin.from('materials').select('id, title, type').order('created_at', { ascending: false });

  // Deep Fetch all quizzes + relationships
  const { data: quizzes } = await supabaseAdmin.from('quizzes').select('*, materials(title), quiz_questions(*)').order('created_at', { ascending: false });

  return (
    <main style={{ padding: '3rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
           <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Knowledge Forge</h1>
           <p style={{ color: '#a1a1aa', fontSize: '1.1rem' }}>Construct internal assessments and link them to curriculum assets.</p>
        </div>
        <Link href="/admin/quizzes" className="btn-secondary" style={{ textDecoration: 'none', padding: '0.75rem 2rem' }}>
           Back to Scores
        </Link>
      </header>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
         <QuizCMSClient materials={materials || []} quizzes={quizzes || []} />
      </div>

    </main>
  );
}
