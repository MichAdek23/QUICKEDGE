'use server';

import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

const getAdminClient = () => {
    return createSupabaseAdminClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
};

export async function createBlogPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  // Make a clean SEO-friendly slug
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  const supabaseAdmin = getAdminClient();
  const { error } = await supabaseAdmin.from('blog_posts').insert({
      title,
      content,
      slug,
      published: true,
      author_id: authData.user?.id
  });
  
  if (error) console.error("Failed to post blog:", error);

  revalidatePath('/admin/blog');
  revalidatePath('/blog');
}

export async function deleteBlogPost(formData: FormData) {
  const id = formData.get('id') as string;
  const supabaseAdmin = getAdminClient();
  
  const { error } = await supabaseAdmin.from('blog_posts').delete().eq('id', id);
  if (error) console.error("Failed to delete blog:", error);

  revalidatePath('/admin/blog');
  revalidatePath('/blog');
}
