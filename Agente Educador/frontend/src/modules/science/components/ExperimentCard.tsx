import React from 'react';
import { Box, Heading, Text, Badge, HStack, VStack, Icon, useColorModeValue } from '@chakra-ui/react';
import { FaFlask, FaClock, FaUserGraduate } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

type Difficulty = 'Fácil' | 'Intermedio' | 'Avanzado';

interface ExperimentCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  duration: number; // en minutos
  ageGroup: string;
  imageUrl?: string;
  topics: string[];
}

const ExperimentCard: React.FC<ExperimentCardProps> = ({
  id,
  title,
  description,
  difficulty,
  duration,
  ageGroup,
  imageUrl,
  topics,
}) => {
  const difficultyColors = {
    'Fácil': 'green',
    'Intermedio': 'yellow',
    'Avanzado': 'red',
  };

  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Box
      as={RouterLink}
      to={`/science/experiments/${id}`}
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'lg',
        borderColor: 'blue.400',
      }}
      h="100%"
      display="flex"
      flexDirection="column"
    >
      {imageUrl && (
        <Box h="160px" bg="gray.100" overflow="hidden">
          <img
            src={imageUrl}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
      )}
      
      <VStack p={4} spacing={3} align="start" flex={1}>
        <HStack spacing={2} mb={1}>
          <Badge colorScheme={difficultyColors[difficulty]}>{difficulty}</Badge>
          <HStack spacing={1} color={textColor}>
            <Icon as={FaClock} />
            <Text fontSize="sm">{duration} min</Text>
          </HStack>
          <HStack spacing={1} color={textColor}>
            <Icon as={FaUserGraduate} />
            <Text fontSize="sm">{ageGroup}</Text>
          </HStack>
        </HStack>
        
        <Heading size="md" mb={2}>
          {title}
        </Heading>
        
        <Text color={textColor} noOfLines={3} fontSize="sm">
          {description}
        </Text>
        
        <Box mt="auto" w="100%">
          <HStack spacing={2} mt={3} flexWrap="wrap">
            {topics.slice(0, 3).map((topic) => (
              <Badge key={topic} colorScheme="blue" variant="subtle" fontSize="xs">
                {topic}
              </Badge>
            ))}
            {topics.length > 3 && (
              <Badge colorScheme="gray" variant="subtle" fontSize="xs">
                +{topics.length - 3}
              </Badge>
            )}
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default React.memo(ExperimentCard);
