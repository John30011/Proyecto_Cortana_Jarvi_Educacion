import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, VStack, HStack, Button, Badge, Progress, useToast, Container, Flex } from '@chakra-ui/react';
import { FaTrophy, FaHome, FaRedo } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { MathExercise } from '../components/MathExercise';
import { useMathExercises } from '../hooks/useMathExercises';

const MathExercisePage: React.FC = () => {
  const { ageGroup = '6-8' } = useParams<{ ageGroup: '3-5' | '6-8' | '9-12' }>();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Usar el hook personalizado para manejar la lógica de los ejercicios
  const {
    currentExercise,
    isLoading,
    error,
    score,
    progress,
    userProgress,
    handleAnswer,
    nextExercise,
    resetSession,
  } = useMathExercises(ageGroup as '3-5' | '6-8' | '9-12', 'user123'); // En una app real, usarías el ID del usuario autenticado
  
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  
  // Contador de tiempo
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Manejar la respuesta del usuario
  const handleAnswerSubmit = async (selectedOption: number) => {
    try {
      const result = await handleAnswer(selectedOption, timeSpent);
      
      // Mostrar retroalimentación
      toast({
        title: result?.isCorrect ? '¡Correcto! 🎉' : 'Incorrecto 😕',
        description: result?.isCorrect 
          ? `+${result.score} puntos`
          : `La respuesta correcta es: ${currentExercise?.options[currentExercise.correctAnswer]}`,
        status: result?.isCorrect ? 'success' : 'error',
        duration: 3000,
        isClosable: true,
      });
      
      // Ir al siguiente ejercicio después de un breve retraso
      setTimeout(() => {
        const hasNext = nextExercise();
        if (!hasNext) {
          setIsSessionComplete(true);
        }
        setTimeSpent(0);
      }, 1500);
      
    } catch (err) {
      console.error('Error al procesar la respuesta:', err);
      toast({
        title: 'Error',
        description: 'Ocurrió un error al procesar tu respuesta. Por favor, inténtalo de nuevo.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // Reiniciar la sesión
  const handleRestartSession = () => {
    resetSession();
    setTimeSpent(0);
    setIsSessionComplete(false);
  };
  
  // Formatear el tiempo (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Mostrar pantalla de carga
  if (isLoading && !currentExercise) {
    return (
      <Box textAlign="center" py={20}>
        <Text fontSize="xl">Cargando ejercicio...</Text>
        <Progress size="xs" isIndeterminate mt={4} />
      </Box>
    );
  }
  
  // Mostrar mensaje de error
  if (error) {
    return (
      <Box textAlign="center" py={20}>
        <Text color="red.500" fontSize="xl" mb={4}>
          {error}
        </Text>
        <Button 
          colorScheme="blue" 
          onClick={() => window.location.reload()}
          leftIcon={<FaRedo />}
        >
          Reintentar
        </Button>
      </Box>
    );
  }
  
  // Mostrar pantalla de sesión completada
  if (isSessionComplete) {
    return (
      <Container maxW="container.md" py={10}>
        <VStack spacing={6} textAlign="center">
          <Box 
            bg="green.100" 
            p={6} 
            borderRadius="full" 
            boxShadow="md"
            mb={4}
          >
            <FaTrophy size={64} color="#38A169" />
          </Box>
          
          <Heading as="h1" size="xl">¡Sesión Completada! 🎉</Heading>
          
          <VStack spacing={4} bg="white" p={6} borderRadius="lg" boxShadow="md" w="100%">
            <Text fontSize="lg">Puntuación total:</Text>
            <Text fontSize="3xl" fontWeight="bold" color="green.500">
              {score} puntos
            </Text>
            
            {userProgress && (
              <VStack spacing={2} mt={4} w="100%">
                <HStack justify="space-between" w="100%" px={4}>
                  <Text>Nivel actual:</Text>
                  <Badge colorScheme="blue" fontSize="lg" px={3} py={1}>
                    {userProgress.level}
                  </Badge>
                </HStack>
                
                <HStack justify="space-between" w="100%" px={4}>
                  <Text>Puntuación total:</Text>
                  <Text fontWeight="bold">{userProgress.totalScore} pts</Text>
                </HStack>
                
                {userProgress.badges.length > 0 && (
                  <Box mt={4} w="100%">
                    <Text mb={2}>Insignias obtenidas:</Text>
                    <HStack spacing={4} justify="center">
                      {userProgress.badges.map((badge, index) => (
                        <Box key={index} textAlign="center">
                          <Box 
                            w={12} 
                            h={12} 
                            bg={`${badge === 'gold' ? 'yellow.400' : badge === 'silver' ? 'gray.300' : 'yellow.700'}`} 
                            borderRadius="full"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            mx="auto"
                            mb={1}
                          >
                            <FaTrophy size={24} color="white" />
                          </Box>
                          <Text fontSize="xs" textTransform="capitalize">
                            {badge}
                          </Text>
                        </Box>
                      ))}
                    </HStack>
                  </Box>
                )}
              </VStack>
            )}
          </VStack>
          
          <HStack spacing={4} mt={6}>
            <Button 
              colorScheme="blue" 
              onClick={handleRestartSession}
              leftIcon={<FaRedo />}
            >
              Jugar de nuevo
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              leftIcon={<FaHome />}
            >
              Volver al inicio
            </Button>
          </HStack>
        </VStack>
      </Container>
    );
  }
  
  // Mostrar el ejercicio actual
  return (
    <Box py={8}>
      <Container maxW="container.md">
        {/* Barra de progreso superior */}
        <VStack spacing={2} mb={8}>
          <HStack w="100%" justify="space-between">
            <Text fontSize="sm" color="gray.600">
              Ejercicio {progress.completed + 1} de {progress.total}
            </Text>
            
            <HStack spacing={4}>
              <HStack>
                <Text fontSize="sm" color="gray.600">Tiempo:</Text>
                <Badge colorScheme="blue" fontSize="md" px={2}>
                  {formatTime(timeSpent)}
                </Badge>
              </HStack>
              
              <HStack>
                <Text fontSize="sm" color="gray.600">Puntos:</Text>
                <Badge colorScheme="green" fontSize="md" px={2}>
                  {score}
                </Badge>
              </HStack>
              
              {userProgress && (
                <HStack>
                  <Text fontSize="sm" color="gray.600">Nivel:</Text>
                  <Badge colorScheme="blue" fontSize="md" px={2}>
                    {userProgress.level}
                  </Badge>
                </HStack>
              )}
            </HStack>
          </HStack>
          
          <Progress 
            value={(progress.completed / progress.total) * 100} 
            size="sm" 
            w="100%" 
            colorScheme="blue" 
            borderRadius="full"
          />
        </VStack>
        
        {/* Contenido principal */}
        {currentExercise && (
          <Box 
            bg="white" 
            borderRadius="lg" 
            boxShadow="md" 
            p={6}
            mb={8}
          >
            <MathExercise 
              exercise={currentExercise} 
              onComplete={handleAnswerSubmit}
              onNext={() => {}}
            />
          </Box>
        )}
        
        {/* Navegación */}
        <Flex justify="space-between" mt={8}>
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            leftIcon={<FaHome />}
          >
            Menú principal
          </Button>
          
          <Button 
            colorScheme="red" 
            variant="ghost"
            onClick={handleRestartSession}
            leftIcon={<FaRedo />}
          >
            Reiniciar
          </Button>
        </Flex>
      </Container>
    </Box>
  );
};

export default MathExercisePage;
