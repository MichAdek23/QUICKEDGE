'use server';

import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const getAdminClient = () => {
    return createSupabaseAdminClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
};

export async function createMaterial(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const url = formData.get('url') as string;
  const type = formData.get('type') as string;

  const supabaseAdmin = getAdminClient();
  const { error } = await supabaseAdmin.from('materials').insert({ title, description, url, type });
  
  if (error) console.error("Failed to insert material:", error);

  revalidatePath('/admin/materials');
  revalidatePath('/dashboard');
}

export async function deleteMaterial(formData: FormData) {
  const id = formData.get('id') as string;
  const supabaseAdmin = getAdminClient();
  
  const { error } = await supabaseAdmin.from('materials').delete().eq('id', id);
  if (error) console.error("Failed to delete material:", error);

  revalidatePath('/admin/materials');
  revalidatePath('/dashboard');
}
