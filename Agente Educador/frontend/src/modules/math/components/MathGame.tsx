import React from 'react';
import { Box, Text, Button } from '@chakra-ui/react';

interface MathGameProps {
  title: string;
  description: string;
  onStart: () => void;
}

export const MathGame: React.FC<MathGameProps> = ({ title, description, onStart }) => {
  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      p={4} 
      mb={4}
      boxShadow="sm"
    >
      <Text fontSize="lg" fontWeight="bold" mb={2}>{title}</Text>
      <Text mb={4} color="gray.600">{description}</Text>
      <Button colorScheme="blue" onClick={onStart} size="sm">
        Jugar
      </Button>
    </Box>
  );
};

export default MathGame;
