import { useState, FormEvent, ChangeEvent, useRef, useEffect, lazy, Suspense } from 'react';
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
  Link as ChakraLink, 
  useToast,
  Alert,
  AlertIcon,
  FormErrorMessage,
  Stack,
  HStack,
  InputGroup,
  InputRightElement,
  IconButton,
  useDisclosure,
  Collapse,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// Importación dinámica corregida para React/Vite
const LetterRain = lazy(() => import('@/components/effects/LetterRain'));

import { ViewIcon, ViewOffIcon, ChevronDownIcon, ChevronUpIcon, AddIcon, CloseIcon } from '@chakra-ui/icons';
import { FaUser, FaEnvelope, FaLock, FaUserGraduate, FaChalkboardTeacher, FaIdCard, FaUserFriends } from 'react-icons/fa';
import { InputLeftElement } from '@chakra-ui/react';
import { UserRole } from '@/types/database.types';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: UserRole;
  age: string;
}

// Componente de animación
const MotionBox = motion(Box);
const MotionButton = motion(Button);

const Register = (): React.JSX.Element => {
  // Estados del formulario
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'student',
    age: ''
  });
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    age: false
  });
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen: showAdvanced, onToggle } = useDisclosure();

  // Validaciones
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string): boolean => {
    // Mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
  };

  const errors = {
    name: !formData.name.trim() ? 'El nombre es requerido' : '',
    email: !formData.email 
      ? 'El correo electrónico es requerido' 
      : !validateEmail(formData.email) 
        ? 'Ingresa un correo electrónico válido' 
        : '',
    password: !formData.password 
      ? 'La contraseña es requerida' 
      : !validatePassword(formData.password)
        ? 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número'
        : '',
    confirmPassword: formData.password !== formData.confirmPassword 
      ? 'Las contraseñas no coinciden' 
      : '',
    age: formData.userType === 'student' && (!formData.age || isNaN(Number(formData.age)))
      ? 'La edad es requerida y debe ser un número válido' 
      : formData.userType === 'student' && (Number(formData.age) < 5 || Number(formData.age) > 120)
        ? 'La edad debe estar entre 5 y 120 años'
        : ''
  };

  const isFormValid = 
    formData.name.trim() !== '' && 
    validateEmail(formData.email) && 
    validatePassword(formData.password) && 
    formData.password === formData.confirmPassword &&
    (formData.userType !== 'student' || 
      (formData.age && 
       !isNaN(Number(formData.age)) && 
       Number(formData.age) >= 5 && 
       Number(formData.age) <= 120));

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      // Si es el campo de edad, convertimos a string
      if (name === 'age') {
        return {
          ...prev,
          [name]: value // Guardamos como string para el input
        };
      }
      return {
        ...prev,
        [name]: value
      };
    });
    
    // Marcar el campo como tocado
    if (name in touched) {
      setTouched(prev => ({
        ...prev,
        [name]: true
      }));
    }
  };

  const handleUserTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      userType: value as UserRole,
      age: value !== 'student' ? '' : prev.age
    }));
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Formato no válido',
        description: 'Solo se permiten imágenes JPG, PNG, GIF o WebP',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Archivo muy grande',
        description: 'La imagen no debe superar los 5MB',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setAvatarFile(file);
    
    // Crear vista previa
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setAvatarFile(null);
    setAvatarPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isFormValid) {
      // Marcar todos los campos como tocados para mostrar errores
      setTouched({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
        age: formData.userType === 'student'
      });
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.userType,
        avatar: avatarFile || undefined,
        ...(formData.userType === 'student' && { age: Number(formData.age) })
      });

      toast({
        title: '¡Registro exitoso!',
        description: 'Tu cuenta ha sido creada correctamente.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Redirigir al dashboard después de un registro exitoso
      navigate('/app/dashboard');
    } catch (error) {
      console.error('Error en el registro:', error);
      setError(error instanceof Error ? error.message : 'Ocurrió un error al registrar la cuenta');
      
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Ocurrió un error al registrar la cuenta',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50" p={4} position="relative" overflow="hidden">
      {isClient && (
        <Suspense fallback={null}>
          <LetterRain />
        </Suspense>
      )}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        bg="white"
        p={8}
        w="100%"
        maxW="lg"
        borderRadius="lg"
        boxShadow="xl"
        position="relative"
        zIndex={1}
        backdropFilter="blur(2px)"
      >
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={4} align="stretch">
            <Box textAlign="center" mb={4}>
              <Heading 
                as="h1" 
                size="xl" 
                fontWeight="bold"
                color="blue.500"
                mb={1}
                fontFamily="'Muthiara', cursive"
              >
                Crear cuenta
              </Heading>
              <Text color="gray.600" fontSize="sm">
                Únete a nuestra plataforma
              </Text>
            </Box>

            {error && (
              <Alert status="error" borderRadius="md" variant="left-accent" mb={3} size="sm">
                <AlertIcon />
                {error}
              </Alert>
            )}

            <Box w="full">
              {/* Campos del formulario */}
              <MotionBox w="full" variants={itemVariants}>
                <FormControl isInvalid={touched.name && !!errors.name}>
                    <FormLabel fontSize="sm" color="gray.600" mb={1}>
                      Nombre completo
                    </FormLabel>
                    <InputGroup size="sm">
                      <InputLeftElement pointerEvents="none">
                        <FaUser color="gray.400" size="0.9em" />
                      </InputLeftElement>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={() => handleBlur('name')}
                        placeholder="Tu nombre completo"
                        size="sm"
                        pl={8}
                        h={9}
                      />
                    </InputGroup>
                    <FormErrorMessage fontSize="xs">{errors.name}</FormErrorMessage>
                  </FormControl>
                </MotionBox>

              <MotionBox w="full" variants={itemVariants}>
                <FormControl isInvalid={touched.email && !!errors.email}>
                  <FormLabel fontSize="sm" color="gray.600" mb={1}>
                    Correo electrónico
                  </FormLabel>
                  <InputGroup size="sm">
                    <InputLeftElement pointerEvents="none">
                      <FaEnvelope color="gray.400" size="0.9em" />
                    </InputLeftElement>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur('email')}
                      placeholder="tu@correo.com"
                      size="sm"
                      pl={8}
                      h={9}
                    />
                  </InputGroup>
                  <FormErrorMessage fontSize="xs">{errors.email}</FormErrorMessage>
                </FormControl>
              </MotionBox>

              <MotionBox w="full" variants={itemVariants}>
                <FormControl isInvalid={touched.password && !!errors.password}>
                  <FormLabel fontSize="sm" color="gray.600" mb={1}>
                    Contraseña
                  </FormLabel>
                  <InputGroup size="sm">
                    <InputLeftElement pointerEvents="none">
                      <FaLock color="gray.400" size="0.9em" />
                    </InputLeftElement>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={() => handleBlur('password')}
                      placeholder="••••••••"
                      size="sm"
                      pl={8}
                      pr={8}
                      h={9}
                    />
                    <InputRightElement width="2.5rem">
                      <IconButton
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        icon={showPassword ? <ViewOffIcon boxSize={3.5} /> : <ViewIcon boxSize={3.5} />}
                        variant="ghost"
                        size="xs"
                        h={5}
                        minW={5}
                        onClick={() => setShowPassword(!showPassword)}
                        _hover={{ bg: 'transparent' }}
                        _active={{ bg: 'transparent' }}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage fontSize="xs">{errors.password}</FormErrorMessage>
                </FormControl>
              </MotionBox>

              <MotionBox w="full" variants={itemVariants}>
                <FormControl isInvalid={touched.confirmPassword && !!errors.confirmPassword}>
                  <FormLabel fontSize="sm" color="gray.600" mb={1}>
                    Confirmar contraseña
                  </FormLabel>
                  <InputGroup size="sm">
                    <InputLeftElement pointerEvents="none">
                      <FaLock color="gray.400" size="0.9em" />
                    </InputLeftElement>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={() => handleBlur('confirmPassword')}
                      placeholder="••••••••"
                      size="sm"
                      pl={8}
                      pr={8}
                      h={9}
                    />
                    <InputRightElement width="2.5rem">
                      <IconButton
                        aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        icon={showConfirmPassword ? <ViewOffIcon boxSize={3.5} /> : <ViewIcon boxSize={3.5} />}
                        variant="ghost"
                        size="xs"
                        h={5}
                        minW={5}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        _hover={{ bg: 'transparent' }}
                        _active={{ bg: 'transparent' }}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage fontSize="xs">{errors.confirmPassword}</FormErrorMessage>
                </FormControl>
              </MotionBox>

              <MotionBox w="full" variants={itemVariants}>
                <FormControl>
                  <FormLabel fontSize="sm" color="gray.600" mb={1}>
                    Tipo de usuario
                  </FormLabel>
                  <Menu>
                    {({ isOpen }) => (
                      <>
                        <MenuButton
                          as={Button}
                          rightIcon={isOpen ? <ChevronUpIcon boxSize={4} /> : <ChevronDownIcon boxSize={4} />}
                          variant="outline"
                          w="full"
                          textAlign="left"
                          fontWeight="normal"
                          size="sm"
                          h={9}
                          fontSize="sm"
                          _hover={{ bg: 'gray.50' }}
                          _expanded={{ bg: 'gray.50' }}
                        >
                          {formData.userType === 'student' 
                            ? 'Estudiante' 
                            : formData.userType === 'teacher' 
                              ? 'Docente' 
                              : 'Padre/Madre'}
                        </MenuButton>
                        <MenuList zIndex={10} fontSize="sm">
                          <MenuItem
                            icon={<FaUserGraduate size="0.9em" />}
                            onClick={() => handleUserTypeChange('student')}
                            _hover={{ bg: 'gray.50' }}
                            _focus={{ bg: 'gray.50' }}
                            fontSize="sm"
                            py={1.5}
                          >
                            Estudiante
                          </MenuItem>
                          <MenuItem
                            icon={<FaChalkboardTeacher size="0.9em" />}
                            onClick={() => handleUserTypeChange('teacher')}
                            _hover={{ bg: 'gray.50' }}
                            _focus={{ bg: 'gray.50' }}
                            fontSize="sm"
                            py={1.5}
                          >
                            Docente
                          </MenuItem>
                          <MenuItem
                            icon={<FaUserFriends size="0.9em" />}
                            onClick={() => handleUserTypeChange('parent')}
                            _hover={{ bg: 'gray.50' }}
                            _focus={{ bg: 'gray.50' }}
                            fontSize="sm"
                            py={1.5}
                          >
                            Padre/Madre
                          </MenuItem>
                        </MenuList>
                      </>
                    )}
                  </Menu>
                </FormControl>
              </MotionBox>

              {formData.userType === 'student' && (
                <MotionBox w="full" variants={itemVariants}>
                  <FormControl isInvalid={touched.age && !!errors.age}>
                    <FormLabel fontSize="sm" color="gray.600" mb={1}>
                      Edad
                    </FormLabel>
                    <InputGroup size="sm">
                      <InputLeftElement pointerEvents="none">
                        <FaIdCard color="gray.400" size="0.9em" />
                      </InputLeftElement>
                      <Input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        onBlur={() => handleBlur('age')}
                        placeholder="Tu edad"
                        min="5"
                        max="120"
                        size="sm"
                        pl={8}
                        h={9}
                      />
                    </InputGroup>
                    <FormErrorMessage fontSize="xs">{errors.age}</FormErrorMessage>
                  </FormControl>
                </MotionBox>
              )}

              <MotionBox w="full" variants={itemVariants} mt={2}>
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="md"
                  w="full"
                  h={9}
                  isLoading={isLoading}
                  loadingText="Creando cuenta..."
                  isDisabled={!isFormValid}
                  fontSize="sm"
                  _hover={{
                    transform: 'translateY(-1px)',
                    boxShadow: 'sm',
                  }}
                  _active={{
                    transform: 'translateY(0)',
                  }}
                  transition="all 0.2s"
                >
                  Crear cuenta
                </Button>
              </MotionBox>

              <MotionBox w="full" variants={itemVariants} textAlign="center" pt={1}>
                <Text fontSize="xs" color="gray.500">
                  ¿Ya tienes una cuenta?{' '}
                  <ChakraLink 
                    as={RouterLink} 
                    to="/auth/login" 
                    color="blue.500" 
                    fontSize="xs"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    Inicia sesión
                  </ChakraLink>
                </Text>
              </MotionBox>
            </Box>
          </VStack>
        </form>
      </MotionBox>
    </Box>
    );
  };

export default Register;