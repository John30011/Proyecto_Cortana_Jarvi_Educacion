import { SupabaseClient, Session } from '@supabase/supabase-js';

declare module '@/utils/supabase' {
  export const supabase: SupabaseClient;
  export type { Session };
}
