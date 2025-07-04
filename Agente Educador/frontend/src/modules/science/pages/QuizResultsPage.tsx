import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Heading,
  VStack,
  HStack,
  Text,
  Progress,
  useColorModeValue,
  Icon,
  Badge,
  Divider,
  SimpleGrid,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tooltip,
  Collapse
} from '@chakra-ui/react';
import { FaTrophy, FaAward, FaClock, FaCheck, FaTimes, FaHome, FaRedo, FaShareAlt, FaStar } from 'react-icons/fa';
import { useScienceModule } from '../hooks/useScienceModule';

interface QuizResultsProps {
  score?: number;
  totalQuestions?: number;
  correctAnswers?: number;
  timeSpent?: number;
  pointsEarned?: number;
  totalPoints?: number;
}

const QuizResultsPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Obtener datos del estado de la navegación o de la ubicación
  const [results, setResults] = useState<QuizResultsProps>(() => {
    // Intentar obtener los resultados del estado de navegación
    if (location.state) {
      return location.state as QuizResultsProps;
    }
    
    // Valores por defecto
    return {
      score: 0,
      totalQuestions: 10,
      correctAnswers: 0,
      timeSpent: 0,
      pointsEarned: 0,
      totalPoints: 0
    };
  });
  
  // Estados locales
  const [isLoading, setIsLoading] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  // Obtener datos del módulo de ciencias
  const { progress, getQuizResults } = useScienceModule();
  
  // Cargar resultados si no se proporcionaron en el estado
  useEffect(() => {
    const loadResults = async () => {
      if (results.score === undefined && quizId) {
        try {
          setIsLoading(true);
          // En una implementación real, aquí cargarías los resultados del servidor
          // const quizResults = await getQuizResults(quizId);
          // setResults(quizResults);
        } catch (error) {
          console.error('Error al cargar los resultados:', error);
          
          toast({
            title: 'Error',
            description: 'No se pudieron cargar los resultados del cuestionario.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadResults();
  }, [quizId, results.score, toast]);
  
  // Calcular porcentaje de aciertos
  const correctPercentage = results.totalQuestions && results.correctAnswers !== undefined
    ? Math.round((results.correctAnswers / results.totalQuestions) * 100)
    : 0;
  
  // Determinar el mensaje según el puntaje
  const getResultMessage = () => {
    if (correctPercentage >= 90) {
      return {
        title: '¡Excelente trabajo!',
        description: '¡Eres un genio de la ciencia! Sigue así.',
        color: 'yellow.400',
        icon: FaTrophy
      };
    } else if (correctPercentage >= 70) {
      return {
        title: '¡Muy bien hecho!',
        description: 'Tienes un gran conocimiento científico.',
        color: 'green.400',
        icon: FaCheck
      };
    } else if (correctPercentage >= 50) {
      return {
        title: 'Buen intento',
        description: 'Sigue aprendiendo y mejorarás.',
        color: 'blue.400',
        icon: FaAward
      };
    } else {
      return {
        title: 'Sigue intentándolo',
        description: 'La práctica hace al maestro. ¡No te rindas!',
        color: 'red.400',
        icon: FaTimes
      };
    }
  };
  
  const resultMessage = getResultMessage();
  const IconComponent = resultMessage.icon;
  
  // Formatear el tiempo
  const formatTime = (seconds: number = 0): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins > 0 ? `${mins}m ` : ''}${secs}s`;
  };
  
  // Compartir resultados
  const shareResults = async () => {
    try {
      const shareData = {
        title: 'Mis resultados del cuestionario de ciencias',
        text: `¡Obtuve ${results.score} puntos en el cuestionario de ciencias! ¿Puedes superarme?`,
        url: window.location.href,
      };
      
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Copiar al portapapeles como alternativa
        await navigator.clipboard.writeText(shareData.text + ' ' + shareData.url);
        
        toast({
          title: '¡Enlace copiado!',
          description: 'Los resultados se han copiado al portapapeles.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error('Error al compartir:', err);
    }
  };
  
  // Navegar al inicio
  const goToHome = () => {
    navigate('/science');
  };
  
  // Reiniciar el cuestionario
  const restartQuiz = () => {
    navigate('/science/quizzes');
  };
  
  // Mostrar carga
  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="300px">
        <Spinner size="xl" color={useColorModeValue('blue.500', 'blue.300')} />
      </Flex>
    );
  }
  
  return (
    <Box maxW="container.md" mx="auto" p={{ base: 4, md: 6 }}>
      {/* Tarjeta de resultados */}
      <Box 
        bg={useColorModeValue('white', 'gray.800')}
        borderRadius="xl"
        p={8}
        boxShadow="lg"
        mb={8}
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '8px',
          bgGradient: 'linear(to-r, blue.400, purple.400)'
        }}
      >
        {/* Encabezado */}
        <VStack spacing={4} textAlign="center" mb={8}>
          <Box 
            p={4} 
            borderRadius="full" 
            bg={useColorModeValue(`${resultMessage.color.replace('400', '100`')}`, `${resultMessage.color.replace('400', '900`')}`)}
            color={resultMessage.color}
            fontSize="4xl"
          >
            <Icon as={IconComponent} />
          </Box>
          
          <Heading size="xl">{resultMessage.title}</Heading>
          <Text color={useColorModeValue('gray.600', 'gray.300')} fontSize="lg">
            {resultMessage.description}
          </Text>
        </VStack>
        
        {/* Puntuación */}
        <Box mb={8}>
          <Flex justify="space-between" mb={2}>
            <Text fontWeight="medium">Tu puntuación:</Text>
            <Text fontWeight="bold" fontSize="lg">
              {results.score} / {results.totalQuestions && results.totalQuestions * 10} puntos
            </Text>
          </Flex>
          
          <Progress 
            value={correctPercentage} 
            size="lg" 
            colorScheme={correctPercentage >= 70 ? 'green' : correctPercentage >= 50 ? 'blue' : 'red'}
            borderRadius="full"
            height="20px"
            sx={{
              '& > div': {
                transition: 'width 1s ease-in-out'
              }
            }}
          />
          
          <Flex justify="space-between" mt={2}>
            <Text fontSize="sm" color="gray.500">0%</Text>
            <Text fontSize="sm" color="gray.500">100%</Text>
          </Flex>
        </Box>
        
        {/* Estadísticas */}
        <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4} mb={8}>
          <StatBox 
            icon={FaCheck} 
            label="Respuestas correctas" 
            value={`${results.correctAnswers} / ${results.totalQuestions}`}
            color="green.400"
          />
          
          <StatBox 
            icon={FaClock} 
            label="Tiempo" 
            value={formatTime(results.timeSpent)}
            color="blue.400"
          />
          
          <StatBox 
            icon={FaStar} 
            label="Puntos ganados" 
            value={`+${results.pointsEarned || 0}`}
            color="yellow.400"
          />
        </SimpleGrid>
        
        {/* Mensaje de felicitaciones */}
        {correctPercentage >= 70 && (
          <Alert 
            status="success" 
            variant="subtle" 
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            borderRadius="md"
            mb={6}
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              ¡Felicidades!
            </AlertTitle>
            <AlertDescription maxW="sm">
              Has desbloqueado una nueva insignia por tu excelente desempeño.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Puntos totales */}
        <Box 
          bg={useColorModeValue('blue.50', 'blue.900')} 
          p={4} 
          borderRadius="md"
          borderLeftWidth="4px"
          borderLeftColor="blue.400"
          mb={6}
        >
          <Flex justify="space-between" align="center">
            <Text fontWeight="medium">Puntos totales:</Text>
            <Badge colorScheme="blue" fontSize="lg" px={3} py={1}>
              {results.totalPoints || 0} pts
            </Badge>
          </Flex>
        </Box>
        
        {/* Botones de acción */}
        <VStack spacing={4} mt={8}>
          <Button 
            colorScheme="blue" 
            size="lg" 
            width="100%"
            onClick={restartQuiz}
            leftIcon={<FaRedo />}
          >
            Intentar de nuevo
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            width="100%"
            onClick={shareResults}
            leftIcon={<FaShareAlt />}
          >
            Compartir resultados
          </Button>
          
          <Button 
            variant="ghost" 
            size="lg" 
            width="100%"
            onClick={goToHome}
            leftIcon={<FaHome />}
          >
            Volver al inicio
          </Button>
        </VStack>
      </Box>
      
      {/* Sección de recomendaciones */}
      <Box 
        bg={useColorModeValue('white', 'gray.800')}
        borderRadius="xl"
        p={6}
        boxShadow="lg"
      >
        <Heading size="md" mb={4}>Recomendaciones para ti</Heading>
        <Text mb={4} color={useColorModeValue('gray.600', 'gray.300')}>
          Basado en tus resultados, te recomendamos los siguientes recursos para mejorar tus conocimientos:
        </Text>
        
        <VStack spacing={4} align="stretch">
          <RecommendationItem 
            title="Experimento: Reacciones químicas"
            description="Aprende sobre reacciones químicas con este divertido experimento."
            topic="Química"
            difficulty="Fácil"
            points={20}
          />
          
          <Divider />
          
          <RecommendationItem 
            title="Lección: El sistema solar"
            description="Explora los planetas y estrellas en nuestro sistema solar."
            topic="Astronomía"
            difficulty="Intermedio"
            points={15}
          />
          
          <Divider />
          
          <RecommendationItem 
            title="Cuestionario: Células y organismos"
            description="Pon a prueba tus conocimientos sobre biología celular."
            topic="Biología"
            difficulty="Difícil"
            points={30}
          />
        </VStack>
      </Box>
    </Box>
  );
};

// Componente para mostrar estadísticas
const StatBox: React.FC<{ 
  icon: any; 
  label: string; 
  value: string | number;
  color: string;
}> = ({ icon, label, value, color }) => (
  <Box 
    p={4} 
    bg={useColorModeValue('gray.50', 'gray.700')} 
    borderRadius="lg"
    textAlign="center"
  >
    <Icon as={icon} color={color} boxSize={6} mb={2} />
    <Text fontSize="sm" color="gray.500" mb={1}>
      {label}
    </Text>
    <Text fontWeight="bold" fontSize="lg">
      {value}
    </Text>
  </Box>
);

// Componente para mostrar recomendaciones
const RecommendationItem: React.FC<{
  title: string;
  description: string;
  topic: string;
  difficulty: 'Fácil' | 'Intermedio' | 'Difícil';
  points: number;
}> = ({ title, description, topic, difficulty, points }) => {
  const difficultyColors = {
    'Fácil': 'green',
    'Intermedio': 'yellow',
    'Difícil': 'red'
  };
  
  return (
    <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
      <Box flex={1}>
        <Text fontWeight="medium" mb={1}>
          {title}
        </Text>
        <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')} mb={2}>
          {description}
        </Text>
        <HStack spacing={2}>
          <Badge colorScheme="blue" variant="subtle">
            {topic}
          </Badge>
          <Badge colorScheme={difficultyColors[difficulty]} variant="subtle">
            {difficulty}
          </Badge>
          <Badge colorScheme="purple" variant="subtle">
            +{points} pts
          </Badge>
        </HStack>
      </Box>
      <Button 
        colorScheme="blue" 
        variant="outline" 
        size="sm"
        alignSelf={{ base: 'stretch', md: 'center' }}
        minW="100px"
      >
        Ver
      </Button>
    </Flex>
  );
};

export default QuizResultsPage;
