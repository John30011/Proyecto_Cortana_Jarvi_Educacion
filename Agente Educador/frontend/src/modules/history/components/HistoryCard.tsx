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
  Tooltip,
  useBreakpointValue,
  Button
} from '@chakra-ui/react';
import { FaStar, FaClock, FaBookOpen, FaMapMarkerAlt } from 'react-icons/fa';
import { HistoryFact } from '../types';

interface HistoryCardProps extends Omit<HistoryFact, 'id' | 'topics' | 'ageGroup'> {
  id: string;
  topic: string;
  onLearnMore?: () => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({
  id,
  title,
  description,
  timePeriod,
  location,
  imageUrl,
  topic,
  importantFigures = [],
  onLearnMore
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Función para generar un color basado en el tema
  const getTopicColor = (topic: string) => {
    const colors = {
      'universe': 'purple',
      'world': 'blue',
      'venezuela': 'yellow',
      'regions': 'green',
      'capitals': 'red',
      'cities': 'teal'
    };
    return colors[topic as keyof typeof colors] || 'gray';
  };

  // Función para obtener el ícono según el tema
  const getTopicIcon = (topic: string) => {
    const icons = {
      'universe': '🌌',
      'world': '🌍',
      'venezuela': '🇻🇪',
      'regions': '🗺️',
      'capitals': '🏛️',
      'cities': '🏙️'
    };
    return icons[topic as keyof typeof icons] || '📜';
  };

  return (
    <Box
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
    >
      {/* Imagen */}
      <Box position="relative" pt="56.25%" overflow="hidden">
        <Image
          src={imageUrl || 'https://via.placeholder.com/400x225?text=Historia'}
          alt={title}
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          objectFit="cover"
          onLoad={() => setImageLoaded(true)}
          opacity={imageLoaded ? 1 : 0}
          transition="opacity 0.3s ease-in-out"
        />
        {!imageLoaded && (
          <Box
            position="absolute"
            top="0"
            left="0"
            width="100%"
            height="100%"
            bg="gray.200"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box as="span" fontSize="2xl">
              {getTopicIcon(topic)}
            </Box>
          </Box>
        )}
        <Box
          position="absolute"
          top="2"
          right="2"
          bg="rgba(0,0,0,0.7)"
          color="white"
          px={2}
          py={1}
          borderRadius="md"
          fontSize="sm"
          fontWeight="bold"
          display="flex"
          alignItems="center"
          gap={1}
        >
          <Box as="span">{getTopicIcon(topic)}</Box>
          <Box as="span" textTransform="capitalize">
            {topic === 'universe' ? 'Universo' : 
             topic === 'world' ? 'Mundo' : 
             topic === 'venezuela' ? 'Venezuela' : 
             topic === 'regions' ? 'Regiones' : 
             topic === 'capitals' ? 'Capitales' : 'Ciudades'}
          </Box>
        </Box>
      </Box>

      {/* Contenido */}
      <VStack p={4} spacing={3} align="stretch" flex={1}>
        {/* Título */}
        <Text 
          fontSize="lg" 
          fontWeight="bold" 
          noOfLines={2} 
          minH="3.5rem"
          lineHeight="tall"
        >
          {title}
        </Text>

        {/* Periodo de tiempo */}
        {timePeriod && (
          <HStack spacing={2} color="blue.500" fontSize="sm">
            <Icon as={FaClock} />
            <Text>{timePeriod}</Text>
          </HStack>
        )}

        {/* Ubicación */}
        {location && (
          <HStack spacing={2} color="green.500" fontSize="sm">
            <Icon as={FaMapMarkerAlt} />
            <Text>{location}</Text>
          </HStack>
        )}

        {/* Descripción */}
        <Text 
          color={textColor} 
          fontSize="sm" 
          noOfLines={3}
          flex={1}
        >
          {description}
        </Text>

        {/* Figuras importantes */}
        {importantFigures && importantFigures.length > 0 && (
          <Box>
            <Text fontSize="xs" color="gray.500" mb={1}>
              Figuras importantes:
            </Text>
            <HStack spacing={2} flexWrap="wrap">
              {importantFigures.slice(0, 3).map((figure, index) => (
                <Badge 
                  key={index} 
                  colorScheme={getTopicColor(topic)}
                  variant="subtle"
                  px={2}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                >
                  {figure}
                </Badge>
              ))}
              {importantFigures.length > 3 && (
                <Tooltip label={importantFigures.slice(3).join(', ')}>
                  <Badge 
                    colorScheme={getTopicColor(topic)}
                    variant="outline"
                    px={2}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                  >
                    +{importantFigures.length - 3} más
                  </Badge>
                </Tooltip>
              )}
            </HStack>
          </Box>
        )}

        {/* Botón de acción */}
        <Button 
          colorScheme={getTopicColor(topic)}
          size="sm"
          mt={2}
          onClick={(e) => {
            e.preventDefault();
            if (onLearnMore) onLearnMore();
          }}
          rightIcon={<FaBookOpen size={14} />}
        >
          Aprender más
        </Button>
      </VStack>
    </Box>
  );
};

export default HistoryCard;
