import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Image, 
  Text, 
  Badge, 
  useColorModeValue, 
  HStack, 
  VStack, 
  Flex, 
  Icon,
  Skeleton,
  Tooltip,
  useBreakpointValue
} from '@chakra-ui/react';
import { FaStar, FaUserGraduate, FaClock, FaBookOpen } from 'react-icons/fa';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  level?: 'Básico' | 'Intermedio' | 'Avanzado';
  duration?: string;
  imageUrl: string;
  rating: number;
  students: number;
  category: string;
  tags?: string[];
}

// Componente de tarjeta de curso
const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  level = 'Básico', // Valor por defecto
  duration = '4 semanas', // Valor por defecto
  imageUrl,
  rating,
  students,
  category,
  tags = []
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Función para obtener el color según el nivel
  const getLevelColor = (level: string) => {
    switch(level) {
      case 'Básico': return 'green';
      case 'Intermedio': return 'blue';
      case 'Avanzado': return 'purple';
      default: return 'gray';
    }
  };

  // Formatear el número de estudiantes
  const formatStudents = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  // Función para generar un color basado en el título del curso
  const getColorFromTitle = (title: string) => {
    // Generar un hash simple basado en el título
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Generar un color pastel basado en el hash
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 80%)`;
  };
  
  const cardBgColor = getColorFromTitle(title);

  return (
    <Box
      as={RouterLink}
      to={`/cursos/curso/${id}`}
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.3s ease-in-out"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'xl',
        bg: hoverBg,
      }}
      height="100%"
      display="flex"
      flexDirection="column"
      position="relative"
    >
      {/* Sección de imagen con overlay */}
      <Box 
        h={{ base: '160px', md: '200px' }} 
        bg="gray.100" 
        overflow="hidden" 
        position="relative"
        borderRadius="lg"
        m={2}
        mt={3}
      >
        <Box 
          width="100%" 
          height="100%" 
          bg={cardBgColor}
          display="flex"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          p={4}
          transition="all 0.3s ease"
          _hover={{
            transform: 'scale(1.02)'
          }}
        >
          <Text 
            fontWeight="bold" 
            fontSize="xl" 
            color="gray.800"
            noOfLines={2}
          >
            {title}
          </Text>
        </Box>
        
        {/* Overlay en hover */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.600"
          opacity={0}
          transition="opacity 0.3s ease"
          _groupHover={{ opacity: 0.1 }}
          zIndex={1}
        />
        
        {/* Badge de nivel */}
        {level && (
          <Badge 
            position="absolute" 
            top={3}
            right={3}
            colorScheme={getLevelColor(level)}
            fontSize="xs"
            px={3}
            py={1}
            borderRadius="full"
            boxShadow="md"
            zIndex={2}
          >
            {level}
          </Badge>
        )}
      </Box>
      
      {/* Contenido de la tarjeta */}
      <VStack p={{ base: 3, md: 4 }} spacing={3} align="stretch" flex={1}>
        {/* Título */}
        <Tooltip label={title} placement="top">
          <Text 
            as="h3"
            fontSize={{ base: 'md', md: 'lg' }}
            fontWeight="bold"
            noOfLines={2}
            minH="3.5rem"
            lineHeight="tall"
            color={useColorModeValue('gray.800', 'white')}
          >
            {title}
          </Text>
        </Tooltip>
        
        {/* Descripción corta */}
        <Text 
          fontSize="sm" 
          color={textColor}
          noOfLines={2}
          minH="2.5rem"
          mb={2}
        >
          {description}
        </Text>
        
        {/* Etiquetas del curso */}
        {tags && tags.length > 0 && (
          <Flex wrap="wrap" gap={2} mb={2}>
            {tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index}
                colorScheme="blue" 
                variant="subtle" 
                fontSize="xs"
                px={2}
                py={0.5}
                borderRadius="full"
                fontWeight="normal"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge 
                colorScheme="gray" 
                variant="subtle" 
                fontSize="xs"
                px={2}
                py={0.5}
                borderRadius="full"
                fontWeight="normal"
              >
                +{tags.length - 3}
              </Badge>
            )}
          </Flex>
        )}
        
        {/* Metadatos */}
        <VStack spacing={2} align="stretch" mt="auto">
          {/* Rating y estudiantes */}
          <HStack spacing={4} color={textColor} fontSize="sm">
            <HStack spacing={1}>
              <Icon as={FaStar} color="yellow.400" />
              <Text fontWeight="medium">{rating.toFixed(1)}</Text>
              <Text fontSize="xs">({Math.floor(students / 100) * 100}+)</Text>
            </HStack>
            <HStack spacing={1}>
              <Icon as={FaUserGraduate} />
              <Text>{formatStudents(students)}</Text>
            </HStack>
          </HStack>
          
          {/* Duración y categoría */}
          <Flex justify="space-between" align="center" pt={2} borderTopWidth="1px" borderTopColor={borderColor}>
            <HStack spacing={2} color={textColor} fontSize="sm">
              <Icon as={FaClock} />
              <Text>{duration}</Text>
            </HStack>
            <Badge 
              colorScheme="blue" 
              variant="subtle"
              fontSize="xs"
              px={2}
              py={1}
              borderRadius="md"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <Icon as={FaBookOpen} boxSize={3} />
              {category}
            </Badge>
            {duration && (
              <HStack spacing={1} color={textColor} fontSize="sm">
                <Icon as={FaClock} />
                <Text>{duration}</Text>
              </HStack>
            )}
          </Flex>
        </VStack>
      </VStack>
    </Box>
  );
};

export default CourseCard;
