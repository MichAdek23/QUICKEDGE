'use client';

import { useState, useEffect, useRef } from 'react';
import { deployQuizAttempt } from '../actions';
import { useRouter } from 'next/navigation';

export default function StrictQuizRunner({ quiz }: { quiz: any }) {
  const [phase, setPhase] = useState<'INSTRUCTIONS' | 'TESTING' | 'COMPLETED' | 'PENALIZED'>('INSTRUCTIONS');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [fatalError, setFatalError] = useState<string | null>(null);

  const router = useRouter();
  const questions = quiz.quiz_questions || [];

  // Use refs to track state dynamically inside the window listener without closure staleness
  const selectedRef = useRef(selectedAnswers);
  const phaseRef = useRef(phase);
  
  useEffect(() => {
    selectedRef.current = selectedAnswers;
    phaseRef.current = phase;
  }, [selectedAnswers, phase]);

  // ANTI-CHEAT: Visibility Hook
  useEffect(() => {
    const handleVisibilityChange = () => {
      // If the document becomes hidden (user switches tabs to Google something!) AND they are actively testing
      if (document.hidden && phaseRef.current === 'TESTING') {
         console.warn("[ANTI-CHEAT] Focus lost. Forcing auto-submission.");
         forceAutoSubmit("You left the secure environment. Your assessment has been automatically closed and penalized.");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
       document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const calculateScore = (answersPayload: { [key: string]: number }): number => {
    let score = 0;
    questions.forEach((q: any) => {
       if (answersPayload[q.id] === q.correct_option) score += 1;
    });
    return score;
  };

  const forceAutoSubmit = async (reason: string) => {
    setIsSubmitting(true);
    const score = calculateScore(selectedRef.current);
    const res = await deployQuizAttempt(quiz.id, score, questions.length);
    if (res.error) setFatalError(res.error);
    
    setFinalScore(score);
    setPhase('PENALIZED');
    setIsSubmitting(false);
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);
    const score = calculateScore(selectedAnswers);
    const res = await deployQuizAttempt(quiz.id, score, questions.length);
    if (res.error) {
       setFatalError(res.error);
    } else {
       setFinalScore(score);
       setPhase('COMPLETED');
    }
    setIsSubmitting(false);
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  if (phase === 'INSTRUCTIONS') {
     return (
       <div className="glass-panel" style={{ padding: '3rem 2rem', borderTop: '4px solid #ef4444' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem', color: '#ef4444' }}>ATTENTION: STRICT TESTING ENVIRONMENT</h2>
          <p style={{ color: '#e4e4e7', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
             You are about to begin <strong>{quiz.title}</strong>.<br/><br/>
             This is a monitored assessment. You are permitted exactly <strong>ONE (1) ATTEMPT</strong>.<br/>
             Once you begin, if you leave this page, switch tabs, or minimize your browser, the system will <strong>AUTOMATICALLY SUBMIT</strong> your incomplete exam as an anti-cheating penalty.<br/><br/>
             Ensure you have a stable connection and are prepared before continuing.
          </p>
          <button onClick={() => setPhase('TESTING')} className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', background: '#e11d48' }}>
             I Accept — Begin Assessment
          </button>
       </div>
     );
  }

  if (phase === 'PENALIZED' || phase === 'COMPLETED') {
     const percentage = finalScore !== null ? ((finalScore / questions.length) * 100) : 0;
     const passed = percentage >= 70;
     
     return (
       <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center', borderTop: passed && phase !== 'PENALIZED' ? '4px solid #10b981' : '4px solid #ef4444' }}>
          {phase === 'PENALIZED' && (
             <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: '#ef4444' }}>ASSESSMENT TERMINATED</h3>
          )}
          {fatalError && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{fatalError}</p>}
          
          <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: passed && phase !== 'PENALIZED' ? '#10b981' : '#f472b6' }}>
            {phase === 'PENALIZED' ? 'Auto-Submitted (Focus Lost)' : (passed ? 'Assessment Logged!' : 'Assessment Logged')}
          </h3>
          <p style={{ fontSize: '1.2rem', color: '#e4e4e7', marginBottom: '2rem' }}>You scored {finalScore} out of {questions.length} ({percentage.toFixed(0)}%)</p>
          
          <button onClick={() => router.push('/dashboard/scores')} className="btn-secondary" style={{ padding: '0.75rem 2rem' }}>
             Return to Scores Directory
          </button>
       </div>
     );
  }

  // Phase === 'TESTING'
  const currentQ = questions[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === questions.length - 1;

  if (isSubmitting) return <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}><h2>Locking Payload...</h2></div>;

  return (
    <div className="glass-panel" style={{ padding: '2.5rem', borderTop: '4px solid #8b5cf6' }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '0.9rem', color: '#ef4444', fontWeight: 800, textTransform: 'uppercase' }}>
         <span>Question {currentQuestionIdx + 1} of {questions.length}</span>
         <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite' }}></span>
            Monitoring Active
         </span>
       </div>
       
       <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#f4f4f5', marginBottom: '2rem', lineHeight: 1.5 }}>
         {currentQ.question_text}
       </h3>

       <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
         {currentQ.options.map((option: string, idx: number) => {
            const isSelected = selectedAnswers[currentQ.id] === idx;
            return (
              <button 
                key={idx} 
                onClick={() => handleSelectOption(currentQ.id, idx)}
                style={{ 
                   padding: '1.25rem', 
                   textAlign: 'left', 
                   background: isSelected ? 'rgba(109, 40, 217, 0.2)' : 'rgba(255,255,255,0.03)', 
                   border: isSelected ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                   borderRadius: '12px',
                   color: isSelected ? 'white' : '#e4e4e7',
                   cursor: 'pointer',
                   transition: 'all 0.2s'
                }}
              >
                 <span style={{ display: 'inline-block', width: '30px', fontWeight: 'bold', color: isSelected ? 'var(--primary)' : '#a1a1aa' }}>
                   {String.fromCharCode(65 + idx)}.
                 </span>
                 {option}
              </button>
            )
         })}
       </div>

       <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button 
            disabled={currentQuestionIdx === 0} 
            onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
            className="btn-secondary"
            style={{ opacity: currentQuestionIdx === 0 ? 0 : 1 }}
          >
             Previous
          </button>
          
          {isLastQuestion ? (
            <button 
               onClick={submitQuiz}
               disabled={selectedAnswers[currentQ.id] === undefined}
               className="btn-primary"
            >
               Finalize & Submit
            </button>
          ) : (
            <button 
               onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
               disabled={selectedAnswers[currentQ.id] === undefined}
               className="btn-primary"
            >
               Save & Continue
            </button>
          )}
       </div>
    </div>
  );
}
