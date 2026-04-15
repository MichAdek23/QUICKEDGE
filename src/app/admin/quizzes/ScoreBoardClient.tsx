'use client';

import { useState } from 'react';

export default function ScoreBoardClient({ initialAttempts }: { initialAttempts: any[] }) {
  const [filterQuery, setFilterQuery] = useState('');

  // Explicit Client-side logging to detect data flow
  console.log("Raw Attempts ingested:", initialAttempts);

  const filteredAttempts = initialAttempts.filter((a) => {
     if (!filterQuery) return true;
     
     const q = filterQuery.toLowerCase();
     const prof = a.profiles || {};
     const quiz = a.quizzes || {};
     
     const mat = (prof.mat_number || '').toLowerCase();
     const name = (prof.full_name || '').toLowerCase();
     const course = (quiz.materials?.title || '').toLowerCase();
     const assessment = (quiz.title || '').toLowerCase();
     
     return mat.includes(q) || name.includes(q) || course.includes(q) || assessment.includes(q);
  });

  return (
    <div>
       <div style={{ marginBottom: '2rem' }}>
          <input 
             type="text" 
             placeholder="Search Matriculation Number, Candidate Name, or Course..." 
             className="input-field"
             value={filterQuery}
             onChange={e => setFilterQuery(e.target.value)}
             style={{ width: '100%', maxWidth: '600px', padding: '1rem 1.5rem', borderRadius: '12px', fontSize: '0.95rem' }}
          />
       </div>
       
       <div className="responsive-table glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
         <div style={{ maxHeight: '800px', overflowY: 'auto' }}>
           <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
             <thead style={{ position: 'sticky', top: 0, background: 'rgba(15, 15, 17, 0.95)', backdropFilter: 'blur(10px)', zIndex: 10 }}>
               <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                 <th style={{ padding: '1.2rem', color: '#a1a1aa', fontSize: '0.8rem', textTransform: 'uppercase' }}>Candidate</th>
                 <th style={{ padding: '1.2rem', color: '#a1a1aa', fontSize: '0.8rem', textTransform: 'uppercase' }}>Assessment</th>
                 <th style={{ padding: '1.2rem', color: '#a1a1aa', fontSize: '0.8rem', textTransform: 'uppercase', textAlign: 'right' }}>Result</th>
                 <th style={{ padding: '1.2rem', color: '#a1a1aa', fontSize: '0.8rem', textTransform: 'uppercase', textAlign: 'right', width: '50px' }}>Purge</th>
               </tr>
             </thead>
             <tbody>
               {filteredAttempts.map((a: any) => {
                  const percentage = (a.score / a.total) * 100;
                  const passed = percentage >= 70;
                  const prof = a.profiles || {};
                  const quiz = a.quizzes || {};
                  
                  return (
                    <tr key={a.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: passed ? 'rgba(16, 185, 129, 0.02)' : 'rgba(239, 68, 68, 0.02)' }}>
                      <td style={{ padding: '1.2rem' }} data-label="Candidate">
                        <div style={{ fontWeight: 600, color: '#f4f4f5' }}>{prof.full_name || 'Ghost Node'}</div>
                        {prof.mat_number && <div style={{ fontSize: '0.75rem', color: '#a1a1aa', fontFamily: 'monospace', marginTop: '0.2rem' }}>{prof.mat_number}</div>}
                      </td>
                      <td style={{ padding: '1.2rem' }} data-label="Assessment">
                         <div style={{ color: '#d4d4d8', fontSize: '0.9rem', fontWeight: 500 }}>{quiz.title || 'ARCHIVED QUIZ'}</div>
                         {quiz.materials?.title && <div style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '0.2rem' }}>Linked: {quiz.materials.title}</div>}
                      </td>
                      <td style={{ padding: '1.2rem', textAlign: 'right' }} data-label="Result">
                         <div style={{ fontSize: '1.2rem', fontWeight: 800, color: passed ? '#10b981' : '#ef4444' }}>{percentage.toFixed(0)}%</div>
                         <div style={{ fontSize: '0.75rem', color: '#a1a1aa', marginTop: '0.2rem' }}>{a.score} / {a.total}</div>
                      </td>
                      <td style={{ padding: '1.2rem', textAlign: 'right' }} data-label="Purge">
                         <button 
                            type="button" 
                            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }}
                            title="Cannot delete via client component natively yet"
                         >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                         </button>
                      </td>
                    </tr>
                  )
               })}
               {filteredAttempts.length === 0 && (
                  <tr><td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: '#a1a1aa' }}>{filterQuery ? "No matching records found." : "Awaiting initial student transmissions..."}</td></tr>
               )}
             </tbody>
           </table>
         </div>
       </div>
    </div>
  );
}
