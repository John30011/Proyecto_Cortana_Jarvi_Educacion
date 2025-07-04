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
  
  // Filtrar contenido por término de búsqueda y tema seleccionado
  const filteredContent = useMemo(() => {
    // Definir el tipo de contenido basado en la pestaña activa
    if (activeTab === 0) {
      // Para experimentos
      let filteredExperiments = [...experiments];
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredExperiments = filteredExperiments.filter(exp => 
          exp.title.toLowerCase().includes(term) || 
          exp.description.toLowerCase().includes(term) ||
          exp.materials.some(m => m.toLowerCase().includes(term))
        );
      }
      
      if (selectedTopic !== 'all') {
        filteredExperiments = filteredExperiments.filter(exp => exp.topic === selectedTopic);
      }
      
      return filteredExperiments;
    } else {
      // Para hechos científicos
      let filteredFacts = [...facts];
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredFacts = filteredFacts.filter(fact => 
          fact.title.toLowerCase().includes(term) || 
          fact.description.toLowerCase().includes(term) ||
          fact.fact.toLowerCase().includes(term)
        );
      }
      
      if (selectedTopic !== 'all') {
        filteredFacts = filteredFacts.filter(fact => 
          fact.topics.includes(selectedTopic)
        );
      }
      
      return filteredFacts;
    }
  }, [activeTab, experiments, facts, searchTerm, selectedTopic, isLoading]);

  // Obtener el color del tema
  const getTopicColor = (topic: string) => {
    return topicIcons[topic as keyof typeof topicIcons]?.color || 'gray';
  };

  // Obtener el ícono del tema
  const getTopicIcon = (topic: string) => {
    return topicIcons[topic as keyof typeof topicIcons]?.icon || FaAtom;
  };
  
  if (isLoading) {
    return (
      <Container maxW="8xl" py={8} px={{ base: 4, md: 8 }}>
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
      </Container>
    );
  }

  return (
    <Container maxW="8xl" py={8} px={{ base: 4, md: 8 }}>
      {/* Encabezado */}
      <VStack spacing={4} mb={8} textAlign="center">
        <Badge colorScheme="blue" px={3} py={1} borderRadius="full" fontSize="sm">
          Aprende Ciencia
        </Badge>
        <Heading as="h1" size="2xl" color={headingColor} fontWeight="bold">
          ¡Descubre la Ciencia para niños de {ageGroup} años!
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

      {/* Sección de dato curioso */}
      <ScaleFade in={!!randomFact} initialScale={0.9}>
        <Box
          mt={12}
          bgGradient="linear(to-r, blue.50, purple.50)"
          p={6}
          borderRadius="xl"
          borderLeft="4px solid"
          borderColor="blue.500"
          position="relative"
          overflow="hidden"
        >
          <Box
            position="absolute"
            top={-4}
            right={-4}
            bg="blue.100"
            p={3}
            borderRadius="full"
            boxShadow="md"
          >
            <Icon as={FaLightbulb} color="yellow.500" boxSize={6} />
          </Box>
          
          <VStack align="start" spacing={4}>
            <Heading size="md" color="blue.700">
              ¡Dato Curioso!
            </Heading>
            <Text fontSize="lg" color={textColor} fontStyle="italic">
              "{randomFact ? randomFact.fact : 'Cargando dato curioso...'}"
            </Text>
            {randomFact?.title && (
              <Text alignSelf="flex-end" color="gray.500">
                — {randomFact.title}
              </Text>
            )}
            <Button
              size="sm"
              variant="outline"
              colorScheme="blue"
              rightIcon={<Icon as={FaArrowRight} />}
              onClick={async () => {
                try {
                  const fact = await getRandomFact(ageGroup);
                  setRandomFact(fact);
                } catch (error) {
                  toast({
                    title: 'Error',
                    description: 'No se pudo cargar un nuevo dato curioso. Intenta de nuevo más tarde.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                  });
                }
              }}
              isLoading={!randomFact}
              loadingText="Cargando..."
            >
              Más datos curiosos
            </Button>
          </VStack>
        </Box>
      </ScaleFade>

      {/* Contenido principal */}
      <Box>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredContent.length > 0 ? (
            filteredContent.map((item) => (
              <ScienceCard 
                key={item.id || Math.random().toString(36).substr(2, 9)}
                item={item} 
                topicIcons={topicIcons}
                onLearnMore={() => {
                  if ('steps' in item) {
                    // Es un experimento
                    navigate(`/science/experiment/${item.id}`);
                  } else {
                    // Es un hecho científico
                    navigate(`/science/fact/${item.id}`);
                  }
                }}
              />
            ))
          ) : (
            <Box 
              p={6}
              borderColor={borderColor}
              bg={useColorModeValue('yellow.50', 'yellow.900')}
              borderRadius="lg"
            >
              <VStack spacing={4} align="stretch">
                <HStack>
                  <Icon as={FaLightbulb} color="yellow.500" boxSize={6} />
                  <Text fontWeight="bold" fontSize="lg">¡No se encontraron resultados!</Text>
                </HStack>
                <Text>
                  No hay {activeTab === 0 ? 'experimentos' : 'datos científicos'} que coincidan con tu búsqueda.
                  Intenta con otros términos o cambia los filtros.
                </Text>
              </VStack>
            </Box>
          )}
        </SimpleGrid>
      </Box>
    </Container>
  );
};

export default ScienceModule;
