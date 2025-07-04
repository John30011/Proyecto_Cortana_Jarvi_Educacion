export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'student' | 'teacher' | 'admin' | 'parent';
export type AgeGroup = '3-5' | '6-8' | '9-12' | '13-15' | '16-18' | 'adult';
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface Database {
  public: {
    Tables: {
      // Tabla de perfiles de usuario
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          email: string | null;
          role: UserRole;
          age_group: AgeGroup | null;
          created_at: string;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          role?: UserRole;
          age_group?: AgeGroup | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          role?: UserRole;
          age_group?: AgeGroup | null;
          created_at?: string;
        };
      };

      // Tabla de sesiones de chat
      chat_sessions: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          module: string;
          age_group: AgeGroup;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          module: string;
          age_group: AgeGroup;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          module?: string;
          age_group?: AgeGroup;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Tabla de mensajes de chat
      chat_messages: {
        Row: {
          id: string;
          session_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          role?: 'user' | 'assistant' | 'system';
          content?: string;
          metadata?: Json | null;
          created_at?: string;
        };
      };

      // Tabla de módulos de aprendizaje
      learning_modules: {
        Row: {
          id: string;
          name: string;
          description: string;
          subject: string;
          age_group: AgeGroup;
          difficulty_level: DifficultyLevel;
          content: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          subject: string;
          age_group: AgeGroup;
          difficulty_level?: DifficultyLevel;
          content: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          subject?: string;
          age_group?: AgeGroup;
          difficulty_level?: DifficultyLevel;
          content?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Tabla de progreso del usuario
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          module_id: string;
          completed_lessons: string[];
          score: number;
          last_accessed: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          module_id: string;
          completed_lessons?: string[];
          score?: number;
          last_accessed?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          module_id?: string;
          completed_lessons?: string[];
          score?: number;
          last_accessed?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    
    Views: {
      [_ in never]: never;
    };
    
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
