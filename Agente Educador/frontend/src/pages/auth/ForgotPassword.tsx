import { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  FormControl, 
  FormLabel, 
  Input, 
  VStack, 
  Heading, 
  Text, 
  useToast,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  Link as ChakraLink
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { Global } from '@emotion/react';

// Importación dinámica del componente FallingElements para evitar problemas de hidratación
const FallingElements = dynamic(
  () => import('@/components/effects/FallingElements').then((mod) => mod.default),
  { ssr: false }
);

// Componente de animación
const MotionBox = motion(Box);

// Variantes de animación
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10
    }
  }
};

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false });
  const toast = useToast();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.800');
  
  // Validaciones
  const errors = {
    email: !email.trim() 
      ? 'El correo electrónico es requerido' 
      : !/\S+@\S+\.\S+/.test(email) 
        ? 'Ingresa un correo electrónico válido' 
        : ''
  };

  const isFormValid = email.trim() !== '' && !errors.email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      setTouched({ email: true });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Aquí iría la lógica para enviar el correo de recuperación
      // Por ahora simulamos una petición
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Correo enviado',
        description: 'Hemos enviado un enlace de recuperación a tu correo electrónico.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
      
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      
      toast({
        title: 'Error',
        description: 'Ocurrió un error al enviar el correo. Por favor, inténtalo de nuevo.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="white" p={4} position="relative" overflow="hidden">
      {isClient && <FallingElements />}
      <Box
        position="relative"
        zIndex={10}
        bg="rgba(255, 255, 255, 0.95)"
        p={8}
        w="100%"
        maxW="md"
        borderRadius="lg"
        boxShadow="xl"
        borderWidth="1px"
        borderColor="gray.100"
      >
        <Global
          styles={`
            @import url('https://fonts.googleapis.com/css2?family=Muthiara&display=swap');
          `}
        />
        <MotionBox
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <MotionBox textAlign="center" variants={itemVariants} mb={8}>
            <Heading 
              as="h1" 
              size="xl" 
              fontWeight="bold"
              color="blue.500"
              mb={2}
              fontFamily="'Muthiara', cursive"
            >
              Recuperar Contraseña
            </Heading>
            <Text color={useColorModeValue('gray.600', 'gray.300')}>
              Ingresa tu correo electrónico para recibir un enlace de recuperación
            </Text>
          </MotionBox>

          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <MotionBox w="full" variants={itemVariants}>
                <FormControl isInvalid={touched.email && !!errors.email}>
                  <FormLabel fontWeight="medium" color={useColorModeValue('gray.700', 'gray.300')} mb={1}>
                    Correo electrónico
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FaEnvelope color="gray.300" />
                    </InputLeftElement>
                    <Input
                      type="email"
                      placeholder="tu@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setTouched({ ...touched, email: true })}
                      bg={useColorModeValue('white', 'gray.700')}
                      borderColor={useColorModeValue('gray.300', 'gray.600')}
                      _hover={{
                        borderColor: useColorModeValue('blue.400', 'blue.300'),
                      }}
                      _focus={{
                        borderColor: 'blue.500',
                        boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
                      }}
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
              </MotionBox>

              <MotionBox w="full" variants={itemVariants}>
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  w="full"
                  isLoading={isLoading}
                  loadingText="Enviando enlace..."
                  isDisabled={!isFormValid}
                >
                  Enviar enlace de recuperación
                </Button>
              </MotionBox>
            </VStack>
          </form>

          <MotionBox mt={6} textAlign="center" variants={itemVariants}>
            <ChakraLink
              as={RouterLink}
              to="/auth/login"
              color="blue.500"
              display="inline-flex"
              alignItems="center"
              _hover={{
                textDecoration: 'none',
                color: 'blue.600',
              }}
            >
              <FaArrowLeft style={{ marginRight: '8px' }} />
              Volver al inicio de sesión
            </ChakraLink>
          </MotionBox>
        </MotionBox>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
