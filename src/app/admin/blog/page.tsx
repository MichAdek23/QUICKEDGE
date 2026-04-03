import { createClient } from '@/utils/supabase/server';
import { createBlogPost, deleteBlogPost } from './actions';

export default async function BlogAdminPage() {
  const supabase = await createClient();
  // Fetch blogs along with their author details. (assumes profiles join works)
  const { data: blogs } = await supabase.from('blog_posts').select('*, profiles(full_name)').order('created_at', { ascending: false });

  return (
    <main style={{ padding: '3rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Blog Publisher Engine</h1>
        <p style={{ color: '#a1a1aa', fontSize: '1.1rem' }}>Write updates, tutorials, and marketing material to rank on Google search.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '3rem' }}>
         <div>
            <div className="glass-panel">
               <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#f4f4f5' }}>Draft New Article</h2>
               <form action={createBlogPost} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem', display: 'block' }}>Catchy Title SEO</label>
                    <input type="text" name="title" required className="input-field" placeholder="E.g. Top 5 Forex Strategies..." />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem', display: 'block' }}>Rich Content (Markdown/HTML Support)</label>
                    <textarea name="content" required className="input-field" rows={12} placeholder="Write your massive blog post here..."></textarea>
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', background: 'linear-gradient(45deg, #10b981, #059669)' }}>Publish to World</button>
               </form>
            </div>
         </div>

         <div>
           <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
             <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
               <thead>
                 <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--card-border)' }}>
                   <th style={{ padding: '1.5rem', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase' }}>Article</th>
                   <th style={{ padding: '1.5rem', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {blogs?.map(b => (
                   <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                     <td style={{ padding: '1.5rem' }}>
                       <div style={{ fontWeight: 600, color: '#f4f4f5', marginBottom: '0.25rem' }}>{b.title}</div>
                       <a href={`/blog/${b.slug}`} target="_blank" style={{ fontSize: '0.8rem', color: '#3b82f6', textDecoration: 'none' }}>quickedge.com/blog/{b.slug}</a>
                     </td>
                     <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                       <form action={deleteBlogPost}>
                          <input type="hidden" name="id" value={b.id} />
                          <button type="submit" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}>Delete</button>
                       </form>
                     </td>
                   </tr>
                 ))}
                 {!blogs || blogs.length === 0 && (
                   <tr><td colSpan={2} style={{ padding: '3rem', textAlign: 'center', color: '#a1a1aa' }}>No articles published.</td></tr>
                 )}
               </tbody>
             </table>
           </div>
         </div>
      </div>
    </main>
  );
}
