import React from 'react';
import { Box, Container, Heading, SimpleGrid, Text, VStack, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, useColorModeValue, Badge, Divider, Input, InputGroup, InputLeftElement, Select } from '@chakra-ui/react';
import { ChevronRightIcon, SearchIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useParams } from 'react-router-dom';
import CourseCard from '../components/CourseCard';

// Datos de ejemplo para los cursos
const coursesData = {
  'matematicas': {
    title: 'Matemáticas',
    description: 'Domina conceptos matemáticos desde lo básico hasta lo avanzado con ejercicios interactivos.',
    icon: '🧮',
    color: 'blue',
    courses: [
      {
        id: 'suma-resta',
        title: 'Suma y Resta Básica',
        description: 'Aprende los fundamentos de la suma y resta con ejercicios prácticos y juegos interactivos.',
        level: 'Básico',
        duration: '2 semanas',
        imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
        rating: 4.8,
        students: 1245,
        category: 'Matemáticas'
      },
      // ... (otros cursos de matemáticas)
    ]
  },
  // Se pueden agregar más categorías aquí
};

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = categoryId ? coursesData[categoryId as keyof typeof coursesData] : null;
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (!category) {
    return (
      <Box bg={bgColor} minH="100vh" py={10}>
        <Container maxW="7xl" px={4} centerContent>
          <Heading as="h1" size="xl" mb={4} color={headingColor}>
            Categoría no encontrada
          </Heading>
          <Text color={textColor} mb={6}>
            La categoría que estás buscando no existe o ha sido eliminada.
          </Text>
          <Box 
            as={RouterLink}
            to="/cursos"
            bg="blue.500"
            color="white"
            px={6}
            py={2}
            borderRadius="md"
            fontWeight="medium"
            _hover={{
              bg: 'blue.600',
              transform: 'translateY(-2px)',
              boxShadow: 'md',
            }}
            transition="all 0.2s"
          >
            Volver a todos los cursos
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" py={10}>
      <Container maxW="7xl" px={4}>
        {/* Migas de pan */}
        <Breadcrumb 
          spacing='8px' 
          separator={<ChevronRightIcon color='gray.500' />} 
          mb={6}
          fontSize="sm"
        >
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/cursos">Cursos</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{category.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Encabezado de la categoría */}
        <Flex direction={{ base: 'column', md: 'row' }} align="center" mb={8}>
          <Flex
            w={{ base: '16', md: '20' }}
            h={{ base: '16', md: '20' }}
            align="center"
            justify="center"
            bg={`${category.color}.100`}
            color={`${category.color}.600`}
            borderRadius="xl"
            fontSize="3xl"
            mr={6}
            mb={{ base: 4, md: 0 }}
          >
            {category.icon}
          </Flex>
          <Box textAlign={{ base: 'center', md: 'left' }}>
            <Flex align="center" justify={{ base: 'center', md: 'flex-start' }}>
              <Heading as="h1" size="xl" color={headingColor} mr={3}>
                {category.title}
              </Heading>
              <Badge colorScheme={category.color} fontSize="md" px={2} py={1}>
                {category.courses.length} {category.courses.length === 1 ? 'curso' : 'cursos'}
              </Badge>
            </Flex>
            <Text color={textColor} mt={2} maxW="3xl">
              {category.description}
            </Text>
          </Box>
        </Flex>

        {/* Filtros y búsqueda */}
        <Box 
          bg={cardBg} 
          p={5} 
          borderRadius="lg" 
          boxShadow="sm"
          mb={8}
        >
          <Flex 
            direction={{ base: 'column', md: 'row' }} 
            align="center" 
            gap={4}
          >
            <InputGroup flex="1" maxW="500px">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input 
                placeholder={`Buscar en ${category.title.toLowerCase()}...`}
                bg={useColorModeValue('white', 'gray.700')}
                borderColor={borderColor}
                _hover={{ borderColor: 'blue.400' }}
                _focus={{
                  borderColor: 'blue.400',
                  boxShadow: '0 0 0 1px #3182ce',
                }}
              />
            </InputGroup>

            <Flex gap={3} w={{ base: '100%', md: 'auto' }}>
              <Select 
                placeholder="Nivel"
                w={{ base: '50%', md: '180px' }}
                bg={useColorModeValue('white', 'gray.700')}
                borderColor={borderColor}
                _hover={{ borderColor: 'blue.400' }}
              >
                <option value="basico">Básico</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </Select>

              <Select 
                placeholder="Ordenar por"
                w={{ base: '50%', md: '180px' }}
                bg={useColorModeValue('white', 'gray.700')}
                borderColor={borderColor}
                _hover={{ borderColor: 'blue.400' }}
              >
                <option value="popular">Más populares</option>
                <option value="nuevos">Más recientes</option>
                <option value="valoracion">Mejor valorados</option>
                <option value="duracion">Duración</option>
              </Select>
            </Flex>
          </Flex>
        </Box>

        {/* Lista de cursos */}
        <Box mb={10}>
          <Heading as="h2" size="lg" mb={6} color={headingColor}>
            Todos los cursos de {category.title}
          </Heading>
          
          {category.courses.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {category.courses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  description={course.description}
                  level={course.level as 'Básico' | 'Intermedio' | 'Avanzado'}
                  duration={course.duration}
                  imageUrl={course.imageUrl}
                  rating={course.rating}
                  students={course.students}
                  category={category.title}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Box 
              bg={cardBg} 
              p={10} 
              borderRadius="lg" 
              textAlign="center"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Text fontSize="lg" color={textColor} mb={4}>
                No se encontraron cursos en esta categoría.
              </Text>
              <Text color={textColor}>
                Pronto agregaremos nuevos cursos. ¡Vuelve más tarde!
              </Text>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default CategoryPage;
