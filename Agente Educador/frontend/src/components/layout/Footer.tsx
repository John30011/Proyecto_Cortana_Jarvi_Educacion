import { Box, Container, Flex, Text, Link as ChakraLink } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box as="footer" bg="white" py={8} mt={8} borderTopWidth="1px">
      <Container maxW="container.xl">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="center">
          <Text mb={{ base: 4, md: 0 }}>
            © {new Date().getFullYear()} Educador AI. Todos los derechos reservados.
          </Text>
          <Flex gap={6}>
            <ChakraLink as={RouterLink} to="/terminos" color="gray.600" _hover={{ color: 'brand.500' }}>
              Términos de Servicio
            </ChakraLink>
            <ChakraLink as={RouterLink} to="/privacidad" color="gray.600" _hover={{ color: 'brand.500' }}>
              Política de Privacidad
            </ChakraLink>
            <ChakraLink as={RouterLink} to="/contacto" color="gray.600" _hover={{ color: 'brand.500' }}>
              Contacto
            </ChakraLink>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
