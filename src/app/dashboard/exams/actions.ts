'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function deployQuizAttempt(quizId: string, score: number, total: number, answers: Record<string, number> = {}) {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  
  if (authError || !authData.user) {
     return { error: 'Unauthorized Session.' };
  }

  // 1. Defensively check again on the backend if they already tried to take this!
  const { data: existingAttempts } = await supabase
    .from('quiz_attempts')
    .select('id')
    .eq('quiz_id', quizId)
    .eq('user_id', authData.user.id);

  if (existingAttempts && existingAttempts.length > 0) {
     return { error: 'FATAL: You have already completed this assessment. Re-attempts are blocked at the database level.' };
  }

  const passed = total > 0 ? score / total >= 0.7 : false;

  // 2. Commit payload
  const { error } = await supabase.from('quiz_attempts').insert({
    quiz_id: quizId,
    user_id: authData.user.id,
    score,
    total,
    passed,
    answers,
  });

  if (error) {
     console.error("Telemetry failure:", error);
     return { error: 'Failed to record the final attempt.' };
  }

  revalidatePath('/dashboard/scores');
  revalidatePath('/admin/quizzes');
  
  return { success: true };
}
