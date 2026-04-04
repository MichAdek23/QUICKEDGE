import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './blog.css'; // Optional: for tailored markdown formatting

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  
  const { data: routeParams } = await Promise.resolve({ data: params });

  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*, profiles(full_name, avatar_url)')
    .eq('slug', routeParams.slug)
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <main style={{ minHeight: '100vh', padding: '6rem 2rem 10rem', background: '#09090b', color: '#f4f4f5' }}>
      <article style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Navigation & Breadcrumb */}
        <div style={{ marginBottom: '3rem' }}>
           <a href="/blog" style={{ color: '#a1a1aa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <g><path d="M19 12H5M12 19l-7-7 7-7" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g>
              Back to Ledger
           </a>
        </div>

        {/* Hero Segment */}
        <header style={{ marginBottom: '4rem' }}>
           <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '2rem', lineHeight: '1.2', color: '#ffffff' }}>
             {post.title}
           </h1>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(45deg, #ef4444, #f43f5e)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                 {post.profiles?.[0]?.full_name?.[0] || 'A'}
              </div>
              <div>
                 <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f4f4f5' }}>{post.profiles?.[0]?.full_name || 'Admin'}</div>
                 <div style={{ fontSize: '0.9rem', color: '#a1a1aa' }}>
                    Published on {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                 </div>
              </div>
           </div>
        </header>

        {/* Splash Thumbnail */}
        {post.thumbnail_url && (
           <div style={{ width: '100%', height: '400px', borderRadius: '16px', backgroundImage: `url(${post.thumbnail_url})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: '4rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} />
        )}

        {/* Content Render Engine */}
        <div className="markdown-deploy" style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#d4d4d8' }}>
           <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
           </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
