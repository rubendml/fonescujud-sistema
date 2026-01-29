import { createClient } from '@supabase/supabase-js';
import config from './config.js';

// Cliente regular (con RLS)
const supabase = createClient(config.supabase.url, config.supabase.key);

// Cliente sin RLS (usa service role key)
const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey || config.supabase.key
);

export default supabase;
export { supabaseAdmin };
