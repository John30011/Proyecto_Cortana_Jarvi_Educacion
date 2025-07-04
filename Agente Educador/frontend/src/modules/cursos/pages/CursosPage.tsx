import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Stack,
  Tag,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  IconButton,
  Badge,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  Divider,
  Tooltip,
  Wrap,
  WrapItem,
  InputRightElement,
  Icon,
  useBreakpointValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Skeleton,
  SkeletonText,
  useToast,
  useMediaQuery,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import { FiSearch, FiFilter, FiX, FiChevronRight, FiStar, FiClock, FiBookOpen, FiBookmark, FiShare2, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { FaChalkboardTeacher, FaBook, FaLaptopCode, FaFlask, FaGlobeAmericas, FaLanguage, FaPalette, FaRunning, FaBrain, FaLeaf } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Componentes
import CourseCard from '../components/CourseCard';
import CategoryCard from '../components/CategoryCard';
import ActivityCourseCard from '../components/ActivityCourseCard';

// Servicios
import { getAllActivities, getActivitiesByCategory, type Activity } from '../../../services/activities';

// Iconos
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';
import { FaCalculator, FaAtom, FaRobot } from 'react-icons/fa';

// Tipos
interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  imageUrl: string;
  rating: number;
  students: number;
  category: string;
  tags: string[];
}

interface Category {
  title: string;
  description: string;
  icon: JSX.Element;
  color: string;
  count: number;
  slug: string;
}

interface FilterOption {
  label: string;
  value: string;
}

// Obtener categorías de actividades
const getCategories = (activitiesList: Activity[]) => {
  const uniqueCategories = Array.from(new Set(activitiesList.map(activity => activity.category)));
  
  const categoryItems = uniqueCategories.map(category => ({
    title: category,
    description: `Explora nuestras actividades de ${category.toLowerCase()} diseñadas para niños.`,
    icon: getCategoryIcon(category),
    color: getCategoryColor(category),
    count: activitiesList.filter(activity => activity.category === category).length,
    slug: category.toLowerCase().replace(/\s+/g, '-')
  }));

  // Add 'All' category at the beginning
  return [
    {
      title: 'Todas las categorías',
      description: 'Explora todas nuestras actividades educativas.',
      icon: <FaRobot />,
      color: 'teal',
      count: activitiesList.length,
      slug: 'todos'
    },
    ...categoryItems
  ];
};

// Obtener ícono por categoría
const getCategoryIcon = (category: string) => {
  const icons: Record<string, JSX.Element> = {
    'Matemáticas': <FaCalculator />,
    'Ciencias': <FaAtom />,
    'Tecnología': <FaLaptopCode />,
    'Arte': <FaPalette />,
    'Música': <FaBook />,
    'Deportes': <FaLeaf />,
    'Desarrollo Personal': <FaBrain />
  };
  return icons[category] || <FaBook />;
};

// Obtener color por categoría
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Matemáticas': 'blue',
    'Ciencias': 'green',
    'Tecnología': 'purple',
    'Arte': 'pink',
    'Música': 'teal',
    'Deportes': 'green',
    'Desarrollo Personal': 'orange',
    'General': 'gray'
  };
  return colors[category] || 'gray';
};

// Obtener actividades del servicio
const allActivities = getAllActivities();

// Obtener categorías basadas en las actividades
const courseCategories = getCategories(allActivities);

// Datos de ejemplo para los cursos (se mantienen como ejemplo)
const cursosEjemplo: Course[] = [
  {
    id: 'curso-matematicas-basico',
    title: 'Matemáticas Básicas',
    description: 'Aprende los fundamentos de las matemáticas con ejemplos prácticos y ejercicios interactivos.',
    level: 'Básico',
    duration: '4 semanas',
    imageUrl: 'https://images.unsplash.com/photo-1541854615901-93c3541970ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1473&q=80',
    rating: 4.8,
    students: 1250,
    category: 'Matemáticas',
    tags: ['Matemáticas', 'Básico', 'Aritmética']
  },
  {
    id: 'curso-ciencias-experimentos',
    title: 'Ciencia Divertida',
    description: 'Experimenta con la ciencia a través de actividades prácticas y sorprendentes.',
    level: 'Intermedio',
    duration: '6 semanas',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    rating: 4.9,
    students: 980,
    category: 'Ciencias Naturales',
    tags: ['Ciencias', 'Experimentos', 'Divertido']
  },
  {
    id: 'curso-programacion-ninos',
    title: 'Introducción a la Programación',
    description: 'Aprende los conceptos básicos de programación con juegos y proyectos divertidos.',
    level: 'Básico',
    duration: '5 semanas',
    imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    rating: 4.7,
    students: 2100,
    category: 'Tecnología',
    tags: ['Programación', 'Tecnología', 'Básico']
  },
  {
    id: 'curso-historia-mundo',
    title: 'Un Viaje por la Historia',
    description: 'Descubre los eventos más importantes de la historia de la humanidad.',
    level: 'Intermedio',
    duration: '8 semanas',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-904fedfedef3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80',
    rating: 4.6,
    students: 850,
    category: 'Ciencias Sociales',
    tags: ['Historia', 'Cultura', 'Geografía']
  },
  {
    id: 'curso-lectura-rapida',
    title: 'Lectura Rápida para Niños',
    description: 'Mejora tu velocidad y comprensión lectora con técnicas divertidas.',
    level: 'Intermedio',
    duration: '4 semanas',
    imageUrl: 'https://images.unsplash.com/photo-1506880018603-83d39b870eb2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    rating: 4.5,
    students: 1200,
    category: 'Lengua y Literatura',
    tags: ['Lectura', 'Comprensión', 'Técnicas']
  },
  {
    id: 'curso-arte-digital',
    title: 'Arte Digital para Niños',
    description: 'Aprende a crear increíbles obras de arte utilizando herramientas digitales.',
    level: 'Avanzado',
    duration: '6 semanas',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a5002?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1458&q=80',
    rating: 4.9,
    students: 1500,
    category: 'Arte y Creatividad',
    tags: ['Arte', 'Digital', 'Creatividad']
  }
];

const CursosPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [activeTab, setActiveTab] = useState(0);
  
  // Filtrar actividades por categoría
  const filteredActivities = (category: string) => {
    if (category === 'todos') {
      return allActivities;
    }
    return allActivities.filter(activity => activity.category === category);
  };
  
  // Filtrar cursos y actividades según búsqueda y categoría seleccionada
  const filteredCourses = useMemo(() => {
    return cursosEjemplo.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'todos' || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);
  
  const filteredActivitiesList = useMemo(() => {
    return allActivities.filter(activity => {
      const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'todos' || activity.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, allActivities]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Obtener categorías únicas para el filtro
  const categoriasUnicas = [...new Set(cursosEjemplo.map(curso => curso.category))];
  
  // Filtrar cursos basado en búsqueda y categoría
  const filteredCursos = useMemo(() => {
    let result = [...cursosEjemplo];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(curso => 
        curso.title.toLowerCase().includes(searchLower) || 
        curso.description.toLowerCase().includes(searchLower) ||
        curso.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Filtrar por categoría
    if (selectedCategory) {
      result = result.filter(curso => curso.category === selectedCategory);
    }
    
    return result;
  }, [searchTerm, selectedCategory]);
  
  // Generar sugerencias de búsqueda
  const updateSuggestions = (value: string) => {
    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    const valueLower = value.toLowerCase();
    const allTags = new Set<string>();
    
    // Obtener etiquetas y títulos que coincidan con la búsqueda
    cursosEjemplo.forEach(curso => {
      // Buscar en etiquetas
      curso.tags.forEach(tag => {
        if (tag.toLowerCase().includes(valueLower)) {
          allTags.add(tag);
        }
      });
      
      // Buscar en títulos
      if (curso.title.toLowerCase().includes(valueLower)) {
        allTags.add(curso.title);
      }
    });
    
    setSuggestions(Array.from(allTags).slice(0, 5));
    setShowSuggestions(true);
  };
  
  // Manejar cambio en el input de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    updateSuggestions(value);
  };
  
  // Manejar selección de sugerencia
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };
  
  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
  };
  
  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <Box py={8}>
      <Container maxW="7xl" px={{ base: 4, md: 6 }}>
        <VStack spacing={8} align="stretch">
          {/* Encabezado */}
          <VStack spacing={4} textAlign="center">
            <Heading 
              as="h1" 
              size="2xl" 
              fontWeight="bold"
              fontFamily="'Poppins', sans-serif"
              letterSpacing="-0.5px"
              lineHeight="1.2"
              sx={{
                background: 'linear-gradient(90deg, #3182ce 0%, #805ad5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                _dark: {
                  background: 'linear-gradient(90deg, #63b3ed 0%, #9f7aea 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }
              }}
            >
              Explora Nuestros Cursos
            </Heading>
            <Text fontSize="lg" color={textColor} maxW="2xl">
              Descubre una amplia variedad de cursos diseñados para potenciar tu aprendizaje y desarrollo profesional.
            </Text>
          </VStack>

          {/* Barra de búsqueda y filtros */}
          <VStack spacing={4} align="stretch" mb={8}>
            <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
              <Box position="relative" flex="1">
                <InputGroup maxW="xl">
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.400" />
                  </InputLeftElement>
                  <Input 
                    placeholder="Buscar cursos por título, descripción o etiquetas..." 
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={() => searchTerm && setShowSuggestions(true)}
                    bg={useColorModeValue('white', 'gray.700')}
                    borderColor={borderColor}
                    _focus={{
                      borderColor: 'blue.400',
                      boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
                    }}
                    pr="2.5rem"
                  />
                  {searchTerm && (
                    <InputRightElement>
                      <IconButton
                        aria-label="Limpiar búsqueda"
                        icon={<CloseIcon />}
                        size="sm"
                        variant="ghost"
                        onClick={clearSearch}
                      />
                    </InputRightElement>
                  )}
                </InputGroup>
                
                {/* Sugerencias de búsqueda */}
                {showSuggestions && suggestions.length > 0 && (
                  <Box
                    position="absolute"
                    zIndex="dropdown"
                    width="100%"
                    mt={1}
                    bg={useColorModeValue('white', 'gray.800')}
                    border="1px"
                    borderColor={borderColor}
                    borderRadius="md"
                    boxShadow="md"
                    maxH="60"
                    overflowY="auto"
                  >
                    {suggestions.map((suggestion, index) => (
                      <Box
                        key={index}
                        px={4}
                        py={2}
                        _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                        cursor="pointer"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <Text>{suggestion}</Text>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
              
              <Select 
                placeholder="Todas las categorías" 
                maxW="xs"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                bg={useColorModeValue('white', 'gray.700')}
                borderColor={borderColor}
                _focus={{
                  borderColor: 'blue.400',
                  boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
                }}
              >
                {categoriasUnicas.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </Select>
            </Flex>
            
            {/* Filtros activos */}
            {(searchTerm || selectedCategory) && (
              <Flex align="center" gap={2} flexWrap="wrap">
                <Text fontSize="sm" color={textColor}>
                  Filtros activos:
                </Text>
                {searchTerm && (
                  <Badge 
                    colorScheme="blue" 
                    px={2} 
                    py={1} 
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    {searchTerm}
                    <CloseIcon 
                      boxSize={2.5} 
                      cursor="pointer" 
                      onClick={() => setSearchTerm('')} 
                    />
                  </Badge>
                )}
                {selectedCategory && (
                  <Badge 
                    colorScheme="green" 
                    px={2} 
                    py={1} 
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    {selectedCategory}
                    <CloseIcon 
                      boxSize={2.5} 
                      cursor="pointer" 
                      onClick={() => setSelectedCategory('')} 
                    />
                  </Badge>
                )}
                <Button 
                  size="xs" 
                  variant="ghost" 
                  colorScheme="blue" 
                  ml={2}
                  onClick={clearFilters}
                >
                  Limpiar filtros
                </Button>
              </Flex>
            )}
          </VStack>

          {/* Listado de cursos en grid responsivo */}
          <Box>
            <Flex justify="space-between" align="center" mb={6}>
              <Heading as="h2" size="lg">
                {filteredCursos.length === cursosEjemplo.length 
                  ? 'Todos los cursos' 
                  : `Cursos encontrados: ${filteredCursos.length}`}
              </Heading>
              
              {(searchTerm || selectedCategory) && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  colorScheme="blue"
                  onClick={clearFilters}
                  leftIcon={<CloseIcon />}
                >
                  Limpiar filtros
                </Button>
              )}
            </Flex>
            
            {filteredCursos.length > 0 ? (
              <SimpleGrid 
                columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} 
                spacing={6}
                sx={{
                  '& > div': {
                    display: 'flex',
                    flexDirection: 'column',
                  }
                }}
              >
                {filteredCursos.map((curso) => (
                  <CourseCard
                    key={curso.id}
                    id={curso.id}
                    title={curso.title}
                    description={curso.description}
                    rating={curso.rating}
                    students={curso.students}
                    category={curso.category}
                    imageUrl="#"
                    tags={curso.tags}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <Box 
                textAlign="center" 
                py={12} 
                bg={useColorModeValue('gray.50', 'gray.800')}
                borderRadius="lg"
              >
                <Heading as="h3" size="md" mb={4} color={textColor}>
                  No se encontraron cursos que coincidan con tu búsqueda
                </Heading>
                <Text color={textColor} mb={4}>
                  Prueba con otros términos de búsqueda o ajusta los filtros.
                </Text>
                <Button 
                  colorScheme="blue" 
                  variant="outline"
                  onClick={clearFilters}
                >
                  Limpiar filtros
                </Button>
              </Box>
            )}
          </Box>

          {/* Categorías destacadas */}
          <VStack spacing={6} align="stretch" mt={12}>
            <Heading as="h2" size="lg">Explora por Categoría</Heading>
            <SimpleGrid 
              columns={{ base: 1, sm: 2, lg: 3 }} 
              spacing={6}
              sx={{
                '& > div': {
                  height: '100%',
                }
              }}
            >
              {courseCategories.map((category: Category) => (
                <CategoryCard
                  key={category.slug}
                  title={category.title}
                  description={category.description}
                  icon={category.icon}
                  color={category.color}
                  count={category.count}
                  to={`/cursos/categoria/${category.slug}`}
                />
              ))}
            </SimpleGrid>
          </VStack>
        </VStack>
        <Box textAlign="center" py={8}>
          <VStack spacing={4}>
            <Text color={textColor} maxW="2xl">
              Estamos constantemente añadiendo nuevos cursos y contenido. ¡Déjanos saber qué te gustaría aprender!
            </Text>
            <Button 
              colorScheme="blue"
              size="lg"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'md',
              }}
              transition="all 0.2s"
            >
              Sugerir un curso
            </Button>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default CursosPage;
