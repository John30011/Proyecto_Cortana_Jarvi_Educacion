import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  
  return (
    <Box 
      position="relative" 
      minH="100vh" 
      bg={useColorModeValue('gray.50', 'gray.900')} 
      px={4} 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
    >
      <MotionBox
        w="100%"
        maxW="md"
        bg={cardBg}
        borderRadius="xl"
        boxShadow="xl"
        p={8}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </MotionBox>
    </Box>
  );
};

export default AuthLayout;
