import { createClient } from '@supabase/supabase-js';

// Valores predeterminados (reemplázalos con tus propias credenciales)
const DEFAULT_SUPABASE_URL = 'https://zddstwkylfyqwwpmidyp.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkZHN0d2t5bGZ5cXd3cG1pZHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyODA1OTMsImV4cCI6MjA2Njg1NjU5M30.-O9Y68-zKf786vmnvqnhXy_4YpEGR5bFZR5Fc7FAQus';

// Usar las variables de entorno o los valores predeterminados
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

// Verificar que las credenciales estén presentes
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Falta la configuración de Supabase. Asegúrate de configurar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu archivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

console.log('Supabase configurado con URL:', supabaseUrl);
