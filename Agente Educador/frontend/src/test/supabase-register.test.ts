import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Faltan las variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Función para generar un email aleatorio
function generateRandomEmail() {
  const randomString = Math.random().toString(36).substring(2, 10);
  return `test_${randomString}@example.com`;
}

// Función para registrar un usuario de prueba
async function testUserRegistration() {
  const testUser = {
    name: 'Usuario de Prueba',
    email: generateRandomEmail(),
    password: 'Password123!',
    role: 'student',
    age: 25
  };

  console.log('🚀 Iniciando prueba de registro...');
  console.log('📝 Datos de prueba:', { ...testUser, password: '***' });

  try {
    console.log('🔑 Creando usuario en Supabase Auth...');
    
    // 1. Crear usuario en Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
      options: {
        data: {
          name: testUser.name,
          role: testUser.role,
          age: testUser.age
        }
      }
    });

    if (signUpError) {
      throw new Error(`Error al registrar usuario: ${signUpError.message}`);
    }

    if (!authData.user) {
      throw new Error('No se pudo crear el usuario. No se recibió información del usuario.');
    }

    console.log('✅ Usuario creado en Auth:', authData.user.id);

    // 2. Determinar grupo de edad
    let ageGroup = null;
    if (testUser.age) {
      if (testUser.age < 13) ageGroup = 'niño';
      else if (testUser.age < 18) ageGroup = 'adolescente';
      else ageGroup = 'adulto';
    }

    // 3. Crear perfil en la base de datos
    console.log('📝 Creando perfil en la base de datos...');
    
    const usernameBase = testUser.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const username = `${usernameBase}_${randomSuffix}`.substring(0, 30);

    const profileData = {
      id: authData.user.id,
      username: username,
      full_name: testUser.name,
      email: testUser.email,
      role: testUser.role,
      age: testUser.age,
      age_group: ageGroup,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();

    if (profileError) {
      throw new Error(`Error al crear el perfil: ${profileError.message}`);
    }

    console.log('✅ Perfil creado exitosamente:', profile);

    // 4. Iniciar sesión automáticamente
    console.log('🔑 Iniciando sesión...');
    const { data: { user, session }, error: signInError } = await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: testUser.password
    });

    if (signInError || !user) {
      console.warn('⚠️  No se pudo iniciar sesión automáticamente:', signInError?.message);
    } else {
      console.log('✅ Sesión iniciada correctamente');
      console.log('🔑 Token de sesión:', session?.access_token.substring(0, 20) + '...');
    }

    console.log('\n🎉 ¡Prueba completada con éxito!');
    console.log('📋 Resumen:');
    console.log('- Usuario ID:', user?.id);
    console.log('- Email:', testUser.email);
    console.log('- Rol:', testUser.role);
    
  } catch (error: any) {
    console.error('❌ Error durante la prueba:', error.message);
    if (error.details) console.error('Detalles:', error.details);
    if (error.hint) console.error('Sugerencia:', error.hint);
    process.exit(1);
  }
}

// Ejecutar la prueba
testUserRegistration();
