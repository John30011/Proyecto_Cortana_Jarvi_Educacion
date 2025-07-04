import { 
  Box, 
  Flex, 
  Heading, 
  Button, 
  useColorMode, 
  useColorModeValue, 
  Avatar, 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  MenuDivider,
  IconButton, 
  Container,
  Text
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext-1';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box as="header" bg={bgColor} boxShadow="sm" py={4} px={8} position="sticky" top={0} zIndex={10}>
      <Container maxW="container.xl">
        <Flex justifyContent="space-between" alignItems="center">
          <RouterLink to="/">
            <Flex alignItems="center">
                <Box w="40px" h="40px" borderRadius="full" bg="gray.200" />
                <Box boxSize="40px" mr={2}>
                  <Box 
                    bg="brand.500" 
                    w="100%" 
                    h="100%" 
                    borderRadius="md" 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center" 
                    color="white"
                  >
                    <Text as="span" fontWeight="bold" fontSize="lg">E</Text>
                  </Box>
                </Box>
              <Heading as="h1" size="lg" color={textColor}>
                Educador AI
              </Heading>
            </Flex>
          </RouterLink>
          
          <Flex alignItems="center" gap={4}>
            <IconButton
              onClick={toggleColorMode}
              variant="ghost"
              aria-label="Toggle color mode"
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            />
            
            {isAuthenticated ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  leftIcon={<Avatar size="sm" name={user?.name} src={user?.avatar} />}
                  variant="ghost"
                  colorScheme="gray"
                >
                  {user?.name || 'Mi Cuenta'}
                </MenuButton>
                <MenuList>
                  <MenuItem as={RouterLink} to="/app/dashboard">
                    Panel de Control
                  </MenuItem>
                  <MenuItem as={RouterLink} to="/app/perfil">
                    Mi Perfil
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={handleLogout} color="red.500">
                    Cerrar Sesión
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <>
                <Button as={RouterLink} to="/login" variant="ghost">
                  Iniciar Sesión
                </Button>
                <Button as={RouterLink} to="/register" colorScheme="brand">
                  Registrarse
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;
