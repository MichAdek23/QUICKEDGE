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
  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    let url = formData.get('url') as string;
    const type = formData.get('type') as string;
    const rawFile = formData.get('file');
    const rawThumbnail = formData.get('thumbnail');

    const supabaseAdmin = getAdminClient();

    // Check if it's genuinely a file object and has bytes
    if (rawFile && typeof rawFile === 'object' && 'size' in rawFile && (rawFile as File).size > 0) {
      const file = rawFile as File;
      let fileExt = file.name?.split('.').pop()?.toLowerCase() || 'media';
      const filePath = `deployments/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      // Defensively extrapolate accurate MIME types explicitly to prevent Native browser download execution bugs.
      let finalContentType = file.type;
      if (!finalContentType || finalContentType === 'application/octet-stream') {
         if (fileExt === 'pdf') finalContentType = 'application/pdf';
         else if (['mp4', 'webm', 'mov'].includes(fileExt)) finalContentType = 'video/' + fileExt;
         else if (['png', 'jpg', 'jpeg', 'svg', 'gif', 'webp'].includes(fileExt)) finalContentType = 'image/' + fileExt;
         else finalContentType = 'application/octet-stream';
      }

      const { error: uploadError } = await supabaseAdmin.storage
         .from('materials')
         .upload(filePath, file, { upsert: true, contentType: finalContentType });
         
      if (uploadError) {
          console.error("CRITICAL STORAGE FAULT:", uploadError);
          throw new Error('Failed to upload file to storage');
      }
      
      const { data: publicUrlData } = supabaseAdmin.storage.from('materials').getPublicUrl(filePath);
      url = publicUrlData.publicUrl;
    }

    if (!url) {
      throw new Error("You must provide either a Media File OR a Remote URL.");
    }
    
    let thumbnail_url = null;
    
    if (rawThumbnail && typeof rawThumbnail === 'object' && 'size' in rawThumbnail && (rawThumbnail as File).size > 0) {
      const thumbFile = rawThumbnail as File;
      let fileExt = thumbFile.name?.split('.').pop()?.toLowerCase() || 'png';
      const thumbPath = `deployments/thumb_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: thumbUploadError } = await supabaseAdmin.storage
         .from('materials')
         .upload(thumbPath, thumbFile, { upsert: true, contentType: thumbFile.type || 'image/png' });
         
      if (!thumbUploadError) {
          const { data: thumbUrlData } = supabaseAdmin.storage.from('materials').getPublicUrl(thumbPath);
          thumbnail_url = thumbUrlData.publicUrl;
      } else {
          console.error("THUMBNAIL STORAGE FAULT:", thumbUploadError);
      }
    }

    const { error } = await supabaseAdmin.from('materials').insert({ 
      title, 
      description, 
      url, 
      type, 
      is_published: false,
      ...(thumbnail_url && { thumbnail_url }) 
    });
    if (error) throw error;

    revalidatePath('/admin/materials');
    revalidatePath('/dashboard');
  } catch (error: any) {
    console.error("SERVER ACTION ERROR:", error);
    // Returning void to comply with NextJS <form action> Promise<void> requirement
    return;
  }
}

export async function publishMaterial(formData: FormData) {
  const id = formData.get('id') as string;
  const supabaseAdmin = getAdminClient();
  
  const { error } = await supabaseAdmin.from('materials').update({ is_published: true }).eq('id', id);
  if (error) console.error("Failed to publish material:", error);

  revalidatePath('/admin/materials');
  revalidatePath('/dashboard');
}

export async function unpublishMaterial(formData: FormData) {
  const id = formData.get('id') as string;
  const supabaseAdmin = getAdminClient();
  
  const { error } = await supabaseAdmin.from('materials').update({ is_published: false }).eq('id', id);
  if (error) console.error("Failed to unpublish material:", error);

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
