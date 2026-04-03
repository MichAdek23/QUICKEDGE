'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/dashboard', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const data = {
    email: email,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('name') as string,
      }
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/signup?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/dashboard', 'layout')
  // Automatically guide user to OTP view just in case their Supabase requires email confirmations
  redirect('/otp-verify?email=' + encodeURIComponent(email) + '&message=' + encodeURIComponent('Please check your email for the verification code.'))
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password`,
  })

  if (error) {
    redirect('/forgot-password?error=' + encodeURIComponent(error.message))
  }

  redirect('/forgot-password?message=' + encodeURIComponent('Check your email for the secure password reset link.'))
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    redirect('/reset-password?error=' + encodeURIComponent(error.message))
  }

  redirect('/login?message=' + encodeURIComponent('Password updated successfully! Please log in.'))
}

export async function verifyOtpAction(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const token = formData.get('token') as string

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup',
  })

  if (error) {
    redirect('/otp-verify?email=' + encodeURIComponent(email) + '&error=' + encodeURIComponent(error.message))
  }

  redirect('/dashboard')
}

export async function signInWithGoogle() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (data.url) {
    redirect(data.url)
  }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  
  if (!user) return

  const fullName = formData.get('full_name') as string

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName })
    .eq('id', user.id)

  if (error) {
    redirect('/dashboard/profile?error=' + encodeURIComponent('Could not save profile.'))
  }

  revalidatePath('/dashboard/profile')
  redirect('/dashboard/profile?message=' + encodeURIComponent('Profile saved successfully!'))
}

export async function registerAdmin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const full_name = formData.get('full_name') as string;
  const admin_secret = formData.get('admin_secret') as string;

  if (admin_secret !== process.env.ADMIN_SECRET_KEY) {
    return redirect('/admin-signup?error=Invalid Secret Key');
  }

  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
      },
    },
  });

  if (error) {
    return redirect(`/admin-signup?error=${encodeURIComponent(error.message)}`);
  }

  if (data.user) {
    // We must bypass RLS to force role to admin directly into the protected table.
    const supabaseAdmin = createSupabaseAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Wait slightly to guarantee the Postgres trigger 'handle_new_user' executed.
    await new Promise(r => setTimeout(r, 1000));

    const { error: elevateError } = await supabaseAdmin
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', data.user.id);

    if (elevateError) {
      console.error('Failed to elevate role:', elevateError);
      return redirect('/admin-signup?error=Account created but failed to elevate to admin. Check Service Key');
    }
  }

  redirect('/admin');
}
