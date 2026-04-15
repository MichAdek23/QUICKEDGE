'use client';

import { useState, useEffect } from 'react';
import SubscriptionCTA from '@/app/dashboard/SubscriptionCTA';
import { createClient } from '@/utils/supabase/client';
import { submitQuizAttempt } from './actions';

export default function QuizRunner({ quiz, isSubscribed, userEmail, userId }: { quiz: any, isSubscribed: boolean, userEmail: string | undefined, userId: string }) {
  const [started, setStarted] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [existingAttempt, setExistingAttempt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();
  const questions = quiz.quiz_questions || [];

  // Check for existing attempt on component mount
  useEffect(() => {
    const checkExistingAttempt = async () => {
      const { data: attempts } = await supabase
        .from('quiz_attempts')
        .select('id, score, total, created_at, passed')
        .eq('quiz_id', quiz.id)
        .eq('user_id', userId)
        .single();
      
      setExistingAttempt(attempts);
      setLoading(false);
    };
    
    if (userId && quiz.id) {
      checkExistingAttempt();
    } else {
      setLoading(false);
    }
  }, [quiz.id, userId, supabase]);

  if (loading) {
    return (
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#a1a1aa' }}>Checking quiz status...</p>
      </div>
    );
  }

  if (existingAttempt) {
    const percentage = (existingAttempt.score / existingAttempt.total) * 100;
    const passed = percentage >= 70;
    
    return (
      <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center', borderTop: passed ? '4px solid #10b981' : '4px solid #ef4444' }}>
        <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: passed ? '#10b981' : '#f472b6' }}>
          Assessment Completed
        </h3>
        <p style={{ fontSize: '1.2rem', color: '#e4e4e7', marginBottom: '2rem' }}>
          You have already completed this quiz. Your score is permanently recorded.
        </p>
        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--card-border)', display: 'inline-block', textAlign: 'left', minWidth: '300px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#a1a1aa' }}>Score:</span>
            <span style={{ fontWeight: 800 }}>{existingAttempt.score} / {existingAttempt.total}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#a1a1aa' }}>Percentage:</span>
            <span style={{ fontWeight: 800, color: passed ? '#10b981' : '#ef4444' }}>{percentage.toFixed(0)}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#a1a1aa' }}>Date:</span>
            <span style={{ fontWeight: 600 }}>{new Date(existingAttempt.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isSubscribed) {
    return (
       <div className="glass-panel" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ opacity: 0.1, filter: 'blur(3px)', userSelect: 'none', pointerEvents: 'none' }}>
             <h3 style={{ fontSize: '1.4rem' }}>{quiz.title}</h3>
             <ul style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
               <li style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>Hidden Question Block</li>
               <li style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>Hidden Question Block</li>
             </ul>
          </div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', padding: '2rem', textAlign: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" style={{ marginBottom: '1rem' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Premium Quiz Locked</h4>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '300px' }}>Subscribe to unlock this comprehensive assessment and track your grading.</p>
            <SubscriptionCTA userEmail={userEmail} userId={userId} />
          </div>
       </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '2rem', color: '#a1a1aa' }}>
        <h3>{quiz.title}</h3>
        <p>No questions have been configured for this quiz yet.</p>
      </div>
    );
  }

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const submitQuiz = async () => {
    if (submitting) return; // Prevent double submission
    
    setSubmitting(true);
    setError(null);
    
    // Calculate Score locally for immediate feedback
    let calculatedScore = 0;
    questions.forEach((q: any) => {
       if (selectedAnswers[q.id] === q.correct_option) {
         calculatedScore += 1;
       }
    });

    console.log("Quiz submission starting. Score:", calculatedScore, "Total:", questions.length);
    setScore(calculatedScore);

    // Save to database using server action for guaranteed insertion
    try {
      console.log("Calling submitQuizAttempt with quiz ID:", quiz.id);
      const result = await submitQuizAttempt(
        quiz.id,
        calculatedScore,
        questions.length,
        selectedAnswers
      );

      console.log("Server action result:", result);

      if (result.error) {
        console.error("Server action error:", result.error);
        setError(`Submission failed: ${result.error}`);
        setSubmitting(false);
        return;
      }

      console.log("Quiz submission successful!");
      setCompleted(true);
    } catch (err: any) {
      console.error("Network error:", err);
      setError(`Network error: ${err.message || 'Please check your connection and try again.'}`);
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderTop: '4px solid #ef4444' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem', color: '#ef4444' }}>Submission Error</h3>
        <p style={{ color: '#e4e4e7', marginBottom: '0.5rem' }}>{error}</p>
        <p style={{ color: '#a1a1aa', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Please try again or contact support if the issue persists.</p>
        <button onClick={() => { setError(null); setSubmitting(false); }} className="btn-primary" style={{ padding: '0.75rem 2rem' }}>
          Try Again
        </button>
      </div>
    );
  }

  if (completed) {
     const percentage = (score / questions.length) * 100;
     const passed = percentage >= 70;
     
     return (
       <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center', borderTop: passed ? '4px solid #10b981' : '4px solid #ef4444' }}>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: passed ? '#10b981' : '#f472b6' }}>
            {passed ? 'Outstanding!' : 'Keep Practicing!'}
          </h3>
          <p style={{ fontSize: '1.2rem', color: '#e4e4e7', marginBottom: '2rem' }}>You scored {score} out of {questions.length} ({percentage.toFixed(0)}%)</p>
          <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Your score has been permanently recorded. Retakes are not allowed.</p>
       </div>
     );
  }

  if (!started) {
     return (
       <div className="glass-panel" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{quiz.title}</h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>{questions.length} multiple choice questions.</p>
          </div>
          <button onClick={() => setStarted(true)} className="btn-primary" style={{ padding: '0.75rem 2rem' }}>
            Start Quiz
          </button>
       </div>
     );
  }

  const currentQ = questions[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === questions.length - 1;

  return (
    <div className="glass-panel" style={{ padding: '2.5rem' }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '0.9rem', color: '#a1a1aa', fontWeight: 600 }}>
         <span>Question {currentQuestionIdx + 1} of {questions.length}</span>
         <span>{((currentQuestionIdx / questions.length) * 100).toFixed(0)}% Completed</span>
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
               disabled={selectedAnswers[currentQ.id] === undefined || submitting}
               className="btn-primary"
               style={{ opacity: submitting ? 0.7 : 1 }}
            >
               {submitting ? 'Submitting...' : 'Finalize & Submit'}
            </button>
          ) : (
            <button 
               onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
               disabled={selectedAnswers[currentQ.id] === undefined}
               className="btn-primary"
            >
               Next Question
            </button>
          )}
       </div>
    </div>
  );
}
