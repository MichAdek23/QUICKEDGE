import { createClient } from '@/utils/supabase/server';
import { deleteMaterial, publishMaterial, unpublishMaterial } from './actions';
import Link from 'next/link';

export default async function MaterialsCMSPage() {
  const supabase = await createClient();
  const { data: materials } = await supabase.from('materials').select('*').order('created_at', { ascending: false });

  return (
    <main style={{ padding: '3rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
        <div>
           <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Content Library CMS</h1>
           <p style={{ color: '#a1a1aa', fontSize: '1.1rem' }}>Manage your premium deployments and drafts.</p>
        </div>
        <Link href="/admin/materials/new" className="btn-primary" style={{ textDecoration: 'none', padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Deploy New Material
        </Link>
      </header>

      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--card-border)' }}>
              <th style={{ padding: '1.5rem', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase' }}>Material Name</th>
              <th style={{ padding: '1.5rem', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase' }}>Type</th>
              <th style={{ padding: '1.5rem', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '1.5rem', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
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
                <td style={{ padding: '1.5rem' }}>
                   {m.is_published ? (
                      <span style={{ padding: '0.3rem 0.8rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>LIVE</span>
                   ) : (
                      <span style={{ padding: '0.3rem 0.8rem', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>DRAFT</span>
                   )}
                </td>
                <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                     {m.is_published ? (
                       <form action={unpublishMaterial}>
                          <input type="hidden" name="id" value={m.id} />
                          <button type="submit" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.3)' }}>Unpublish</button>
                       </form>
                     ) : (
                       <form action={publishMaterial}>
                          <input type="hidden" name="id" value={m.id} />
                          <button type="submit" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}>Publish</button>
                       </form>
                     )}
                     <form action={deleteMaterial}>
                        <input type="hidden" name="id" value={m.id} />
                        <button type="submit" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}>Delete</button>
                     </form>
                  </div>
                </td>
              </tr>
            ))}
            {!materials || materials.length === 0 && (
              <tr><td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: '#a1a1aa' }}>No materials found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
