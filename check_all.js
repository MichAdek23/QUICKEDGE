const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const url = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=([^\r\n]+)/)[1];
const key = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=([^\r\n]+)/)[1];

const supabase = createClient(url, key);
async function run() {
  const { data, error } = await supabase.from('profiles').select('id, full_name, role');
  console.log("ALL PROFILES:", JSON.stringify(data, null, 2));

  const { data: users } = await supabase.auth.admin.listUsers();
  console.log("\nALL AUTH USERS:", JSON.stringify(users.users.map(u => ({ email: u.email, id: u.id })), null, 2));
}
run();
