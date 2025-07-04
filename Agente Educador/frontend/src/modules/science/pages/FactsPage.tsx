import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Stack,
  Tag,
  TagLabel,
  Text,
  useColorModeValue,
  VStack,
  Wrap,
  WrapItem,
  useDisclosure,
  Collapse,
  Badge,
  Tooltip,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  AspectRatio,
  Image,
  Divider
} from '@chakra-ui/react';
import {
  FaFlask, 
  FaQuestionCircle, 
  FaLightbulb, 
  FaArrowRight, 
  FaBook, 
  FaGamepad,
  FaBug,
  FaExclamationTriangle,
  FaSyncAlt
} from 'react-icons/fa';
import { useScienceModule } from '../hooks/useScienceModule';

const FactsPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onToggle } = useDisclosure();
  
  const {
    ageGroup,
    setAgeGroup,
    facts,
    isLoading,
    error,
    getRandomFact,
    saveFavoriteFact,
    isFactFavorite,
    progress,
    loadNewRandomFact
  } = useScienceModule();
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [filteredFacts, setFilteredFacts] = useState(facts);
  const [randomFact, setRandomFact] = useState<any>(null);
  const [isLoadingRandom, setIsLoadingRandom] = useState(false);
  
  // Temas disponibles
  const topics = [
    { id: 'all', name: 'Todos los temas' },
    { id: 'biology', name: 'Biología' },
    { id: 'chemistry', name: 'Química' },
    { id: 'physics', name: 'Física' },
    { id: 'space', name: 'Espacio' },
    { id: 'earth', name: 'Tierra' },
    { id: 'animals', name: 'Animales' },
    { id: 'human-body', name: 'Cuerpo humano' },
    { id: 'technology', name: 'Tecnología' },
    { id: 'environment', name: 'Medio ambiente' }
  ];
  
  // Cargar un hecho aleatorio al inicio
  useEffect(() => {
    loadNewRandomFact();
  }, [loadNewRandomFact]);
  
  // Manejar el guardado de un hecho como favorito
  const handleSaveFavorite = async (factId: string) => {
    try {
      const success = await saveFavoriteFact(factId);
      
      if (success) {
        toast({
          title: isFactFavorite(factId) ? 'Eliminado de favoritos' : 'Añadido a favoritos',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error('Error al guardar el hecho favorito:', err);
      
      toast({
        title: 'Error',
        description: 'No se pudo guardar el hecho en favoritos.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // Compartir un hecho
  const shareFact = async (fact: any) => {
    try {
      const shareData = {
        title: `Dato curioso: ${fact.title}`,
        text: `${fact.content} - Descubre más en Ciencia para Niños`,
        url: window.location.href,
      };
      
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Copiar al portapapeles como alternativa
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        
        toast({
          title: '¡Enlace copiado!',
          description: 'El enlace al dato curioso ha sido copiado al portapapeles.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      // El usuario canceló el compartir
      if (err.name !== 'AbortError') {
        console.error('Error al compartir:', err);
      }
    }
  };
  
  // Estilos
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const accentColor = useColorModeValue('blue.500', 'blue.300');
  
  // Mostrar carga
  if (isLoading) {
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
          Error al cargar los datos
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
          <Heading size="lg">Datos Curiosos de Ciencia</Heading>
          
          <Select 
            value={ageGroup} 
            onChange={(e) => setAgeGroup(e.target.value as any)}
            width={{ base: '100%', sm: 'auto' }}
            maxW="200px"
            variant="filled"
          >
            <option value="3-5">3-5 años</option>
            <option value="6-8">6-8 años</option>
            <option value="9-12">9-12 años</option>
          </Select>
        </Flex>
        
        {/* Hecho aleatorio destacado */}
        {randomFact && (
          <Box 
            bgGradient="linear(to-r, blue.500, purple.500)" 
            color="white" 
            p={6} 
            borderRadius="lg"
            position="relative"
            overflow="hidden"
            boxShadow="lg"
            mb={6}
          >
            <Box position="absolute" top="4" right="4" zIndex="1">
              <Tooltip label={isFactFavorite(randomFact.id) ? 'Quitar de favoritos' : 'Guardar en favoritos'}>
                <IconButton
                  aria-label={isFactFavorite(randomFact.id) ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                  icon={isFactFavorite(randomFact.id) ? <FaHeart color="red" /> : <FaRegHeart />}
                  onClick={() => handleSaveFavorite(randomFact.id)}
                  variant="ghost"
                  colorScheme="whiteAlpha"
                  isRound
                  size="sm"
                />
              </Tooltip>
              
              <Tooltip label="Compartir">
                <IconButton
                  aria-label="Compartir"
                  icon={<FaShare />}
                  onClick={() => shareFact(randomFact)}
                  variant="ghost"
                  colorScheme="whiteAlpha"
                  isRound
                  size="sm"
                  ml={2}
                />
              </Tooltip>
            </Box>
            
            <Box position="relative" zIndex="1">
              <Badge 
                colorScheme="yellow" 
                mb={3} 
                px={3} 
                py={1} 
                borderRadius="full"
                fontSize="0.8em"
              >
                ¡Dato destacado!
              </Badge>
              
              <Heading size="md" mb={3}>
                {randomFact.title}
              </Heading>
              
              <Text mb={4} noOfLines={3}>
                {randomFact.content}
              </Text>
              
              <Wrap spacing={2} mb={4}>
                {randomFact.topics.slice(0, 3).map((topic: string) => (
                  <WrapItem key={topic}>
                    <Tag size="sm" variant="subtle" colorScheme="whiteAlpha">
                      {topic}
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
              
              <Flex justify="space-between" align="center">
                <Button 
                  variant="outline" 
                  colorScheme="whiteAlpha" 
                  size="sm"
                  onClick={loadRandomFact}
                  isLoading={isLoadingRandom}
                  leftIcon={<FaSyncAlt />}
                >
                  Otro dato
                </Button>
                
                <Button 
                  variant="solid" 
                  colorScheme="whiteAlpha" 
                  size="sm"
                  as={Link}
                  to={`/science/facts/${randomFact.id}`}
                >
                  Leer más
                </Button>
              </Flex>
            </Box>
            
            {/* Patrón de fondo */}
            <Box 
              position="absolute" 
              top="0" 
              right="0" 
              bottom="0" 
              left="0" 
              opacity="0.1"
              bgImage="url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"
            />
          </Box>
        )}
        
        {/* Barra de búsqueda y filtros */}
        <Box>
          <InputGroup mb={3}>
            <InputLeftElement pointerEvents="none">
              <Icon as={FaSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Buscar datos curiosos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg={cardBg}
              borderRadius="md"
              pr="4.5rem"
            />
          </InputGroup>
          
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={2}>
            <Button 
              leftIcon={<FaFilter />} 
              variant="outline" 
              size="sm"
              onClick={onToggle}
              aria-label="Mostrar filtros"
            >
              Filtros {isOpen ? <FaChevronUp style={{ marginLeft: '4px' }} /> : <FaChevronDown style={{ marginLeft: '4px' }} />}
            </Button>
            
            <Text fontSize="sm" color="gray.500">
              Mostrando {filteredFacts.length} de {facts.length} datos
            </Text>
          </Flex>
          
          <Collapse in={isOpen} animateOpacity>
            <Box 
              mt={3} 
              p={4} 
              bg={useColorModeValue('gray.50', 'gray.700')} 
              borderRadius="md"
            >
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Filtrar por tema:
              </Text>
              
              <Wrap spacing={2}>
                {topics.map(topic => (
                  <WrapItem key={topic.id}>
                    <Button
                      size="sm"
                      variant={selectedTopic === topic.id ? 'solid' : 'outline'}
                      colorScheme={selectedTopic === topic.id ? 'blue' : 'gray'}
                      onClick={() => setSelectedTopic(topic.id)}
                      borderRadius="full"
                      px={4}
                    >
                      {topic.name}
                    </Button>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          </Collapse>
        </Box>
      </VStack>
      
      {/* Lista de datos curiosos */}
      {filteredFacts.length === 0 ? (
        <Box 
          textAlign="center" 
          py={12} 
          bg={useColorModeValue('gray.50', 'gray.800')}
          borderRadius="lg"
        >
          <Icon as={FaSearch} boxSize={10} color="gray.400" mb={4} />
          <Heading size="md" mb={2}>
            No se encontraron datos
          </Heading>
          <Text color="gray.500" maxW="md" mx="auto">
            No hay datos que coincidan con los filtros seleccionados. 
            Intenta con otros términos de búsqueda o cambia los filtros.
          </Text>
          <Button 
            mt={4} 
            colorScheme="blue"
            onClick={() => {
              setSearchTerm('');
              setSelectedTopic('all');
            }}
          >
            Limpiar filtros
          </Button>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredFacts.map((fact) => (
            <Box
              key={fact.id}
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
              display="flex"
              flexDirection="column"
              height="100%"
            >
              {/* Imagen del hecho */}
              {fact.imageUrl && (
                <AspectRatio ratio={16 / 9} w="100%">
                  <Image 
                    src={fact.imageUrl} 
                    alt={fact.title}
                    objectFit="cover"
                    borderTopRadius="lg"
                  />
                </AspectRatio>
              )}
              
              {/* Contenido */}
              <Box p={5} flex="1" display="flex" flexDirection="column">
                <Box flex="1">
                  <HStack spacing={2} mb={2}>
                    {fact.topics.slice(0, 2).map((topic: string) => (
                      <Badge 
                        key={topic} 
                        colorScheme="blue" 
                        variant="subtle"
                        textTransform="capitalize"
                        fontSize="0.6em"
                        px={2}
                        py={0.5}
                        borderRadius="full"
                      >
                        {topic}
                      </Badge>
                    ))}
                    
                    {fact.topics.length > 2 && (
                      <Badge 
                        colorScheme="gray" 
                        variant="subtle"
                        fontSize="0.6em"
                        px={2}
                        py={0.5}
                        borderRadius="full"
                      >
                        +{fact.topics.length - 2}
                      </Badge>
                    )}
                  </HStack>
                  
                  <Heading size="md" mb={2} noOfLines={2}>
                    {fact.title}
                  </Heading>
                  
                  <Text color="gray.600" noOfLines={3} mb={4}>
                    {fact.content}
                  </Text>
                </Box>
                
                <Divider my={3} />
                
                <Flex justify="space-between" align="center">
                  <HStack spacing={2}>
                    <Tooltip label={isFactFavorite(fact.id) ? 'Quitar de favoritos' : 'Guardar en favoritos'}>
                      <IconButton
                        aria-label={isFactFavorite(fact.id) ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                        icon={isFactFavorite(fact.id) ? <FaBookmark color="#3182ce" /> : <FaRegBookmark />}
                        onClick={() => handleSaveFavorite(fact.id)}
                        variant="ghost"
                        size="sm"
                        colorScheme="blue"
                      />
                    </Tooltip>
                    
                    <Tooltip label="Compartir">
                      <IconButton
                        aria-label="Compartir"
                        icon={<FaShare />}
                        onClick={() => shareFact(fact)}
                        variant="ghost"
                        size="sm"
                        colorScheme="blue"
                      />
                    </Tooltip>
                  </HStack>
                  
                  <Button 
                    size="sm" 
                    colorScheme="blue" 
                    variant="outline"
                    as={Link}
                    to={`/science/facts/${fact.id}`}
                  >
                    Ver más
                  </Button>
                </Flex>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      )}
      
      {/* Botón para volver al inicio */}
      <Flex justify="center" mt={8}>
        <Button 
          leftIcon={<FaArrowLeft />} 
          variant="ghost" 
          onClick={() => navigate('/science')}
        >
          Volver al inicio
        </Button>
      </Flex>
    </Box>
  );
};

export default FactsPage;
