import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import Link from 'next/link';
import BlogActionControls from './BlogActionControls';

export const dynamic = 'force-dynamic';

export default async function BlogCMSDashboard() {
  const supabaseAdmin = createSupabaseAdminClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // Elevate query explicitly via the Service Role to bypass the public 'published = true' security policy
  const { data: blogs } = await supabaseAdmin
    .from('blog_posts')
    .select('*, profiles(full_name)')
    .eq('is_archived', false)
    .order('created_at', { ascending: false });

  return (
    <main style={{ padding: '3rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Blog CMS Architecture</h1>
          <p style={{ color: '#a1a1aa', fontSize: '1.1rem' }}>Manage drafts, toggle publication states, and soft archive old records.</p>
        </div>
        <Link href="/admin/blog/editor/new" className="btn-primary" style={{ textDecoration: 'none', padding: '0.75rem 2rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
           Forge Initial Draft
        </Link>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
         {blogs?.map(blog => (
            <div key={blog.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', borderTop: blog.published ? '4px solid #10b981' : '4px solid #f59e0b' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', padding: '0.3rem 0.8rem', borderRadius: '4px', background: blog.published ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: blog.published ? '#10b981' : '#f59e0b', border: `1px solid ${blog.published ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}` }}>
                     {blog.published ? 'LIVE PRODUCTION' : 'DRAFTED SECURELY'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#71717a' }}>{new Date(blog.created_at).toLocaleDateString()}</span>
               </div>
               
               <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f4f4f5', marginBottom: '0.5rem' }}>{blog.title}</h2>
               <p style={{ fontSize: '0.9rem', color: '#a1a1aa', flexGrow: 1, marginBottom: '1rem' }}>
                  {blog.content.substring(0, 100)}...
               </p>
               
               {blog.published && (
                  <a href={`/blog/${blog.slug}`} target="_blank" style={{ fontSize: '0.85rem', color: '#8b5cf6', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
                    View Live <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  </a>
               )}

               <BlogActionControls id={blog.id} published={blog.published} />
            </div>
         ))}
         {!blogs || blogs.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', border: '1px dashed var(--card-border)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
               <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="1" style={{ margin: '0 auto 1rem auto' }}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
               <h3 style={{ fontSize: '1.2rem', color: '#e4e4e7', marginBottom: '0.5rem' }}>No Records Detected</h3>
               <p style={{ color: '#a1a1aa' }}>Forge a new draft to begin writing.</p>
            </div>
         )}
      </div>
    </main>
  );
}
