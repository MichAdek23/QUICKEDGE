'use server';

import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';

const getAdminClient = () => {
    return createSupabaseAdminClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
};

export async function submitContactMessage(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !message) {
       return { error: 'All fields are strictly required.' };
    }

    const supabaseAdmin = getAdminClient();

    const { error } = await supabaseAdmin.from('contact_messages').insert({
        name,
        email,
        message,
        is_read: false
    });
    
    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Failed to transmit contact message:", error);
    return { error: 'Transmission failed. Please try again later.' };
  }
}
