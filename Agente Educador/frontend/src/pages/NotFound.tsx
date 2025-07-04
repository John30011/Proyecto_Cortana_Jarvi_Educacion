import React from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Button, 
  VStack, 
  useColorModeValue,
  Image
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const textColor = useColorModeValue('gray.600', 'gray.300');
  
  return (
    <Container maxW="container.md" py={20}>
      <VStack spacing={8} textAlign="center">
        <Box maxW="300px" mx="auto">
          <Image 
            src="/images/404-illustration.svg" 
            alt="Página no encontrada" 
            w="100%"
          />
        </Box>
        
        <VStack spacing={4}>
          <Heading as="h1" size="2xl">
            ¡Ups! Página no encontrada
          </Heading>
          
          <Text fontSize="xl" color={textColor} maxW="2xl" mx="auto">
            La página que estás buscando podría haber sido eliminada, haber cambiado de nombre o no está disponible temporalmente.
          </Text>
          
          <Button 
            as={RouterLink} 
            to="/" 
            colorScheme="blue" 
            size="lg"
            mt={6}
          >
            Volver al inicio
          </Button>
        </VStack>
      </VStack>
    </Container>
  );
};

export default NotFoundPage;
