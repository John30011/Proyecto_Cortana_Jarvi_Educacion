import { supabase } from './supabase';

/**
 * Prueba la conexión con Supabase
 * @returns Promise<{success: boolean, error?: string, data?: any}>
 */
export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Probando conexión con Supabase...');
    
    // 1. Verificar que las credenciales estén configuradas
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      throw new Error('❌ Faltan las variables de entorno de Supabase');
    }
    
    console.log('✅ Variables de entorno configuradas correctamente');
    
    // 2. Obtener la sesión actual
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.warn('⚠️ No hay sesión activa, pero la conexión parece funcionar');
    } else {
      console.log('✅ Sesión obtenida correctamente');
      console.log('   Usuario:', session.session?.user?.email || 'No autenticado');
    }
    
    // 3. Hacer una consulta simple a la tabla profiles
    console.log('🔍 Probando consulta a la tabla profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.warn(`⚠️ Error al consultar perfiles: ${profilesError.message}`);
    } else {
      console.log(`✅ Consulta a perfiles exitosa. ${profiles?.length || 0} perfiles encontrados`);
    }
    
    // 4. Probar el almacenamiento (si está configurado)
    try {
      console.log('🔍 Probando acceso al almacenamiento...');
      const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
      
      if (storageError) {
        console.warn(`⚠️ No se pudo acceder al almacenamiento: ${storageError.message}`);
      } else {
        console.log('✅ Almacenamiento accesible');
        console.log(`   Buckets disponibles: ${buckets?.length || 0}`);
      }
    } catch (storageTestError) {
      console.warn('⚠️ No se pudo probar el almacenamiento:', storageTestError);
    }
    
    return {
      success: true,
      message: '✅ Conexión con Supabase verificada correctamente',
      session: session.session,
      profilesCount: profiles?.length || 0,
      hasStorage: !profilesError
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('❌ Error al conectar con Supabase:', errorMessage);
    
    return {
      success: false,
      error: errorMessage,
      message: '❌ Error al verificar la conexión con Supabase'
    };
  }
};

// Si se ejecuta directamente desde la consola (opcional)
if (typeof window !== 'undefined' && window.location.search.includes('test-supabase')) {
  testSupabaseConnection().then(console.log).catch(console.error);
}
