import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import { markMessageAsRead, deleteMessage } from './actions';
import ReplyForm from './ReplyForm';

export const dynamic = 'force-dynamic';

interface MessageReply {
  id: string;
  reply_text: string;
  reply_from: 'user' | 'admin';
  sent_via_email: boolean;
  created_at: string;
}

export default async function AdminMessagesPage() {
  const supabaseAdmin = createSupabaseAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: messages, error } = await supabaseAdmin
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  // Get replies for each message
  const messagesWithReplies = await Promise.all(
    (messages || []).map(async (msg) => {
      const { data: replies } = await supabaseAdmin
        .from('message_replies')
        .select('*')
        .eq('message_id', msg.id)
        .order('created_at', { ascending: true });
      
      return { ...msg, replies: replies || [] };
    })
  );

  if (error) {
    console.error("Error fetching messages:", error);
    return <div>Failed to load inbox data.</div>;
  }

  return (
    <main style={{ padding: '3rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>
       <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: 'white' }}>Inbox / Comms</h1>
            <p style={{ color: '#a1a1aa', margin: '0.5rem 0 0 0' }}>Review secure contact transmissions spanning the public framework.</p>
          </div>
       </header>

       {(!messagesWithReplies || messagesWithReplies.length === 0) ? (
          <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
             <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3f3f46" strokeWidth="1.5" style={{ margin: '0 auto 1.5rem auto' }}><rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect><line x1="3" y1="10" x2="21" y2="10"></line></svg>
             <h3 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '1.2rem' }}>No Transmissions Available</h3>
             <p style={{ color: '#a1a1aa' }}>Your inbox is currently completely clear.</p>
          </div>
       ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
             {messagesWithReplies.map((msg) => (
                <div key={msg.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', borderLeft: msg.is_read ? '4px solid transparent' : '4px solid #8b5cf6', background: msg.is_read ? 'rgba(255,255,255,0.01)' : 'rgba(139, 92, 246, 0.05)' }}>
                   
                   <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                         <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', color: msg.is_read ? '#e4e4e7' : 'white', fontWeight: msg.is_read ? 600 : 800 }}>{msg.name}</h3>
                            <p style={{ margin: '0.2rem 0 0 0', color: '#a1a1aa', fontSize: '0.85rem' }}>{msg.email}</p>
                         </div>
                         <div style={{ color: '#71717a', fontSize: '0.8rem' }}>
                            {new Date(msg.created_at).toLocaleString()}
                         </div>
                      </div>

                      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '12px', color: '#d4d4d8', fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {msg.message}
                      </div>

                      {/* Show replies */}
                      {msg.replies && msg.replies.length > 0 && (
                        <div style={{ marginTop: '1rem' }}>
                          <h4 style={{ color: '#a1a1aa', fontSize: '0.85rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Conversation ({msg.replies.length} {msg.replies.length === 1 ? 'reply' : 'replies'})
                          </h4>
                          {msg.replies.map((reply: MessageReply) => (
                            <div key={reply.id} style={{ 
                              background: reply.reply_from === 'admin' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                              padding: '1rem', 
                              borderRadius: '8px', 
                              marginBottom: '0.5rem',
                              borderLeft: `3px solid ${reply.reply_from === 'admin' ? '#8b5cf6' : '#6b7280'}`,
                              fontSize: '0.9rem'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <span style={{ color: reply.reply_from === 'admin' ? '#8b5cf6' : '#a1a1aa', fontWeight: 600, fontSize: '0.8rem' }}>
                                  {reply.reply_from === 'admin' ? 'Admin' : 'User'}
                                </span>
                                <span style={{ color: '#71717a', fontSize: '0.75rem' }}>
                                  {new Date(reply.created_at).toLocaleString()}
                                </span>
                              </div>
                              <div style={{ color: '#d4d4d8', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                                {reply.reply_text}
                              </div>
                              {reply.sent_via_email && (
                                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#10b981' }}>
                                  ✓ Also sent via email
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                   </div>

                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', justifyContent: 'center' }}>
                      <ReplyForm
                        messageId={msg.id}
                        recipientEmail={msg.email}
                        recipientName={msg.name}
                      />

                      <form action={markMessageAsRead}>
                         <input type="hidden" name="id" value={msg.id} />
                         <input type="hidden" name="is_read" value={msg.is_read ? 'false' : 'true'} />
                         <button type="submit" className={msg.is_read ? 'btn-secondary' : 'btn-primary'} style={{ width: '130px', padding: '0.5rem', fontSize: '0.85rem' }}>
                            {msg.is_read ? 'Mark Unread' : 'Mark as Read'}
                         </button>
                      </form>

                      <form action={deleteMessage}>
                         <input type="hidden" name="id" value={msg.id} />
                         <button type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '130px', padding: '0.5rem', fontSize: '0.85rem', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '8px', cursor: 'pointer' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            Delete
                         </button>
                      </form>
                   </div>

                </div>
             ))}
          </div>
       )}
    </main>
  );
}
