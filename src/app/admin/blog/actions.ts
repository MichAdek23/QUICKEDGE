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

export async function upsertBlogPost(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const rawFile = formData.get('thumbnail');
    const isDraft = formData.get('isDraft') === 'true';

    // Advanced Slugification keeping it completely safe
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

    const payload: any = {
        title,
        content,
        slug,
        published: !isDraft,
        author_id: authData.user?.id
    };

    if (thumbnail_url) payload.thumbnail_url = thumbnail_url;

    if (id && id !== 'new') {
        const { error } = await supabaseAdmin.from('blog_posts').update(payload).eq('id', id);
        if (error) throw error;
    } else {
        const { error } = await supabaseAdmin.from('blog_posts').insert(payload);
        if (error) throw error;
    }

    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to post blog:", error);
    return { error: error.message };
  }
}

export async function toggleBlogPostStatus(id: string, targetState: boolean) {
  const supabaseAdmin = getAdminClient();
  const { error } = await supabaseAdmin.from('blog_posts').update({ published: targetState }).eq('id', id);
  if (error) console.error("Toggle status error:", error);
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
}

export async function deleteBlogPost(id: string) {
  const supabaseAdmin = getAdminClient();
  // Execute Soft Delete architecture
  const { error } = await supabaseAdmin.from('blog_posts').update({ is_archived: true }).eq('id', id);
  if (error) console.error("Failed to soft-delete blog:", error);

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
