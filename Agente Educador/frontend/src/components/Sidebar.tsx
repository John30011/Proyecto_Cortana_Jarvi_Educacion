import React from 'react';
import { 
  Box, 
  VStack, 
  Button, 
  Text, 
  useColorModeValue,
  HStack,
  Icon,
  Link,
  Divider
} from '@chakra-ui/react';
import { 
  FaFlask, 
  FaBook, 
  FaHistory, 
  FaCalculator, 
  FaGamepad, 
  FaChartLine,
  FaUser
} from 'react-icons/fa';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const activeBg = useColorModeValue('blue.50', 'blue.900');
  const activeColor = useColorModeValue('blue.600', 'blue.200');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  
  const isActive = (path: string) => location.pathname === path;
  
  const menuItems = [
    { to: '/app/dashboard', icon: FaChartLine, label: 'Dashboard' },
    { to: '/app/profile', icon: FaUser, label: 'Mi Perfil' },
    { to: '/science', icon: FaFlask, label: 'Ciencia' },
    { to: '/math', icon: FaCalculator, label: 'Matemáticas' },
    { to: '/history', icon: FaHistory, label: 'Historia' },
    { to: '/games', icon: FaGamepad, label: 'Juegos' },
  ];

  return (
    <Box p={4}>
      <VStack align="stretch" spacing={1}>
        {menuItems.map((item) => (
          <Button
            key={item.to}
            as={RouterLink}
            to={item.to}
            variant="ghost"
            justifyContent="flex-start"
            leftIcon={<Icon as={item.icon} />}
            w="100%"
            textAlign="left"
            borderRadius="md"
            bg={isActive(item.to) ? activeBg : 'transparent'}
            color={isActive(item.to) ? activeColor : 'inherit'}
            _hover={{
              bg: isActive(item.to) ? activeBg : hoverBg,
              textDecoration: 'none',
            }}
          >
            {item.label}
          </Button>
        ))}
        
        <Divider my={2} />
        
        <Text fontSize="sm" fontWeight="bold" color="gray.500" px={2} mb={2}>
          PROGRESO
        </Text>
        
        <Button as={RouterLink} to="/progress" variant="ghost" justifyContent="flex-start" leftIcon={<Icon as={FaChartLine} />} w="100%" textAlign="left" borderRadius="md">
          Mi Progreso
        </Button>
        
        <Button as={RouterLink} to="/achievements" variant="ghost" justifyContent="flex-start" leftIcon={<Icon as={FaGamepad} />} w="100%" textAlign="left" borderRadius="md">
          Logros
        </Button>
        
        <Divider my={2} />
      </VStack>
    </Box>
  );
};

export default Sidebar;
