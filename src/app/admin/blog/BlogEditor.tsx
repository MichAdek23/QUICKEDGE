'use client';

import { useState, useRef } from 'react';
import { upsertBlogPost, uploadInlineImage } from './actions';

export default function BlogEditor() {
  const [content, setContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    
    const result = await uploadInlineImage(formData);
    
    if (result.url) {
      // Intelligently insert the markdown syntax tracking the user's cursor
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const markdownImage = `\n![Inline Image](${result.url})\n`;
        
        const newContent = content.substring(0, start) + markdownImage + content.substring(end);
        setContent(newContent);
        
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + markdownImage.length;
          textarea.focus();
        }, 10);
      } else {
        setContent(prev => prev + `\n![Inline Image](${result.url})\n`);
      }
    } else {
      alert("Failed to upload image.");
    }
    
    setIsUploading(false);
    e.target.value = ''; // Reset input
  };

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setStatus(null);
    
    const result = await upsertBlogPost(formData);
    
    if (result.error) {
      setStatus({ type: 'error', message: result.error });
    } else {
      setStatus({ type: 'success', message: 'Blog post published successfully!' });
      // Optionally clear form
    }
    
    setLoading(false);
  }

  return (
    <>
      {status && (
        <div style={{
          padding: '1rem',
          borderRadius: '8px',
          background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: status.type === 'success' ? '#10b981' : '#ef4444',
          border: `1px solid ${status.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
          fontSize: '0.9rem'
        }}>
          {status.message}
        </div>
      )}
      <form action={handleSubmit} encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
       <div>
         <label style={{ fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem', display: 'block' }}>Catchy Title SEO</label>
         <input type="text" name="title" required className="input-field" placeholder="E.g. Top 5 Forex Strategies..." disabled={loading} />
       </div>
       
       <div>
         <label style={{ fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem', display: 'block' }}>Thumbnail Cover (Optional)</label>
         <input type="file" name="thumbnail" accept="image/*" className="input-field" style={{ padding: '0.4rem', border: '1px dashed var(--accent)', backgroundColor: 'transparent' }} disabled={loading} />
       </div>

       <div>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>Rich Content (Markdown/HTML Support)</label>
            <label style={{ cursor: 'pointer', color: '#f472b6', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(244, 114, 182, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
               {isUploading ? 'Uploading...' : 'Embed Image'}
               <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleInlineImageUpload} disabled={isUploading} />
            </label>
         </div>
         <textarea 
            ref={textareaRef}
            name="content" 
            required 
            className="input-field" 
            rows={12} 
            placeholder="Write your massive blog post here. You can use markdown like ## Headers or embed images using the button above!"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ fontFamily: 'monospace' }}
            disabled={loading}
         ></textarea>
       </div>
       
       <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', background: 'linear-gradient(45deg, #10b981, #059669)' }} disabled={loading}>
         {loading ? 'Publishing...' : 'Publish to World'}
       </button>
    </form>
    </>
  );
}
