import React, { useState, useEffect } from 'react';
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
  AspectRatio
} from '@chakra-ui/react';
import { FaFlask, FaQuestionCircle, FaLightbulb, FaBook, FaGamepad } from 'react-icons/fa';
import { ScienceExperiment, ScienceFact, AgeGroup } from './types';
import { getScienceExperiments, getRandomFact } from './services';
import { useParams, useNavigate } from 'react-router-dom';

const ScienceModule: React.FC = () => {
  const { ageGroup = '6-8' } = useParams<{ ageGroup?: AgeGroup }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [experiments, setExperiments] = useState<ScienceExperiment[]>([]);
  const [randomFact, setRandomFact] = useState<ScienceFact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Cargar experimentos
        const exps = await getScienceExperiments(ageGroup);
        setExperiments(exps);
        
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
    return (
      <Flex justify="center" align="center" minH="300px">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }
  
  return (
    <Box bg={bgColor} borderRadius="lg" boxShadow="md" p={6}>
      <Tabs 
        variant="enclosed" 
        colorScheme="blue" 
        index={activeTab} 
        onChange={handleTabChange}
      >
        <TabList>
          <Tab>
            <HStack spacing={2}>
              <Icon as={FaFlask} />
              <Text>Experimentos</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack spacing={2}>
              <Icon as={FaQuestionCircle} />
              <Text>Cuestionarios</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack spacing={2}>
              <Icon as={FaLightbulb} />
              <Text>Datos Curiosos</Text>
            </HStack>
          </Tab>
        </TabList>
        
        <TabPanels mt={4}>
          {/* Panel de Experimentos */}
          <TabPanel p={0}>
            <VStack align="stretch" spacing={6}>
              <Heading size="lg" mb={4}>Experimentos para {ageGroup} años</Heading>
              
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {experiments.slice(0, 3).map((experiment) => (
                  <Box 
                    key={experiment.id}
                    borderWidth="1px" 
                    borderRadius="lg" 
                    overflow="hidden"
                    borderColor={borderColor}
                    transition="all 0.2s"
                    _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
                  >
                    {experiment.imageUrl && (
                      <Box 
                        h="160px" 
                        bg={`url(${experiment.imageUrl})`} 
                        bgSize="cover" 
                        bgPosition="center"
                      />
                    )}
                    <Box p={4}>
                      <HStack mb={2}>
                        <Badge colorScheme="blue">{experiment.difficulty}</Badge>
                        <Badge colorScheme="green">{experiment.duration} min</Badge>
                      </HStack>
                      <Heading size="md" mb={2}>{experiment.title}</Heading>
                      <Text color="gray.600" noOfLines={2} mb={4}>
                        {experiment.description}
                      </Text>
                      <Button 
                        colorScheme="blue" 
                        size="sm" 
                        rightIcon={<FaFlask />}
                        width="100%"
                      >
                        Ver Experimento
                      </Button>
                    </Box>
                  </Box>
                ))}
              </SimpleGrid>
              
              <Button 
                variant="outline" 
                colorScheme="blue" 
                onClick={handleViewAllExperiments}
                alignSelf="flex-end"
              >
                Ver todos los experimentos
              </Button>
            </VStack>
          </TabPanel>
          
          {/* Panel de Cuestionarios */}
          <TabPanel p={0}>
            <VStack align="stretch" spacing={6}>
              <Heading size="lg" mb={4}>Cuestionarios de Ciencias</Heading>
              
              <Box 
                borderWidth="1px" 
                borderRadius="lg" 
                p={6}
                borderColor={borderColor}
                bg={useColorModeValue('blue.50', 'blue.900')}
              >
                <VStack spacing={4} align="stretch">
                  <Heading size="md">¡Pon a prueba tus conocimientos!</Heading>
                  <Text>
                    Responde preguntas sobre diferentes temas de ciencias y gana puntos. 
                    Cada cuestionario está adaptado a tu grupo de edad ({ageGroup} años).
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={4}>
                    {['Biología', 'Química', 'Física', 'Tierra y Espacio'].map((topic) => (
                      <Button 
                        key={topic}
                        leftIcon={<FaQuestionCircle />}
                        justifyContent="flex-start"
                        height="auto"
                        py={3}
                        px={4}
                        whiteSpace="normal"
                        textAlign="left"
                      >
                        {topic}
                      </Button>
                    ))}
                  </SimpleGrid>
                </VStack>
              </Box>
              
              <Button 
                variant="outline" 
                colorScheme="blue" 
                onClick={handleViewAllQuizzes}
                alignSelf="flex-end"
              >
                Ver todos los cuestionarios
              </Button>
            </VStack>
          </TabPanel>
          
          {/* Panel de Datos Curiosos */}
          <TabPanel p={0}>
            <VStack align="stretch" spacing={6}>
              <Heading size="lg" mb={4}>Datos Curiosos de Ciencia</Heading>
              
              {randomFact && (
                <Box 
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
