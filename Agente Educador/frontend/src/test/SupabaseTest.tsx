import { useState } from 'react';
import { Button, VStack, Text, Box, useToast, Input, FormControl, FormLabel, Code, Textarea, HStack, Badge } from '@chakra-ui/react';
import { supabase } from '@/utils/supabase';

type UserProfile = {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: string;
  created_at: string;
};

export default function SupabaseTest() {
  const [logs, setLogs] = useState<string[]>(['✅ Aplicación iniciada']);
  const [isLoading, setIsLoading] = useState(false);
  const [testEmail, setTestEmail] = useState(`test-${Math.random().toString(36).substring(2, 8)}@example.com`);
  const [testPassword] = useState('Test123456!');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const toast = useToast();

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(message);
  };

  const testConnection = async () => {
    try {
      setIsLoading(true);
      addLog('🔌 Probando conexión con Supabase...');
      
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      addLog(`✅ Conexión exitosa. Sesión: ${data.session ? 'Activa' : 'Inactiva'}`);
      
      // Verificar perfiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(3);
        
      if (profilesError) throw profilesError;
      addLog(`📋 ${profiles?.length || 0} perfiles encontrados`);
      
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testRegister = async () => {
    try {
      setIsLoading(true);
      setUser(null);
      setProfile(null);
      addLog('\n🔄 Iniciando prueba de registro...');
      
      const email = testEmail || `test-${Math.random().toString(36).substring(2, 8)}@example.com`;
      const fullName = `Usuario de Prueba ${Date.now().toString().slice(-4)}`;
      
      addLog(`📧 Registrando: ${email}`);
      
      // 1. Registrar usuario
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: testPassword,
        options: {
          data: {
            full_name: fullName,
            username: email.split('@')[0],
            role: 'student'
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('No se pudo crear el usuario');
      
      setUser(authData.user);
      addLog('✅ Usuario registrado en autenticación');
      addLog(`🆔 User ID: ${authData.user.id.substring(0, 8)}...`);
      
      // 2. Verificar perfil (con reintentos)
      let profileData = null;
      let attempts = 0;
      const maxAttempts = 5;
      
      while (attempts < maxAttempts && !profileData) {
        attempts++;
        addLog(`🔄 Verificando perfil (intento ${attempts}/${maxAttempts})...`);
        
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle();
          
        if (profileError) throw profileError;
        if (data) {
          profileData = data;
          setProfile(data);
          break;
        }
        
        // Esperar antes de reintentar
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      if (profileData) {
        addLog('✅ Perfil verificado en la base de datos');
        addLog(`👤 Nombre: ${profileData.full_name}`);
        addLog(`🎯 Rol: ${profileData.role}`);
      } else {
        addLog('⚠️ No se pudo verificar el perfil automáticamente');
        await createProfileManually(authData.user.id, email, fullName);
      }
      
      // Mostrar credenciales
      addLog('\n🔑 Credenciales de prueba:');
      addLog(`   Email: ${email}`);
      addLog(`   Contraseña: ${testPassword}`);
      
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createProfileManually = async (userId: string, email: string, fullName: string) => {
    try {
      addLog('\n🛠️ Intentando crear perfil manualmente...');
      
      // Usar el cliente de servicio con la clave de servicio
      const serviceClient = supabase;
      
      const { data, error } = await serviceClient
        .from('profiles')
        .upsert({
          id: userId,
          email: email,
          username: email.split('@')[0],
          full_name: fullName,
          role: 'student'
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setProfile(data);
      addLog('✅ Perfil creado manualmente con éxito');
      return data;
    } catch (error: any) {
      addLog(`❌ Error al crear perfil manualmente: ${error.message}`);
      throw error;
    }
  };

  const clearLogs = () => {
    setLogs(['✅ Registros limpiados']);
  };

  return (
    <Box p={6} maxW="3xl" mx="auto" mt={8}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={2}>Prueba de Supabase</Text>
          <Text color="gray.600">Verifica la conexión y el registro de usuarios</Text>
        </Box>
        
        <Box>
          <Text fontWeight="bold" mb={2}>Configuración actual:</Text>
          <Box bg="gray.50" p={3} borderRadius="md" fontSize="sm" mb={4}>
            <Text>URL: <Code>{import.meta.env.VITE_SUPABASE_URL || 'No configurada'}</Code></Text>
            <Text>Clave: <Code>{import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configurada' : 'No configurada'}</Code></Text>
          </Box>
        </Box>
        
        <HStack spacing={4}>
          <Button 
            colorScheme="blue" 
            onClick={testConnection}
            isLoading={isLoading}
            loadingText="Probando conexión..."
          >
            Probar conexión
          </Button>
          
          <Button 
            colorScheme="red" 
            onClick={clearLogs}
            variant="outline"
          >
            Limpiar registros
          </Button>
        </HStack>
        
        <Box>
          <FormControl mb={4}>
            <FormLabel>Email de prueba</FormLabel>
            <Input
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </FormControl>
          
          <Button 
            colorScheme="green" 
            onClick={testRegister}
            isLoading={isLoading}
            loadingText="Registrando..."
            width="100%"
            size="lg"
          >
            Probar Registro
          </Button>
        </Box>
        
        {(user || profile) && (
          <Box 
            p={4} 
            borderWidth={1} 
            borderRadius="md" 
            borderColor="blue.100" 
            bg="blue.50"
          >
            <Text fontWeight="bold" mb={2}>Información del Usuario:</Text>
            {user && (
              <Box mb={3}>
                <Text fontSize="sm" color="gray.600">ID: <Code>{user.id.substring(0, 8)}...</Code></Text>
                <Text fontSize="sm" color="gray.600">Email: <Code>{user.email}</Code></Text>
                <Text fontSize="sm" color="gray.600">Email confirmado: 
                  <Badge ml={2} colorScheme={user.email_confirmed_at ? 'green' : 'orange'}>
                    {user.email_confirmed_at ? 'Sí' : 'No'}
                  </Badge>
                </Text>
              </Box>
            )}
            {profile && (
              <Box>
                <Text fontSize="sm" color="gray.600">Perfil creado: <Code>{new Date(profile.created_at).toLocaleString()}</Code></Text>
                <Text fontSize="sm" color="gray.600">Nombre: <Code>{profile.full_name}</Code></Text>
                <Text fontSize="sm" color="gray.600">Rol: 
                  <Badge 
                    ml={2} 
                    colorScheme={
                      profile.role === 'admin' ? 'red' : 
                      profile.role === 'teacher' ? 'purple' : 'blue'
                    }
                  >
                    {profile.role}
                  </Badge>
                </Text>
              </Box>
            )}
          </Box>
        )}
        
        <Box>
          <HStack justify="space-between" mb={2}>
            <Text fontWeight="bold">Registro de actividad:</Text>
            <Button 
              size="xs" 
              onClick={() => setLogs(prev => [...prev])}
              variant="ghost"
            >
              Actualizar
            </Button>
          </HStack>
          <Box 
            bg="black" 
            color="white" 
            p={4} 
            borderRadius="md" 
            fontFamily="monospace" 
            fontSize="sm"
            height="300px"
            overflowY="auto"
          >
            {logs.length === 0 ? (
              <Text color="gray.400">No hay registros</Text>
            ) : (
              logs.map((line, index) => (
                <Text key={index} mb={1} whiteSpace="pre-wrap" fontSize="xs">{line}</Text>
              ))
            )}
          </Box>
        </Box>
      </VStack>
    </Box>
  );
}