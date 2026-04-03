'use server';

import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

export async function toggleUserRole(userId: string, targetRole: 'admin' | 'student') {
  const supabaseAdmin = createSupabaseAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ role: targetRole })
    .eq('id', userId);

  if (error) {
    console.error('Role update failed:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/users');
  return { success: true };
}
