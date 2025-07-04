import React from 'react';
import { 
  Box, 
  Flex, 
  Button, 
  useColorModeValue, 
  useColorMode,
  IconButton,
  HStack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { FiMoon, FiSun, FiMenu, FiBell, FiUser, FiLogOut } from 'react-icons/fi';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast({
        title: 'Sesión cerrada',
        description: 'Has cerrado sesión correctamente',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cerrar la sesión',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box 
      bg={bgColor} 
      px={4} 
      borderBottomWidth="1px" 
      borderColor={borderColor}
      position="fixed"
      w="100%"
      zIndex="sticky"
      top={0}
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        {/* Logo y menú móvil */}
        <HStack spacing={4} alignItems="center">
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
            variant="ghost"
            aria-label="Abrir menú"
            icon={<FiMenu />}
          />
          
          <Box 
            as={RouterLink} 
            to="/" 
            fontWeight="extrabold" 
            fontSize="2xl"
            bgGradient="linear(to-r, #4F46E5, #7C3AED)"
            bgClip="text"
            fontFamily="'Poppins', sans-serif"
            letterSpacing="tighter"
            _hover={{
              textDecoration: 'none',
              bgGradient: 'linear(to-r, #4338CA, #6D28D9)'
            }}
          >
            EducaKids
          </Box>
        </HStack>

        {/* Menú de navegación */}
        <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
          <Button as={RouterLink} to="/" variant="ghost">Inicio</Button>
          <Button as={RouterLink} to="/science" variant="ghost">Ciencia</Button>
          <Button as={RouterLink} to="/math" variant="ghost">Matemáticas</Button>
          <Button as={RouterLink} to="/history" variant="ghost">Historia</Button>
        </HStack>

        {/* Acciones de usuario */}
        <HStack spacing={4}>
          <IconButton
            aria-label="Cambiar tema"
            icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
            onClick={toggleColorMode}
            variant="ghost"
          />
          
          <IconButton
            aria-label="Notificaciones"
            icon={<FiBell />}
            variant="ghost"
          />
          
          <Menu>
            <MenuButton
              as={Button}
              rounded={'full'}
              variant={'link'}
              cursor={'pointer'}
              minW={0}
            >
              <Avatar
                size={'sm'}
                name="Usuario"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              />
            </MenuButton>
            <MenuList>
              <MenuItem as={RouterLink} to="/app/profile" icon={<FiUser />}>
                Perfil
              </MenuItem>
              <MenuDivider />
              <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
                Salir
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
