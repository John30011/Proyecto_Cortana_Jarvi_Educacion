import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  VStack, 
  Heading, 
  Text, 
  Link as ChakraLink, 
  useToast,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  IconButton,
  FormErrorMessage,
  useColorModeValue
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FaEnvelope, FaLock } from 'react-icons/fa';

// Importación dinámica para evitar problemas de hidratación
const ShapeRain = dynamic(
  () => import('@/components/effects/ShapeRain').then((mod) => mod.default),
  { ssr: false }
);
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface FormData {
  email: string;
  password: string;
}

interface TouchedFields {
  email: boolean;
  password: boolean;
}

const Login = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState<TouchedFields>({
    email: false,
    password: false
  });
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Colores y estilos
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardShadow = useColorModeValue('sm', 'dark-lg');
  const headingColor = useColorModeValue('blue.600', 'blue.400');
  
  // Validaciones
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const errors = {
    email: !formData.email 
      ? 'El correo electrónico es requerido' 
      : !validateEmail(formData.email) 
        ? 'Ingresa un correo electrónico válido' 
        : '',
    password: !formData.password 
      ? 'La contraseña es requerida' 
      : ''
  };
  
  const isFormValid = 
    formData.email.trim() !== '' && 
    validateEmail(formData.email) && 
    formData.password.trim() !== '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Marcar el campo como tocado
    if (name in touched) {
      setTouched(prev => ({
        ...prev,
        [name]: true
      }));
    }
  };
  
  const handleBlur = (field: keyof TouchedFields) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados para mostrar errores
    setTouched({
      email: true,
      password: true
    });
    
    if (!isFormValid) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
      
      toast({
        title: '¡Bienvenido!',
        description: 'Has iniciado sesión correctamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      
      navigate('/app/dashboard');
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      
      let errorMessage = 'Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.';
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Correo electrónico o contraseña incorrectos.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Por favor, verifica tu correo electrónico antes de iniciar sesión.';
      }
      
      toast({
        title: 'Error al iniciar sesión',
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
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50" p={4} position="relative" overflow="hidden">
      {isClient && <ShapeRain />}
      <Box
        position="relative"
        zIndex={1}
        bg="white"
        p={8}
        w="100%"
        maxW="md"
        borderRadius="lg"
        boxShadow="xl"
        backdropFilter="blur(2px)"
      >
        <form onSubmit={handleSubmit}>
          <VStack spacing={6}>
            <Box textAlign="center">
              <Heading 
                as="h1" 
                size="xl" 
                fontWeight="bold"
                color="blue.500"
                mb={2}
                fontFamily="'Muthiara', cursive"
              >
                Iniciar Sesión
              </Heading>
              <Text color={useColorModeValue('gray.600', 'gray.300')}>
                Ingresa tus credenciales para acceder a tu cuenta
              </Text>
            </Box>

            <FormControl isInvalid={touched.email && !!errors.email}>
              <FormLabel>Correo electrónico</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FaEnvelope color="gray.300" />
                </InputLeftElement>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  placeholder="tu@correo.com"
                  autoComplete="email"
                />
              </InputGroup>
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={touched.password && !!errors.password}>
              <FormLabel>Contraseña</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FaLock color="gray.300" />
                </InputLeftElement>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  pr="3rem"
                />
                <InputRightElement width="3rem">
                  <IconButton
                    h="1.75rem"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    variant="ghost"
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              w="full"
              mt={2}
              isLoading={isLoading}
              loadingText="Iniciando sesión..."
              isDisabled={!isFormValid}
              color="white"
              mb={2}
              fontFamily="'Muthiara', cursive"
            >
              Iniciar Sesión
            </Button>
          </VStack>
        </form>

        <Box mt={6} textAlign="center">
          <ChakraLink
            as={RouterLink}
            to="/auth/forgot-password"
            fontSize="sm"
            color="blue.500"
            _hover={{ textDecoration: 'underline' }}
          >
            ¿Olvidaste tu contraseña?
          </ChakraLink>
          <Text mt={2}>
            ¿No tienes una cuenta?{' '}
            <ChakraLink 
              as={RouterLink} 
              to="/auth/register" 
              color="blue.500"
              _hover={{ textDecoration: 'underline' }}
            >
              Regístrate
            </ChakraLink>
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
