import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import HeroCarousel from '@/components/HeroCarousel';

export default async function BlogIndexPage() {
  const supabase = await createClient();
  
  // Fetch published blogs unconditionally for public indexing
  const { data: blogs, error } = await supabase
    .from('blog_posts')
    .select('*, profiles(full_name, avatar_url)')
    .eq('published', true)
    .eq('is_archived', false)
    .order('created_at', { ascending: false });

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0c', color: '#f4f4f5' }}>
      
      <HeroCarousel 
         preTitle="Intel & Analysis"
         title="The Quick-Hedge"
         gradientSpan="Ledger."
         subtitle="Latest market insights, trading strategies, and platform updates straight from the originators."
      />

      <div style={{ maxWidth: '1200px', margin: '-5rem auto 0 auto', position: 'relative', zIndex: 5, padding: '0 2rem 6rem' }}>
        <style>{`
          .blog-cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 2rem;
          }

          @media (max-width: 767px) {
            .blog-cards-grid {
              grid-template-columns: 1fr;
              gap: 1.5rem;
            }
          }
        `}</style>
        <div className="blog-cards-grid">
          {blogs?.map((post: any) => (
             <Link href={`/blog/${post.slug}`} key={post.id} style={{ textDecoration: 'none' }}>
                <article className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid rgba(255,255,255,0.05)' }}>
                   {post.thumbnail_url ? (
                      <div style={{ width: '100%', height: '220px', background: `url(${post.thumbnail_url}) center/cover no-repeat` }} />
                   ) : (
                      <div style={{ width: '100%', height: '220px', background: 'linear-gradient(135deg, #18181b, #27272a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <span style={{ color: '#a1a1aa', fontWeight: 600 }}>QUICK-HEDGE</span>
                      </div>
                   )}
                   <div style={{ padding: '2rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                         <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ef4444', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                            {post.profiles?.[0]?.full_name?.[0] || 'A'}
                         </div>
                         <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
                            <span style={{ color: '#f4f4f5' }}>{post.profiles?.[0]?.full_name || 'Admin'}</span>
                            <span style={{ margin: '0 0.5rem' }}>•</span>
                            <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                         </div>
                      </div>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f4f4f5', marginBottom: '0.5rem', lineHeight: '1.3' }}>
                         {post.title}
                      </h2>
                      <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: '1.6', flexGrow: 1 }}>
                         {post.content.substring(0, 140)}...
                      </p>
                   </div>
                </article>
             </Link>
          ))}
          {!blogs || blogs.length === 0 && (
             <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '6rem', color: '#a1a1aa', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                No transmission received yet. Check back later.
             </div>
          )}
        </div>
      </div>
    </main>
  );
}
