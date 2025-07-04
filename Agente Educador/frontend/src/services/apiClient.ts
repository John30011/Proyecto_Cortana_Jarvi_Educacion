import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_ERRORS, ApiResponse, RequestConfig } from '../config/api';

// Interfaz para el perfil del usuario    
interface UserProfile {
  id: string;  // UUID
  email: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  role: 'student' | 'teacher' | 'admin'; // Ajusta según tus roles definidos
  age_group?: string; // Ajusta el tipo según tu enum en la base de datos
  age?: number;
  created_at: string; // o Date si lo conviertes
  updated_at: string; // o Date si lo conviertes
  avatar_path?: string;
}



// Crear una instancia de Axios con configuración por defecto
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para añadir el token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas de error
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      const { status, data } = error.response;
      
      if (status === 401) {
        // No autorizado - limpiar el token y redirigir al login
        localStorage.removeItem('authToken');
        window.location.href = '/auth/login';
      }
      
      return Promise.reject({
        code: getErrorCode(status, data),
        message: getErrorMessage(error, data),
        details: (data as any)?.errors,
      });
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      return Promise.reject({
        code: API_ERRORS.NETWORK_ERROR,
        message: 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.',
      });
    } else {
      // Ocurrió un error al configurar la petición
      return Promise.reject({
        code: API_ERRORS.UNKNOWN_ERROR,
        message: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.',
      });
    }
  }
);

// Función para obtener el código de error
function getErrorCode(status: number, data: any): string {
  if (status === 401) return API_ERRORS.UNAUTHORIZED;
  if (status === 403) return API_ERRORS.FORBIDDEN;
  if (status === 404) return API_ERRORS.NOT_FOUND;
  if (status === 422) return API_ERRORS.VALIDATION_ERROR;
  if (status >= 500) return API_ERRORS.SERVER_ERROR;
  return (data as any)?.code || API_ERRORS.UNKNOWN_ERROR;
}

// Función para obtener el mensaje de error
function getErrorMessage(error: AxiosError, data: any): string {
  if (data?.message) return data.message;
  if (error.message) return error.message;
  return 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.';
}

// Función genérica para realizar peticiones HTTP
export const apiRequest = async <T = any>(
  method: 'get' | 'post' | 'put' | 'delete' | 'patch',
  url: string,
  data?: any,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> => {
  const { headers = {}, params, timeout, auth = true } = config;
  
  const requestConfig: AxiosRequestConfig = {
    method,
    url,
    data,
    params,
    timeout,
    headers: {
      ...(auth && { Authorization: `Bearer ${localStorage.getItem('authToken')}` }),
      ...headers,
    },
  };

  try {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient(requestConfig);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: {
        code: error.code || API_ERRORS.UNKNOWN_ERROR,
        message: error.message || 'Ocurrió un error inesperado',
        details: error.details,
      },
    };
  }
};

// Métodos HTTP preconfigurados
export const api = {
  get: <T = any>(url: string, config?: RequestConfig) => 
    apiRequest<T>('get', url, undefined, config),
  
  post: <T = any>(url: string, data?: any, config?: RequestConfig) => 
    apiRequest<T>('post', url, data, config),
  
  put: <T = any>(url: string, data?: any, config?: RequestConfig) => 
    apiRequest<T>('put', url, data, config),
  
  patch: <T = any>(url: string, data?: any, config?: RequestConfig) => 
    apiRequest<T>('patch', url, data, config),
  
  delete: <T = any>(url: string, config?: RequestConfig) => 
    apiRequest<T>('delete', url, undefined, config),
};

export default api;
