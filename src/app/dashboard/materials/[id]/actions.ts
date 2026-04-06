'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitQuizAttempt(quizId: string, score: number, total: number, answers: Record<string, number> = {}) {
  console.log("=== MATERIALS QUIZ SUBMISSION START ===");
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

  // Check if attempt already exists
  const { data: existingAttempts, error: checkError } = await supabase
    .from('quiz_attempts')
    .select('id')
    .eq('quiz_id', quizId)
    .eq('user_id', authData.user.id);

  console.log("Existing attempts check:", { existingAttempts, checkError });

  if (checkError) {
    console.error("Error checking existing attempts:", checkError);
    return { error: `Database check failed: ${checkError.message}` };
  }

  if (existingAttempts && existingAttempts.length > 0) {
     console.log("User already attempted this quiz");
     return { error: 'You have already completed this quiz.' };
  }

  const passed = total > 0 ? score / total >= 0.7 : false;
  console.log("Passed:", passed);

  // Insert attempt
  const insertData = {
    quiz_id: quizId,
    user_id: authData.user.id,
    score,
    total,
    passed,
    answers,
  };
  
  console.log("Inserting data:", insertData);

  const { data, error } = await supabase.from('quiz_attempts').insert(insertData).select();

  console.log("Insert result:", { data, error });

  if (error) {
     console.error("Database insertion error:", error);
     return { error: `Failed to record quiz attempt: ${error.message}` };
  }

  console.log("=== MATERIALS QUIZ SUBMISSION SUCCESS ===");

  revalidatePath('/dashboard/materials');
  revalidatePath('/dashboard/scores');
  revalidatePath('/admin/quizzes');
  
  return { success: true, data };
}
