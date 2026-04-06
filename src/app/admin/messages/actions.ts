'use server';

import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';

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

export async function sendReply(formData: FormData) {
  const messageId = formData.get('messageId') as string;
  const replyText = formData.get('replyText') as string;
  const recipientEmail = formData.get('recipientEmail') as string;
  const recipientName = formData.get('recipientName') as string;
  const sendViaEmail = formData.get('sendViaEmail') === 'true';

  if (!messageId || !replyText || !recipientEmail) {
    return { error: 'Missing required fields for reply.' };
  }

  const supabaseAdmin = getAdminClient();

  try {
    // Store reply in database
    const { error: replyError } = await supabaseAdmin.from('message_replies').insert({
      message_id: messageId,
      reply_text: replyText,
      reply_from: 'admin',
      sent_via_email: sendViaEmail
    });

    if (replyError) throw replyError;

    // Send email if requested
    if (sendViaEmail) {
      const emailResult = await sendEmailReply(recipientEmail, recipientName, replyText);
      if (!emailResult.success) {
        console.error("Email failed to send, but reply was stored:", emailResult.error);
        return { error: 'Reply saved but email delivery failed. Please check email configuration.' };
      }
    }

    // Mark original message as read
    await supabaseAdmin.from('contact_messages').update({ is_read: true }).eq('id', messageId);

    revalidatePath('/admin/messages');
    return { success: true, message: sendViaEmail ? 'Reply sent via email and saved.' : 'Reply saved.' };

  } catch (error: any) {
    console.error("Failed to send reply:", error);
    return { error: 'Failed to send reply. Please try again.' };
  }
}

async function sendEmailReply(toEmail: string, toName: string, message: string) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured, simulating email send');
      return { success: true };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const { data, error } = await resend.emails.send({
      from: 'QUICKEDGE <noreply@quick-hedgeconsulting.com>',
      to: [toEmail],
      subject: `Reply to your message - QUICKEDGE`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8b5cf6;">Reply from QUICKEDGE Admin</h2>
          <p>Dear ${toName},</p>
          <p>Thank you for reaching out to us. Here is our reply to your message:</p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <p>Best regards,<br>QUICKEDGE Team</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="font-size: 12px; color: #6b7280;">This is an automated reply to your message sent to QUICKEDGE.</p>
        </div>
      `
    });

    if (error) {
      console.error("Resend API error:", error);
      return { success: false, error: error.message };
    }

    console.log('Email sent successfully:', data);
    return { success: true };
    
  } catch (error: any) {
    console.error("Email sending error:", error);
    return { success: false, error: error.message };
  }
}
