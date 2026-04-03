import { createClient } from '@/utils/supabase/server';
import { createMaterial, deleteMaterial } from './actions';

export default async function MaterialsCMSPage() {
  const supabase = await createClient();
  const { data: materials } = await supabase.from('materials').select('*').order('created_at', { ascending: false });

  return (
    <main style={{ padding: '3rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Content Library CMS</h1>
        <p style={{ color: '#a1a1aa', fontSize: '1.1rem' }}>Publish new PDFs, Videos, or interactive endpoints straight to the user dashboard.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '3rem' }}>
         <div>
            <div className="glass-panel">
               <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#f4f4f5' }}>Deploy Material</h2>
               <form action={createMaterial} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem', display: 'block' }}>Title</label>
                    <input type="text" name="title" required className="input-field" placeholder="E.g. Advanced Forex PDF" />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem', display: 'block' }}>File URL (Drive/S3/YouTube)</label>
                    <input type="url" name="url" required className="input-field" placeholder="https://..." />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem', display: 'block' }}>Type</label>
                    <select name="type" className="input-field" style={{ appearance: 'auto', backgroundColor: '#18181b' }}>
                       <option value="pdf">PDF Document</option>
                       <option value="video">Direct Video</option>
                       <option value="image">Image Format</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem', display: 'block' }}>Description Setup</label>
                    <textarea name="description" required className="input-field" rows={4} placeholder="What will they learn?"></textarea>
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>Push to Production</button>
               </form>
            </div>
         </div>

         <div>
           <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
             <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
               <thead>
                 <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--card-border)' }}>
                   <th style={{ padding: '1.5rem', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase' }}>Material Name</th>
                   <th style={{ padding: '1.5rem', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase' }}>Type</th>
                   <th style={{ padding: '1.5rem', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
                 </tr>
               </thead>
               <tbody>
                 {materials?.map(m => (
                   <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                     <td style={{ padding: '1.5rem' }}>
                       <div style={{ fontWeight: 600, color: '#f4f4f5' }}>{m.title}</div>
                       <div style={{ fontSize: '0.8rem', color: '#a1a1aa', marginTop: '0.2rem' }}>{new Date(m.created_at).toLocaleDateString()}</div>
                     </td>
                     <td style={{ padding: '1.5rem' }}>
                        <span style={{ padding: '0.2rem 0.6rem', border: '1px solid var(--card-border)', borderRadius: '4px', fontSize: '0.75rem', textTransform: 'uppercase' }}>{m.type}</span>
                     </td>
                     <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                       <form action={deleteMaterial}>
                          <input type="hidden" name="id" value={m.id} />
                          <button type="submit" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}>Delete</button>
                       </form>
                     </td>
                   </tr>
                 ))}
                 {!materials || materials.length === 0 && (
                   <tr><td colSpan={3} style={{ padding: '3rem', textAlign: 'center', color: '#a1a1aa' }}>No materials published.</td></tr>
                 )}
               </tbody>
             </table>
           </div>
         </div>
      </div>
    </main>
  );
}
