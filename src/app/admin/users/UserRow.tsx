'use client';

import { useState } from 'react';
import { toggleUserRole } from './actions';

export default function UserRow({ user }: { user: any }) {
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleRole = async () => {
    setIsLoading(true);
    const targetRole = user.role === 'admin' ? 'student' : 'admin';
    await toggleUserRole(user.id, targetRole);
    setIsLoading(false);
  };

  const attempts = user.quiz_attempts || [];

  return (
    <>
      <tr style={{ background: expanded ? 'rgba(255,255,255,0.02)' : 'transparent', borderBottom: expanded ? 'none' : '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s' }}>
        <td style={{ padding: '1.2rem', cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, #8b5cf6, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {user.avatar_url ? (
                 <img src={user.avatar_url} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} alt="Avatar" />
              ) : (
                 (user.full_name || 'U').charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <div style={{ fontWeight: 600, color: '#f4f4f5' }}>{user.full_name || 'Anonymous User'}</div>
              <div style={{ fontSize: '0.8rem', color: '#a1a1aa', fontFamily: 'monospace' }}>
                {user.mat_number ? `MAT: ${user.mat_number}` : `...${user.id.substring(user.id.length - 8)}`}
              </div>
            </div>
          </div>
        </td>
        <td style={{ padding: '1.2rem' }}>
           {user.is_subscribed ? (
              <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Subscribed</span>
           ) : (
              <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.05)', color: '#a1a1aa', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Free Tier</span>
           )}
        </td>
        <td style={{ padding: '1.2rem' }}>
           <span style={{ padding: '0.25rem 0.75rem', border: user.role === 'admin' ? '1px solid #ef4444' : '1px solid #3b82f6', color: user.role === 'admin' ? '#ef4444' : '#3b82f6', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
             {user.role}
           </span>
        </td>
        <td style={{ padding: '1.2rem', textAlign: 'right' }}>
           <button 
             onClick={handleToggleRole} 
             disabled={isLoading}
             className="btn-secondary" 
             style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', opacity: isLoading ? 0.5 : 1 }}
           >
             {user.role === 'admin' ? 'Demote to Student' : 'Promote to Admin'}
           </button>
        </td>
      </tr>

      {expanded && (
        <tr style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <td colSpan={4} style={{ padding: '2rem' }}>
            <h4 style={{ fontSize: '1rem', color: '#f4f4f5', marginBottom: '1rem', letterSpacing: '0.05em' }}>Quiz Telemetry ({attempts.length} attempts)</h4>
            {attempts.length === 0 ? (
              <p style={{ color: '#52525b', fontSize: '0.9rem', fontStyle: 'italic' }}>This user has not completed any quizzes yet.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {attempts.map((attempt: any) => {
                  const percentage = (attempt.score / attempt.total) * 100;
                  const passed = percentage >= 70;
                  return (
                    <div key={attempt.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: passed ? '3px solid #10b981' : '3px solid #ef4444' }}>
                      <div style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '0.25rem' }}>{attempt.quizzes?.title || 'Deleted Quiz'}</div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: passed ? '#10b981' : '#ef4444' }}>{percentage.toFixed(0)}%</span>
                        <span style={{ fontSize: '0.85rem', color: '#52525b', paddingBottom: '0.2rem' }}>({attempt.score}/{attempt.total} correctly answered)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}
