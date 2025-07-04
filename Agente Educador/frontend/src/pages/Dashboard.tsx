import { Box, SimpleGrid, Heading, Text, Card, CardHeader, CardBody, CardFooter, Button, VStack, HStack, Icon, useColorModeValue } from '@chakra-ui/react';
import { FaBookOpen, FaGraduationCap, FaChartLine, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const cardBg = useColorModeValue('white', 'gray.700');
  const stats = [
    {
      title: 'Cursos Activos',
      value: '5',
      icon: FaBookOpen,
      color: 'blue.500',
    },
    {
      title: 'Estudiantes',
      value: '124',
      icon: FaUsers,
      color: 'green.500',
    },
    {
      title: 'Progreso Promedio',
      value: '78%',
      icon: FaChartLine,
      color: 'purple.500',
    },
    {
      title: 'Certificados',
      value: '89',
      icon: FaGraduationCap,
      color: 'orange.500',
    },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <Box>
      <Box mb={8} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Heading as="h1" size="xl" mb={2}>
            Hola, {user?.user_metadata?.name || 'Usuario'}
          </Heading>
          <Text color="gray.600">Bienvenido a tu panel de control</Text>
        </Box>
        <Button 
          colorScheme="red" 
          variant="outline" 
          onClick={handleLogout}
          leftIcon={<Icon as={FaSignOutAlt} />}
        >
          Cerrar Sesión
        </Button>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        {stats.map((stat, index) => (
          <Card key={index} bg={cardBg} boxShadow="sm">
            <CardHeader pb={0}>
              <HStack spacing={4}>
                <Box p={2} bg={`${stat.color}20`} borderRadius="full">
                  <Icon as={stat.icon} boxSize={5} color={stat.color} />
                </Box>
                <Text fontSize="sm" color="gray.500">
                  {stat.title}
                </Text>
              </HStack>
            </CardHeader>
            <CardBody pt={2}>
              <Heading size="lg">{stat.value}</Heading>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Card bg={cardBg} boxShadow="sm">
          <CardHeader>
            <Heading size="md">Cursos Recientes</Heading>
          </CardHeader>
          <CardBody>
            <VStack align="stretch" spacing={4}>
              {[
                'Matemáticas Básicas',
                'Ciencias Naturales',
                'Historia Universal',
              ].map((course, index) => (
                <HStack key={index} p={3} bg="gray.50" borderRadius="md">
                  <Box w="8px" h="full" bg="brand.500" borderRadius="full" />
                  <Text>{course}</Text>
                </HStack>
              ))}
            </VStack>
          </CardBody>
          <CardFooter>
            <Button variant="link" colorScheme="brand">
              Ver todos los cursos
            </Button>
          </CardFooter>
        </Card>

        <Card bg={cardBg} boxShadow="sm">
          <CardHeader>
            <Heading size="md">Actividad Reciente</Heading>
          </CardHeader>
          <CardBody>
            <VStack align="stretch" spacing={4}>
              {[
                'Completaste la lección de Sumas',
                'Nueva lección disponible: Fracciones',
                'Has ganado una insignia: Matemático Junior',
              ].map((activity, index) => (
                <HStack key={index} p={3} bg="gray.50" borderRadius="md">
                  <Box w="8px" h="full" bg="green.500" borderRadius="full" />
                  <Text>{activity}</Text>
                </HStack>
              ))}
            </VStack>
          </CardBody>
          <CardFooter>
            <Button variant="link" colorScheme="brand">
              Ver toda la actividad
            </Button>
          </CardFooter>
        </Card>
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;
