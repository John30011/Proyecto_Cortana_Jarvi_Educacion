import { useState } from 'react';
import axios from 'axios';

type UserRole = 'student' | 'teacher' | 'admin';

// Configuración de la API
const API_URL = 'http://localhost:3001';

// Interceptor para manejar errores de la API
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para mostrar logs de las peticiones
api.interceptors.request.use(
  (config) => {
    console.log('Enviando petición a:', config.url);
    return config;
  },
  (error) => {
    console.error('Error en la petición:', error);
    return Promise.reject(error);
  }
);

const RegisterTest = () => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<Array<{message: string; type: 'info' | 'success' | 'error' | 'warning'}>>([]);
  const [testUser, setTestUser] = useState({
    name: 'Usuario de Prueba',
    email: `test_${Math.random().toString(36).substring(2, 10)}@example.com`,
    password: 'Password123!',
    role: 'student' as UserRole,
    age: Math.floor(Math.random() * 30) + 10
  });

  const log = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    setLogs(prev => [
      { message: `[${new Date().toLocaleTimeString()}] ${message}`, type },
      ...prev
    ].slice(0, 50)); // Mantener solo los últimos 50 mensajes
  };

  const runTest = async () => {
    setLoading(true);
    setLogs([]);
    log('🚀 Iniciando prueba de registro...');

    try {
      // Datos del usuario a registrar
      const userData = {
        email: testUser.email,
        password: testUser.password,
        name: testUser.name,
        role: testUser.role,
        age: testUser.age
      };

      // 1. Registrar usuario a través del endpoint de registro
      log('🔑 Registrando usuario a través de la API...');
      
      const registerResponse = await api.post('/auth/register', userData);
      
      if (!registerResponse.data) {
        throw new Error('No se recibieron datos en la respuesta del registro');
      }

      log('✅ Usuario registrado exitosamente', 'success');
      log(JSON.stringify(registerResponse.data, null, 2));

      // 2. Intentar iniciar sesión automáticamente
      log('🔑 Intentando iniciar sesión automáticamente...');
      
      try {
        const loginResponse = await api.post('/auth/login', {
          email: testUser.email,
          password: testUser.password
        });

        if (loginResponse.data && loginResponse.data.access_token) {
          log('✅ Inicio de sesión exitoso', 'success');
          log(`🔑 Token de acceso: ${loginResponse.data.access_token.substring(0, 20)}...`);
        } else {
          log('⚠️ No se pudo iniciar sesión automáticamente', 'warning');
        }
      } catch (loginError: any) {
        log(`⚠️ No se pudo iniciar sesión automáticamente: ${loginError.response?.data?.detail || loginError.message}`, 'warning');
      }

      log('\n🎉 ¡Prueba completada con éxito!', 'success');
      log('📋 Resumen:', 'info');
      log(`- Email: ${testUser.email}`);
      log(`- Rol: ${testUser.role}`);
      log(`- Edad: ${testUser.age}`);
      
    } catch (error: any) {
      console.error('Error durante la prueba:', error);
      log(`❌ Error: ${error.message}`, 'error');
      if (error.details) log(`Detalles: ${error.details}`, 'error');
      if (error.hint) log(`Sugerencia: ${error.hint}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTestUser(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value
    }));
  };

  const generateRandomEmail = () => {
    const randomEmail = `test_${Math.random().toString(36).substring(2, 10)}@example.com`;
    setTestUser(prev => ({ ...prev, email: randomEmail }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Prueba de Registro Supabase</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Datos de Prueba</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              name="name"
              value={testUser.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="flex">
              <input
                type="email"
                name="email"
                value={testUser.email}
                onChange={handleInputChange}
                className="flex-1 p-2 border rounded-l"
              />
              <button
                onClick={generateRandomEmail}
                className="bg-gray-200 px-3 rounded-r text-sm"
                type="button"
              >
                🔄
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              value={testUser.password}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select
              name="role"
              value={testUser.role}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="student">Estudiante</option>
              <option value="teacher">Profesor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
            <input
              type="number"
              name="age"
              min="5"
              max="100"
              value={testUser.age}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={runTest}
            disabled={loading}
            className={`px-4 py-2 rounded text-white font-medium ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Ejecutando...' : 'Ejecutar Prueba'}
          </button>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Registro de Ejecución</h2>
          <button
            onClick={() => setLogs([])}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Limpiar
          </button>
        </div>
        
        <div className="bg-white rounded p-4 h-96 overflow-y-auto font-mono text-sm">
          {logs.length === 0 ? (
            <p className="text-gray-500 italic">Presiona 'Ejecutar Prueba' para comenzar...</p>
          ) : (
            logs.map((log, index) => (
              <div 
                key={index} 
                className={`mb-1 ${log.type === 'error' ? 'text-red-600' : 
                                log.type === 'success' ? 'text-green-600' : 
                                log.type === 'warning' ? 'text-yellow-600' : 'text-gray-800'}`}
              >
                {log.message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterTest;
