'use client';

import { useState } from 'react';
import { toggleBlogPostStatus, deleteBlogPost } from './actions';
import { useRouter } from 'next/navigation';

export default function BlogActionControls({ id, published }: { id: string, published: boolean }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
     setIsProcessing(true);
     await toggleBlogPostStatus(id, !published);
     setIsProcessing(false);
  };

  const handleSoftDelete = async () => {
     if (!confirm("Are you sure you want to archive this post? It will be removed from the active system.")) return;
     setIsProcessing(true);
     await deleteBlogPost(id);
     setIsProcessing(false);
  };

  const handleEdit = () => {
     router.push(`/admin/blog/editor/${id}`);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem', opacity: isProcessing ? 0.5 : 1 }}>
       <button onClick={handleEdit} disabled={isProcessing} className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', flexGrow: 1, textAlign: 'center' }}>
          Edit Schema
       </button>
       
       <button onClick={handleToggle} disabled={isProcessing} className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', flexGrow: 1, textAlign: 'center', borderColor: published ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)', color: published ? '#ef4444' : '#10b981' }}>
          {published ? 'Revert to Draft' : 'Push Live'}
       </button>
       
       <button onClick={handleSoftDelete} disabled={isProcessing} style={{ padding: '0.4rem', background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
       </button>
    </div>
  );
}
