import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://bwyssnnpymyvfdpcyujx.supabase.co';
const serviceRoleKey = fs.readFileSync('.env.local', 'utf8').match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1];

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function applySeed() {
  console.log('Reading seed.sql...');
  const seedSQL = fs.readFileSync('supabase/seed.sql', 'utf8');
  
  // Split by semicolon at end of line (actual SQL statement terminator)
  // Use regex to split on semicolon followed by newline or end of string
  const statements = seedSQL
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(s => s && s.length > 10); // Filter out tiny fragments
  
  console.log(`Found ${statements.length} statements to execute`);
  
  let success = 0;
  let failed = 0;
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    if (!stmt) continue;
    
    process.stdout.write(`[${i+1}/${statements.length}] `);
    
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/pgexec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ query: stmt + ';' })
      });
      
      if (!response.ok) {
        const text = await response.text();
        console.error('Failed:', text.substring(0, 200));
        failed++;
      } else {
        console.log('OK');
        success++;
      }
    } catch (e) {
      console.error('Error:', e.message);
      failed++;
    }
  }
  
  console.log(`\nDone: ${success} succeeded, ${failed} failed`);
}

applySeed().catch(console.error);