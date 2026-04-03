'use server';

import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const getAdminClient = () => {
    return createSupabaseAdminClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
};

export async function toggleAdminSignup(enabled: boolean) {
  const supabaseAdmin = getAdminClient();
  const { error } = await supabaseAdmin
    .from('app_settings')
    .update({ value: enabled ? 'true' : 'false' })
    .eq('key', 'admin_signup_enabled');
    
  if (error) console.error("Failed to update setting:", error);

  revalidatePath('/admin/settings');
}
