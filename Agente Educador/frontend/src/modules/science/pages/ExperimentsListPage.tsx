import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  Badge,
  Icon,
  HStack,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useDisclosure,
  Collapse
} from '@chakra-ui/react';
import { FaSearch, FaFilter, FaFlask, FaClock, FaArrowRight, FaTimes } from 'react-icons/fa';
import { useScienceModule } from '../hooks/useScienceModule';

const ExperimentsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { isOpen, onToggle } = useDisclosure();
  
  const {
    ageGroup,
    setAgeGroup,
    experiments,
    isLoading,
    error,
    isExperimentCompleted,
    getFilteredExperiments
  } = useScienceModule();
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [filteredExperiments, setFilteredExperiments] = useState(experiments);
  
  // Temas disponibles
  const topics = [
    { id: 'all', name: 'Todos los temas' },
    { id: 'biology', name: 'Biología' },
    { id: 'chemistry', name: 'Química' },
    { id: 'physics', name: 'Física' },
    { id: 'earth', name: 'Ciencias de la Tierra' },
    { id: 'space', name: 'Espacio' },
    { id: 'experiments', name: 'Experimentos' }
  ];
  
  // Dificultades disponibles
  const difficulties = [
    { id: 'all', name: 'Todas' },
    { id: 'easy', name: 'Fácil' },
    { id: 'medium', name: 'Intermedio' },
    { id: 'hard', name: 'Difícil' }
  ];
  
  // Filtrar experimentos cuando cambian los filtros o los datos
  useEffect(() => {
    let result = [...experiments];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(exp => 
        exp.title.toLowerCase().includes(term) || 
        exp.description.toLowerCase().includes(term)
      );
    }
    
    // Filtrar por tema
    if (selectedTopic !== 'all') {
      result = result.filter(exp => exp.topic === selectedTopic);
    }
    
    // Filtrar por dificultad
    if (selectedDifficulty !== 'all') {
      result = result.filter(exp => exp.difficulty === selectedDifficulty);
    }
    
    setFilteredExperiments(result);
  }, [searchTerm, selectedTopic, selectedDifficulty, experiments]);
  
  // Actualizar experimentos filtrados cuando cambia la lista de experimentos
  useEffect(() => {
    setFilteredExperiments(experiments);
  }, [experiments]);
  
  // Manejar cambio de grupo de edad
  const handleAgeGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAgeGroup(e.target.value as any);
    // Resetear filtros al cambiar el grupo de edad
    setSearchTerm('');
    setSelectedTopic('all');
    setSelectedDifficulty('all');
  };
  
  // Estilos
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const accentColor = useColorModeValue('blue.500', 'blue.300');
  const difficultyColors: Record<string, string> = {
    easy: 'green',
    medium: 'yellow',
    hard: 'red'
  };
  
  // Mostrar carga
  if (isLoading && experiments.length === 0) {
    return (
      <Flex justify="center" align="center" minH="300px">
        <Spinner size="xl" color={accentColor} />
      </Flex>
    );
  }
  
  // Mostrar error
  if (error) {
    return (
      <Alert status="error" borderRadius="md" variant="subtle" flexDirection="column"
        alignItems="center" justifyContent="center" textAlign="center" minH="200px">
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Error al cargar los experimentos
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          {error}
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Box maxW="container.xl" mx="auto" p={4}>
      {/* Encabezado y controles */}
      <VStack spacing={6} align="stretch" mb={8}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Heading size="lg">Experimentos de Ciencias</Heading>
          
          <Select 
            value={ageGroup} 
            onChange={handleAgeGroupChange}
            width={{ base: '100%', sm: 'auto' }}
            maxW="200px"
            variant="filled"
          >
            <option value="3-5">3-5 años</option>
            <option value="6-8">6-8 años</option>
            <option value="9-12">9-12 años</option>
          </Select>
        </Flex>
        
        {/* Barra de búsqueda */}
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FaSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Buscar experimentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg={cardBg}
            borderRadius="md"
          />
        </InputGroup>
        
        {/* Filtros */}
        <Box>
          <Button 
            leftIcon={<FaFilter />} 
            variant="outline" 
            size="sm"
            onClick={onToggle}
            mb={2}
          >
            Filtros {isOpen ? <Icon as={FaTimes} ml={2} /> : null}
          </Button>
          
          <Collapse in={isOpen} animateOpacity>
            <Box 
              p={4} 
              bg={useColorModeValue('gray.50', 'gray.700')} 
              borderRadius="md"
              mt={2}
            >
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Tema
                  </Text>
                  <Select 
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    bg={cardBg}
                  >
                    {topics.map(topic => (
                      <option key={topic.id} value={topic.id}>
                        {topic.name}
                      </option>
                    ))}
                  </Select>
                </Box>
                
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Dificultad
                  </Text>
                  <Select 
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    bg={cardBg}
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty.id} value={difficulty.id}>
                        {difficulty.name}
                      </option>
                    ))}
                  </Select>
                </Box>
              </SimpleGrid>
            </Box>
          </Collapse>
        </Box>
        
        {/* Etiquetas de filtros activos */}
        {(searchTerm || selectedTopic !== 'all' || selectedDifficulty !== 'all') && (
          <Flex wrap="wrap" gap={2} mb={4}>
            <Text fontSize="sm" color="gray.500" mr={2}>
              Filtros activos:
            </Text>
            
            {searchTerm && (
              <Badge 
                px={2} 
                py={1} 
                borderRadius="full" 
                colorScheme="blue"
                display="flex"
                alignItems="center"
              >
                "{searchTerm}"
                <Box 
                  as="button" 
                  ml={1} 
                  onClick={() => setSearchTerm('')}
                  _hover={{ color: 'red.500' }}
                >
                  <FaTimes size={12} />
                </Box>
              </Badge>
            )}
            
            {selectedTopic !== 'all' && (
              <Badge 
                px={2} 
                py={1} 
                borderRadius="full" 
                colorScheme="teal"
                display="flex"
                alignItems="center"
              >
                {topics.find(t => t.id === selectedTopic)?.name}
                <Box 
                  as="button" 
                  ml={1} 
                  onClick={() => setSelectedTopic('all')}
                  _hover={{ color: 'red.500' }}
                >
                  <FaTimes size={12} />
                </Box>
              </Badge>
            )}
            
            {selectedDifficulty !== 'all' && (
              <Badge 
                px={2} 
                py={1} 
                borderRadius="full" 
                colorScheme={difficultyColors[selectedDifficulty] || 'gray'}
                display="flex"
                alignItems="center"
              >
                {difficulties.find(d => d.id === selectedDifficulty)?.name}
                <Box 
                  as="button" 
                  ml={1} 
                  onClick={() => setSelectedDifficulty('all')}
                  _hover={{ color: 'red.500' }}
                >
                  <FaTimes size={12} />
                </Box>
              </Badge>
            )}
            
            <Button 
              variant="link" 
              colorScheme="blue" 
              size="sm" 
              ml="auto"
              onClick={() => {
                setSearchTerm('');
                setSelectedTopic('all');
                setSelectedDifficulty('all');
              }}
            >
              Limpiar filtros
            </Button>
          </Flex>
        )}
      </VStack>
      
      {/* Resultados */}
      {filteredExperiments.length === 0 ? (
        <Box 
          textAlign="center" 
          py={12} 
          bg={useColorModeValue('gray.50', 'gray.800')}
          borderRadius="lg"
        >
          <Icon as={FaFlask} boxSize={12} color="gray.400" mb={4} />
          <Heading size="md" mb={2}>
            No se encontraron experimentos
          </Heading>
          <Text color="gray.500" maxW="md" mx="auto">
            No hay experimentos que coincidan con los filtros seleccionados. 
            Intenta con otros criterios de búsqueda.
          </Text>
          <Button 
            mt={4} 
            colorScheme="blue"
            onClick={() => {
              setSearchTerm('');
              setSelectedTopic('all');
              setSelectedDifficulty('all');
            }}
          >
            Limpiar filtros
          </Button>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredExperiments.map((experiment) => (
            <Box
              key={experiment.id}
              bg={cardBg}
              borderRadius="lg"
              overflow="hidden"
              borderWidth="1px"
              borderColor={borderColor}
              transition="all 0.2s"
              _hover={{
                transform: 'translateY(-4px)',
                boxShadow: 'lg',
                borderColor: accentColor,
              }}
              position="relative"
            >
              {/* Badge de completado */}
              {isExperimentCompleted(experiment.id) && (
                <Box
                  position="absolute"
                  top="2"
                  right="2"
                  bg="green.500"
                  color="white"
                  borderRadius="full"
                  p={1}
                  zIndex="1"
                  title="Experimento completado"
                >
                  <FaCheck size={12} />
                </Box>
              )}
              
              {/* Imagen del experimento */}
              <Box 
                h="160px" 
                bg={`url(${experiment.imageUrl || '/images/science-placeholder.jpg'})`}
                bgSize="cover"
                bgPosition="center"
                position="relative"
              >
                <Box 
                  position="absolute" 
                  bottom="0" 
                  left="0" 
                  right="0" 
                  p={2}
                  bgGradient="linear(to-t, blackAlpha.800, transparent)"
                >
                  <HStack spacing={2} justify="space-between">
                    <Badge 
                      colorScheme={difficultyColors[experiment.difficulty] || 'gray'}
                      textTransform="capitalize"
                    >
                      {experiment.difficulty}
                    </Badge>
                    
                    <HStack spacing={1} color="white">
                      <Icon as={FaClock} />
                      <Text fontSize="sm">{experiment.duration} min</Text>
                    </HStack>
                  </HStack>
                </Box>
              </Box>
              
              {/* Contenido */}
              <Box p={4}>
                <Heading size="md" mb={2} noOfLines={2} minH="56px">
                  {experiment.title}
                </Heading>
                
                <Text color="gray.600" noOfLines={3} mb={4} minH="60px">
                  {experiment.description}
                </Text>
                
                <Flex justify="space-between" align="center" mt="auto">
                  <Badge 
                    colorScheme="blue" 
                    variant="subtle"
                    textTransform="capitalize"
                  >
                    {experiment.topic}
                  </Badge>
                  
                  <Button 
                    colorScheme="blue" 
                    variant="outline" 
                    size="sm"
                    rightIcon={<FaArrowRight />}
                    as={Link}
                    to={`/science/experiments/${experiment.id}`}
                  >
                    Ver más
                  </Button>
                </Flex>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default ExperimentsListPage;
