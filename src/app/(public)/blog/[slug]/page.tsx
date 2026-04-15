import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './blog.css'; 

export default async function BlogPostPage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const supabase = await createClient();
  
  const routeParams = await Promise.resolve(params);

  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*, profiles(full_name, avatar_url)')
    .eq('slug', routeParams.slug)
    .single();

  // Fetch admin profile for consistent branding
  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('role', 'admin')
    .single();

  if (error || !post) {
    notFound();
  }

  const defaultHero = 'url(/images/hero-1.png) center/cover no-repeat';

  return (
    <main style={{ minHeight: '100vh', background: '#09090b', color: '#f4f4f5' }}>
      
      {/* Dynamic Immersive Thumbnail Hero */}
      <section style={{ 
         width: '100%', 
         height: '100vh', 
         position: 'relative', 
         display: 'flex', 
         alignItems: 'flex-end', 
         justifyContent: 'center', 
         background: post.thumbnail_url ? `url(${post.thumbnail_url}) center/cover no-repeat` : defaultHero 
      }}>
         {/* Shader Gradient */}
         <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #09090b 0%, rgba(9,9,11,0.5) 100%)', zIndex: 1 }}></div>

         {/* Content Wrapper */}
         <div style={{ maxWidth: '800px', width: '100%', padding: '0 2rem 4rem', position: 'relative', zIndex: 2 }}>
           <a href="/blog" style={{ color: '#a1a1aa', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '2rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                 <g><path d="M19 12H5M12 19l-7-7 7-7" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g>
              </svg>
              Return to Catalog
           </a>
           
           <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '2rem', lineHeight: '1.1', color: '#ffffff', textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
             {post.title}
           </h1>
           
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: adminProfile?.avatar_url ? `url(${adminProfile.avatar_url}) center/cover no-repeat` : 'linear-gradient(45deg, #ef4444, #f43f5e)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.4)' }}>
                 {adminProfile?.avatar_url ? '' : (adminProfile?.full_name?.[0] || 'A')}
              </div>
              <div>
                 <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>{adminProfile?.full_name || 'Admin'}</div>
                 <div style={{ fontSize: '0.9rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                 </div>
              </div>
           </div>
         </div>
      </section>

      {/* Markdown Engine Execution Block */}
      <article style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem 10rem' }}>
        <div className="markdown-deploy" style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#d4d4d8' }}>
           <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
           </ReactMarkdown>
        </div>
      </article>

    </main>
  );
}
