import React from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Avatar, 
  Badge, 
  Divider, 
  useColorModeValue,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  Button,
  Icon
} from '@chakra-ui/react';
import { FaUser, FaGraduationCap, FaStar, FaBook, FaAward, FaEdit } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Componentes de animación
const MotionBox = motion(Box);

const Profile = () => {
  const textColor = useColorModeValue('gray.700', 'white');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Datos de ejemplo del usuario
  const userData = {
    name: 'Ana García',
    email: 'ana.garcia@ejemplo.com',
    role: 'Estudiante',
    level: 5,
    xp: 1250,
    nextLevelXp: 2000,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    bio: '¡Me encanta aprender cosas nuevas todos los días! Especialmente matemáticas y ciencias.',
    stats: {
      coursesCompleted: 12,
      totalXp: 5600,
      achievements: 8,
      streak: 15
    }
  };

  const xpPercentage = Math.round((userData.xp / userData.nextLevelXp) * 100);

  return (
    <Container maxW="container.xl" py={8}>
      {/* Encabezado del perfil */}
      <VStack spacing={6} align="stretch" mb={10}>
        <HStack spacing={6} align="center">
          <Box position="relative">
            <Avatar
              size="2xl"
              name={userData.name}
              src={userData.avatar}
              borderWidth="4px"
              borderColor="blue.400"
            />
            <Button
              as={MotionBox}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              position="absolute"
              bottom="0"
              right="0"
              p={1.5}
              minW="auto"
              h="auto"
              bg="blue.500"
              color="white"
              borderRadius="full"
              _hover={{ bg: 'blue.600' }}
              aria-label="Editar perfil"
            >
              <Icon as={FaEdit} boxSize={4} />
            </Button>
          </Box>
          
          <VStack align="flex-start" spacing={2}>
            <HStack>
              <Heading size="lg" color={textColor}>{userData.name}</Heading>
              <Badge colorScheme="blue" fontSize="0.8em" px={2} py={1} borderRadius="full">
                Nivel {userData.level}
              </Badge>
            </HStack>
            
            <Text color="gray.500">{userData.email}</Text>
            <Text mt={2} color={textColor}>{userData.bio}</Text>
            
            <HStack spacing={4} mt={2}>
              <Badge colorScheme="purple" px={2} py={1} borderRadius="md">
                <HStack spacing={1}>
                  <FaStar />
                  <Text>XP: {userData.xp}</Text>
                </HStack>
              </Badge>
              <Badge colorScheme="green" px={2} py={1} borderRadius="md">
                <HStack spacing={1}>
                  <FaBook />
                  <Text>{userData.stats.coursesCompleted} cursos</Text>
                </HStack>
              </Badge>
            </HStack>
          </VStack>
        </HStack>
        
        {/* Barra de progreso */}
        <Box mt={4}>
          <HStack justify="space-between" mb={1}>
            <Text fontSize="sm" color="gray.500">Progreso al siguiente nivel</Text>
            <Text fontSize="sm" fontWeight="bold" color="blue.500">{xpPercentage}%</Text>
          </HStack>
          <Progress 
            value={xpPercentage} 
            size="sm" 
            colorScheme="blue" 
            borderRadius="full"
            bg={useColorModeValue('gray.200', 'gray.700')}
          />
          <HStack justify="space-between" mt={1}>
            <Text fontSize="xs" color="gray.500">{userData.xp} XP</Text>
            <Text fontSize="xs" color="gray.500">{userData.nextLevelXp} XP</Text>
          </HStack>
        </Box>
      </VStack>

      {/* Estadísticas */}
      <Heading size="md" mb={4} color={textColor}>Estadísticas</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={8}>
        <StatCard 
          icon={FaBook}
          label="Cursos Completados"
          value={userData.stats.coursesCompleted}
          color="blue"
        />
        <StatCard 
          icon={FaStar}
          label="XP Total"
          value={userData.stats.totalXp}
          color="green"
        />
        <StatCard 
          icon={FaAward}
          label="Logros"
          value={userData.stats.achievements}
          color="purple"
        />
        <StatCard 
          icon={FaGraduationCap}
          label="Racha Actual"
          value={`${userData.stats.streak} días`}
          color="orange"
        />
      </SimpleGrid>

      <Divider my={8} />

      {/* Información adicional */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Box 
          bg={cardBg} 
          p={6} 
          borderRadius="xl" 
          borderWidth="1px" 
          borderColor={borderColor}
        >
          <Heading size="md" mb={4} color={textColor}>Información Personal</Heading>
          <VStack align="stretch" spacing={4}>
            <InfoRow label="Nombre" value={userData.name} />
            <InfoRow label="Correo" value={userData.email} />
            <InfoRow label="Rol" value={userData.role} />
            <InfoRow label="Nivel" value={`${userData.level} (${userData.xp} XP)`} />
          </VStack>
        </Box>

        <Box 
          bg={cardBg} 
          p={6} 
          borderRadius="xl" 
          borderWidth="1px" 
          borderColor={borderColor}
        >
          <Heading size="md" mb={4} color={textColor}>Actividad Reciente</Heading>
          <VStack align="stretch" spacing={4}>
            <ActivityItem 
              title="Matemáticas Básicas"
              description="Completado el 02/07/2025"
              icon={FaGraduationCap}
              color="blue"
            />
            <ActivityItem 
              title="Ciencias Naturales"
              description="En progreso (75%)"
              icon={FaBook}
              color="green"
            />
            <ActivityItem 
              title="Logro Desbloqueado"
              description="¡Explorador Estelar!"
              icon={FaAward}
              color="yellow"
            />
          </VStack>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

// Componentes auxiliares
const StatCard = ({ icon, label, value, color }: { icon: any, label: string, value: string | number, color: string }) => (
  <Box 
    bg={useColorModeValue('white', 'gray.800')} 
    p={4} 
    borderRadius="xl"
    borderWidth="1px"
    borderColor={useColorModeValue('gray.200', 'gray.700')}
  >
    <HStack spacing={3}>
      <Box
        p={2}
        borderRadius="lg"
        bg={`${color}.100`}
        color={`${color}.600`}
      >
        <Icon as={icon} boxSize={5} />
      </Box>
      <Box>
        <Text fontSize="sm" color="gray.500">{label}</Text>
        <Text fontSize="xl" fontWeight="bold" color={useColorModeValue('gray.800', 'white')}>
          {value}
        </Text>
      </Box>
    </HStack>
  </Box>
);

const InfoRow = ({ label, value }: { label: string, value: string }) => (
  <HStack justify="space-between" borderBottomWidth="1px" pb={2} borderColor={useColorModeValue('gray.100', 'gray.700')}>
    <Text color="gray.500">{label}</Text>
    <Text fontWeight="medium">{value}</Text>
  </HStack>
);

const ActivityItem = ({ title, description, icon, color }: { title: string, description: string, icon: any, color: string }) => (
  <HStack spacing={3} p={2} borderRadius="md" _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
    <Box
      p={2}
      borderRadius="md"
      bg={`${color}.100`}
      color={`${color}.600`}
    >
      <Icon as={icon} />
    </Box>
    <Box>
      <Text fontWeight="medium">{title}</Text>
      <Text fontSize="sm" color="gray.500">{description}</Text>
    </Box>
  </HStack>
);

const IconButton = ({ icon, ...props }: any) => (
  <Button
    as="button"
    p={1.5}
    minW="auto"
    h="auto"
    borderRadius="full"
    variant="ghost"
    _hover={{ bg: 'blue.600' }}
    {...props}
  >
    <Icon as={icon} boxSize={4} />
  </Button>
);

export default Profile;
