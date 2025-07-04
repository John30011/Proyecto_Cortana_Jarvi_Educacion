import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  IconButton,
  useColorModeValue,
  SimpleGrid,
  List,
  ListItem,
  ListIcon,
  Divider,
  Button,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Collapse,
  Icon,
  Flex,
  Image,
  AspectRatio,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Textarea
} from '@chakra-ui/react';
import { FaArrowLeft, FaFlask, FaCheck, FaExclamationTriangle, FaHeart, FaRegHeart, FaShare, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { MdTimer, MdScience, MdWarning } from 'react-icons/md';
import { useScienceModule } from '../hooks/useScienceModule';

const ExperimentDetailPage: React.FC = () => {
  const { experimentId } = useParams<{ experimentId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showAllMaterials, setShowAllMaterials] = useState(false);
  const [notes, setNotes] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);
  
  const {
    experiments,
    isLoading,
    error,
    isExperimentCompleted,
    handleExperimentComplete,
    progress
  } = useScienceModule();
  
  const [experiment, setExperiment] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Buscar el experimento por ID
  useEffect(() => {
    if (experimentId) {
      const foundExperiment = experiments.find(exp => exp.id === experimentId);
      if (foundExperiment) {
        setExperiment(foundExperiment);
        setIsCompleted(isExperimentCompleted(experimentId));
      }
    }
  }, [experimentId, experiments, isExperimentCompleted]);
  
  // Estilos
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const accentColor = useColorModeValue('blue.500', 'blue.300');
  const dangerColor = useColorModeValue('red.500', 'red.300');
  const successColor = useColorModeValue('green.500', 'green.300');
  
  // Manejar la finalización del experimento
  const handleCompleteExperiment = async () => {
    try {
      setIsCompleting(true);
      const success = await handleExperimentComplete(experimentId!, notes || undefined);
      
      if (success) {
        setIsCompleted(true);
        onClose();
        
        toast({
          title: '¡Experimento completado!',
          description: 'Has ganado puntos por completar este experimento.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error('Error al completar el experimento:', err);
      
      toast({
        title: 'Error',
        description: 'No se pudo marcar el experimento como completado. Inténtalo de nuevo.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsCompleting(false);
    }
  };
  
  // Mostrar carga
  if (isLoading && !experiment) {
    return (
      <Flex justify="center" align="center" minH="300px">
        <Spinner size="xl" color={accentColor} />
      </Flex>
    );
  }
  
  // Mostrar error
  if (error || !experiment) {
    return (
      <Alert status="error" borderRadius="md" variant="subtle" flexDirection="column"
        alignItems="center" justifyContent="center" textAlign="center" minH="200px">
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Experimento no encontrado
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          No pudimos encontrar el experimento que estás buscando. Por favor, verifica la URL o regresa a la página de experimentos.
        </AlertDescription>
        <Button 
          mt={4} 
          colorScheme="blue" 
          leftIcon={<FaArrowLeft />}
          onClick={() => navigate('/science/experiments')}
        >
          Volver a experimentos
        </Button>
      </Alert>
    );
  }
  
  // Función para compartir el experimento
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: experiment.title,
          text: `Mira este increíble experimento de ciencias: ${experiment.title}`,
          url: window.location.href,
        });
      } else {
        // Copiar al portapapeles como alternativa
        await navigator.clipboard.writeText(window.location.href);
        
        toast({
          title: '¡Enlace copiado!',
          description: 'El enlace al experimento ha sido copiado al portapapeles.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error('Error al compartir:', err);
    }
  };
  
  return (
    <Box maxW="container.lg" mx="auto" p={4}>
      {/* Botón de regreso */}
      <Button 
        leftIcon={<FaArrowLeft />} 
        variant="ghost" 
        mb={6}
        onClick={() => navigate(-1)}
      >
        Volver
      </Button>
      
      {/* Encabezado */}
      <VStack spacing={4} align="stretch" mb={8}>
        <HStack justify="space-between" align="flex-start">
          <Box>
            <Badge colorScheme="blue" mb={2} fontSize="sm">
              {experiment.ageGroup} años
            </Badge>
            <Heading size="xl" mb={2}>
              {experiment.title}
            </Heading>
          </Box>
          
          <HStack spacing={2}>
            <IconButton
              aria-label="Compartir"
              icon={<FaShare />}
              onClick={handleShare}
              variant="ghost"
              isRound
            />
            <IconButton
              aria-label={isCompleted ? "Quitar de completados" : "Marcar como completado"}
              icon={isCompleted ? <FaHeart color="red" /> : <FaRegHeart />}
              onClick={isCompleted ? undefined : onOpen}
              variant="ghost"
              isRound
              colorScheme={isCompleted ? 'red' : 'gray'}
            />
          </HStack>
        </HStack>
        
        <HStack spacing={4} color="gray.500">
          <HStack>
            <Icon as={MdTimer} />
            <Text>{experiment.duration} min</Text>
          </HStack>
          <HStack>
            <Icon as={MdScience} />
            <Text textTransform="capitalize">{experiment.difficulty}</Text>
          </HStack>
          {isCompleted && (
            <Badge colorScheme="green" ml="auto">
              <HStack spacing={1}>
                <FaCheck />
                <Text>Completado</Text>
              </HStack>
            </Badge>
          )}
        </HStack>
      </VStack>
      
      {/* Imagen del experimento */}
      {experiment.imageUrl && (
        <AspectRatio ratio={16 / 9} mb={8} borderRadius="lg" overflow="hidden" boxShadow="md">
          <Image 
            src={experiment.imageUrl} 
            alt={experiment.title}
            objectFit="cover"
          />
        </AspectRatio>
      )}
      
      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
        {/* Columna principal */}
        <Box gridColumn={{ base: '1', lg: '1 / 3' }}>
          {/* Descripción */}
          <Box mb={8}>
            <Heading size="md" mb={4}>Descripción</Heading>
            <Text whiteSpace="pre-line" lineHeight="tall">
              {experiment.description}
            </Text>
          </Box>
          
          {/* Pasos */}
          <Box mb={8}>
            <Heading size="md" mb={4}>Pasos a seguir</Heading>
            <List spacing={3}>
              {experiment.steps.map((step: string, index: number) => (
                <ListItem key={index} display="flex">
                  <ListIcon as={FaFlask} color={accentColor} mt={1} />
                  <Box>
                    <Text fontWeight="medium">Paso {index + 1}</Text>
                    <Text color="gray.600">{step}</Text>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
          
          {/* Notas de seguridad */}
          {experiment.safetyNotes && experiment.safetyNotes.length > 0 && (
            <Box mb={8}>
              <Heading size="md" mb={4} display="flex" alignItems="center">
                <Icon as={MdWarning} color={dangerColor} mr={2} />
                Medidas de seguridad
              </Heading>
              <Alert status="warning" variant="left-accent" mb={4}>
                <AlertIcon />
                <Box>
                  <Text fontWeight="bold" mb={1}>¡Importante!</Text>
                  <Text fontSize="sm">
                    Este experimento debe realizarse bajo la supervisión de un adulto.
                  </Text>
                </Box>
              </Alert>
              
              <List spacing={2}>
                {experiment.safetyNotes.map((note: string, index: number) => (
                  <ListItem key={index} display="flex" alignItems="flex-start">
                    <ListIcon as={FaExclamationTriangle} color={dangerColor} mt={1} />
                    <Text>{note}</Text>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
        
        {/* Barra lateral */}
        <Box>
          <Box 
            position="sticky" 
            top="6" 
            bg={cardBg} 
            p={6} 
            borderRadius="lg" 
            borderWidth="1px" 
            borderColor={borderColor}
            boxShadow="sm"
          >
            <VStack spacing={6} align="stretch">
              <Box>
                <Heading size="md" mb={4}>Materiales necesarios</Heading>
                <List spacing={2}>
                  {experiment.materials.slice(0, showAllMaterials ? undefined : 5).map((material: string, index: number) => (
                    <ListItem key={index} display="flex" alignItems="center">
                      <ListIcon as={FaCheck} color={successColor} />
                      <Text>{material}</Text>
                    </ListItem>
                  ))}
                </List>
                
                {experiment.materials.length > 5 && (
                  <Button
                    mt={2}
                    variant="link"
                    colorScheme="blue"
                    size="sm"
                    leftIcon={showAllMaterials ? <FaChevronUp /> : <FaChevronDown />}
                    onClick={() => setShowAllMaterials(!showAllMaterials)}
                  >
                    {showAllMaterials ? 'Ver menos' : `Ver ${experiment.materials.length - 5} más`}
                  </Button>
                )}
              </Box>
              
              <Divider />
              
              <Box>
                <Heading size="md" mb={4}>Tu progreso</Heading>
                <VStack spacing={3} align="stretch">
                  <Box>
                    <Text fontSize="sm" color="gray.500" mb={1}>Puntos actuales</Text>
                    <Text fontSize="2xl" fontWeight="bold" color={accentColor}>
                      {progress.points}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontSize="sm" color="gray.500" mb={1}>Experimentos completados</Text>
                    <Text fontSize="lg" fontWeight="medium">
                      {progress.completedExperiments.length}
                      <Text as="span" fontSize="sm" color="gray.500" ml={1}>
                        /{experiments.length}
                      </Text>
                    </Text>
                  </Box>
                  
                  {!isCompleted ? (
                    <Button 
                      colorScheme="blue" 
                      size="lg" 
                      mt={4}
                      leftIcon={<FaCheck />}
                      onClick={onOpen}
                      isFullWidth
                    >
                      Marcar como completado
                    </Button>
                  ) : (
                    <Button 
                      colorScheme="green" 
                      variant="outline"
                      size="lg" 
                      mt={4}
                      leftIcon={<FaCheck />}
                      isFullWidth
                      isDisabled
                    >
                      Experimento completado
                    </Button>
                  )}
                </VStack>
              </Box>
              
              <Divider />
              
              <Box>
                <Text fontSize="sm" color="gray.500" mb={2}>Comparte este experimento</Text>
                <HStack spacing={2}>
                  <Button 
                    variant="outline" 
                    leftIcon={<FaShare />}
                    onClick={handleShare}
                    flex={1}
                  >
                    Compartir
                  </Button>
                  <Button 
                    as="a"
                    href={`mailto:?subject=Mira este experimento: ${encodeURIComponent(experiment.title)}&body=¡Hola!\n\nMira este increíble experimento de ciencias: ${encodeURIComponent(experiment.title)}\n\n${window.location.href}`}
                    variant="outline"
                    flex={1}
                  >
                    Correo
                  </Button>
                </HStack>
              </Box>
            </VStack>
          </Box>
        </Box>
      </SimpleGrid>
      
      {/* Modal para completar el experimento */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Completar experimento</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text>¡Felicidades por completar este experimento! ¿Te gustaría agregar alguna nota o observación?</Text>
              
              <Box>
                <Text mb={2} fontWeight="medium">Tus notas (opcional):</Text>
                <Textarea
                  placeholder="Escribe tus observaciones, resultados o cualquier cosa que quieras recordar sobre este experimento..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </Box>
              
              <Alert status="info" variant="left-accent" borderRadius="md">
                <AlertIcon />
                <Text fontSize="sm">
                  Al completar este experimento, ganarás <strong>10 puntos</strong> en tu perfil.
                </Text>
              </Alert>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose} isDisabled={isCompleting}>
              Cancelar
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleCompleteExperiment}
              isLoading={isCompleting}
              loadingText="Guardando..."
            >
              Guardar y completar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ExperimentDetailPage;
