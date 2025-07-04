import React from 'react';
import { 
  Box, 
  Container, 
  Stack, 
  Text, 
  Link, 
  useColorModeValue,
  Divider,
  HStack,
  Icon
} from '@chakra-ui/react';
import { FaGithub, FaTwitter, FaFacebook, FaYoutube } from 'react-icons/fa';

const Footer: React.FC = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  
  const currentYear = new Date().getFullYear();
  
  return (
    <Box
      bg={bgColor}
      borderTopWidth="1px"
      borderColor={borderColor}
      mt="auto"
    >
      <Container as="footer" maxW="container.xl" py={8}>
        <Stack spacing={8}>
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={8}
            justifyContent="space-between"
            alignItems={{ base: 'flex-start', md: 'center' }}
          >
            <Box>
              <Text fontWeight="bold" fontSize="lg" mb={2}>
                EducaKids
              </Text>
              <Text maxW="300px" color={textColor}>
                Plataforma educativa interactiva para niños de 3 a 12 años.
              </Text>
            </Box>
            
            <Stack direction="row" spacing={6}>
              <Stack spacing={2} minW="150px">
                <Text fontWeight="semibold">Explorar</Text>
                <Link href="#" color={textColor} _hover={{ color: 'blue.500' }}>Inicio</Link>
                <Link href="#" color={textColor} _hover={{ color: 'blue.500' }}>Módulos</Link>
                <Link href="#" color={textColor} _hover={{ color: 'blue.500' }}>Recursos</Link>
              </Stack>
              
              <Stack spacing={2} minW="150px">
                <Text fontWeight="semibold">Legal</Text>
                <Link href="#" color={textColor} _hover={{ color: 'blue.500' }}>Términos</Link>
                <Link href="#" color={textColor} _hover={{ color: 'blue.500' }}>Privacidad</Link>
                <Link href="#" color={textColor} _hover={{ color: 'blue.500' }}>Seguridad</Link>
              </Stack>
              
              <Stack spacing={2} minW="150px">
                <Text fontWeight="semibold">Soporte</Text>
                <Link href="#" color={textColor} _hover={{ color: 'blue.500' }}>Ayuda</Link>
                <Link href="#" color={textColor} _hover={{ color: 'blue.500' }}>Contacto</Link>
                <Link href="#" color={textColor} _hover={{ color: 'blue.500' }}>FAQs</Link>
              </Stack>
            </Stack>
          </Stack>
          
          <Divider />
          
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={4}
            justifyContent="space-between"
            alignItems="center"
          >
            <Text color={textColor} fontSize="sm">
              © {currentYear} EducaKids. Todos los derechos reservados.
            </Text>
            
            <HStack spacing={4}>
              <Link href="https://github.com/" isExternal>
                <Icon as={FaGithub} boxSize={5} color={textColor} _hover={{ color: 'blue.500' }} />
              </Link>
              <Link href="https://twitter.com/" isExternal>
                <Icon as={FaTwitter} boxSize={5} color={textColor} _hover={{ color: 'blue.500' }} />
              </Link>
              <Link href="https://facebook.com/" isExternal>
                <Icon as={FaFacebook} boxSize={5} color={textColor} _hover={{ color: 'blue.500' }} />
              </Link>
              <Link href="https://youtube.com/" isExternal>
                <Icon as={FaYoutube} boxSize={5} color={textColor} _hover={{ color: 'red.500' }} />
              </Link>
            </HStack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
