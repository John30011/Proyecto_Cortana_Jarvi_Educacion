import { Box, Container } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext-1';
import Header from './Header';
import Footer from './Footer';

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <Box minH="100vh" display="flex" flexDirection="column">
        <Box h="64px" bg="white" boxShadow="sm" />
        <Container maxW="container.xl" flex="1" py={8}>
          <Box h="200px" w="100%" bg="gray.100" borderRadius="md" />
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Container maxW="container.xl" flex="1" py={8}>
        <Box flex="1">
          {children}
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default MainLayout;
