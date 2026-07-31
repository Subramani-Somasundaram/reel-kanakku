import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

// Reel Kanakku's tables live in the `reelkanakku` schema of the shared
// Supabase project (consolidated with Payanam to stay within the free-tier
// 2-active-project limit). Setting the default schema here means every
// existing `.from('movie_entries')` / `.from('user_profiles')` call across
// the app resolves to reelkanakku.* without any other code changes.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'reelkanakku',
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  }
});
