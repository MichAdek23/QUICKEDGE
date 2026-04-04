'use client';

import { useState, useRef, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { upsertBlogPost, uploadInlineImage } from '../../actions';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function EnhancedBlogForge({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const idStr = resolvedParams.id;
  const isNew = idStr === 'new';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const router = useRouter();

  // On mount, if not new, we need to fetch the existing data natively.
  // Because this is a massive client component with complex Markdown refs, fetching natively inside a useEffect is safest for isolating state.
  useEffect(() => {
     if (!isNew) {
        fetch(`/api/blog-proxy?id=${idStr}`)
          .then(res => res.json())
          .then(data => {
             if (data.blog) {
                setTitle(data.blog.title);
                setContent(data.blog.content);
                if (data.blog.thumbnail_url) setThumbnailPreview(data.blog.thumbnail_url);
             }
          });
     }
  }, [idStr, isNew]);

  const handleImagePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
       if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          const file = items[i].getAsFile();
          if (!file) continue;

          const textarea = e.target as HTMLTextAreaElement;
          const cursorPos = textarea.selectionStart;
          const textBefore = content.substring(0, cursorPos);
          const textAfter = content.substring(cursorPos, content.length);

          setContent(textBefore + `\n![Uploading image...]()\n` + textAfter);

          const formData = new FormData();
          formData.append('file', file);
          const res = await uploadInlineImage(formData);

          if (res.url) {
             setContent(textBefore + `\n![Image](${res.url})\n` + textAfter);
          } else {
             setContent(textBefore + `\n*[Image upload failed]*\n` + textAfter);
          }
       }
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview(null);
    }
  };

  const submitPayload = async (isDraft: boolean) => {
     if (!title.trim() || !content.trim()) return alert("Title and Content are mandatory constraints.");
     
     setIsProcessing(true);
     const formData = new FormData();
     formData.append('id', idStr);
     formData.append('title', title);
     formData.append('content', content);
     formData.append('isDraft', isDraft.toString());

     const fileInput = document.getElementById('thumbnail_upload') as HTMLInputElement;
     if (fileInput?.files?.[0]) {
        formData.append('thumbnail', fileInput.files[0]);
     }

     const res = await upsertBlogPost(formData);
     if (res.success) {
        router.push('/admin/blog');
     } else {
        alert(res.error || "System failure during transmission.");
        setIsProcessing(false);
     }
  };

  return (
    <main style={{ padding: '2rem 4rem', maxWidth: '1400px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
       <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <span onClick={() => router.back()} style={{ color: '#a1a1aa', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}>← Back to Dashboard</span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem' }}>{isNew ? 'Forge New Draft' : 'Refine Article Payload'}</h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem', opacity: isProcessing ? 0.5 : 1 }}>
             <button disabled={isProcessing} onClick={() => submitPayload(true)} className="btn-secondary" style={{ padding: '0.8rem 1.5rem', fontWeight: 600 }}>Save to Drafts</button>
             <button disabled={isProcessing} onClick={() => submitPayload(false)} className="btn-primary" style={{ padding: '0.8rem 2rem', fontWeight: 600, background: '#10b981', borderColor: '#059669', color: '#022c22' }}>Execute Publish Sequence</button>
          </div>
       </header>

       <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 3fr', gap: '2rem', flexGrow: 1 }}>
          <aside className="glass-panel" style={{ height: 'fit-content' }}>
             <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '0.5rem', display: 'block' }}>Hero Thumbnail</label>
                <div style={{ width: '100%', height: '180px', background: thumbnailPreview ? `url(${thumbnailPreview}) center/cover` : 'var(--card-bg)', border: '1px dashed var(--card-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', overflow: 'hidden' }}>
                    {!thumbnailPreview && <span style={{ color: '#71717a', fontSize: '0.85rem' }}>No Cover Bound</span>}
                </div>
                <input id="thumbnail_upload" type="file" accept="image/*" onChange={handleThumbnailChange} style={{ fontSize: '0.8rem', width: '100%' }} />
             </div>
             
             <div>
                <label style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '0.5rem', display: 'block' }}>Protocol Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="input-field" placeholder="System Updates V2..." style={{ fontSize: '1rem', fontWeight: 600, padding: '1rem' }} />
             </div>
          </aside>

          <section className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
             <div style={{ display: 'flex', borderBottom: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.2)' }}>
                <button onClick={() => setActiveTab('write')} style={{ padding: '1rem 2rem', background: activeTab === 'write' ? 'transparent' : 'rgba(255,255,255,0.02)', border: 'none', color: activeTab === 'write' ? 'white' : '#a1a1aa', borderBottom: activeTab === 'write' ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', flexGrow: 1 }}>Markdown Editor</button>
                <button onClick={() => setActiveTab('preview')} style={{ padding: '1rem 2rem', background: activeTab === 'preview' ? 'transparent' : 'rgba(255,255,255,0.02)', border: 'none', color: activeTab === 'preview' ? 'white' : '#a1a1aa', borderBottom: activeTab === 'preview' ? '2px solid #10b981' : '2px solid transparent', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', flexGrow: 1 }}>Live Engine Preview</button>
             </div>
             
             {activeTab === 'write' ? (
                <textarea 
                   className="input-field"
                   value={content}
                   onChange={e => setContent(e.target.value)}
                   onPaste={handleImagePaste}
                   placeholder="Initiate Markdown compilation here... (Ctrl+V instantly uploads images directly into the DOM)"
                   style={{ flexGrow: 1, resize: 'none', minHeight: '600px', border: 'none', borderRadius: 0, padding: '2rem', fontFamily: 'monospace', fontSize: '1rem', lineHeight: 1.6, background: 'transparent' }}
                />
             ) : (
                <div style={{ flexGrow: 1, minHeight: '600px', padding: '3rem 4rem', overflowY: 'auto', background: '#0a0a0c' }} className="markdown-prose">
                   <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>{title || 'Untitled Draft'}</h1>
                   <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {content || '*Empty node sequence detected.*'}
                   </ReactMarkdown>
                </div>
             )}
          </section>
       </div>
    </main>
  );
}
