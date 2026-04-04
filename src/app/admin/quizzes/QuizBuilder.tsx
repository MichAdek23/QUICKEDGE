'use client';

import { useState } from 'react';
import { deployQuizWithQuestions } from './actions';

export default function QuizBuilder({ materials, onCancel }: { materials: any[], onCancel?: () => void }) {
  const [materialId, setMaterialId] = useState('');
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([{ question_text: '', options: ['', '', '', ''], correct_option: 0 }]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question_text: '', options: ['', '', '', ''], correct_option: 0 }]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    (updated[index] as any)[field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    setStatus(null);

    // Minor validation
    if (!materialId || !title) {
       setStatus({ type: 'error', text: 'You must select a material and provide a Quiz Title.' });
       setIsDeploying(false);
       return;
    }

    for (const q of questions) {
       if (!q.question_text || q.options.some(opt => !opt)) {
          setStatus({ type: 'error', text: 'All questions and options must be completely filled out.' });
          setIsDeploying(false);
          return;
       }
    }

    const payload = { materialId, title, questions };
    const formData = new FormData();
    formData.append('payload', JSON.stringify(payload));

    const res = await deployQuizWithQuestions(formData);
    if (res.error) {
       setStatus({ type: 'error', text: res.error });
    } else {
       setStatus({ type: 'success', text: 'Quiz Successfully Deployed to Production.' });
       // Reset Forge
       setTitle('');
       setMaterialId('');
       setQuestions([{ question_text: '', options: ['', '', '', ''], correct_option: 0 }]);
       if (onCancel) onCancel(); // Route back!
    }
    setIsDeploying(false);
  };

  return (
    <div className="glass-panel" style={{ overflow: 'visible' }}>
       {status && (
         <div style={{ padding: '1rem', marginBottom: '2rem', borderRadius: '8px', background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: status.type === 'success' ? '#10b981' : '#ef4444', border: `1px solid ${status.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` }}>
           {status.text}
         </div>
       )}

       <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '0.5rem', display: 'block' }}>Target Material Endpoint</label>
            <select value={materialId} onChange={(e) => setMaterialId(e.target.value)} className="input-field" style={{ backgroundColor: '#18181b', appearance: 'auto' }}>
               <option value="" disabled>Select Material...</option>
               {materials.map(m => (
                 <option key={m.id} value={m.id}>{m.title} ({m.type.toUpperCase()})</option>
               ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '0.5rem', display: 'block' }}>Quiz Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="E.g. Final Diagnostics Exam" />
          </div>
       </div>

       <div style={{ margin: '2rem 0', height: '1px', background: 'var(--card-border)' }}></div>

       <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
         {questions.map((q, qIndex) => (
           <div key={qIndex} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)', borderRadius: '12px', position: 'relative' }}>
             
             {questions.length > 1 && (
               <button onClick={() => handleRemoveQuestion(qIndex)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}>Remove</button>
             )}

             <h3 style={{ fontSize: '0.9rem', color: '#8b5cf6', marginBottom: '1rem', fontWeight: 700, textTransform: 'uppercase' }}>Question {qIndex + 1}</h3>
             
             <input type="text" value={q.question_text} onChange={(e) => updateQuestion(qIndex, 'question_text', e.target.value)} className="input-field" placeholder="Enter question..." style={{ marginBottom: '1.5rem' }} />

             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {q.options.map((opt, oIndex) => (
                   <div key={oIndex} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: q.correct_option === oIndex ? 'rgba(16, 185, 129, 0.1)' : 'transparent', padding: '0.5rem', borderRadius: '8px', border: q.correct_option === oIndex ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent' }}>
                      <input 
                         type="radio" 
                         name={`correct_${qIndex}`} 
                         checked={q.correct_option === oIndex} 
                         onChange={() => updateQuestion(qIndex, 'correct_option', oIndex)} 
                         style={{ cursor: 'pointer', width: '18px', height: '18px', accentColor: '#10b981' }} 
                      />
                      <input 
                         type="text" 
                         value={opt} 
                         onChange={(e) => updateOption(qIndex, oIndex, e.target.value)} 
                         className="input-field" 
                         placeholder={`Option ${oIndex + 1}`} 
                         style={{ padding: '0.4rem 0.8rem', flexGrow: 1 }} 
                      />
                   </div>
                ))}
             </div>
           </div>
         ))}
       </div>

       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem' }}>
          <button onClick={handleAddQuestion} type="button" className="btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Alternative Question
          </button>
          <button onClick={handleDeploy} disabled={isDeploying} type="button" className="btn-primary" style={{ padding: '0.75rem 2.5rem', fontSize: '1rem', fontWeight: 600 }}>
             {isDeploying ? 'Deploying Payload...' : 'Execute Deployment'}
          </button>
       </div>
    </div>
  );
}
