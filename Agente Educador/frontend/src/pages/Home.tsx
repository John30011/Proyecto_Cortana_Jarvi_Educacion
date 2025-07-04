import { Box, Button, Container, Flex, Heading, Text, VStack, SimpleGrid, Badge, useColorModeValue, Image, AspectRatio, HStack, Stack } from '@chakra-ui/react';
import { Global, keyframes } from '@emotion/react';
import { FaRobot, FaLightbulb, FaMagic, FaPuzzlePiece, FaArrowRight, FaStar } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';

// Datos de características
const features = [
  {
    icon: <FaRobot size={48} />,
    title: 'Aprendizaje Inteligente',
    description: 'Cortana y Jarvis te guían en tu aprendizaje',
    color: 'blue.500'
  },
  {
    icon: <FaLightbulb size={48} />,
    title: 'Desarrollo Cognitivo',
    description: 'Ejercicios que estimulan tu cerebro',
    color: 'teal.500'
  },
  {
    icon: <FaMagic size={48} />,
    title: 'Aprendizaje Mágico',
    description: 'Contenido sorprendente y divertido',
    color: 'purple.500'
  },
  {
    icon: <FaPuzzlePiece size={48} />,
    title: 'Resolución de Problemas',
    description: 'Desafíos que te harán pensar',
    color: 'orange.500'
  }
];

// Datos de cursos de ejemplo
const courses = [
  {
    id: 1,
    title: 'Matemáticas Básicas',
    description: 'Aprende los fundamentos de las matemáticas de manera interactiva',
    level: 'Principiante',
    duration: '4 semanas',
    image: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    rating: 4.8,
    students: 1245
  },
  {
    id: 2,
    title: 'Programación en Python',
    description: 'Domina los conceptos básicos de programación con Python',
    level: 'Intermedio',
    duration: '6 semanas',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    rating: 4.9,
    students: 2531
  },
  {
    id: 3,
    title: 'Inteligencia Artificial',
    description: 'Introducción a los conceptos fundamentales de IA',
    level: 'Avanzado',
    duration: '8 semanas',
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.7,
    students: 1897
  }
];

// Componente principal
const Home = () => {
  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const accentColor = 'blue.500';
  const cardBg = useColorModeValue('white', 'gray.800');
  const headerBg = useColorModeValue('white', 'gray.800');
  const buttonBg = useColorModeValue('white', 'gray.700');

  // Definir la animación del título
  const gradient = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  `;

  return (
    <Box bg={bgColor} minH="100vh">
      <Global
        styles={`
          @import url('https://fonts.googleapis.com/css2?family=Muthiara&display=swap');
          
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      />
        {/* Header con botones de autenticación */}
        <Box as="header" position="fixed" top={0} left={0} right={0} zIndex={1000} bg={headerBg} boxShadow="sm" py={4}>
          <Container maxW="7xl" px={4}>
            <Flex justify="space-between" align="center">
              <Box 
                fontSize="2xl" 
                fontWeight="bold" 
                color={accentColor}
                fontFamily="'Muthiara', cursive"
                position="relative"
                _before={{
                  content: '""',
                  position: 'absolute',
                  bottom: '-5px',
                  left: 0,
                  width: '100%',
                  height: '3px',
                  bgGradient: 'linear(to-r, blue.500, teal.400)',
                  transform: 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.3s ease-in-out',
                }}
                _hover={{
                  _before: {
                    transform: 'scaleX(1)',
                  },
                }}
              >
                Una nueva diversión
              </Box>
            <HStack spacing={4}>
              <Button 
                as={RouterLink} 
                to="/auth/login" 
                variant="outline" 
                colorScheme="blue"
                bg={buttonBg}
                _hover={{
                  bg: useColorModeValue('gray.50', 'gray.600'),
                  transform: 'translateY(-2px)'
                }}
              >
                Iniciar Sesión
              </Button>
              <Button 
                as={RouterLink} 
                to="/auth/register" 
                colorScheme="blue"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(49, 130, 206, 0.3)'
                }}
              >
                Registrarse
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>
      {/* Hero Section */}
      <Container maxW="7xl" pt={24} pb={16} px={4} mt={16}>
        <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between" gap={8} mb={16}>
          <Box flex="1" maxW={{ base: '100%', md: '50%' }}>
            <Badge colorScheme="blue" px={3} py={1} borderRadius="full" mb={4}>
              ¡Nuevo!
            </Badge>
            <Heading as="h1" size="3xl" mb={6} color={textColor} lineHeight="1.2">
              Aprende de forma divertida con{' '}
              <Box as="span" color={accentColor} display="inline">
                Cortana y Jarvis
              </Box>
            </Heading>
            <Text fontSize="xl" color="gray.600" mb={8}>
              Descubre un nuevo mundo de aprendizaje donde la tecnología y la diversión se unen para ayudarte a crecer.
            </Text>
            <Flex gap={4} flexWrap="wrap">
              <Button
                as={RouterLink}
                to="/cursos"
                colorScheme="blue"
                size="lg"
                rightIcon={<FaArrowRight />}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              >
                Explorar Cursos
              </Button>
              <Button
                as="a"
                href="#caracteristicas"
                variant="outline"
                size="lg"
                colorScheme="blue"
              >
                Saber más
              </Button>
            </Flex>
          </Box>
          <Box flex="1" maxW={{ base: '100%', md: '45%' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Box
                borderRadius="xl"
                overflow="hidden"
                boxShadow="xl"
                width="100%"
              >
                <AspectRatio ratio={16/9}>
                  <iframe
                    src="https://www.youtube.com/embed/nLeCPLdeGzs?autoplay=1&mute=1&loop=1&playlist=nLeCPLdeGzs"
                    title="Presentación de Cortana y Jarvis"
                    allowFullScreen
                    style={{ border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </AspectRatio>
              </Box>
            </motion.div>
          </Box>
        </Flex>

        {/* Características Principales */}
        <Box id="caracteristicas" py={16}>
          <VStack spacing={4} textAlign="center" mb={12}>
            <Text color={accentColor} fontWeight="bold" fontSize="xl">
              ¿POR QUÉ ELEGIRNOS?
            </Text>
            <Heading size="2xl" mb={4}>
              Una experiencia de aprendizaje única
            </Heading>
            <Text color="gray.600" maxW="2xl">
              Combinamos inteligencia artificial con metodologías educativas probadas para ofrecerte la mejor experiencia de aprendizaje.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <VStack
                  p={6}
                  bg={cardBg}
                  borderRadius="xl"
                  boxShadow="md"
                  align="center"
                  spacing={4}
                  height="100%"
                  borderWidth="1px"
                  borderColor="gray.100"
                  _hover={{
                    boxShadow: 'lg',
                    borderColor: 'blue.100'
                  }}
                  textAlign="center"
                >
                  <Box p={3} bg="blue.50" borderRadius="lg" color={feature.color}>
                    {feature.icon}
                  </Box>
                  <Heading as="h3" size="md" color={textColor}>
                    {feature.title}
                  </Heading>
                  <Text color="gray.600">{feature.description}</Text>
                </VStack>
              </motion.div>
            ))}
          </SimpleGrid>
        </Box>

        {/* Sección de Video */}
        <Box py={16} id="video-demo" bg={useColorModeValue('gray.50', 'gray.800')}>
          <Container maxW="7xl">
            <VStack spacing={4} textAlign="center" mb={12}>
              <Badge colorScheme="blue" px={3} py={1} borderRadius="full">
                Video Demo
              </Badge>
              <Heading as="h2" size="xl">
                Conoce nuestra plataforma
              </Heading>
              <Text color="gray.600" maxW="700px">
                Mira cómo puedes mejorar tu aprendizaje con nuestra plataforma impulsada por IA.
              </Text>
            </VStack>

            <Box
              borderRadius="xl"
              overflow="hidden"
              boxShadow="xl"
              maxW="1000px"
              mx="auto"
              bg="black"
            >
              <AspectRatio ratio={16/9}>
                <iframe
                  src="https://www.youtube.com/embed/B2jwFh8445k?autoplay=1&mute=1&loop=1&playlist=B2jwFh8445k"
                  title="Demo de la plataforma"
                  allowFullScreen
                  style={{ border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </AspectRatio>
            </Box>
          </Container>
        </Box>

        {/* Sección de Cursos Populares */}
        <Box py={16} id="cursos">
          <Container maxW="7xl">
            <VStack spacing={4} textAlign="center" mb={12}>
              <Badge colorScheme="blue" px={3} py={1} borderRadius="full">
                Cursos
              </Badge>
              <Heading as="h2" size="xl">
                Nuestros Cursos Destacados
              </Heading>
              <Text color="gray.600" maxW="700px">
                Descubre nuestros cursos más populares y comienza tu viaje de aprendizaje hoy mismo.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {courses.map((course) => (
                <motion.div
                  key={course.id}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    borderWidth="1px"
                    borderRadius="xl"
                    overflow="hidden"
                    bg={cardBg}
                    boxShadow="md"
                    _hover={{
                      boxShadow: 'lg',
                      borderColor: 'blue.100',
                    }}
                    h="100%"
                    display="flex"
                    flexDirection="column"
                  >
                    <Box position="relative" h="200px" overflow="hidden">
                      <Image
                        src={course.image}
                        alt={course.title}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                        transition="transform 0.3s"
                        _hover={{
                          transform: 'scale(1.05)'
                        }}
                      />
                      <Box
                        position="absolute"
                        top={4}
                        right={4}
                        bg="white"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontWeight="bold"
                        color={accentColor}
                        fontSize="sm"
                      >
                        {course.level}
                      </Box>
                    </Box>
                    <Box p={6} flex="1" display="flex" flexDirection="column">
                      <Box flex="1">
                        <Heading as="h3" size="md" mb={2} color={textColor}>
                          {course.title}
                        </Heading>
                        <Text color="gray.600" mb={4} noOfLines={2}>
                          {course.description}
                        </Text>
                      </Box>
                      <Flex justify="space-between" align="center" mt={4}>
                        <HStack spacing={2}>
                          <FaStar color="#F59E0B" />
                          <Text fontSize="sm" color="gray.600">
                            {course.rating}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            ({course.students} estudiantes)
                          </Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.500">
                          {course.duration}
                        </Text>
                      </Flex>
                    </Box>
                    <Box borderTopWidth="1px" p={4}>
                      <Button
                        as={RouterLink}
                        to={`/cursos/${course.id}`}
                        colorScheme="blue"
                        variant="outline"
                        width="100%"
                        rightIcon={<FaArrowRight />}
                      >
                        Ver Curso
                      </Button>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </SimpleGrid>

            <Box textAlign="center" mt={12}>
              <Button
                as={RouterLink}
                to="/cursos"
                colorScheme="blue"
                size="lg"
                rightIcon={<FaArrowRight />}
              >
                Ver todos los cursos
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Sección de CTA */}
        <Box py={16} bgGradient="linear(to-r, blue.500, purple.500)" color="white">
          <Container maxW="4xl" textAlign="center">
            <Heading as="h2" size="2xl" mb={6}>
              ¿Listo para comenzar tu viaje de aprendizaje?
            </Heading>
            <Text fontSize="xl" mb={8} opacity={0.9}>
              Únete a miles de estudiantes que ya están mejorando sus habilidades con nuestros cursos.
            </Text>
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={4} justify="center">
              <Button
                as={RouterLink}
                to="/auth/register"
                colorScheme="white"
                variant="outline"
                size="lg"
                _hover={{
                  bg: 'whiteAlpha.200'
                }}
              >
                Crear cuenta gratis
              </Button>
              <Button
                as={RouterLink}
                to="/cursos"
                colorScheme="white"
                variant="solid"
                size="lg"
                rightIcon={<FaArrowRight />}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              >
                Explorar cursos
              </Button>
            </Stack>
          </Container>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
