import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function check() {
  const { data: attempts, count, error } = await supabase
    .from('quiz_attempts')
    .select('*', { count: 'exact' });

  console.log("Total quiz_attempts:", count);
  if (error) console.error("Error:", error);
  if (attempts && attempts.length > 0) {
    console.log("Sample attempt:", attempts[0]);
  }

  const { data: profiles, count: pCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' });
  console.log("Total profiles:", pCount);
}

check();
