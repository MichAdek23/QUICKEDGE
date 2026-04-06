'use server';

import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const getAdminClient = () => {
    return createSupabaseAdminClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
};

export async function deployQuizWithQuestions(formData: FormData) {
  try {
    const rawPayload = formData.get('payload') as string;
    if (!rawPayload) throw new Error("No payload detected.");

    const { materialId, title, questions } = JSON.parse(rawPayload);

    if (!materialId || !title || !questions || questions.length === 0) {
       throw new Error("Missing critical quiz parameters.");
    }

    const supabaseAdmin = getAdminClient();

    // 0. Defensive Check: Does a quiz already exist for this material?
    const { data: existing } = await supabaseAdmin.from('quizzes').select('id').eq('material_id', materialId);
    if (existing && existing.length > 0) {
       throw new Error("CRITICAL FAILURE: This material already has an active quiz attached. 1-to-1 Mapping Enforced.");
    }

    // 1. Create the base quiz matrix
    const { data: quizData, error: quizError } = await supabaseAdmin
       .from('quizzes')
       .insert({ material_id: materialId, title })
       .select('id')
       .single();

    if (quizError || !quizData) throw new Error(quizError?.message || "Failed to instantiate quiz node.");

    // 2. Prepare and map question payloads
    const mappedQuestions = questions.map((q: any) => ({
       quiz_id: quizData.id,
       question_text: q.question_text,
       options: q.options,
       correct_option: parseInt(q.correct_option)
    }));

    // 3. Batch insert questions
    const { error: questionsError } = await supabaseAdmin
       .from('quiz_questions')
       .insert(mappedQuestions);

    if (questionsError) {
       // Rollback sequence
       await supabaseAdmin.from('quizzes').delete().eq('id', quizData.id);
       throw new Error(questionsError.message || "Failed to write quiz questions.");
    }

    revalidatePath('/admin/quizzes');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error("Quiz Deployment Error:", error);
    return { error: error.message || "Internal deployment failure." };
  }
}

export async function forceDeleteQuizAttempt(formData: FormData) {
   const attemptId = formData.get('attempt_id') as string;
   const supabaseAdmin = getAdminClient();
   const { error } = await supabaseAdmin.from('quiz_attempts').delete().eq('id', attemptId);
   if (error) console.error("Failed to delete attempt:", error);
   revalidatePath('/admin/quizzes');
}

// New: Update quiz title and optionally its questions
export async function updateQuiz(formData: FormData) {
  const quizId = formData.get('quiz_id') as string;
  const title = formData.get('title') as string;
  const questionsPayload = formData.get('questions') as string; // JSON string of array
  const supabaseAdmin = getAdminClient();

  // Update title
  const { error: titleError } = await supabaseAdmin.from('quizzes').update({ title }).eq('id', quizId);
  if (titleError) throw new Error(titleError.message);

  // Update questions if provided
  if (questionsPayload) {
    const questions = JSON.parse(questionsPayload);
    // Delete existing questions for this quiz
    await supabaseAdmin.from('quiz_questions').delete().eq('quiz_id', quizId);
    // Insert new set
    const mapped = questions.map((q: any) => ({
      quiz_id: quizId,
      question_text: q.question_text,
      options: q.options,
      correct_option: parseInt(q.correct_option)
    }));
    const { error: qError } = await supabaseAdmin.from('quiz_questions').insert(mapped);
    if (qError) throw new Error(qError.message);
  }
  revalidatePath('/admin/quizzes');
}

// New: Toggle publish flag
export async function toggleQuizPublish(formData: FormData) {
  const quizId = formData.get('quiz_id') as string;
  const supabaseAdmin = getAdminClient();
  // Fetch current publish state with error handling
  const { data: quiz, error: fetchError } = await supabaseAdmin
    .from('quizzes')
    .select('published')
    .eq('id', quizId)
    .single();
  if (fetchError) throw new Error(fetchError.message);
  if (!quiz) throw new Error('Quiz not found');
  const newState = !quiz.published;
  const { error: updateError } = await supabaseAdmin
    .from('quizzes')
    .update({ published: newState })
    .eq('id', quizId);
  if (updateError) throw new Error(updateError.message);
  revalidatePath('/admin/quizzes');
}

// New: Soft delete quiz (archive)
export async function softDeleteQuiz(formData: FormData) {
  const quizId = formData.get('quiz_id') as string;
  const supabaseAdmin = getAdminClient();
  try {
    const { error } = await supabaseAdmin.from('quizzes').update({ is_archived: true }).eq('id', quizId);
    if (error) throw new Error(error.message);
    revalidatePath('/admin/quizzes');
  } catch (err: any) {
    console.error('Archive quiz error:', err.message);
    throw err;
  }
}
