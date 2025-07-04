import { User } from '@supabase/supabase-js';

declare module '@/hooks/useAuth' {
  interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, fullName: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }

  const useAuth: () => AuthContextType;
  
  export default useAuth;
}
