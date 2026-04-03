import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = await params;
  const supabase = await createClient();
  const { data: post } = await supabase.from('blog_posts').select('title, content').eq('slug', p.slug).single();
  return {
    title: post?.title ? `${post.title} | Quickedge` : 'Quickedge Blog',
    description: post?.content?.substring(0, 150)
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await params;
  const supabase = await createClient();
  
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*, profiles(full_name)')
    .eq('slug', p.slug)
    .single();

  if (!post) return notFound();

  // Basic markdown simulator to render line breaks cleanly
  const renderContent = (content: string) => {
     return content.split('\n').map((paragraph, i) => (
        paragraph.trim() ? <p key={i} style={{ marginBottom: '1.5rem', lineHeight: '1.8', fontSize: '1.15rem', color: '#e4e4e7' }}>{paragraph}</p> : <br key={i} />
     ));
  };

  return (
    <article style={{ minHeight: '100vh', padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#a1a1aa', textDecoration: 'none', marginBottom: '3rem', fontSize: '0.9rem', transition: 'color 0.2s' }}>
         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
         Back to Insights
      </Link>

      <header style={{ marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.2, color: '#f4f4f5' }}>{post.title}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#a1a1aa', fontSize: '0.9rem', borderTop: '1px solid var(--card-border)', borderBottom: '1px solid var(--card-border)', padding: '1rem 0' }}>
           <span style={{ fontWeight: 600, color: 'var(--primary)' }}>By {(post.profiles as any)?.full_name || 'Admin'}</span>
           <span>•</span>
           <span>Published {new Date(post.created_at).toLocaleDateString()}</span>
        </div>
      </header>

      <section style={{ fontFamily: 'Georgia, serif' }}>
         {renderContent(post.content)}
      </section>

      <div style={{ marginTop: '5rem', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--card-border)' }}>
         <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#f4f4f5' }}>Ready to elevate your knowledge?</h3>
         <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>Sign up to the platform to access premium PDF and video materials.</p>
         <Link href="/signup" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>Join Quickedge Today</Link>
      </div>
    </article>
  );
}
