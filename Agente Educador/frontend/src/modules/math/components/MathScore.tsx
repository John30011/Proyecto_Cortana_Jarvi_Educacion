import React from 'react';
import { Box, Progress, Text, HStack, Badge } from '@chakra-ui/react';

interface MathScoreProps {
  score: number;
  maxScore: number;
  level: number;
  badges: string[];
}

export const MathScore: React.FC<MathScoreProps> = ({ 
  score, 
  maxScore, 
  level, 
  badges 
}) => {
  const progress = (score / maxScore) * 100;
  
  return (
    <Box 
      bg="white" 
      p={4} 
      borderRadius="lg" 
      boxShadow="md"
      mb={6}
    >
      <HStack justify="space-between" mb={2}>
        <Text fontWeight="bold">Tu Progreso</Text>
        <Badge colorScheme="blue" fontSize="sm">Nivel {level}</Badge>
      </HStack>
      
      <HStack justify="space-between" mb={1}>
        <Text fontSize="sm" color="gray.600">Puntuación: {score}/{maxScore}</Text>
        <Text fontSize="sm" color="gray.600">{Math.round(progress)}%</Text>
      </HStack>
      
      <Progress 
        value={progress} 
        size="sm" 
        colorScheme="blue" 
        borderRadius="full"
        mb={4}
      />
      
      {badges.length > 0 && (
        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>Insignias:</Text>
          <HStack spacing={2}>
            {badges.map((badge, index) => (
              <Badge key={index} colorScheme="yellow">
                {badge}
              </Badge>
            ))}
          </HStack>
        </Box>
      )}
    </Box>
  );
};

export default MathScore;
