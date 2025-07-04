import React from 'react';
import { Box, Heading, Text, VStack, Button, Divider } from '@chakra-ui/react';
import { FaPlay, FaBook } from 'react-icons/fa';

interface MathTutorialProps {
  title: string;
  content: string;
  onStartPractice: () => void;
  videoUrl?: string;
}

export const MathTutorial: React.FC<MathTutorialProps> = ({
  title,
  content,
  onStartPractice,
  videoUrl
}) => {
  return (
    <Box 
      bg="white" 
      p={6} 
      borderRadius="lg" 
      boxShadow="md"
      mb={6}
    >
      <VStack align="stretch" spacing={4}>
        <Box>
          <Heading as="h3" size="md" mb={2} display="flex" alignItems="center">
            <FaBook style={{ marginRight: '8px' }} />
            {title}
          </Heading>
          <Divider mb={4} />
        </Box>
        
        <Text lineHeight="tall" mb={4}>
          {content}
        </Text>
        
        {videoUrl && (
          <Box 
            bg="black" 
            height="300px" 
            borderRadius="md" 
            overflow="hidden"
            mb={4}
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
          >
            <VStack>
              <FaPlay size={48} />
              <Text>Video Tutorial</Text>
            </VStack>
          </Box>
        )}
        
        <Button 
          colorScheme="blue" 
          rightIcon={<FaPlay />}
          onClick={onStartPractice}
          alignSelf="flex-end"
        >
          Practicar Ahora
        </Button>
      </VStack>
    </Box>
  );
};

export default MathTutorial;
