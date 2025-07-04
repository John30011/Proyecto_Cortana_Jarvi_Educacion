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
  Button,
  VStack,
  HStack,
  Badge,
  Icon,
  Flex,
  Spinner,
  useToast,
  AspectRatio,
  Container,
  Image,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Wrap,
  WrapItem,
  Skeleton,
  SkeletonText,
  useBreakpointValue,
  useMediaQuery,
  Center,
  ScaleFade,
  Fade,
  SlideFade
} from '@chakra-ui/react';
import { 
  FaFlask, 
  FaQuestionCircle, 
  FaLightbulb, 
  FaBook, 
  FaGamepad, 
  FaSearch, 
  FaStar, 
  FaArrowRight,
  FaAtom,
  FaDna,
  FaRobot,
  FaLeaf,
  FaMeteor,
  FaWater,
  FaMicroscope
} from 'react-icons/fa';
import { FiFilter, FiX } from 'react-icons/fi';
import { ScienceExperiment, ScienceFact, AgeGroup, ScienceTopic } from './types';
import { getScienceExperiments, getRandomFact, getScienceFacts } from './services';
import { useParams, useNavigate } from 'react-router-dom';
import ScienceCard from './components/ScienceCard';

// Mapeo de temas a íconos y colores
const topicIcons = {
  'biology': { icon: FaLeaf, color: 'green' },
  'chemistry': { icon: FaFlask, color: 'blue' },
  'physics': { icon: FaAtom, color: 'purple' },
  'space': { icon: FaMeteor, color: 'cyan' },
  'earth': { icon: FaWater, color: 'teal' },
  'animals': { icon: FaDna, color: 'orange' },
  'human-body': { icon: FaMicroscope, color: 'pink' },
  'technology': { icon: FaRobot, color: 'blue' },
  'environment': { icon: FaLeaf, color: 'green' }
};

const ScienceModule: React.FC = () => {
  const { ageGroup = '6-8' } = useParams<{ ageGroup?: AgeGroup }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [experiments, setExperiments] = useState<ScienceExperiment[]>([]);
  const [facts, setFacts] = useState<ScienceFact[]>([]);
  const [randomFact, setRandomFact] = useState<ScienceFact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<ScienceTopic | 'all'>('all');
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const toast = useToast();
  
  // Colores y estilos
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const primaryColor = useColorModeValue('blue.500', 'blue.300');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const headingColor = useColorModeValue('gray.800', 'white');
  
  // Categorías de ciencia
  const scienceCategories = [
    { id: 'all', name: 'Todo', icon: FaAtom },
    { id: 'biology', name: 'Biología', icon: FaLeaf },
    { id: 'chemistry', name: 'Química', icon: FaFlask },
    { id: 'physics', name: 'Física', icon: FaAtom },
    { id: 'space', name: 'Espacio', icon: FaMeteor },
    { id: 'animals', name: 'Animales', icon: FaDna },
    { id: 'human-body', name: 'Cuerpo Humano', icon: FaMicroscope },
    { id: 'technology', name: 'Tecnología', icon: FaRobot },
  ];

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Cargar experimentos
        const exps = await getScienceExperiments(ageGroup);
        setExperiments(exps);
        
        // Cargar hechos científicos
        const factsData = await getScienceFacts(ageGroup);
        setFacts(factsData);
        
        // Cargar un hecho aleatorio
        const fact = await getRandomFact(ageGroup);
        setRandomFact(fact);
      } catch (error) {
        console.error('Error al cargar datos de ciencias:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los datos de ciencias. Por favor, inténtalo de nuevo más tarde.',
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
  
  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };
  
  const handleViewAllExperiments = () => {
    navigate(`/science/experiments/${ageGroup}`);
  };
  
  const handleViewAllQuizzes = () => {
    navigate(`/science/quizzes/${ageGroup}`);
  };
  
  const handleViewAllFacts = () => {
    navigate(`/science/facts/${ageGroup}`);
  };
  
  if (isLoading) {
    // Filtrar contenido por término de búsqueda y tema seleccionado
  const filteredContent = useMemo(() => {
    let filtered = activeTab === 0 ? [...experiments] : [...facts];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.title?.toLowerCase().includes(term) || 
        item.description?.toLowerCase().includes(term) ||
        (item as ScienceExperiment).materials?.some(m => m.toLowerCase().includes(term))
      );
    }
    
    // Filtrar por tema seleccionado
    if (selectedTopic !== 'all') {
      filtered = filtered.filter(item => 
        (item as ScienceExperiment).topic === selectedTopic || 
        (item as ScienceFact).topics?.includes(selectedTopic)
      );
    }
    
    return filtered;
  }, [activeTab, experiments, facts, searchTerm, selectedTopic]);

  // Obtener el color del tema
  const getTopicColor = (topic: ScienceTopic) => {
    return topicIcons[topic]?.color || 'gray';
  };

  // Obtener el ícono del tema
  const getTopicIcon = (topic: ScienceTopic) => {
    return topicIcons[topic]?.icon || FaAtom;
  };

  return (
    <Container maxW="8xl" py={8} px={{ base: 4, md: 8 }}>
      {/* Encabezado */}
      <VStack spacing={4} mb={8} textAlign="center">
        <Badge colorScheme="blue" px={3} py={1} borderRadius="full" fontSize="sm">
          Aprende Ciencia
        </Badge>
        <Heading as="h1" size="2xl" color={headingColor} fontWeight="bold">
          ¡Descubre la Ciencia!
        </Heading>
        <Text fontSize="lg" color={textColor} maxW="2xl">
          Experimentos divertidos y datos asombrosos para mentes curiosas
        </Text>
      </VStack>

      {/* Filtros y búsqueda */}
      <VStack spacing={4} mb={8} align="stretch">
        <InputGroup size="lg" maxW="600px" mx="auto">
          <InputLeftElement pointerEvents="none">
            <Icon as={FaSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Buscar experimentos y datos científicos..."
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

        {/* Categorías */}
        <Box overflowX="auto" py={2}>
          <Wrap spacing={2} justify="center">
            {scienceCategories.map((category) => {
              const isActive = selectedTopic === category.id;
              const IconComponent = category.icon;
              
              return (
                <WrapItem key={category.id}>
                  <Button
                    size={isMobile ? 'sm' : 'md'}
                    leftIcon={<Icon as={IconComponent} />}
                    colorScheme={isActive ? 'blue' : 'gray'}
                    variant={isActive ? 'solid' : 'outline'}
                    onClick={() => setSelectedTopic(category.id as ScienceTopic | 'all')}
                    borderRadius="full"
                    px={4}
                  >
                    {category.name}
                  </Button>
                </WrapItem>
              );
            })}
          </Wrap>
        </Box>
      </VStack>

      {/* Contenido principal */}
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
                  borderWidth="1px" 
                  borderRadius="lg" 
                  p={6}
                  borderColor={borderColor}
                  bg={useColorModeValue('yellow.50', 'yellow.900')}
                >
                  <VStack spacing={4} align="stretch">
                    <HStack>
                      <Icon as={FaLightbulb} color="yellow.500" boxSize={6} />
                      <Text fontWeight="bold" fontSize="lg">¿Sabías que...?</Text>
                    </HStack>
                    <Text fontSize="lg" fontStyle="italic">
                      "{randomFact.content}"
                    </Text>
                    {randomFact.title && (
                      <Text alignSelf="flex-end" color="gray.500">
                        — {randomFact.title}
                      </Text>
                    )}
                  </VStack>
                </Box>
              )}
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Button 
                  leftIcon={<FaLightbulb />}
                  colorScheme="yellow"
                  variant="outline"
                >
                  Ver otro dato curioso
                </Button>
                <Button 
                  leftIcon={<FaBook />}
                  colorScheme="yellow"
                  onClick={handleViewAllFacts}
                >
                  Ver más datos curiosos
                </Button>
              </SimpleGrid>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ScienceModule;
