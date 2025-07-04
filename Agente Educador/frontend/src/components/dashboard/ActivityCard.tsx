import React from 'react';
import { Box, VStack, Heading, Text, Button, useColorModeValue, Badge, HStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { Activity } from '@/services/activities';

const MotionBox = motion(Box);

const ActivityCard: React.FC<Omit<Activity, 'id' | 'category' | 'subTopics'>> = ({
  title,
  description,
  icon,
  color,
  path,
  difficulty = 'Fácil',
  duration = '15 min'
}) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'white');
  const difficultyColors = {
    'Fácil': 'green',
    'Intermedio': 'blue',
    'Avanzado': 'purple'
  };

  return (
    <MotionBox
      bg={cardBg}
      p={6}
      borderRadius="xl"
      boxShadow="md"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      borderWidth="1px"
      borderColor="gray.200"
      _dark={{ borderColor: 'gray.600' }}
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <VStack spacing={4} align="flex-start" flex={1}>
        <HStack spacing={4} width="100%" justify="space-between">
          <Box
            p={3}
            borderRadius="lg"
            bg={`${color}20`}
            color={color}
          >
            {icon}
          </Box>
          <Badge 
            colorScheme={difficultyColors[difficulty]}
            borderRadius="full"
            px={3}
            py={1}
          >
            {difficulty}
          </Badge>
        </HStack>
        
        <Box flex={1}>
          <Heading size="md" mb={2} color={textColor}>{title}</Heading>
          <Text fontSize="sm" color="gray.500" mb={4}>{description}</Text>
        </Box>
        
        <HStack spacing={2} width="100%" justify="space-between" mt="auto">
          <Text fontSize="xs" color="gray.500">⏱️ {duration}</Text>
          <Button
            as={RouterLink}
            to={path}
            colorScheme="blue"
            variant="outline"
            size="sm"
            _hover={{ transform: 'scale(1.05)' }}
            _active={{ transform: 'scale(0.95)' }}
            transition="all 0.2s"
          >
            Explorar
          </Button>
        </HStack>
      </VStack>
    </MotionBox>
  );
};

export default ActivityCard;
