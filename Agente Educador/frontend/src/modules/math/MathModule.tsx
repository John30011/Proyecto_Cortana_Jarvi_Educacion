import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { FaCalculator } from 'react-icons/fa';

interface MathModuleProps {
  ageGroup: '3-5' | '6-8' | '9-12';
}

export const MathModule: React.FC<MathModuleProps> = ({ ageGroup }) => {
  // Contenido basado en el grupo de edad
  const getContentByAgeGroup = () => {
    switch (ageGroup) {
      case '3-5':
        return {
          title: 'Matemáticas para Pequeños',
          description: 'Aprende a contar y formas básicas de manera divertida',
        };
      case '6-8':
        return {
          title: 'Aventuras Matemáticas',
          description: 'Sumas, restas y problemas matemáticos emocionantes',
        };
      case '9-12':
        return {
          title: 'Desafíos Matemáticos',
          description: 'Multiplicación, división y problemas más complejos',
        };
      default:
        return {
          title: 'Matemáticas',
          description: 'Explora el mundo de los números',
        };
    }
  };

  const { title, description } = getContentByAgeGroup();

  return (
    <Box p={6} borderRadius="lg" bg="white" boxShadow="md">
      <Box display="flex" alignItems="center" mb={4}>
        <FaCalculator size={32} className="text-blue-500 mr-3" />
        <Heading as="h2" size="lg">{title}</Heading>
      </Box>
      <Text mb={6} color="gray.600">
        {description}
      </Text>
      <Box>
        {/* Aquí irán los componentes específicos del módulo de matemáticas */}
        <Text>Contenido interactivo para el grupo de edad {ageGroup}</Text>
      </Box>
    </Box>
  );
};

export default MathModule;
