import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  VStack 
} from '@chakra-ui/react';
import PythonCourse from './PythonCourse';
import MathCourse from './MathCourse';
import AICourse from './AICourse';

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  // Render different course components based on courseId
  switch(courseId) {
    case '1':
      return <MathCourse />;
    case '2':
      return <PythonCourse />;
    case '3':
      return <AICourse />;
    default:
      return (
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8} align="stretch">
            <Box textAlign="center">
              <Heading as="h1" size="2xl" mb={4}>
                Curso no encontrado
              </Heading>
              <Text>El curso que buscas no existe o ha sido eliminado.</Text>
            </Box>
          </VStack>
        </Container>
      );
  }
};

export default CourseDetailPage;
