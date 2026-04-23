import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import Link from 'next/link';

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: userId } = await params;
  const supabaseAdmin = createSupabaseAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch user profile with attempts using Admin role
  const { data: user } = await supabaseAdmin
    .from('profiles')
    .select(`*, quiz_attempts (id, score, total, created_at, quizzes (title))`)
    .eq('id', userId)
    .single();

  if (!user) {
    return (
      <main className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ color: '#f4f4f5' }}>User not found</h2>
        <Link href="/admin/users" className="btn-primary" style={{ marginTop: '1rem' }}>
          Back to Directory
        </Link>
      </main>
    );
  }

  const attempts = user.quiz_attempts || [];

  return (
    <main className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/admin/users" className="btn-secondary" style={{ marginBottom: '1rem' }}>
        ← Back to Users Directory
      </Link>
      <section style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#f4f4f5' }}>{user.full_name || 'Anonymous User'}</h1>
        <p style={{ color: '#a1a1aa' }}>MAT: {user.mat_number || 'N/A'}</p>
        <p style={{ color: '#a1a1aa' }}>Role: {user.role}</p>
        <p style={{ color: '#a1a1aa' }}>
          Subscription: {user.is_subscribed ? 'Subscribed' : 'Free Tier'}
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', color: '#f4f4f5', marginBottom: '1rem' }}>
          Quiz Telemetry ({attempts.length} attempts)
        </h2>
        {attempts.length === 0 ? (
          <p style={{ color: '#52525b' }}>This user has not completed any quizzes yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {attempts.map((attempt: any) => {
              const percentage = (attempt.score / attempt.total) * 100;
              const passed = percentage >= 70;
              return (
                <div key={attempt.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: passed ? '3px solid #10b981' : '3px solid #ef4444' }}>
                  <div style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '0.25rem' }}>{attempt.quizzes?.title || 'Deleted Quiz'}</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: passed ? '#10b981' : '#ef4444' }}>{percentage.toFixed(0)}%</span>
                    <span style={{ fontSize: '0.85rem', color: '#52525b', paddingBottom: '0.2rem' }}>({attempt.score}/{attempt.total} correct)</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
