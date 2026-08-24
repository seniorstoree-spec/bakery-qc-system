import { createClient } from '@supabase/supabase-js';

// Production project is fixed intentionally. Vercel environment variables must not
// silently redirect the application to a different Supabase project.
const SUPABASE_URL = 'https://xvnknchehhuslbgrpytl.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_XaCTMBlPfNsLSAIbER3wkw_KAWNRDkL';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'bakery-qc-supabase-auth',
  },
});
