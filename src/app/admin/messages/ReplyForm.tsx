'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ReplyFormProps {
  messageId: string;
  recipientEmail: string;
  recipientName: string;
}

export default function ReplyForm({ messageId, recipientEmail, recipientName }: ReplyFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sendViaEmail, setSendViaEmail] = useState(true);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append('messageId', messageId);
    formData.append('replyText', replyText);
    formData.append('recipientEmail', recipientEmail);
    formData.append('recipientName', recipientName);
    formData.append('sendViaEmail', sendViaEmail.toString());

    try {
      const response = await fetch('/admin/messages/api/reply', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.error) {
        setStatus({ type: 'error', message: result.error });
      } else {
        setStatus({ type: 'success', message: result.message || 'Reply sent successfully!' });
        setReplyText('');
        setTimeout(() => {
          setIsOpen(false);
          router.refresh(); // This will refresh the server component
        }, 1500);
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to send reply. Please try again.' });
    }

    setLoading(false);
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn-primary"
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '0.5rem', 
          width: '130px', 
          padding: '0.5rem', 
          fontSize: '0.85rem' 
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        Reply
      </button>
    );
  }

  return (
    <div style={{ 
      border: '1px solid rgba(139, 92, 246, 0.3)', 
      borderRadius: '12px', 
      padding: '1.5rem', 
      marginTop: '1rem',
      background: 'rgba(139, 92, 246, 0.05)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 style={{ margin: 0, color: 'white', fontSize: '1rem' }}>Reply to {recipientName}</h4>
        <button
          onClick={() => setIsOpen(false)}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: '#a1a1aa', 
            cursor: 'pointer',
            fontSize: '1.2rem'
          }}
        >
          ×
        </button>
      </div>

      {status && (
        <div style={{
          padding: '0.75rem',
          borderRadius: '6px',
          background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: status.type === 'success' ? '#10b981' : '#ef4444',
          border: `1px solid ${status.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
          fontSize: '0.85rem',
          marginBottom: '1rem'
        }}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '0.5rem', display: 'block', fontWeight: 600 }}>
            Your Reply
          </label>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            required
            className="input-field"
            rows={4}
            placeholder="Type your reply here..."
            disabled={loading}
            style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '0.75rem',
              color: 'white',
              fontSize: '0.9rem',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            id="sendViaEmail"
            checked={sendViaEmail}
            onChange={(e) => setSendViaEmail(e.target.checked)}
            disabled={loading}
            style={{ accentColor: '#8b5cf6' }}
          />
          <label htmlFor="sendViaEmail" style={{ color: '#a1a1aa', fontSize: '0.85rem', cursor: 'pointer' }}>
            Also send via email to {recipientEmail}
          </label>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#a1a1aa',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !replyText.trim()}
            className="btn-primary"
            style={{ 
              padding: '0.5rem 1rem', 
              fontSize: '0.85rem',
              opacity: (loading || !replyText.trim()) ? 0.5 : 1
            }}
          >
            {loading ? 'Sending...' : 'Send Reply'}
          </button>
        </div>
      </form>
    </div>
  );
}
