import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel, 
  SimpleGrid, 
  Heading, 
  Text, 
  useColorModeValue,
  VStack,
  HStack,
  Badge,
  Flex,
  Spinner,
  useToast,
  Image,
  Button,
  Container,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Select,
  useMediaQuery,
  Icon,
  useBreakpointValue,
  Skeleton,
  SkeletonText
} from '@chakra-ui/react';
import { 
  FaGlobeAmericas, 
  FaLandmark, 
  FaCity, 
  FaHistory, 
  FaBook, 
  FaStar,
  FaSearch,
  FaTimes
} from 'react-icons/fa';
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';

// Importar tipos
import { HistoryFact, HistoryTopic, AgeGroup } from './types';

// Importar componentes
import HistoryCard from './components/HistoryCard';

// Datos de ejemplo (en un proyecto real, estos vendrían de una API)
const historyFacts: HistoryFact[] = [
  {
    id: '1',
    title: 'El Big Bang',
    description: 'Hace aproximadamente 13.8 mil millones de años, el universo comenzó con una gran explosión llamada Big Bang. Toda la materia y energía del universo estaban comprimidas en un punto muy pequeño y caliente que de repente se expandió.',
    topics: ['universe'],
    ageGroup: '9-12',
    timePeriod: 'Hace 13.8 mil millones de años',
    importantFigures: ['Georges Lemaître', 'Edwin Hubble'],
    imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc2674?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    level: 'Intermedio',
    duration: '15 min',
    rating: 4.8,
    students: 1245,
    category: 'Ciencia'
  },
  {
    id: '2',
    title: 'Caída del Imperio Romano',
    description: 'El Imperio Romano de Occidente cayó en el año 476 d.C. cuando el último emperador romano, Rómulo Augústulo, fue depuesto por el líder germánico Odoacro. Este evento marcó el final de la Edad Antigua y el comienzo de la Edad Media en Europa.',
    topics: ['world'],
    ageGroup: '9-12',
    timePeriod: '476 d.C.',
    location: 'Europa',
    importantFigures: ['Rómulo Augústulo', 'Odoacro'],
    imageUrl: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    level: 'Intermedio',
    duration: '20 min',
    rating: 4.6,
    students: 1890,
    category: 'Historia'
  },
  {
    id: '3',
    title: 'Independencia de Venezuela',
    description: 'El 5 de julio de 1811, Venezuela declaró su independencia de España, convirtiéndose en uno de los primeros países de América del Sur en hacerlo. Este fue un paso crucial en las Guerras de Independencia Hispanoamericanas.',
    topics: ['venezuela'],
    ageGroup: '6-8',
    timePeriod: '5 de julio de 1811',
    location: 'Caracas, Venezuela',
    importantFigures: ['Simón Bolívar', 'Francisco de Miranda'],
    imageUrl: 'https://images.unsplash.com/photo-1580130732478-4d0393abed1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    level: 'Básico',
    duration: '12 min',
    rating: 4.9,
    students: 2345,
    category: 'Historia de Venezuela'
  },
  {
    id: '4',
    title: 'Formación del Sistema Solar',
    description: 'Nuestro sistema solar se formó hace aproximadamente 4.6 mil millones de años a partir de una nube de gas y polvo interestelar que colapsó bajo su propia gravedad, formando el Sol y los planetas que lo orbitan.',
    topics: ['universe'],
    ageGroup: '9-12',
    timePeriod: 'Hace 4.6 mil millones de años',
    importantFigures: ['Pierre-Simon Laplace', 'Immanuel Kant'],
    imageUrl: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    level: 'Intermedio',
    duration: '18 min',
    rating: 4.7,
    students: 1560,
    category: 'Ciencia'
  },
  {
    id: '5',
    title: 'Descubrimiento de América',
    description: 'El 12 de octubre de 1492, Cristóbal Colón llegó a América, marcando el primer contacto europeo con el continente y el inicio de la colonización europea en el Nuevo Mundo.',
    topics: ['world'],
    ageGroup: '6-8',
    timePeriod: '12 de octubre de 1492',
    location: 'América',
    importantFigures: ['Cristóbal Colón', 'Los Reyes Católicos'],
    imageUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    level: 'Básico',
    duration: '15 min',
    rating: 4.5,
    students: 2100,
    category: 'Historia'
  },
  {
    id: '6',
    title: 'Regiones de Venezuela',
    description: 'Venezuela se divide en 9 regiones político-administrativas: Capital, Central, Centro Occidental, Los Andes, Los Llanos, Nor-Oriental, Guayana, Insular y Zuliana. Cada una tiene características geográficas y culturales únicas.',
    topics: ['regions'],
    ageGroup: '6-8',
    location: 'Venezuela',
    importantFigures: [],
    imageUrl: 'https://images.unsplash.com/photo-1580130732478-4d0393abed1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    level: 'Básico',
    duration: '20 min',
    rating: 4.6,
    students: 1870,
    category: 'Geografía de Venezuela'
  },
  {
    id: '7',
    title: 'Caracas, Capital de Venezuela',
    description: 'Fundada en 1567 por Diego de Losada, Caracas es la capital y ciudad más poblada de Venezuela. Es el centro político, económico y cultural del país, ubicada en un valle montañoso del norte de Venezuela.',
    topics: ['capitals'],
    ageGroup: '6-8',
    timePeriod: 'Fundada en 1567',
    location: 'Caracas, Venezuela',
    importantFigures: ['Diego de Losada', 'Francisco Fajardo'],
    imageUrl: 'https://images.unsplash.com/photo-1580130732478-4d0393abed1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    level: 'Básico',
    duration: '15 min',
    rating: 4.4,
    students: 1650,
    category: 'Geografía de Venezuela'
  },
  {
    id: '8',
    title: 'Maracaibo, la Tierra del Sol Amada',
    description: 'Maracaibo es la segunda ciudad más grande de Venezuela y capital del estado Zulia. Conocida por su impresionante Puente sobre el Lago de Maracaibo, su cultura única y su importancia petrolera, es una de las ciudades más importantes del país.',
    topics: ['cities'],
    ageGroup: '9-12',
    location: 'Maracaibo, Venezuela',
    importantFigures: ['Ambrosio Alfinger', 'Rafael Urdaneta'],
    imageUrl: 'https://images.unsplash.com/photo-1594744803324-4a9f3d1e5e5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    level: 'Intermedio',
    duration: '18 min',
    rating: 4.7,
    students: 1420,
    category: 'Geografía de Venezuela'
  }
];

const HistoryModule: React.FC = () => {
  const { ageGroup = '6-8' } = useParams<{ ageGroup?: AgeGroup }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [facts, setFacts] = useState<HistoryFact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const toast = useToast();
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  
  // Colores y estilos
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const headingColor = useColorModeValue('gray.800', 'white');
  const primaryColor = useColorModeValue('blue.500', 'blue.300');
  
  // Categorías disponibles
  const categories = [
    { id: 'universe', name: 'Universo', icon: <FaGlobeAmericas /> },
    { id: 'world', name: 'Mundo', icon: <FaLandmark /> },
    { id: 'venezuela', name: 'Venezuela', icon: <FaStar /> },
    { id: 'regions', name: 'Regiones', icon: <FaGlobeAmericas /> },
    { id: 'capitals', name: 'Capitales', icon: <FaLandmark /> },
    { id: 'cities', name: 'Ciudades', icon: <FaCity /> }
  ];
  
  // Cargar datos según el grupo de edad
  useEffect(() => {
    const loadData = () => {
      try {
        setIsLoading(true);
        // Filtrar hechos por grupo de edad
        const filteredFacts = historyFacts.filter(
          fact => fact.ageGroup === ageGroup || fact.ageGroup === '6-8' // Mostrar contenido por defecto si no hay coincidencia
        );
        setFacts(filteredFacts);
      } catch (error) {
        console.error('Error cargando datos históricos:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los datos históricos',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [ageGroup, toast]);

  // Filtrar hechos por categoría y búsqueda
  const getFactsByTopic = (topic: HistoryTopic) => {
    return facts
      .filter(fact => fact.topics.includes(topic))
      .filter(fact => 
        fact.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fact.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (fact.importantFigures && fact.importantFigures.some(figure => 
          figure.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      )
      .filter(fact => 
        selectedLevel === 'all' || fact.level === selectedLevel
      );
  };

  // Obtener todas las categorías únicas
  const allTopics = useMemo(() => {
    const topics = new Set<string>();
    facts.forEach(fact => {
      fact.topics.forEach(topic => topics.add(topic));
    });
    return Array.from(topics);
  }, [facts]);

  // Manejar el clic en una tarjeta
  const handleCardClick = (fact: HistoryFact) => {
    // Aquí podrías navegar a una página de detalle o mostrar un modal
    console.log('Ver más sobre:', fact.title);
  };

  return (
    <Container maxW="8xl" py={8} px={{ base: 4, md: 8 }}>
      {/* Encabezado */}
      <VStack spacing={4} mb={8} textAlign="center">
        <Badge colorScheme="blue" px={3} py={1} borderRadius="full" fontSize="sm">
          Historia
        </Badge>
        <Heading as="h1" size="2xl" color={headingColor} fontWeight="bold">
          Explora la Historia
        </Heading>
        <Text fontSize="lg" color={textColor} maxW="2xl">
          Descubre los eventos más importantes que han dado forma a nuestro mundo y a Venezuela
        </Text>
      </VStack>

      {/* Filtros y búsqueda */}
      <Flex 
        direction={{ base: 'column', md: 'row' }} 
        gap={4} 
        mb={8}
        justifyContent="space-between"
        alignItems={{ base: 'stretch', md: 'center' }}
      >
        <InputGroup maxW={{ base: '100%', md: '400px' }}>
          <InputLeftElement pointerEvents="none">
            <Icon as={FaSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Buscar en historia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg={bgColor}
            borderColor={borderColor}
            _hover={{ borderColor: 'gray.300' }}
            _focus={{
              borderColor: primaryColor,
              boxShadow: `0 0 0 1px ${primaryColor}`,
            }}
          />
          {searchTerm && (
            <InputRightElement>
              <IconButton
                aria-label="Limpiar búsqueda"
                icon={<FiX />}
                size="sm"
                variant="ghost"
                onClick={() => setSearchTerm('')}
              />
            </InputRightElement>
          )}
        </InputGroup>

        <HStack spacing={4} w={{ base: '100%', md: 'auto' }}>
          <Select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            bg={bgColor}
            borderColor={borderColor}
            _hover={{ borderColor: 'gray.300' }}
            _focus={{
              borderColor: primaryColor,
              boxShadow: `0 0 0 1px ${primaryColor}`,
            }}
            maxW={{ base: '100%', md: '200px' }}
          >
            <option value="all">Todos los niveles</option>
            <option value="Básico">Básico</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
          </Select>

          {isMobile && (
            <Button
              leftIcon={<FiFilter />}
              rightIcon={isFiltersOpen ? <FiChevronUp /> : <FiChevronDown />}
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              variant="outline"
              width="100%"
            >
              Filtros
            </Button>
          )}
        </HStack>
      </Flex>

      {/* Filtros móviles */}
      {(isFiltersOpen && isMobile) && (
        <Box mb={6} p={4} bg={bgColor} borderRadius="md" boxShadow="sm">
          <Text fontWeight="bold" mb={3}>Categorías</Text>
          <SimpleGrid columns={2} spacing={2} mb={4}>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeTab === categories.findIndex(c => c.id === category.id) ? 'solid' : 'outline'}
                colorScheme={activeTab === categories.findIndex(c => c.id === category.id) ? 'blue' : 'gray'}
                size="sm"
                leftIcon={category.icon}
                onClick={() => setActiveTab(categories.findIndex(c => c.id === category.id))}
                justifyContent="flex-start"
              >
                {category.name}
              </Button>
            ))}
          </SimpleGrid>
        </Box>
      )}

      {/* Contenido principal */}
      <Box>
        {/* Pestañas de categorías (solo escritorio) */}
        {!isMobile && (
          <Tabs 
            variant="soft-rounded" 
            colorScheme="blue"
            index={activeTab}
            onChange={(index) => setActiveTab(index)}
            mb={8}
          >
            <TabList flexWrap="wrap" gap={2}>
              {categories.map((category, index) => (
                <Tab 
                  key={category.id}
                  _selected={{ 
                    color: 'white', 
                    bg: 'blue.500',
                    _dark: { bg: 'blue.600' }
                  }}
                  borderRadius="full"
                  px={4}
                  py={2}
                >
                  <HStack spacing={2}>
                    {category.icon}
                    <Text>{category.name}</Text>
                  </HStack>
                </Tab>
              ))}
            </TabList>
          </Tabs>
        )}

        {/* Contenido de las pestañas */}
        <Box>
          {isLoading ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {[1, 2, 3].map((i) => (
                <Box 
                  key={i} 
                  bg={cardBg} 
                  borderRadius="lg" 
                  overflow="hidden"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Box pt="56.25%" bg="gray.200" position="relative" />
                  <Box p={4}>
                    <Skeleton height="24px" width="80%" mb={3} />
                    <SkeletonText noOfLines={3} spacing={2} />
                    <Skeleton height="36px" mt={4} />
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {getFactsByTopic(categories[activeTab]?.id as HistoryTopic).length > 0 ? (
                getFactsByTopic(categories[activeTab]?.id as HistoryTopic).map((fact) => (
                  <HistoryCard
                    key={fact.id}
                    {...fact}
                    topic={categories[activeTab]?.id || 'universe'}
                    onLearnMore={() => handleCardClick(fact)}
                  />
                ))
              ) : (
                <Box 
                  gridColumn="1 / -1" 
                  textAlign="center" 
                  py={10}
                  bg={bgColor}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Text fontSize="lg" color={textColor}>
                    No se encontraron resultados para tu búsqueda.
                  </Text>
                  <Button 
                    mt={4} 
                    colorScheme="blue"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedLevel('all');
                    }}
                  >
                    Limpiar filtros
                  </Button>
                </Box>
              )}
            </SimpleGrid>
          )}
        </Box>
      </Box>
    </Container>
  );
};

// Componente para mostrar una categoría de historia (ya no se usa directamente, pero lo mantenemos por si acaso)
interface HistoryCategoryProps {
  title: string;
  facts: HistoryFact[];
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  isLoading: boolean;
}

const HistoryCategory: React.FC<HistoryCategoryProps> = ({
  title,
  facts,
  icon,
  bgColor,
  borderColor,
  isLoading
}) => {
  if (isLoading) {
    return (
      <Flex justify="center" py={10}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (facts.length === 0) {
    return (
      <VStack spacing={4} py={10} textAlign="center">
        <Box fontSize="4xl" color="gray.400">
          {icon}
        </Box>
        <Text fontSize="lg" color="gray.500">
          Próximamente más contenido sobre {title.toLowerCase()}
        </Text>
      </VStack>
    );
  }

  return (
    <Box>
      <HStack spacing={3} mb={6}>
        <Box fontSize="2xl">
          {icon}
        </Box>
        <Heading as="h2" size="lg">
          {title}
        </Heading>
      </HStack>
      
      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        {facts.map((fact) => (
          <HistoryCard
            key={fact.id}
            {...fact}
            topic={fact.topics[0] || 'universe'}
            onLearnMore={() => console.log('Ver más sobre:', fact.title)}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default HistoryModule;
