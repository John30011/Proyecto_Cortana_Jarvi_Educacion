import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  VStack, 
  Heading, 
  Text, 
  useToast,
  Select,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
  Checkbox
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/database.types';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as UserRole,
    age: '',
    termsAccepted: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Validación del formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validación de nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    } else if (formData.name.length > 100) {
      newErrors.name = 'El nombre no puede tener más de 100 caracteres';
    }
    
    // Validación de email
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    } else if (formData.email.length > 255) {
      newErrors.email = 'El correo electrónico no puede tener más de 255 caracteres';
    }
    
    // Validación de contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos una letra mayúscula';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos un número';
    } else if (formData.password.length > 100) {
      newErrors.password = 'La contraseña no puede tener más de 100 caracteres';
    }
    
    // Validación de confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    // Validación de edad para estudiantes
    if (formData.role === 'student') {
      if (!formData.age) {
        newErrors.age = 'La edad es requerida para estudiantes';
      } else {
        const age = parseInt(formData.age, 10);
        if (isNaN(age) || age < 5 || age > 120) {
          newErrors.age = 'La edad debe estar entre 5 y 120 años';
        }
      }
    }
    
    // Validación de términos y condiciones
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'Debes aceptar los términos y condiciones';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    // Limpiar el error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Error de validación',
        description: 'Por favor, completa todos los campos requeridos correctamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Iniciando registro...', {
        email: formData.email,
        name: formData.name,
        role: formData.role,
        age: formData.role === 'student' ? parseInt(formData.age, 10) : undefined
      });
      
      await register({
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        role: formData.role,
        age: formData.role === 'student' ? parseInt(formData.age, 10) : undefined
      });
      
      // Mostrar mensaje de éxito
      toast({
        title: '¡Registro exitoso!',
        description: 'Tu cuenta ha sido creada correctamente. Redirigiendo...',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      
      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error: any) {
      console.error('Error durante el registro:', error);
      
      // Mapear errores comunes de Supabase a mensajes amigables
      let errorMessage = 'Ocurrió un error al crear la cuenta. Por favor, inténtalo de nuevo.';
      
      if (error.message.includes('already registered')) {
        errorMessage = 'Este correo electrónico ya está registrado. Por favor, inicia sesión o utiliza otro correo.';
      } else if (error.message.includes('password')) {
        errorMessage = 'La contraseña no cumple con los requisitos mínimos.';
      } else if (error.message.includes('email')) {
        errorMessage = 'El correo electrónico no es válido o ya está en uso.';
      }
      
      toast({
        title: 'Error en el registro',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
      <Box 
        w="100%" 
        maxW="md" 
        p={8} 
        borderWidth={1} 
        borderRadius="lg" 
        boxShadow="lg" 
        bg="white"
      >
        <VStack spacing={6} as="form" onSubmit={handleSubmit}>
          <VStack textAlign="center">
            <Heading as="h1" size="xl">Crear una cuenta</Heading>
            <Text color="gray.500">Comienza tu viaje educativo hoy mismo</Text>
          </VStack>

          {/* Botón de prueba */}
          <Button 
            colorScheme="green" 
            onClick={() => {
              setFormData({
                name: 'Usuario de Prueba',
                email: `test${Math.floor(Math.random() * 10000)}@example.com`,
                password: 'password123',
                confirmPassword: 'password123',
                role: 'student',
                age: '25',
                termsAccepted: true
              });
            }}
            isLoading={isLoading}
            loadingText="Registrando..."
            width="100%"
            size="lg"
            mb={4}
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            }}
            transition="all 0.2s"
          >
            🚀 PROBAR REGISTRO AUTOMÁTICO
          </Button>

          <Text textAlign="center" color="gray.500" w="full">
            ──────── o regístrate manualmente ────────
          </Text>

          <FormControl isRequired isInvalid={!!errors.name}>
            <FormLabel>Nombre completo</FormLabel>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Tu nombre completo"
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>
          
          <FormControl isRequired isInvalid={!!errors.email}>
            <FormLabel>Correo electrónico</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tucorreo@ejemplo.com"
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>
          
          <FormControl isRequired isInvalid={!!errors.password}>
            <FormLabel>Contraseña</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
              />
              <InputRightElement>
                <IconButton
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  variant="ghost"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>
          
          <FormControl isRequired isInvalid={!!errors.confirmPassword}>
            <FormLabel>Confirmar contraseña</FormLabel>
            <Input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Vuelve a escribir tu contraseña"
            />
            <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
          </FormControl>
          
          <FormControl isRequired>
            <FormLabel>Rol</FormLabel>
            <Select 
              name="role" 
              value={formData.role} 
              onChange={handleChange}
            >
              <option value="student">Estudiante</option>
              <option value="teacher">Profesor</option>
              <option value="admin">Administrador</option>
            </Select>
          </FormControl>
          
          {formData.role === 'student' && (
            <FormControl isRequired isInvalid={!!errors.age}>
              <FormLabel>Edad</FormLabel>
              <Input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Tu edad"
                min="5"
                max="120"
              />
              <FormErrorMessage>{errors.age}</FormErrorMessage>
            </FormControl>
          )}
          
          <FormControl isRequired isInvalid={!!errors.termsAccepted}>
            <Checkbox
              name="termsAccepted"
              isChecked={formData.termsAccepted}
              onChange={handleChange}
            >
              Acepto los términos y condiciones
            </Checkbox>
            <FormErrorMessage>{errors.termsAccepted}</FormErrorMessage>
          </FormControl>
          
          <Button 
            type="submit" 
            colorScheme="blue" 
            size="lg" 
            width="100%"
            isLoading={isLoading}
            loadingText="Creando cuenta..."
          >
            Crear cuenta
          </Button>

          <Text textAlign="center" mt={4}>
            ¿Ya tienes una cuenta?{' '}
            <Link to="/auth/login" style={{ color: '#3182ce', fontWeight: 'bold' }}>
              Inicia sesión
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default Register;
