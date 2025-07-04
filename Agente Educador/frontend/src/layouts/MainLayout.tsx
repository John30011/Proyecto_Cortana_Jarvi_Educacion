import React from 'react';
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const MainLayout: React.FC = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Flex direction="column" minH="100vh">
      <Navbar />
      
      <Flex flex="1" pt="60px">
        <Box
          as="aside"
          w="250px"
          bg={bgColor}
          borderRightWidth="1px"
          borderColor={borderColor}
          display={{ base: 'none', md: 'block' }}
          position="fixed"
          h="calc(100vh - 60px)"
          overflowY="auto"
        >
          <Sidebar />
        </Box>
        
        <Box 
          as="main" 
          flex="1" 
          ml={{ base: 0, md: '250px' }}
          p={4}
        >
          <Box maxW="1200px" mx="auto">
            <Outlet />
          </Box>
        </Box>
      </Flex>
      
      <Footer />
    </Flex>
  );
};

export default MainLayout;
