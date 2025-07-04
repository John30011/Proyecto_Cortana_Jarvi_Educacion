import React, { useState, useEffect } from 'react';
import { Box, Button, VStack, Text, HStack, useToast, Progress, Badge } from '@chakra-ui/react';
import { FaCheck, FaTimes, FaArrowRight } from 'react-icons/fa';
import { MathExercise as MathExerciseType } from '../types';
import { calculateScore, formatTime } from '../utils';

interface MathExerciseProps {
  exercise: MathExerciseType;
  onComplete: (score: number) => void;
  onNext: () => void;
}

export const MathExercise: React.FC<MathExerciseProps> = ({
  exercise,
  onComplete,
  onNext,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [score, setScore] = useState(0);
  const toast = useToast();
  const timerRef = React.useRef<NodeJS.Timeout>();

  // Iniciar el temporizador cuando el componente se monta
  useEffect(() => {
    const startTime = Date.now();
    
    timerRef.current = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    const correct = optionIndex === exercise.correctAnswer;
    setIsCorrect(correct);
    setIsAnswered(true);
    
    // Detener el temporizador
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Calcular puntuación
    const timeInSeconds = timeSpent;
    const calculatedScore = calculateScore(timeInSeconds, correct, exercise.difficulty);
    setScore(calculatedScore);
    
    // Mostrar retroalimentación
    toast({
      title: correct ? '¡Correcto!' : 'Incorrecto',
      description: correct 
        ? `¡Buen trabajo! Ganaste ${calculatedScore} puntos.`
        : `La respuesta correcta es: ${exercise.options[exercise.correctAnswer]}`,
      status: correct ? 'success' : 'error',
      duration: 3000,
      isClosable: true,
    });
    
    // Notificar al componente padre
    onComplete(calculatedScore);
  };

  const getOptionColor = (index: number) => {
    if (!isAnswered) return 'gray';
    
    if (index === exercise.correctAnswer) return 'green';
    if (index === selectedOption && !isCorrect) return 'red';
    
    return 'gray';
  };

  return (
    <Box 
      p={6} 
      borderRadius="lg" 
      bg="white" 
      boxShadow="md"
      maxW="600px"
      mx="auto"
    >
      {/* Encabezado con información del ejercicio */}
      <HStack justify="space-between" mb={6}>
        <Box>
          <Text fontSize="sm" color="gray.500">
            Nivel: <Badge colorScheme={{
              easy: 'green',
              medium: 'orange',
              hard: 'red'
            }[exercise.difficulty]}>
              {{
                easy: 'Fácil',
                medium: 'Medio',
                hard: 'Difícil'
              }[exercise.difficulty]}
            </Badge>
          </Text>
          <Text fontSize="sm" color="gray.500">
            Tema: <Badge colorScheme="blue">{exercise.topic}</Badge>
          </Text>
        </Box>
        <Box textAlign="right">
          <Text fontSize="sm" color="gray.500">
            Tiempo: <Badge>{formatTime(timeSpent)}</Badge>
          </Text>
          <Text fontSize="sm" color="gray.500">
            Puntos: <Badge colorScheme="green">{score}</Badge>
          </Text>
        </Box>
      </HStack>

      {/* Pregunta */}
      <Text fontSize="xl" fontWeight="bold" mb={6} textAlign="center">
        {exercise.question}
      </Text>

      {/* Opciones de respuesta */}
      <VStack spacing={4} mb={6}>
        {exercise.options.map((option, index) => (
          <Button
            key={index}
            w="100%"
            py={6}
            variant="outline"
            colorScheme={getOptionColor(index)}
            leftIcon={
              isAnswered ? (
                index === exercise.correctAnswer ? (
                  <FaCheck />
                ) : index === selectedOption ? (
                  <FaTimes />
                ) : null
              ) : null
            }
            onClick={() => handleOptionSelect(index)}
            isDisabled={isAnswered}
            _disabled={{
              opacity: isAnswered && index !== selectedOption && index !== exercise.correctAnswer ? 0.5 : 1,
              cursor: 'not-allowed',
            }}
          >
            {option}
          </Button>
        ))}
      </VStack>

      {/* Pista (si está disponible) */}
      {exercise.hint && isAnswered && !isCorrect && (
        <Box 
          bg="yellow.50" 
          p={4} 
          borderRadius="md" 
          borderLeft="4px" 
          borderColor="yellow.400"
          mb={6}
        >
          <Text fontWeight="bold" color="yellow.700" mb={2}>Pista:</Text>
          <Text color="yellow.700">{exercise.hint}</Text>
        </Box>
      )}

      {/* Barra de progreso */}
      <Box mb={6}>
        <HStack justify="space-between" mb={2}>
          <Text fontSize="sm" color="gray.500">Progreso</Text>
          <Text fontSize="sm" color="gray.500">100%</Text>
        </HStack>
        <Progress value={100} size="sm" colorScheme="blue" borderRadius="full" />
      </Box>

      {/* Botón de siguiente (solo visible después de responder) */}
      {isAnswered && (
        <Button
          colorScheme="blue"
          size="lg"
          w="100%"
          rightIcon={<FaArrowRight />}
          onClick={onNext}
        >
          Siguiente ejercicio
        </Button>
      )}
    </Box>
  );
};

export default MathExercise;
