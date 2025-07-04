import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Image,
  SimpleGrid,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  useColorModeValue,
  VStack,
  Wrap,
  WrapItem,
  Badge,
  Divider,
  useDisclosure,
  Collapse,
  IconButton,
  Tooltip,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  AspectRatio,
  Link as ChakraLink,
  UnorderedList,
  ListItem,
  ListIcon
} from '@chakra-ui/react';
import { 
  FaArrowLeft, 
  FaBook, 
  FaFlask, 
  FaQuestionCircle, 
  FaStar, 
  FaRegStar, 
  FaShare, 
  FaChevronDown, 
  FaChevronUp,
  FaYoutube,
  FaLink,
  FaBookOpen,
  FaGraduationCap
} from 'react-icons/fa';
import { useScienceModule } from '../hooks/useScienceModule';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const TopicPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onToggle } = useDisclosure();
  
  const {
    ageGroup,
    setAgeGroup,
    getTopicById,
    getExperimentsByTopic,
    getFactsByTopic,
    getQuestionsByTopic,
    saveFavoriteTopic,
    isTopicFavorite,
    progress,
    isLoading
  } = useScienceModule();
  
  // Estados
  const [topic, setTopic] = useState<any>(null);
  const [experiments, setExperiments] = useState<any[]>([]);
  const [facts, setFacts] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Cargar datos del tema
  useEffect(() => {
    const loadTopicData = async () => {
      try {
        setIsLoadingContent(true);
        
        // Obtener información del tema
        const topicData = getTopicById(topicId || '');
        setTopic(topicData);
        
        // Obtener experimentos relacionados
        const exps = getExperimentsByTopic(topicId || '', ageGroup);
        setExperiments(exps);
        
        // Obtener datos curiosos relacionados
        const factsData = getFactsByTopic(topicId || '', ageGroup);
        setFacts(factsData);
        
        // Obtener preguntas de práctica
        const quizQuestions = getQuestionsByTopic(topicId || '', ageGroup);
        setQuestions(quizQuestions);
        
      } catch (err) {
        console.error('Error al cargar el tema:', err);
        
        toast({
          title: 'Error',
          description: 'No se pudo cargar la información del tema. Por favor, inténtalo de nuevo más tarde.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoadingContent(false);
      }
    };
    
    if (topicId) {
      loadTopicData();
    }
  }, [topicId, ageGroup, getTopicById, getExperimentsByTopic, getFactsByTopic, getQuestionsByTopic, toast]);
  
  // Manejar el guardado de un tema como favorito
  const handleSaveFavorite = async () => {
    if (!topicId) return;
    
    try {
      setIsSaving(true);
      const success = await saveFavoriteTopic(topicId);
      
      if (success) {
        toast({
          title: isTopicFavorite(topicId) ? 'Tema eliminado de favoritos' : 'Tema añadido a favoritos',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error('Error al guardar el tema favorito:', err);
      
      toast({
        title: 'Error',
        description: 'No se pudo guardar el tema en favoritos.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Compartir tema
  const shareTopic = async () => {
    if (!topic) return;
    
    try {
      const shareData = {
        title: `Tema: ${topic.name}`,
        text: `Aprende sobre ${topic.name} con estos recursos educativos.`,
        url: window.location.href,
      };
      
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Copiar al portapapeles como alternativa
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        
        toast({
          title: '¡Enlace copiado!',
          description: 'El enlace al tema ha sido copiado al portapapeles.',
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
  const subtleBg = useColorModeValue('gray.50', 'gray.700');
  
  // Mostrar carga
  if (isLoading || isLoadingContent) {
    return (
      <Flex justify="center" align="center" minH="300px">
        <Spinner size="xl" color={accentColor} />
      </Flex>
    );
  }
  
  // Mostrar error si no se encuentra el tema
  if (!topic) {
    return (
      <Alert status="error" borderRadius="md" variant="subtle" flexDirection="column"
        alignItems="center" justifyContent="center" textAlign="center" minH="200px">
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Tema no encontrado
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          Lo sentimos, no pudimos encontrar el tema que estás buscando.
        </AlertDescription>
        <Button mt={4} colorScheme="blue" onClick={() => navigate('/science')}>
          Volver a temas
        </Button>
      </Alert>
    );
  }
  
  // Renderizar recursos educativos
  const renderResources = () => (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={4}>
      <Box 
        bg={subtleBg} 
        p={4} 
        borderRadius="md"
        borderLeftWidth="4px"
        borderLeftColor="blue.400"
      >
        <HStack spacing={2} mb={2}>
          <Icon as={FaBookOpen} color="blue.500" />
          <Text fontWeight="bold">Para leer</Text>
        </HStack>
        <UnorderedList spacing={2} pl={4}>
          {topic.resources?.articles?.slice(0, 3).map((article: any, index: number) => (
            <ListItem key={index}>
              <ChakraLink href={article.url} isExternal color="blue.500">
                {article.title} <ExternalLinkIcon mx="2px" />
              </ChakraLink>
            </ListItem>
          )) || (
            <Text color="gray.500" fontStyle="italic">No hay artículos disponibles</Text>
          )}
        </UnorderedList>
      </Box>
      
      <Box 
        bg={subtleBg} 
        p={4} 
        borderRadius="md"
        borderLeftWidth="4px"
        borderLeftColor="red.400"
      >
        <HStack spacing={2} mb={2}>
          <Icon as={FaYoutube} color="red.500" />
          <Text fontWeight="bold">Videos</Text>
        </HStack>
        <UnorderedList spacing={2} pl={4}>
          {topic.resources?.videos?.slice(0, 3).map((video: any, index: number) => (
            <ListItem key={index}>
              <ChakraLink href={video.url} isExternal color="blue.500">
                {video.title} <ExternalLinkIcon mx="2px" />
              </ChakraLink>
            </ListItem>
          )) || (
            <Text color="gray.500" fontStyle="italic">No hay videos disponibles</Text>
          )}
        </UnorderedList>
      </Box>
    </SimpleGrid>
  );
  
  // Renderizar experimentos
  const renderExperiments = () => (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={4}>
      {experiments.length > 0 ? (
        experiments.slice(0, 4).map((exp) => (
          <Box
            key={exp.id}
            bg={cardBg}
            p={4}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
            _hover={{
              borderColor: accentColor,
              boxShadow: 'md',
              transform: 'translateY(-2px)'
            }}
            transition="all 0.2s"
            as={ChakraLink}
            href={`/science/experiments/${exp.id}`}
            textDecoration="none"
          >
            <HStack spacing={3}>
              <Icon as={FaFlask} color="blue.500" boxSize={6} />
              <Box>
                <Text fontWeight="medium">{exp.title}</Text>
                <Text fontSize="sm" color="gray.500">
                  {exp.duration} min • {exp.difficulty}
                </Text>
              </Box>
            </HStack>
          </Box>
        ))
      ) : (
        <Text color="gray.500" fontStyle="italic">
          No hay experimentos disponibles para este tema.
        </Text>
      )}
    </SimpleGrid>
  );
  
  // Renderizar datos curiosos
  const renderFacts = () => (
    <SimpleGrid columns={{ base: 1 }} spacing={4} mt={4}>
      {facts.length > 0 ? (
        facts.slice(0, 5).map((fact, index) => (
          <Box
            key={fact.id || index}
            bg={cardBg}
            p={4}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
            _hover={{
              borderColor: accentColor,
              boxShadow: 'md',
            }}
            transition="all 0.2s"
          >
            <Text fontWeight="medium">{fact.title}</Text>
            <Text fontSize="sm" color="gray.600" mt={1} noOfLines={2}>
              {fact.content}
            </Text>
          </Box>
        ))
      ) : (
        <Text color="gray.500" fontStyle="italic">
          No hay datos curiosos disponibles para este tema.
        </Text>
      )}
    </SimpleGrid>
  );
  
  // Renderizar preguntas de práctica
  const renderPracticeQuestions = () => (
    <Box mt={4}>
      {questions.length > 0 ? (
        <VStack spacing={4} align="stretch">
          {questions.slice(0, 3).map((q, index) => (
            <Box
              key={q.id || index}
              bg={cardBg}
              p={4}
              borderRadius="md"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Text fontWeight="medium" mb={2}>
                {q.question}
              </Text>
              <VStack align="stretch" spacing={2}>
                {q.options.map((opt: string, optIndex: number) => (
                  <HStack
                    key={optIndex}
                    p={2}
                    bg={q.correctAnswerIndex === optIndex ? 'green.50' : 'transparent'}
                    borderRadius="md"
                    borderWidth={q.correctAnswerIndex === optIndex ? '1px' : '1px'}
                    borderColor={q.correctAnswerIndex === optIndex ? 'green.200' : 'transparent'}
                  >
                    <Box
                      w={4}
                      h={4}
                      borderRadius="full"
                      bg={q.correctAnswerIndex === optIndex ? 'green.500' : 'gray.200'}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="white"
                      fontSize="xs"
                      fontWeight="bold"
                      flexShrink={0}
                    >
                      {String.fromCharCode(65 + optIndex)}
                    </Box>
                    <Text fontSize="sm">{opt}</Text>
                  </HStack>
                ))}
              </VStack>
              {q.explanation && (
                <Box
                  mt={2}
                  p={2}
                  bg="blue.50"
                  borderRadius="md"
                  borderLeftWidth="3px"
                  borderLeftColor="blue.400"
                >
                  <Text fontSize="sm" color="blue.700">
                    <strong>Explicación:</strong> {q.explanation}
                  </Text>
                </Box>
              )}
            </Box>
          ))}
          
          {questions.length > 3 && (
            <Button
              mt={2}
              variant="outline"
              colorScheme="blue"
              size="sm"
              onClick={() => {
                // Navegar a la página de cuestionarios con este tema
                navigate(`/science/quizzes?topic=${topicId}`);
              }}
            >
              Ver más preguntas
            </Button>
          )}
        </VStack>
      ) : (
        <Text color="gray.500" fontStyle="italic">
          No hay preguntas de práctica disponibles para este tema.
        </Text>
      )}
    </Box>
  );
  
  return (
    <Box maxW="container.xl" mx="auto" p={{ base: 4, md: 6 }}>
      {/* Botón de regreso */}
      <Button 
        leftIcon={<FaArrowLeft />} 
        variant="ghost" 
        mb={6}
        onClick={() => navigate(-1)}
      >
        Volver
      </Button>
      
      {/* Encabezado del tema */}
      <Box 
        bgGradient={`linear(to-r, ${topic.color || 'blue.500'}, ${topic.secondaryColor || 'purple.500'})`}
        color="white"
        p={8}
        borderRadius="xl"
        mb={8}
        position="relative"
        overflow="hidden"
      >
        {/* Fondo decorativo */}
        <Box
          position="absolute"
          top="-50%"
          right="-50%"
          width="100%"
          height="200%"
          opacity="0.1"
          backgroundImage="radial-gradient(circle, white 1px, transparent 1px)"
          backgroundSize="20px 20px"
          transform="rotate(15deg)"
          pointerEvents="none"
        />
        
        <Flex direction={{ base: 'column', md: 'row' }} position="relative" zIndex="1">
          <Box flex="1">
            <Flex align="center" mb={2}>
              <Badge 
                colorScheme="whiteAlpha" 
                variant="solid" 
                px={3} 
                py={1} 
                borderRadius="full"
                fontSize="0.7em"
                mr={3}
              >
                {topic.category || 'Ciencia'}
              </Badge>
              
              <Text fontSize="sm" opacity="0.9">
                Para {ageGroup} años
              </Text>
            </Flex>
            
            <Heading size="xl" mb={4}>
              {topic.name}
            </Heading>
            
            <Text fontSize="lg" mb={6} maxW="2xl" opacity="0.95">
              {topic.description}
            </Text>
            
            <HStack spacing={4}>
              <Button 
                colorScheme="white" 
                variant="outline"
                leftIcon={isTopicFavorite(topic.id) ? <FaStar /> : <FaRegStar />}
                onClick={handleSaveFavorite}
                isLoading={isSaving}
              >
                {isTopicFavorite(topic.id) ? 'Guardado' : 'Guardar'}
              </Button>
              
              <Button 
                colorScheme="white" 
                variant="outline"
                leftIcon={<FaShare />}
                onClick={shareTopic}
              >
                Compartir
              </Button>
              
              <Select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value as any)}
                maxW="150px"
                color="white"
                borderColor="whiteAlpha.500"
                _hover={{ borderColor: 'whiteAlpha.700' }}
                _focus={{ borderColor: 'white', boxShadow: '0 0 0 1px white' }}
                css={{
                  '> option': {
                    color: 'black',
                    backgroundColor: 'white'
                  }
                }}
              >
                <option value="3-5">3-5 años</option>
                <option value="6-8">6-8 años</option>
                <option value="9-12">9-12 años</option>
              </Select>
            </HStack>
          </Box>
          
          {topic.imageUrl && (
            <Box 
              display={{ base: 'none', lg: 'block' }}
              width="300px"
              ml={8}
              flexShrink={0}
            >
              <AspectRatio ratio={1}>
                <Image 
                  src={topic.imageUrl} 
                  alt={topic.name}
                  borderRadius="lg"
                  objectFit="cover"
                  boxShadow="xl"
                />
              </AspectRatio>
            </Box>
          )}
        </Flex>
      </Box>
      
      {/* Contenido del tema */}
      <Tabs variant="enclosed" colorScheme="blue" mt={8}>
        <TabList overflowX="auto" overflowY="hidden" pb={1}>
          <Tab fontWeight="medium">
            <HStack spacing={2}>
              <Icon as={FaBook} />
              <Text>Información</Text>
            </HStack>
          </Tab>
          <Tab fontWeight="medium">
            <HStack spacing={2}>
              <Icon as={FaFlask} />
              <Text>Experimentos ({experiments.length})</Text>
            </HStack>
          </Tab>
          <Tab fontWeight="medium">
            <HStack spacing={2}>
              <Icon as={FaStar} />
              <Text>Datos curiosos ({facts.length})</Text>
            </HStack>
          </Tab>
          <Tab fontWeight="medium">
            <HStack spacing={2}>
              <Icon as={FaQuestionCircle} />
              <Text>Práctica</Text>
            </HStack>
          </Tab>
          <Tab fontWeight="medium">
            <HStack spacing={2}>
              <Icon as={FaGraduationCap} />
              <Text>Recursos</Text>
            </HStack>
          </Tab>
        </TabList>
        
        <TabPanels mt={6}>
          <TabPanel p={0}>
            <Box 
              bg={cardBg} 
              p={6} 
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              dangerouslySetInnerHTML={{ __html: topic.content || '<p>No hay información disponible para este tema.</p>' }}
            />
            
            {topic.keyPoints && topic.keyPoints.length > 0 && (
              <Box 
                bg={subtleBg} 
                p={6} 
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
                mt={6}
              >
                <Heading size="md" mb={4}>Puntos clave</Heading>
                <UnorderedList spacing={2}>
                  {topic.keyPoints.map((point: string, index: number) => (
                    <ListItem key={index}>{point}</ListItem>
                  ))}
                </UnorderedList>
              </Box>
            )}
            
            {topic.vocabulary && topic.vocabulary.length > 0 && (
              <Box 
                bg={cardBg} 
                p={6} 
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
                mt={6}
              >
                <Heading size="md" mb={4}>Vocabulario</Heading>
                <Wrap spacing={3}>
                  {topic.vocabulary.map((word: any, index: number) => (
                    <WrapItem key={index}>
                      <Tooltip label={word.definition} placement="top">
                        <Tag size="lg" colorScheme="blue" variant="subtle" cursor="help">
                          {word.term}
                        </Tag>
                      </Tooltip>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
            )}
          </TabPanel>
          
          <TabPanel p={0}>
            <Box 
              bg={cardBg} 
              p={6} 
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Heading size="md" mb={4}>Experimentos sobre {topic.name}</Heading>
              {renderExperiments()}
              
              {experiments.length > 0 && (
                <Button 
                  mt={6} 
                  colorScheme="blue" 
                  rightIcon={<FaArrowRight />}
                  as="a"
                  href="/science/experiments"
                >
                  Ver todos los experimentos
                </Button>
              )}
            </Box>
          </TabPanel>
          
          <TabPanel p={0}>
            <Box 
              bg={cardBg} 
              p={6} 
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Heading size="md" mb={4}>Datos curiosos sobre {topic.name}</Heading>
              {renderFacts()}
              
              {facts.length > 0 && (
                <Button 
                  mt={6} 
                  colorScheme="blue" 
                  variant="outline"
                  rightIcon={<FaArrowRight />}
                  as="a"
                  href="/science/facts"
                >
                  Ver más datos curiosos
                </Button>
              )}
            </Box>
          </TabPanel>
          
          <TabPanel p={0}>
            <Box 
              bg={cardBg} 
              p={6} 
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Heading size="md" mb={4}>Pon a prueba lo aprendido</Heading>
              <Text mb={4} color="gray.600">
                Responde estas preguntas para verificar tu comprensión sobre {topic.name.toLowerCase()}.
              </Text>
              
              {renderPracticeQuestions()}
              
              {questions.length > 0 && (
                <Button 
                  mt={6} 
                  colorScheme="blue" 
                  rightIcon={<FaArrowRight />}
                  onClick={() => {
                    // Iniciar un cuestionario con preguntas de este tema
                    navigate(`/science/quizzes?topic=${topicId}`);
                  }}
                >
                  Comenzar cuestionario
                </Button>
              )}
            </Box>
          </TabPanel>
          
          <TabPanel p={0}>
            <Box 
              bg={cardBg} 
              p={6} 
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Heading size="md" mb={4}>Recursos adicionales</Heading>
              <Text mb={6} color="gray.600">
                Explora estos recursos seleccionados para aprender más sobre {topic.name.toLowerCase()}.
              </Text>
              
              {renderResources()}
              
              {topic.resources?.books && topic.resources.books.length > 0 && (
                <Box mt={8}>
                  <Heading size="md" mb={4}>Libros recomendados</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    {topic.resources.books.map((book: any, index: number) => (
                      <Box
                        key={index}
                        bg={subtleBg}
                        p={4}
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor={borderColor}
                        _hover={{
                          borderColor: accentColor,
                          transform: 'translateY(-2px)'
                        }}
                        transition="all 0.2s"
                      >
                        {book.coverUrl && (
                          <Image 
                            src={book.coverUrl} 
                            alt={`Portada de ${book.title}`}
                            mb={3}
                            maxH="120px"
                            objectFit="contain"
                            mx="auto"
                          />
                        )}
                        <Text fontWeight="medium">{book.title}</Text>
                        <Text fontSize="sm" color="gray.500" mb={2}>
                          {book.author}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {book.recommendedAges || 'Para todas las edades'}
                        </Text>
                        {book.url && (
                          <ChakraLink 
                            href={book.url} 
                            isExternal 
                            color="blue.500" 
                            fontSize="sm"
                            display="inline-block"
                            mt={2}
                          >
                            Ver más <ExternalLinkIcon mx="2px" />
                          </ChakraLink>
                        )}
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>
              )}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      {/* Sección de temas relacionados */}
      {topic.relatedTopics && topic.relatedTopics.length > 0 && (
        <Box mt={12}>
          <Heading size="lg" mb={6}>Temas relacionados</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {topic.relatedTopics.map((relatedTopic: any) => {
              const relatedTopicData = getTopicById(relatedTopic.id);
              if (!relatedTopicData) return null;
              
              return (
                <Box
                  key={relatedTopic.id}
                  bg={cardBg}
                  p={4}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                  _hover={{
                    borderColor: accentColor,
                    transform: 'translateY(-2px)'
                  }}
                  transition="all 0.2s"
                  as="a"
                  href={`/science/topics/${relatedTopic.id}`}
                  textDecoration="none"
                >
                  <HStack spacing={3}>
                    {relatedTopicData.icon && (
                      <Icon as={relatedTopicData.icon} color="blue.500" boxSize={6} />
                    )}
                    <Box>
                      <Text fontWeight="medium">{relatedTopicData.name}</Text>
                      <Text fontSize="sm" color="gray.500" noOfLines={2}>
                        {relatedTopicData.shortDescription || relatedTopicData.description?.substring(0, 80) + '...'}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>
      )}
    </Box>
  );
};

export default TopicPage;
