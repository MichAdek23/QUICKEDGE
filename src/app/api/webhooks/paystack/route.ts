import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const text = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    // Verify webhook signature to securely ensure the request is from Paystack
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(text)
      .digest('hex');

    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(text);

    // When the charge is successful
    if (event.event === 'charge.success') {
      const { metadata } = event.data;
      const userId = metadata?.userId;

      if (userId) {
        // We initialize the Supabase Admin client here using the Service Role Key
        // This is safe because this logic runs purely on the server and bypasses RLS
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Update the user's subscription status natively
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .update({ is_subscribed: true })
          .eq('id', userId);
          
        // Log the exact transaction in our new realtime ledger
        const { error: paymentError } = await supabaseAdmin
           .from('payments')
           .insert({
              user_id: userId,
              amount: event.data.amount / 100,
              reference: event.data.reference,
              status: 'success'
           });
        
        if (profileError || paymentError) {
          console.error("Error updating database:", profileError, paymentError);
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
