import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Progress,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useColorModeValue,
  VStack,
  Badge,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  IconButton,
  Tooltip,
  Collapse
} from '@chakra-ui/react';
import { FaArrowLeft, FaCheck, FaClock, FaFlask, FaLightbulb, FaRegClock, FaTimes } from 'react-icons/fa';
import { useScienceModule } from '../hooks/useScienceModule';

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const {
    questions,
    isLoading,
    error,
    progress,
    handleQuizComplete,
    isQuizCompleted
  } = useScienceModule();
  
  // Estados del cuestionario
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos en segundos
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [answers, setAnswers] = useState<{questionId: string; answerIndex: number}[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  
  // Estilos
  const accentColor = useColorModeValue('blue.500', 'blue.300');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const successColor = useColorModeValue('green.500', 'green.300');
  const dangerColor = useColorModeValue('red.500', 'red.300');
  
  // Temporizador del cuestionario
  useEffect(() => {
    if (!quizStarted || isQuizFinished) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prevTimeLeft => {
        if (prevTimeLeft <= 1) {
          clearInterval(timer);
          handleFinishQuiz();
          return 0;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [quizStarted, isQuizFinished]);
  
  // Formatear el tiempo restante (mm:ss)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Manejar la selección de respuesta
  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(parseInt(value));
  };
  
  // Pasar a la siguiente pregunta
  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswerIndex;
    
    // Guardar la respuesta
    const newAnswers = [
      ...answers,
      {
        questionId: currentQuestion.id,
        answerIndex: selectedAnswer
      }
    ];
    
    setAnswers(newAnswers);
    
    // Actualizar puntuación si la respuesta es correcta
    if (isCorrect) {
      setScore(prevScore => prevScore + 10); // 10 puntos por respuesta correcta
    }
    
    // Mostrar explicación antes de continuar
    setShowExplanation(true);
    
    // Si es la última pregunta, finalizar el cuestionario
    if (currentQuestionIndex === questions.length - 1) {
      // Pequeño retraso para mostrar la explicación
      setTimeout(() => {
        handleFinishQuiz();
      }, 2000);
    }
  };
  
  // Continuar a la siguiente pregunta
  const handleContinue = () => {
    setShowExplanation(false);
    setSelectedAnswer(null);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };
  
  // Finalizar el cuestionario
  const handleFinishQuiz = async () => {
    try {
      setIsQuizFinished(true);
      
      // Calcular tiempo transcurrido
      const timeSpent = 600 - timeLeft; // 10 minutos - tiempo restante
      
      // Guardar resultados
      const result = await handleQuizComplete(
        `quiz-${Date.now()}`,
        answers,
        timeSpent
      );
      
      // Navegar a la página de resultados
      navigate(`/science/quizzes/results/quiz-${Date.now()}`, { 
        state: { 
          score: result.correctAnswers * 10, // 10 puntos por respuesta correcta
          totalQuestions: result.totalQuestions,
          correctAnswers: result.correctAnswers,
          timeSpent: result.timeSpent,
          pointsEarned: result.pointsEarned,
          totalPoints: result.totalPoints
        } 
      });
      
    } catch (err) {
      console.error('Error al guardar los resultados del cuestionario:', err);
      
      toast({
        title: 'Error',
        description: 'No se pudieron guardar los resultados del cuestionario.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // Iniciar el cuestionario
  const startQuiz = () => {
    setQuizStarted(true);
  };
  
  // Reiniciar el cuestionario
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeLeft(600);
    setIsQuizFinished(false);
    setAnswers([]);
    setShowExplanation(false);
    setQuizStarted(false);
  };
  
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
          Error al cargar el cuestionario
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          {error}
        </AlertDescription>
        <Button mt={4} colorScheme="blue" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </Alert>
    );
  }
  
  // Página de inicio del cuestionario
  if (!quizStarted) {
    return (
      <Box maxW="container.md" mx="auto" p={6} bg={cardBg} borderRadius="lg" boxShadow="md">
        <VStack spacing={6} textAlign="center">
          <Icon as={FaFlask} boxSize={16} color={accentColor} />
          
          <Heading size="xl">Cuestionario de Ciencias</Heading>
          
          <Text fontSize="lg" color="gray.600">
            Pon a prueba tus conocimientos con este cuestionario de {questions.length} preguntas.
            Tienes 10 minutos para completarlo. ¡Buena suerte!
          </Text>
          
          <Box textAlign="left" w="100%" bg={useColorModeValue('gray.50', 'gray.700')} p={4} borderRadius="md">
            <Heading size="md" mb={3}>Instrucciones:</Heading>
            <VStack spacing={2} align="stretch">
              <HStack>
                <Icon as={FaCheck} color={successColor} />
                <Text>Lee cada pregunta cuidadosamente antes de responder.</Text>
              </HStack>
              <HStack>
                <Icon as={FaClock} color={accentColor} />
                <Text>Tienes 10 minutos para completar el cuestionario.</Text>
              </HStack>
              <HStack>
                <Icon as={FaCheck} color={successColor} />
                <Text>Selecciona solo una respuesta por pregunta.</Text>
              </HStack>
              <HStack>
                <Icon as={FaCheck} color={successColor} />
                <Text>No puedes cambiar tu respuesta después de continuar.</Text>
              </HStack>
              <HStack>
                <Icon as={FaLightbulb} color="yellow.500" />
                <Text>¡Las preguntas correctas valen 10 puntos cada una!</Text>
              </HStack>
            </VStack>
          </Box>
          
          <Button 
            colorScheme="blue" 
            size="lg" 
            onClick={startQuiz}
            rightIcon={<FaArrowRight />}
            isLoading={isLoading}
          >
            Comenzar cuestionario
          </Button>
          
          <Text color="gray.500" fontSize="sm">
            Puntuación más alta: {progress.highestQuizScore || 0} puntos
          </Text>
        </VStack>
      </Box>
    );
  }
  
  // Obtener la pregunta actual
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isAnswerCorrect = selectedAnswer === currentQuestion.correctAnswerIndex;
  
  return (
    <Box maxW="container.lg" mx="auto" p={{ base: 4, md: 6 }}>
      {/* Encabezado */}
      <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={4}>
        <Button 
          leftIcon={<FaArrowLeft />} 
          variant="ghost" 
          onClick={() => window.history.back()}
          size="sm"
        >
          Volver
        </Button>
        
        <HStack spacing={4}>
          <Badge colorScheme="blue" px={3} py={1} borderRadius="full">
            <HStack spacing={1}>
              <Icon as={FaRegClock} />
              <Text>{formatTime(timeLeft)}</Text>
            </HStack>
          </Badge>
          
          <Badge colorScheme="green" px={3} py={1} borderRadius="full">
            Pregunta {currentQuestionIndex + 1} de {questions.length}
          </Badge>
          
          <Badge colorScheme="purple" px={3} py={1} borderRadius="full">
            Puntos: {score}
          </Badge>
        </HStack>
      </Flex>
      
      {/* Barra de progreso */}
      <Progress 
        value={((currentQuestionIndex) / questions.length) * 100} 
        size="sm" 
        colorScheme="blue" 
        mb={6} 
        borderRadius="full"
      />
      
      {/* Tarjeta de la pregunta */}
      <Box 
        bg={cardBg} 
        borderRadius="lg" 
        p={6} 
        boxShadow="md"
        borderLeftWidth="4px"
        borderLeftColor={showExplanation ? (isAnswerCorrect ? successColor : dangerColor) : accentColor}
        transition="all 0.3s"
      >
        {/* Pregunta */}
        <Text 
          fontSize="xl" 
          fontWeight="medium" 
          mb={6}
          color={showExplanation ? (isAnswerCorrect ? successColor : dangerColor) : 'inherit'}
        >
          {currentQuestion.question}
        </Text>
        
        {/* Opciones de respuesta */}
        <RadioGroup 
          value={selectedAnswer !== null ? selectedAnswer.toString() : ''} 
          onChange={handleAnswerSelect}
          isDisabled={showExplanation}
        >
          <Stack spacing={3} mb={6}>
            {currentQuestion.options.map((option, index) => {
              let optionBg = 'transparent';
              let optionBorderColor = borderColor;
              let optionHoverBg = useColorModeValue('gray.50', 'gray.700');
              
              if (showExplanation) {
                if (index === currentQuestion.correctAnswerIndex) {
                  // Respuesta correcta
                  optionBg = useColorModeValue('green.50', 'green.900');
                  optionBorderColor = successColor;
                  optionHoverBg = useColorModeValue('green.100', 'green.800');
                } else if (index === selectedAnswer && !isAnswerCorrect) {
                  // Respuesta incorrecta seleccionada
                  optionBg = useColorModeValue('red.50', 'red.900');
                  optionBorderColor = dangerColor;
                  optionHoverBg = useColorModeValue('red.100', 'red.800');
                }
              }
              
              return (
                <Box
                  key={index}
                  p={3}
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor={optionBorderColor}
                  bg={optionBg}
                  _hover={{
                    bg: showExplanation ? optionHoverBg : optionHoverBg,
                    cursor: showExplanation ? 'default' : 'pointer',
                  }}
                  transition="all 0.2s"
                  position="relative"
                >
                  <Radio 
                    value={index.toString()} 
                    colorScheme={showExplanation ? (index === currentQuestion.correctAnswerIndex ? 'green' : 'red') : 'blue'}
                    isDisabled={showExplanation}
                  >
                    <Box ml={2}>
                      <Text>{option}</Text>
                      
                      {/* Explicación (solo se muestra para la opción correcta) */}
                      {showExplanation && index === currentQuestion.correctAnswerIndex && (
                        <Collapse in={showExplanation} animateOpacity>
                          <Box 
                            mt={2} 
                            p={2} 
                            bg={useColorModeValue('blue.50', 'blue.900')}
                            borderRadius="md"
                            borderLeftWidth="3px"
                            borderLeftColor={accentColor}
                          >
                            <Text fontSize="sm" color={useColorModeValue('blue.700', 'blue.200')}>
                              <strong>Explicación:</strong> {currentQuestion.explanation}
                            </Text>
                          </Box>
                        </Collapse>
                      )}
                    </Box>
                  </Radio>
                  
                  {/* Indicadores de respuesta correcta/incorrecta */}
                  {showExplanation && (
                    <Box 
                      position="absolute" 
                      right="3" 
                      top="50%" 
                      transform="translateY(-50%)"
                    >
                      {index === currentQuestion.correctAnswerIndex ? (
                        <Icon as={FaCheck} color={successColor} boxSize={5} />
                      ) : index === selectedAnswer ? (
                        <Icon as={FaTimes} color={dangerColor} boxSize={5} />
                      ) : null}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Stack>
        </RadioGroup>
        
        {/* Botones de acción */}
        <Flex justify="space-between" mt={6} flexWrap="wrap" gap={4}>
          <Button 
            variant="outline" 
            onClick={resetQuiz}
            leftIcon={<FaTimes />}
            colorScheme="red"
            isDisabled={isQuizFinished}
          >
            Reiniciar
          </Button>
          
          {!showExplanation ? (
            <Button 
              colorScheme="blue" 
              onClick={handleNextQuestion}
              isDisabled={selectedAnswer === null || isQuizFinished}
              ml="auto"
            >
              {isLastQuestion ? 'Finalizar cuestionario' : 'Siguiente pregunta'}
            </Button>
          ) : (
            <Button 
              colorScheme="blue" 
              onClick={handleContinue}
              isDisabled={isQuizFinished}
              ml="auto"
            >
              {isLastQuestion ? 'Ver resultados' : 'Continuar'}
            </Button>
          )}
        </Flex>
      </Box>
      
      {/* Contador de preguntas */}
      <Flex justify="center" mt={8} gap={2} flexWrap="wrap">
        {questions.map((_, index) => (
          <Box
            key={index}
            w="30px"
            h="30px"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg={
              index < currentQuestionIndex 
                ? successColor 
                : index === currentQuestionIndex 
                  ? accentColor 
                  : useColorModeValue('gray.200', 'gray.600')
            }
            color={
              index <= currentQuestionIndex 
                ? 'white' 
                : useColorModeValue('gray.700', 'gray.300')
            }
            fontWeight="bold"
            borderWidth="1px"
            borderColor={
              index < currentQuestionIndex 
                ? successColor 
                : index === currentQuestionIndex 
                  ? accentColor 
                  : borderColor
            }
            _hover={{
              cursor: 'pointer',
              transform: 'scale(1.1)'
            }}
            transition="all 0.2s"
            onClick={() => {
              if (!showExplanation) {
                setCurrentQuestionIndex(index);
                setSelectedAnswer(answers[index]?.answerIndex ?? null);
              }
            }}
          >
            {index + 1}
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default QuizPage;
