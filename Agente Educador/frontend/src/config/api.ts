// Configuración de la API
export const API_CONFIG = {
  // En desarrollo, usa la URL del servidor local
  // En producción, usa la URL del servidor real
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  
  // Tiempo máximo de espera para las peticiones (en milisegundos)
  TIMEOUT: 10000,
  
  // Headers por defecto
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;

// Tipos de errores de la API
export enum API_ERRORS {
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// Tipos de respuestas de la API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

// Interfaz para errores de validación
export interface ValidationError {
  [key: string]: string[];
}

// Interfaz para la configuración de peticiones
export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  auth?: boolean;
}
