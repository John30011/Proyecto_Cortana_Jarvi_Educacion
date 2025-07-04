import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { User as SupabaseUser, UserMetadata, Session } from '@supabase/supabase-js';
import { UserRole } from '../types/database.types';

// Define types
type User = SupabaseUser & {
  role?: UserRole;
  user_metadata: {
    name?: string;
    full_name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    age?: number;
    avatar?: File;
  }) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check active session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          return;
        }

        if (session?.user) {
          setUser(session.user as User);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user as User);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const register = useCallback(async (userData: { 
    name: string; 
    email: string; 
    password: string;
    role: UserRole;
    age?: number;
    avatar?: File;
  }): Promise<void> => {
    try {
      console.log('=== REGISTER STARTED ===');
      console.log('Form data received:', {
        email: userData.email,
        name: userData.name,
        role: userData.role,
        hasPassword: !!userData.password,
        age: userData.age
      });

      setIsLoading(true);
      
      // 1. Sign up with Supabase Auth
      console.log('Step 1: Creating user in Auth...');
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role,
            age: userData.age
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      console.log('Auth response:', {
        user: authData?.user ? 'User received' : 'No user',
        session: authData?.session ? 'Session created' : 'No session',
        error: signUpError ? signUpError.message : 'No error'
      });

      if (signUpError) {
        console.error('Auth error:', signUpError);
        throw signUpError;
      }

      if (!authData.user) {
        throw new Error('No user returned from auth');
      }

      console.log('✅ User created in Auth. ID:', authData.user.id);

      // 2. Generate profile data
      const usernameBase = userData.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_');
      const username = `${usernameBase}_${Math.floor(1000 + Math.random() * 9000)}`.substring(0, 30);
      

      // 3. Create profile in database
      console.log('Step 2: Creating profile in database...');
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          username,
          full_name: userData.name,
          email: userData.email,
          role: userData.role,
          age: userData.age || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error(`Failed to create profile: ${profileError.message}`);
      }

      console.log('✅ Profile created successfully:', profileData);

      // 4. Update user state
      const userWithMetadata = {
        ...authData.user,
        user_metadata: {
          ...(authData.user.user_metadata || {}),
          name: userData.name,
          full_name: userData.name,
          role: userData.role
        }
      } as User;

      setUser(userWithMetadata);
      console.log('=== REGISTRATION COMPLETE ===');

      // 5. Redirect to dashboard
      navigate('/app/dashboard');

    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        setUser(data.user as User);
        navigate('/app/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const signInWithGitHub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('GitHub sign in error:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    signInWithGoogle,
    signInWithGitHub,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};