import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/apiClient';
import { API_ERRORS } from '@/config/api';
import { logError } from '../utils/logger';

export type AgeGroup = '3-5' | '6-8' | '9-12';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  ageGroup?: AgeGroup;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
  confirmPassword?: string;
}

interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Verificar si hay una sesión activa al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          // Verificar si el token es válido
          const response = await api.get<{ user: User }>('/auth/me');
          if (response.success && response.data) {
            setUser(response.data.user);
          } else {
            // Token inválido o expirado
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
          }
        }
      } catch (error: any) {
        logError('Error al verificar autenticación', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async ({ email, password }: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
      
      if (response.success && response.data) {
        const { user, token, expiresIn } = response.data;
        
        // Almacenar token y datos del usuario
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Configurar tiempo de expiración de la sesión
        const expirationTime = new Date().getTime() + expiresIn * 1000;
        localStorage.setItem('tokenExpiration', expirationTime.toString());
        
        setUser(user);
        navigate('/app/dashboard');
      } else {
        throw new Error(response.error?.message || 'Error al iniciar sesión');
      }
    } catch (error: any) {
      logError('Login error', error);
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const register = useCallback(async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Eliminar confirmPassword si existe (no lo necesitamos en el backend)
      const { confirmPassword, ...registrationData } = userData;
      
      const response = await api.post<AuthResponse>('/auth/register', registrationData);
      
      if (response.success && response.data) {
        const { user, token, expiresIn } = response.data;
        
        // Almacenar token y datos del usuario
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Configurar tiempo de expiración de la sesión
        const expirationTime = new Date().getTime() + expiresIn * 1000;
        localStorage.setItem('tokenExpiration', expirationTime.toString());
        
        setUser(user);
        navigate('/app/dashboard');
      } else {
        throw new Error(response.error?.message || 'Error al registrar el usuario');
      }
    } catch (error: any) {
      logError('Registration error', error);
      const errorMessage = error.response?.data?.message || 'Error al registrar el usuario. Por favor, intenta de nuevo.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    // Limpiar almacenamiento local
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiration');
    
    // Limpiar caché de React Query
    queryClient.clear();
    
    // Restablecer el estado
    setUser(null);
    setError(null);
    
    // Redirigir al login
    navigate('/login');
  }, [navigate, queryClient]);

  // Verificar si la sesión está activa
  const isAuthenticated = !!user && !!localStorage.getItem('authToken');

  return {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    isLoading,
    error,
  };
};
