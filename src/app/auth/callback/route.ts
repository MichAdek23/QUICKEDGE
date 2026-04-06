import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { ensureProfileExistsForAuthUser } from '@/utils/supabase/profile'
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  // By default, send them to the dashboard after a successful OAuth flow
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing user sessions.
            }
          },
        },
      }
    )

    // Exchanges auth code for the secure session cookie
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (data.user && !data.user.email_confirmed_at) {
      // User signed up via OAuth but email confirmation is still required
      // Use admin client to confirm the email automatically for OAuth users
      const supabaseAdmin = createSupabaseAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      await supabaseAdmin.auth.admin.updateUserById(data.user.id, {
        email_confirm: true
      });
    }

    if (data.user?.id) {
      await ensureProfileExistsForAuthUser(data.user)
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(next, request.url))
}
