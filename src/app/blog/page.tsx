import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function PublicBlogIndex() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('title, slug, created_at, content, profiles(full_name)')
    .eq('published', true)
    .order('created_at', { ascending: false });

  return (
    <main style={{ minHeight: '100vh', padding: '6rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', backgroundImage: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Quickedge Insights
        </h1>
        <p style={{ color: '#a1a1aa', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Expert analysis, educational breakdowns, and the latest from the Quickedge consultancy team.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '3rem' }}>
        {posts?.map(post => (
          <Link href={`/blog/${post.slug}`} key={post.slug} style={{ textDecoration: 'none', display: 'block' }}>
             <article className="glass-panel" style={{ padding: '2.5rem', transition: 'all 0.3s', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }} 
               onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
               onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
             >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', fontSize: '0.85rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                   <span>{new Date(post.created_at).toLocaleDateString()}</span>
                   <span>•</span>
                   <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{(post.profiles as any)?.full_name || 'Quickedge Team'}</span>
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f4f4f5', marginBottom: '1rem' }}>{post.title}</h2>
                <p style={{ color: '#e4e4e7', fontSize: '1rem', lineHeight: 1.6 }}>
                  {post.content.substring(0, 180)}...
                </p>
                <span style={{ display: 'inline-block', marginTop: '1.5rem', color: 'var(--primary)', fontWeight: 600 }}>Read full article →</span>
             </article>
          </Link>
        ))}

        {!posts || posts.length === 0 && (
          <div style={{ textAlign: 'center', color: '#a1a1aa', padding: '4rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto 1rem auto' }}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            <h2>No articles published yet</h2>
            <p>Check back later for updates from our team.</p>
          </div>
        )}
      </div>
    </main>
  );
}
