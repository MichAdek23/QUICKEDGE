import { createMaterial } from '../actions';
import Link from 'next/link';

export default function NewMaterialPage() {
  return (
    <main style={{ padding: '3rem 4rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/admin/materials" style={{ color: '#a1a1aa', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '2rem' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
           <g><path d="M19 12H5M12 19l-7-7 7-7" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g>
        </svg>
        Back to Deployments
      </Link>

      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Draft New Material</h1>
        <p style={{ color: '#a1a1aa', fontSize: '1.1rem' }}>Upload your content. It will be saved as a draft and hidden from users until published.</p>
      </header>

      <div className="glass-panel">
         <form action={createMaterial} encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#e4e4e7', marginBottom: '0.5rem', display: 'block' }}>Title</label>
              <input type="text" name="title" required className="input-field" placeholder="E.g. Advanced Forex PDF" />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#e4e4e7', marginBottom: '0.5rem', display: 'block' }}>Media (Direct File Upload)</label>
              <input type="file" name="file" accept="video/*,application/pdf,image/*" className="input-field" style={{ padding: '0.4rem', border: '1px dashed var(--accent)', backgroundColor: 'transparent' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#e4e4e7', marginBottom: '0.5rem', display: 'block' }}>OR Remote Media URL (YouTube/Drive)</label>
              <input type="url" name="url" className="input-field" placeholder="https://..." />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#e4e4e7', marginBottom: '0.5rem', display: 'block' }}>Type</label>
              <select name="type" className="input-field" style={{ appearance: 'auto', backgroundColor: '#18181b' }}>
                 <option value="pdf">PDF Document</option>
                 <option value="video">Direct Video</option>
                 <option value="image">Image Format</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#e4e4e7', marginBottom: '0.5rem', display: 'block' }}>Description Setup</label>
              <textarea name="description" required className="input-field" rows={4} placeholder="What will they learn?"></textarea>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#e4e4e7', marginBottom: '0.5rem', display: 'block' }}>Thumbnail Image (Optional)</label>
              <input type="file" name="thumbnail" accept="image/*" className="input-field" style={{ padding: '0.4rem', border: '1px dashed var(--accent)', backgroundColor: 'transparent' }} />
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '1rem' }}>Save as Draft</button>
         </form>
      </div>
    </main>
  );
}
