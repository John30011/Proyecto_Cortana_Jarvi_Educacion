import React from 'react';
import { Box, Container, Heading, Text, VStack, Button, useColorModeValue, HStack, Badge, Flex, SimpleGrid } from '@chakra-ui/react';
import { FaUserAstronaut, FaGraduationCap } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ActivitiesGrid from '@/components/dashboard/ActivitiesGrid';

// Componentes de animación
const MotionBox = motion(Box);
const MotionButton = motion(Button);



const Dashboard = () => {
  const textColor = useColorModeValue('gray.700', 'white');

  return (
    <Container maxW="container.xl" py={8}>
      {/* Encabezado con bienvenida */}
      <VStack spacing={6} align="flex-start" mb={10}>
        <HStack spacing={4} align="center">
          <Box
            p={3}
            borderRadius="full"
            bgGradient="linear(to-r, blue.400, purple.400)"
            color="white"
          >
            <FaUserAstronaut size={32} />
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500">¡Bienvenido de nuevo,</Text>
            <Heading size="lg" color={textColor}>Explorador Estelar</Heading>
          </Box>
        </HStack>
        
        <Text fontSize="lg" color={textColor} maxW="2xl">
          ¿Qué te gustaría aprender hoy? ¡Tenemos muchas aventuras emocionantes esperándote!
        </Text>
      </VStack>

      {/* Sección de progreso */}
      <Box mb={10}>
        <Heading size="md" mb={4} color={textColor}>Tu Progreso</Heading>
        <Box 
          bgGradient="linear(to-r, blue.400, purple.400)" 
          p={6} 
          borderRadius="xl"
          color="white"
          position="relative"
          overflow="hidden"
        >
          <Box zIndex={1} position="relative">
            <Text fontSize="lg" fontWeight="bold" mb={2}>Nivel: Aprendiz Estelar</Text>
            <Box bg="whiteAlpha.300" h="8px" borderRadius="full" mb={4} overflow="hidden">
              <Box w="45%" h="100%" bg="white" borderRadius="full" />
            </Box>
            <Text fontSize="sm">45% completado hasta el siguiente nivel</Text>
          </Box>
          <Box
            position="absolute"
            right="-50px"
            top="-50px"
            bg="whiteAlpha.200"
            w="200px"
            h="200px"
            borderRadius="full"
          />
          <Box
            position="absolute"
            right="-20px"
            bottom="-20px"
            bg="whiteAlpha.200"
            w="100px"
            h="100px"
            borderRadius="full"
          />
        </Box>
      </Box>

      {/* Cuadrícula de actividades educativas */}
      <ActivitiesGrid />

      {/* Recompensas y logros */}
      <Box>
        <HStack justify="space-between" mb={4}>
          <Heading size="md" color={textColor}>Tus Logros</Heading>
          <Button variant="ghost" colorScheme="blue" size="sm">Ver todos</Button>
        </HStack>
        
        <Box 
          bg={useColorModeValue('white', 'gray.700')} 
          p={6} 
          borderRadius="xl"
          boxShadow="md"
          borderWidth="1px"
          borderColor="gray.200"
          _dark={{ borderColor: 'gray.600' }}
        >
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
            {[1, 2, 3, 4].map((item) => (
              <VStack key={item} spacing={3}>
                <Box
                  p={3}
                  borderRadius="full"
                  bg="yellow.100"
                  color="yellow.600"
                  _dark={{ bg: 'yellow.900', color: 'yellow.300' }}
                >
                  <FaGraduationCap size={24} />
                </Box>
                <Text fontWeight="bold" color={textColor}>Logro {item}</Text>
                <Badge colorScheme="yellow" borderRadius="full" px={3} py={1}>
                  ¡Desbloqueado!
                </Badge>
              </VStack>
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
