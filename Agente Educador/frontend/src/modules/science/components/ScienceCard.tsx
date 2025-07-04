import React from 'react';
import {
  Box,
  Heading,
  Text,
  Badge,
  Button,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Image,
  AspectRatio,
  Flex,
  Tooltip
} from '@chakra-ui/react';
import { FaFlask, FaClock, FaStar, FaArrowRight } from 'react-icons/fa';
import { ScienceExperiment, ScienceFact } from '../types';

interface TopicIcons {
  [key: string]: {
    icon: any;
    color: string;
  };
}

interface ScienceCardProps {
  item: ScienceExperiment | ScienceFact;
  topicIcons: TopicIcons;
  onLearnMore: () => void;
}

const ScienceCard: React.FC<ScienceCardProps> = ({ item, topicIcons, onLearnMore }) => {
  const isExperiment = 'steps' in item;
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const headingColor = useColorModeValue('gray.800', 'white');

  const getTopic = () => {
    if (isExperiment) {
      return item.topic;
    }
    // Para hechos, usamos el primer tema disponible
    return item.topics?.[0] || 'science';
  };

  const topic = getTopic();
  const topicData = topicIcons[topic as keyof typeof topicIcons] || { icon: FaFlask, color: 'blue' };
  const IconComponent = topicData.icon;
  const iconColor = topicData.color;

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      overflow="hidden"
      borderWidth="1px"
      borderColor={borderColor}
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'lg',
        bg: hoverBg,
      }}
      height="100%"
      display="flex"
      flexDirection="column"
    >
      {/* Imagen */}
      {item.imageUrl && (
        <AspectRatio ratio={16 / 9}>
          <Image
            src={item.imageUrl}
            alt={item.title || 'Imagen de ciencia'}
            objectFit="cover"
            borderTopRadius="lg"
          />
        </AspectRatio>
      )}

      {/* Contenido */}
      <VStack p={5} spacing={3} align="stretch" flex={1}>
        {/* Título y categoría */}
        <HStack spacing={2} align="center">
          <Icon as={IconComponent} color={`${iconColor}.500`} boxSize={5} />
          <Text
            fontSize="sm"
            fontWeight="semibold"
            color={`${iconColor}.600`}
            textTransform="uppercase"
            letterSpacing="wide"
          >
            {topic}
          </Text>
        </HStack>

        <Heading size="md" color={headingColor} noOfLines={2} minH="3.5rem">
          {item.title || 'Título no disponible'}
        </Heading>

        <Text color={textColor} noOfLines={3} flex={1}>
          {item.description || 'Descripción no disponible'}
        </Text>

        {/* Badges */}
        <HStack spacing={2} mt={2} flexWrap="wrap">
          {isExperiment && (
            <>
              <Tooltip label="Dificultad">
                <Badge colorScheme="blue" borderRadius="full" px={2}>
                  {item.difficulty === 'easy' ? 'Fácil' : item.difficulty === 'medium' ? 'Intermedio' : 'Difícil'}
                </Badge>
              </Tooltip>
              <Tooltip label="Duración">
                <Badge colorScheme="green" borderRadius="full" px={2}>
                  <HStack spacing={1}>
                    <Icon as={FaClock} boxSize={3} />
                    <span>{item.duration} min</span>
                  </HStack>
                </Badge>
              </Tooltip>
              <Tooltip label="Valoración">
                <Badge colorScheme="yellow" borderRadius="full" px={2}>
                  <HStack spacing={1}>
                    <Icon as={FaStar} color="yellow.500" boxSize={3} />
                    <span>{item.rating || '4.5'}</span>
                  </HStack>
                </Badge>
              </Tooltip>
            </>
          )}
          {!isExperiment && item.topics && item.topics.length > 0 && (
            <Badge colorScheme="purple" borderRadius="full" px={2}>
              {item.topics[0]}
            </Badge>
          )}
        </HStack>
      </VStack>

      {/* Botón de acción */}
      <Box p={4} pt={0}>
        <Button
          colorScheme={iconColor}
          variant="outline"
          width="100%"
          rightIcon={<FaArrowRight />}
          onClick={onLearnMore}
          size="sm"
        >
          {isExperiment ? 'Ver experimento' : 'Saber más'}
        </Button>
      </Box>
    </Box>
  );
};

export default ScienceCard;
