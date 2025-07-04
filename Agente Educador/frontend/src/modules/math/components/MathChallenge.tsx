import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  VStack, 
  Text, 
  HStack, 
  useToast,
  Badge,
  Progress
} from '@chakra-ui/react';
import { FaTrophy, FaCheck, FaTimes } from 'react-icons/fa';

interface Challenge {
  id: string;
  question: string;
  answer: number;
  options: number[];
  points: number;
  timeLimit: number; // in seconds
}

interface MathChallengeProps {
  challenge: Challenge;
  onComplete: (pointsEarned: number) => void;
  onSkip: () => void;
}

export const MathChallenge: React.FC<MathChallengeProps> = ({
  challenge,
  onComplete,
  onSkip
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(challenge.timeLimit);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const toast = useToast();

  // Timer effect
  React.useEffect(() => {
    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerSelect = (answer: number) => {
    if (hasAnswered) return;
    
    setSelectedAnswer(answer);
    const correct = answer === challenge.answer;
    setIsCorrect(correct);
    setHasAnswered(true);
    
    // Calculate points based on time left
    const timeBonus = Math.ceil((timeLeft / challenge.timeLimit) * challenge.points * 0.5);
    const pointsEarned = correct ? challenge.points + timeBonus : 0;
    
    // Show feedback
    toast({
      title: correct ? '¡Correcto!' : 'Incorrecto',
      description: correct 
        ? `¡Bien hecho! Ganaste ${pointsEarned} puntos.`
        : `La respuesta correcta es: ${challenge.answer}`,
      status: correct ? 'success' : 'error',
      duration: 3000,
      isClosable: true,
    });
    
    // Notify parent after a delay
    setTimeout(() => {
      onComplete(pointsEarned);
    }, 2000);
  };

  const handleTimeUp = () => {
    if (hasAnswered) return;
    
    setHasAnswered(true);
    setIsCorrect(false);
    
    toast({
      title: '¡Tiempo agotado!',
      description: `La respuesta correcta era: ${challenge.answer}`,
      status: 'warning',
      duration: 3000,
      isClosable: true,
    });
    
    setTimeout(() => {
      onComplete(0);
    }, 2000);
  };

  const getButtonVariant = (option: number) => {
    if (!hasAnswered) return 'outline';
    
    if (option === challenge.answer) return 'solid';
    if (option === selectedAnswer && option !== challenge.answer) return 'solid';
    
    return 'ghost';
  };

  const getButtonColorScheme = (option: number) => {
    if (!hasAnswered) return 'blue';
    
    if (option === challenge.answer) return 'green';
    if (option === selectedAnswer && option !== challenge.answer) return 'red';
    
    return 'gray';
  };

  return (
    <Box 
      bg="white" 
      p={6} 
      borderRadius="lg" 
      boxShadow="lg"
      maxW="500px"
      mx="auto"
    >
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <HStack justify="space-between" mb={2}>
            <Text fontSize="sm" color="gray.500">Desafío Matemático</Text>
            <Badge colorScheme="purple">{challenge.points} pts</Badge>
          </HStack>
          
          <Box mb={4}>
            <HStack justify="space-between" mb={1}>
              <Text fontSize="sm" color="gray.600">Tiempo restante:</Text>
              <Text 
                fontWeight="bold" 
                color={timeLeft <= 5 ? 'red.500' : 'gray.700'}
              >
                {timeLeft}s
              </Text>
            </HStack>
            <Progress 
              value={(timeLeft / challenge.timeLimit) * 100} 
              size="xs" 
              colorScheme={timeLeft <= 5 ? 'red' : 'blue'}
              borderRadius="full"
            />
          </Box>
          
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            {challenge.question}
          </Text>
        </Box>
        
        {/* Options */}
        <VStack spacing={3} mb={6}>
          {challenge.options.map((option, index) => (
            <Button
              key={index}
              w="100%"
              py={6}
              variant={getButtonVariant(option)}
              colorScheme={getButtonColorScheme(option)}
              leftIcon={hasAnswered && (
                option === challenge.answer ? (
                  <FaCheck />
                ) : option === selectedAnswer ? (
                  <FaTimes />
                ) : null
              )}
              onClick={() => handleAnswerSelect(option)}
              isDisabled={hasAnswered}
              _disabled={{
                opacity: hasAnswered && option !== selectedAnswer && option !== challenge.answer ? 0.7 : 1,
                cursor: 'not-allowed',
              }}
              size="lg"
            >
              {option}
            </Button>
          ))}
        </VStack>
        
        {/* Skip Button (only show if not answered yet) */}
        {!hasAnswered && (
          <Button 
            variant="ghost" 
            colorScheme="gray" 
            onClick={onSkip}
            isDisabled={hasAnswered}
          >
            Saltar desafío
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default MathChallenge;
