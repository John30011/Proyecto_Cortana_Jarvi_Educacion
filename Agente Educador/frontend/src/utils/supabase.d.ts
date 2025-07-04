import { SupabaseClient, Session } from '@supabase/supabase-js';

declare global {
  interface Window {
    supabase: SupabaseClient;
  }
}

declare const supabase: SupabaseClient;

export { supabase };
export type { Session };
