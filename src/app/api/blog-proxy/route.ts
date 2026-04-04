import { NextResponse } from 'next/server';
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id || id === 'new') {
     return NextResponse.json({ blog: null });
  }

  const supabaseAdmin = createSupabaseAdminClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data } = await supabaseAdmin.from('blog_posts').select('*').eq('id', id).single();
  return NextResponse.json({ blog: data });
}
