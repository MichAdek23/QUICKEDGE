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
  try {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const rawFile = formData.get('thumbnail');

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    const supabaseAdmin = getAdminClient();

    let thumbnail_url = null;

    if (rawFile && typeof rawFile === 'object' && 'size' in rawFile && (rawFile as File).size > 0) {
      const file = rawFile as File;
      const fileExt = file.name?.split('.').pop() || 'jpg';
      const filePath = `blog_thumbnails/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabaseAdmin.storage
         .from('materials')
         .upload(filePath, file, { upsert: true, contentType: file.type || 'image/jpeg' });
         
      if (uploadError) throw uploadError;
      
      const { data: publicUrlData } = supabaseAdmin.storage.from('materials').getPublicUrl(filePath);
      thumbnail_url = publicUrlData.publicUrl;
    }

    const { error } = await supabaseAdmin.from('blog_posts').insert({
        title,
        content,
        slug,
        thumbnail_url,
        published: true,
        author_id: authData.user?.id
    });
    
    if (error) throw error;

    revalidatePath('/admin/blog');
    revalidatePath('/blog');
  } catch (error) {
    console.error("Failed to post blog:", error);
  }
}

export async function deleteBlogPost(formData: FormData) {
  const id = formData.get('id') as string;
  const supabaseAdmin = getAdminClient();
  
  const { error } = await supabaseAdmin.from('blog_posts').delete().eq('id', id);
  if (error) console.error("Failed to delete blog:", error);

  revalidatePath('/admin/blog');
  revalidatePath('/blog');
}

// Rapid Inline API for the Markdown Editor
export async function uploadInlineImage(formData: FormData) {
  const rawFile = formData.get('file');
  if (rawFile && typeof rawFile === 'object' && 'size' in rawFile && (rawFile as File).size > 0) {
     const file = rawFile as File;
     const supabaseAdmin = getAdminClient();
     
     const fileExt = file.name?.split('.').pop() || 'jpg';
     const filePath = `blog_inline/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
     
     const { error: uploadError } = await supabaseAdmin.storage
         .from('materials')
         .upload(filePath, file, { upsert: true, contentType: file.type || 'image/jpeg' });
         
     if (uploadError) {
         console.error("Inline image error:", uploadError);
         return { error: uploadError.message };
     }
     
     const { data: publicUrlData } = supabaseAdmin.storage.from('materials').getPublicUrl(filePath);
     return { url: publicUrlData.publicUrl };
  }
  return { error: 'No file received' };
}
