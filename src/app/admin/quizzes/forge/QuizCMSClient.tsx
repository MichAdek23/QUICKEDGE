'use client';

import { useState } from 'react';
import QuizBuilder from '../QuizBuilder';
import { updateQuiz, toggleQuizPublish, softDeleteQuiz } from '../actions';

export default function QuizCMSClient({ materials, quizzes }: { materials: any[], quizzes: any[] }) {
  const [view, setView] = useState<'explorer' | 'forge'>('explorer');
  const [expandedQuizId, setExpandedQuizId] = useState<string | null>(null);
  const [editQuiz, setEditQuiz] = useState<any>(null);

  // Advanced 1-to-1 UI Enforcement Filtering
  const unusedMaterials = materials.filter(m => !quizzes.some(q => q.material_id === m.id));

  if (view === 'forge') {
    return (
       <div>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
             <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                Quiz Compiler Core
             </h2>
             <button onClick={() => setView('explorer')} className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>Cancel</button>
          </header>
          
          <QuizBuilder materials={unusedMaterials} onCancel={() => setView('explorer')} />
       </div>
    );
  }

  // --- Explorer View ---
  return (
    <div>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Deployed Assessments</h2>
            <p style={{ color: '#a1a1aa', fontSize: '0.95rem' }}>Comprehensive breakdown of all active nodes.</p>
          </div>
          <button onClick={() => setView('forge')} className="btn-primary" style={{ padding: '0.75rem 1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
             Forge New Assessment
          </button>
       </div>

       <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {quizzes.filter(q => !q.is_archived).map(quiz => {
             const isExpanded = expandedQuizId === quiz.id;
             const questions = quiz.quiz_questions || [];
             
             return (
               <div key={quiz.id} className="glass-panel" style={{ padding: 0, overflow: 'hidden', borderLeft: '4px solid #10b981', transition: 'all 0.3s' }}>
                  <div 
                     onClick={() => setExpandedQuizId(isExpanded ? null : quiz.id)} 
                     style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isExpanded ? 'rgba(255,255,255,0.02)' : 'transparent' }}
                  >
                     <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f4f4f5', marginBottom: '0.2rem' }}>{quiz.title}</h3>
                        <div style={{ fontSize: '0.85rem', color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                           <span style={{ padding: '0.1rem 0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>PRODUCTION</span>
                           Linked Curriculum: {quiz.materials?.title || 'Unknown Source'}
                        </div>
                     </div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '0.85rem', color: '#71717a', fontWeight: 600 }}>{questions.length} Nodes</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
                     </div>
                  </div>
                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem 1rem', borderTop: '1px solid var(--card-border)', background: '#111113' }}>
                    {/* Edit */}
                    <button type="button" onClick={() => setEditQuiz(quiz)} className="btn-secondary" style={{ padding: '0.4rem 0.8rem' }}>Edit</button>
                    {/* Publish Toggle */}
                    <form action={toggleQuizPublish} method="post" style={{ display: 'inline' }}>
                      <input type="hidden" name="quiz_id" value={quiz.id} />
                      <button type="submit" className="btn-secondary" style={{ padding: '0.4rem 0.8rem' }}>{quiz.published ? 'Unpublish' : 'Publish'}</button>
                    </form>
                    {/* Soft Delete */}
                    <form action={softDeleteQuiz} method="post" style={{ display: 'inline' }} onSubmit={e => { if(!confirm('Archive this quiz?')) e.preventDefault(); }}>
                      <input type="hidden" name="quiz_id" value={quiz.id} />
                      <button type="submit" className="btn-danger" style={{ padding: '0.4rem 0.8rem' }}>Archive</button>
                    </form>
                  </div>

                  {/* Deep Nested Question Expansion payload */}
                  {isExpanded && (
                     <div style={{ padding: '2rem', borderTop: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {questions.map((q: any, qIdx: number) => (
                           <div key={q.id}>
                              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#e4e4e7', marginBottom: '1rem' }}>
                                 <span style={{ color: '#8b5cf6', marginRight: '0.5rem' }}>Q{qIdx + 1}.</span> 
                                 {q.question_text}
                              </h4>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                 {q.options.map((opt: string, optIdx: number) => {
                                    const isCorrect = q.correct_option === optIdx;
                                    return (
                                      <div key={optIdx} style={{ padding: '0.75rem 1rem', background: isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)', border: isCorrect ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--card-border)', borderRadius: '8px', color: isCorrect ? '#10b981' : '#a1a1aa', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                         <span style={{ fontWeight: 800, opacity: isCorrect ? 1 : 0.5 }}>{String.fromCharCode(65 + optIdx)}.</span>
                                         {opt}
                                         {isCorrect && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginLeft: 'auto' }}><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                      </div>
                                    )
                                 })}
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
             )
          })}
          
          {(!quizzes || quizzes.filter(q => !q.is_archived).length === 0) && (
             <div style={{ padding: '4rem', textAlign: 'center', border: '1px dashed var(--card-border)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="1" style={{ margin: '0 auto 1rem auto' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                <h3 style={{ fontSize: '1.2rem', color: '#e4e4e7', marginBottom: '0.5rem' }}>No Active Assessments</h3>
                <p style={{ color: '#a1a1aa' }}>Forge a new assessment to construct the database.</p>
             </div>
          )}
       </div>
    </div>
  );

      {/* Edit Modal */}
      {editQuiz && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setEditQuiz(null)}>
          <div style={{ background: '#111113', padding: '2rem', borderRadius: '12px', minWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '1rem', color: '#f4f4f5' }}>Edit Quiz "{editQuiz.title}"</h3>
            <form action={updateQuiz} method="post">
              <input type="hidden" name="quiz_id" value={editQuiz.id} />
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: '#a1a1aa' }}>Title</label>
                <input type="text" name="title" defaultValue={editQuiz.title} className="input-field" style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: '#a1a1aa' }}>Questions (JSON)</label>
                <textarea name="questions" defaultValue={JSON.stringify(editQuiz.quiz_questions || [], null, 2)} className="input-field" style={{ width: '100%', height: '200px' }}></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setEditQuiz(null)} className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
}
