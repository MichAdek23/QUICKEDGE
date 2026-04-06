'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { ensureProfileExistsForAuthUser } from '@/utils/supabase/profile'
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const nextTarget = formData.get('next') as string | null;

  const { error, data: authData } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message))
  }

  if (authData.user) {
    // Elevate query to use backend service role to bypass instantaneous session propagation delays
    const supabaseAdmin = createSupabaseAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
      
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single();

    if (profile?.role === 'admin') {
      revalidatePath('/admin', 'layout')
      redirect(nextTarget && nextTarget.startsWith('/admin') ? nextTarget : '/admin')
    }
  }

  revalidatePath('/dashboard', 'layout')
  redirect(nextTarget ? nextTarget : '/dashboard')
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
  const nextTarget = formData.get('next') as string | null;

  const { error, data: authData } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/signup?error=' + encodeURIComponent(error.message))
  }

  if (authData?.user?.id) {
    await ensureProfileExistsForAuthUser(authData.user, {
      full_name: data.options?.data?.full_name,
      role: 'student',
    })
  }

  revalidatePath('/dashboard', 'layout')
  // Automatically guide user to OTP view just in case their Supabase requires email confirmations
  let otpRedirect = '/otp-verify?email=' + encodeURIComponent(email) + '&message=' + encodeURIComponent('Please check your email for the verification code.')
  if (nextTarget) {
     otpRedirect += '&next=' + encodeURIComponent(nextTarget);
  }
  redirect(otpRedirect)
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
  const nextTarget = formData.get('next') as string | null

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup',
  })

  if (error) {
    redirect('/otp-verify?email=' + encodeURIComponent(email) + '&error=' + encodeURIComponent(error.message) + (nextTarget ? '&next=' + encodeURIComponent(nextTarget) : ''))
  }

  redirect(nextTarget ? nextTarget : '/dashboard')
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
    return redirect('/admin-signup?error=' + encodeURIComponent('Invalid Secret Key'));
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
     return redirect('/admin-signup?error=' + encodeURIComponent('System Error: Missing Environment Administration Key'));
  }

  const supabaseAdmin = createSupabaseAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // 1. Create user using Admin API to instantly bypass email confirmations
  const { data: adminUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name }
  });

  if (createError) {
    return redirect(`/admin-signup?error=${encodeURIComponent(createError.message)}`);
  }

  if (adminUser.user) {
    // 2. Bruteforce Upsert the Profile explicitly to 'admin' using the service role key.
    // This fully bypasses any delay or silent failure in the handle_new_user postgres trigger!
    const { error: elevateError } = await supabaseAdmin
      .from('profiles')
      .upsert({
         id: adminUser.user.id,
         full_name: full_name,
         role: 'admin',
      }, { onConflict: 'id' });

    if (elevateError) {
      console.error("Upsert Failure Diagnostics:", elevateError);
      return redirect('/admin-signup?error=' + encodeURIComponent('Role elevation failed: ' + elevateError.message));
    }
  }

  // 3. Manually sign them into the local NextJS client session so the cookies are set!
  const supabase = await createClient();
  
  // Wipe any potentially lingering ghost sessions strictly from the client first
  await supabase.auth.signOut();
  
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (signInError) {
     return redirect('/login?message=' + encodeURIComponent('Admin account created successfully! Please log in.'));
  }

  // 4. Forcibly destroy any stale NextJS internal layout cache before transporting
  revalidatePath('/admin', 'layout');
  revalidatePath('/dashboard', 'layout');

  // 5. Force transport to Admin Dashboard
  redirect('/admin');
}
