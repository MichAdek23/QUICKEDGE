'use server';

import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const getAdminClient = () => {
    return createSupabaseAdminClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
};

export async function markMessageAsRead(formData: FormData) {
  const id = formData.get('id') as string;
  const is_read = formData.get('is_read') === 'true';

  const supabaseAdmin = getAdminClient();
  const { error } = await supabaseAdmin.from('contact_messages').update({ is_read }).eq('id', id);

  if (error) console.error("Failed to mark message read status:", error);

  revalidatePath('/admin/messages');
}

export async function deleteMessage(formData: FormData) {
  const id = formData.get('id') as string;

  const supabaseAdmin = getAdminClient();
  const { error } = await supabaseAdmin.from('contact_messages').delete().eq('id', id);

  if (error) console.error("Failed to delete contact message:", error);

  revalidatePath('/admin/messages');
}
