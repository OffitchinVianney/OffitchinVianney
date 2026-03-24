import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

// Client public pour les opérations qui pourraient être exposées côté user.
export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey);

// Client admin pour les opérations sensibles (upload signé, admin DB).
export const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: { persistSession: false }
});
