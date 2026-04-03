import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, userId } = await request.json();

    if (!email || !userId) {
      return NextResponse.json({ error: 'Email and User ID are required' }, { status: 400 });
    }

    const payload = {
      email,
      amount: 1500 * 100, // Paystack amount is in the lowest currency unit (Kobo), so 1500 NGN * 100
      metadata: {
        userId, // Passes the Supabase user ID to Paystack so the webhook knows who paid
      },
      // When payment finishes, user returns here
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard`,
    };

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!data.status) {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }

    // Return the checkout URL from Paystack so the frontend can redirect the user
    return NextResponse.json({ authorization_url: data.data.authorization_url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
