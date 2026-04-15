'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function deployQuizAttempt(quizId: string, score: number, total: number, answers: Record<string, number> = {}) {
  console.log("=== DEPLOY QUIZ ATTEMPT START ===");
  console.log("Quiz ID:", quizId);
  console.log("Score:", score, "Total:", total);
  console.log("Answers:", answers);
  
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  
  if (authError || !authData.user) {
     console.error("Auth error:", authError);
     return { error: 'Unauthorized Session.' };
  }

  console.log("User authenticated:", authData.user.id);

  // 1. Defensively check again on the backend if they already tried to take this!
  const { data: existingAttempts, error: checkError } = await supabase
    .from('quiz_attempts')
    .select('id')
    .eq('quiz_id', quizId)
    .eq('user_id', authData.user.id);

  console.log("Existing attempts check:", { existingAttempts, checkError });

  if (checkError && checkError.code !== 'PGRST116') {
    console.error("Error checking existing attempts:", checkError);
    return { error: `Database check failed: ${checkError.message}` };
  }

  if (existingAttempts && existingAttempts.length > 0) {
     console.log("User already attempted this quiz");
     return { error: 'FATAL: You have already completed this assessment. Re-attempts are blocked at the database level.' };
  }

  const passed = total > 0 ? score / total >= 0.7 : false;
  console.log("Passed:", passed);

  // 2. Commit payload - try with answers first, fallback without if schema cache issue
  const insertData = {
    quiz_id: quizId,
    user_id: authData.user.id,
    score,
    total,
    passed,
    answers,
  };
  
  console.log("Inserting data:", insertData);

  let { data, error } = await supabase.from('quiz_attempts').insert(insertData).select();

  // Fallback: If schema cache error, try without answers field
  if (error && (error.message?.includes('answers') || error.message?.includes('passed'))) {
    console.warn("Schema cache lag detected. Retrying without optional fields...");
    const fallbackData = {
      quiz_id: quizId,
      user_id: authData.user.id,
      score,
      total,
    };
    const result = await supabase.from('quiz_attempts').insert(fallbackData).select();
    data = result.data;
    error = result.error;
  }

  console.log("Insert result:", { data, error });

  if (error) {
     console.error("Telemetry failure:", error);
     return { error: `Failed to record the final attempt: ${error.message}` };
  }

  console.log("=== DEPLOY QUIZ ATTEMPT SUCCESS ===");

  revalidatePath('/dashboard/scores');
  revalidatePath('/admin/quizzes');
  
  return { success: true, data };
}
