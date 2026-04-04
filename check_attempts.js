const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data, error } = await supabaseAdmin
    .from('quiz_attempts')
    .select(`
       id,
       score,
       total,
       created_at,
       user_id,
       profiles ( id, full_name, mat_number ),
       quizzes ( title, materials ( title ) )
    `);
  console.log("Attempts:", JSON.stringify(data, null, 2));
  if (error) console.error("Error:", error);
}

check();
