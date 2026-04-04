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
