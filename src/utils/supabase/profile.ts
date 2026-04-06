import { createClient as createSupabaseAdminClient, type User } from '@supabase/supabase-js'

export function createSupabaseAdminClientInstance() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase admin credentials for profile helper.')
  }

  return createSupabaseAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  )
}

function normalizeProfilePayload(user: User, profileData: { full_name?: string; mat_number?: string; avatar_url?: string; role?: string } = {}) {
  const rawMetaSource = (user as unknown) as { raw_user_meta_data?: unknown; user_metadata?: unknown }
  const rawMeta = (rawMetaSource.raw_user_meta_data ?? rawMetaSource.user_metadata ?? {}) as Record<string, unknown>
  const rawProfile = rawMeta.profile as Record<string, unknown> | undefined

  const defaultFullName = profileData.full_name || String(rawMeta.full_name ?? rawMeta.name ?? user.email?.split('@')[0] ?? 'Student')
  const avatarUrl = profileData.avatar_url || String(rawMeta.avatar_url ?? rawMeta.picture ?? rawProfile?.picture ?? '') || null

  const payload: Record<string, unknown> = {
    full_name: defaultFullName,
    avatar_url: avatarUrl,
    role: profileData.role ?? 'student',
  }

  if (profileData.mat_number) {
    payload.mat_number = profileData.mat_number
  }

  return payload
}

export async function ensureProfileExistsForAuthUser(
  user: User,
  profileData: { full_name?: string; mat_number?: string; avatar_url?: string; role?: string } = {}
) {
  if (!user?.id) {
    return
  }

  const supabaseAdmin = createSupabaseAdminClientInstance()
  const { data: existingProfile, error: lookupError } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (lookupError) {
    console.error('Profile lookup failed in ensureProfileExistsForAuthUser:', lookupError)
    return
  }

  if (existingProfile) {
    return
  }

  const payload = normalizeProfilePayload(user, profileData)

  const { error: insertError } = await supabaseAdmin
    .from('profiles')
    .insert({
      id: user.id,
      ...payload,
    })

  if (insertError) {
    console.error('Profile creation failed in ensureProfileExistsForAuthUser:', insertError)
  }
}
