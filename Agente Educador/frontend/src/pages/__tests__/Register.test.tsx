import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Register from '../Register';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock de Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn((event, callback) => {
        // Simular un usuario autenticado después del registro
        if (event === 'SIGNED_IN') {
          callback({
            event: 'SIGNED_IN',
            session: {
              user: {
                id: 'test-user-id',
                email: 'test@example.com',
                user_metadata: {
                  name: 'Test User'
                }
              },
              expires_at: 3600
            }
          });
        }
        return { data: { subscription: { unsubscribe: jest.fn() } } };
      }),
    },
  },
}));

// Mock del hook useAuth
const mockRegister = jest.fn().mockResolvedValue({ error: null });

jest.mock('@/contexts/AuthContext', () => ({
  ...jest.requireActual('@/contexts/AuthContext'),
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: jest.fn(),
    register: mockRegister,
    logout: jest.fn(),
    signInWithGoogle: jest.fn(),
    signInWithGitHub: jest.fn(),
    error: null,
  }),
}));

describe('Register Component', () => {
  beforeEach(() => {
    // Limpiar cualquier mock antes de cada prueba
    mockRegister.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <ChakraProvider>
        <MemoryRouter>
          <AuthProvider>
            <Register />
          </AuthProvider>
        </MemoryRouter>
      </ChakraProvider>
    );
  };

  it('renders the registration form', () => {
    renderComponent();
    
    expect(screen.getByText('Crear cuenta')).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
    expect(screen.getByText(/¿ya tienes una cuenta?/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderComponent();
    
    const submitButton = screen.getByRole('button', { name: /registrarse/i });
    fireEvent.click(submitButton);
    
    // Verificar mensajes de error para campos requeridos
    await waitFor(() => {
      // Verificar que los mensajes de error estén presentes
      const errorMessages = [
        screen.getByText('El nombre es requerido'),
        screen.getByText('El correo es requerido'),
        screen.getByText('La contraseña es requerida')
      ];
      
      errorMessages.forEach(message => {
        expect(message).toBeInTheDocument();
      });
    });
    
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('validates email format', async () => {
    renderComponent();
    
    // Rellenar el formulario con un correo electrónico inválido
    fireEvent.change(screen.getByLabelText(/nombre completo/i), { 
      target: { value: 'Juan Pérez' } 
    });
    
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    // Establecer contraseñas válidas
    const passwordInput = screen.getByTestId('password-input');
    const confirmPasswordInput = screen.getByTestId('confirm-password-input');
    
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
    
    const submitButton = screen.getByRole('button', { name: /registrarse/i });
    fireEvent.click(submitButton);
    
    // Verificar que se muestra el mensaje de error
    const errorMessage = await screen.findByTestId('error-message');
    expect(errorMessage).toHaveTextContent('Ingresa un correo electrónico válido');
    
    // Verificar que no se llamó a la función de registro
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('validates password match', async () => {
    renderComponent();
    
    // Rellenar el formulario con contraseñas que no coinciden
    fireEvent.change(screen.getByLabelText(/nombre completo/i), { 
      target: { value: 'Juan Pérez' } 
    });
    
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { 
      target: { value: 'test@example.com' } 
    });
    
    fireEvent.change(screen.getByTestId('password-input'), { 
      target: { value: 'Password123!' } 
    });
    
    fireEvent.change(screen.getByTestId('confirm-password-input'), { 
      target: { value: 'Different123!' } 
    });
    
    const submitButton = screen.getByRole('button', { name: /registrarse/i });
    fireEvent.click(submitButton);
    
    // Verificar que se muestra el mensaje de error
    const errorMessage = await screen.findByText('Las contraseñas no coinciden');
    expect(errorMessage).toBeInTheDocument();
    
    // Verificar que no se llamó a la función de registro
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('submits the form with valid data', async () => {
    mockRegister.mockResolvedValueOnce(undefined);
    
    renderComponent();
    
    // Rellenar el formulario con datos válidos
    fireEvent.change(screen.getByLabelText(/nombre completo/i), { 
      target: { value: 'Juan Pérez' } 
    });
    
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { 
      target: { value: 'test@example.com' } 
    });
    
    const passwordInput = screen.getByTestId('password-input');
    const confirmPasswordInput = screen.getByTestId('confirm-password-input');
    
    fireEvent.change(passwordInput, { target: { value: 'SecurePassword123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'SecurePassword123!' } });
    
    const submitButton = screen.getByRole('button', { name: /registrarse/i });
    fireEvent.click(submitButton);
    
    // Verificar que se llamó a la función de registro con los datos correctos
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'Juan Pérez',
        email: 'test@example.com',
        password: 'SecurePassword123!'
      });
    });
  });

  it('shows loading state during form submission', async () => {
    // Simular una promesa que no se resuelve inmediatamente
    let resolvePromise: (value?: unknown) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    
    mockRegister.mockImplementation(() => promise as Promise<void>);
    
    renderComponent();
    
    // Rellenar el formulario con datos válidos
    fireEvent.change(screen.getByLabelText(/nombre completo/i), { 
      target: { value: 'Juan Pérez' } 
    });
    
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { 
      target: { value: 'test@example.com' } 
    });
    
    const passwordInput = screen.getByTestId('password-input');
    const confirmPasswordInput = screen.getByTestId('confirm-password-input');
    
    fireEvent.change(passwordInput, { target: { value: 'SecurePassword123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'SecurePassword123!' } });
    
    const submitButton = screen.getByRole('button', { name: /registrarse/i });
    fireEvent.click(submitButton);
    
    // Verificar que el botón muestra el estado de carga
    await waitFor(() => {
      expect(submitButton).toHaveTextContent('Creando cuenta...');
      expect(submitButton).toBeDisabled();
    });
    
    // Resolver la promesa
    resolvePromise!();
    
    // Verificar que el botón vuelve a su estado normal
    await waitFor(() => {
      expect(submitButton).not.toHaveTextContent('Creando cuenta...');
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('shows error message on registration failure', async () => {
    const toastMessage = 'No se pudo completar el registro. Por favor, inténtalo de nuevo.';
    mockRegister.mockRejectedValueOnce(new Error('Error al registrar la cuenta'));
    
    // Espiar console.error para evitar que muestre errores en la consola de pruebas
    const originalError = console.error;
    console.error = jest.fn();
    
    renderComponent();
    
    // Rellenar el formulario con datos válidos
    fireEvent.change(screen.getByLabelText(/nombre completo/i), { 
      target: { value: 'Juan Pérez' } 
    });
    
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { 
      target: { value: 'test@example.com' } 
    });
    
    const passwordInput = screen.getByTestId('password-input');
    const confirmPasswordInput = screen.getByTestId('confirm-password-input');
    
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
    
    const submitButton = screen.getByRole('button', { name: /registrarse/i });
    fireEvent.click(submitButton);
    
    // Verificar que se muestra el mensaje de error en el toast
    const toastError = await screen.findByRole('alert');
    expect(toastError).toHaveTextContent(toastMessage);
    
    // Restaurar console.error
    console.error = originalError;
  });
});
