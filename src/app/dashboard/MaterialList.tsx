'use client';

import { useRouter } from 'next/navigation';

type Material = {
  id: string;
  title: string;
  description: string;
  type: string;
  url?: string;
  thumbnail_url?: string;
  created_at: string;
}

export default function MaterialList({ materials, isSubscribed }: { materials: Material[], isSubscribed: boolean }) {
  const router = useRouter();

  const handleMaterialClick = (materialId: string) => {
    router.push(`/dashboard/materials/${materialId}`);
  };

  const getGradient = (type: string) => {
    switch(type) {
      case 'video': return 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)';
      case 'pdf': return 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
      default: return 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)';
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .material-card {
          display: flex;
          flex-direction: column;
          background: rgba(15, 15, 17, 0.6);
          border: 1px solid var(--card-border);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          cursor: pointer;
          position: relative;
        }
        .material-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px -10px rgba(0,0,0,0.5);
          border-color: rgba(255,255,255,0.1);
        }
        .material-thumb {
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          color: white;
        }
        .material-thumb::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: linear-gradient(to top, rgba(15,15,17,0.9), transparent);
        }
        .material-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(8px);
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          border: 1px solid rgba(255,255,255,0.1);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      `}} />

      {materials.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <p style={{ color: '#a1a1aa', fontSize: '1.2rem' }}>No materials published yet. Check back later!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {materials.map((item) => (
            <div key={item.id} className="material-card" onClick={() => handleMaterialClick(item.id)}>
              
              <div className="material-thumb" style={{ background: item.thumbnail_url ? 'none' : getGradient(item.type) }}>
                {item.thumbnail_url ? (
                  <img src={item.thumbnail_url} alt={`${item.title} thumbnail`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', zIndex: 1, position: 'relative' }} />
                ) : (
                  <>
                    {item.type === 'pdf' && <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ zIndex: 1, position: 'relative' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>}
                    {item.type === 'video' && <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ zIndex: 1, position: 'relative' }}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>}
                    {item.type === 'image' && <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ zIndex: 1, position: 'relative' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
                  </>
                )}
                <div className="badge">{item.type}</div>
              </div>

              <div className="material-content">
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#f4f4f5', fontWeight: 700 }}>{item.title}</h3>
                <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '1.5rem', flexGrow: 1, lineHeight: 1.6 }}>{item.description}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', marginTop: 'auto' }}>
                  {isSubscribed ? (
                    <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      Access Portal
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </span>
                  ) : (
                    <span style={{ color: '#f472b6', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      Premium Access
                    </span>
                  )}
                  <span style={{ fontSize: '0.8rem', color: '#52525b' }}>{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </>
  );
}
