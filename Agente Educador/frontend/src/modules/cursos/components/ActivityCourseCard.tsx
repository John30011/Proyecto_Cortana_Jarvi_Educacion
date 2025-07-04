import React from 'react';
import { Box, Image, Text, Badge, HStack, VStack, Flex, Icon, Heading } from '@chakra-ui/react';
import { FaStar, FaUserGraduate, FaClock } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import { Activity } from '../../../services/activities';

interface ActivityCourseCardProps {
  activity: Activity;
}

const ActivityCourseCard: React.FC<ActivityCourseCardProps> = ({ activity }) => {
  const cardBg = 'white';
  const borderColor = 'gray.200';
  const textColor = 'gray.700';
  const mutedText = 'gray.500';
  type DifficultyType = 'Fácil' | 'Intermedio' | 'Avanzado';
  
  const levelColors: Record<DifficultyType, string> = {
    'Fácil': 'green',
    'Intermedio': 'blue',
    'Avanzado': 'purple'
  };

  // Mapear dificultad a nivel de curso
  const getCourseLevel = (difficulty: string) => {
    switch(difficulty) {
      case 'Fácil': return 'Básico';
      case 'Intermedio': return 'Intermedio';
      case 'Avanzado': return 'Avanzado';
      default: return 'Básico';
    }
  };

  // Generar una URL de imagen de placeholder basada en la categoría
  const getImageUrl = (category: string) => {
    const categories: Record<string, string> = {
      'Matemáticas': 'https://img.icons8.com/color/480/math.png',
      'Ciencias': 'https://img.icons8.com/color/480/test-tube.png',
      'Tecnología': 'https://img.icons8.com/color/480/laptop--v1.png',
      'Arte': 'https://img.icons8.com/color/480/paint-palette.png',
      'Música': 'https://img.icons8.com/color/480/musical-notes.png',
      'Deportes': 'https://img.icons8.com/color/480/football2--v1.png',
      'General': 'https://img.icons8.com/color/480/learning.png'
    };
    
    return categories[category] || 'https://img.icons8.com/color/480/learning.png';
  };

  return (
    <Box
      as={RouterLink}
      to={activity.path}
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      boxShadow="sm"
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'md',
        textDecoration: 'none'
      }}
      h="100%"
      display="flex"
      flexDirection="column"
    >
      {/* Imagen del curso */}
      <Box h="120px" bg="gray.100" position="relative" overflow="hidden">
        <Image
          src={getImageUrl(activity.category)}
          alt={activity.title}
          objectFit="cover"
          w="100%"
          h="100%"
        />
      </Box>

      {/* Contenido de la tarjeta */}
      <VStack p={4} spacing={2} align="start" flex={1}>
        {/* Nivel del curso */}
        <Badge 
          colorScheme={levelColors[activity.difficulty as DifficultyType] || 'gray'}
          borderRadius="full"
          px={2}
          py={1}
          fontSize="xs"
          fontWeight="semibold"
        >
          {getCourseLevel(activity.difficulty)}
        </Badge>

        {/* Título del curso */}
        <Heading as="h3" size="sm" color={textColor} mt={1} noOfLines={2}>
          {activity.title}
        </Heading>

        {/* Descripción */}
        <Text fontSize="sm" color={mutedText} noOfLines={2}>
          {activity.description}
        </Text>

        {/* Categoría */}
        <Badge 
          colorScheme="blue" 
          variant="subtle" 
          fontSize="xs"
          borderRadius="md"
          px={2}
          py={0.5}
          mt={1}
        >
          {activity.category}
        </Badge>

        {/* Metadatos */}
        <Flex mt="auto" w="100%" justifyContent="space-between" color={mutedText}>
          <HStack spacing={2}>
            <Icon as={FaClock} boxSize={3} />
            <Text fontSize="xs">{activity.duration}</Text>
          </HStack>
          
          <HStack spacing={2}>
            <Icon as={FaStar} color="yellow.400" />
            <Text fontSize="xs">4.8</Text>
          </HStack>
        </Flex>
      </VStack>
    </Box>
  );
};

export default ActivityCourseCard;
