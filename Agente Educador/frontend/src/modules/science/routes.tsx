import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Box, Spinner, useColorModeValue } from '@chakra-ui/react';

// Páginas
import ScienceModule from '../ScienceModule';

// Componentes de carga
const LoadingSpinner = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minH="300px">
    <Spinner size="xl" color={useColorModeValue('blue.500', 'blue.300')} />
  </Box>
);

// Componentes cargados de forma perezosa
const ExperimentDetailPage = React.lazy(() => import('./pages/ExperimentDetailPage'));
const ExperimentsListPage = React.lazy(() => import('./pages/ExperimentsListPage'));
const QuizPage = React.lazy(() => import('./pages/QuizPage'));
const QuizResultsPage = React.lazy(() => import('./pages/QuizResultsPage'));
const FactsPage = React.lazy(() => import('./pages/FactsPage'));
const TopicPage = React.lazy(() => import('./pages/TopicPage'));

// Componente de envoltura para la carga perezosa
const LazyLoadedComponent: React.FC<{ component: React.ReactNode }> = ({ component }) => (
  <React.Suspense fallback={<LoadingSpinner />}>
    {component}
  </React.Suspense>
);

// Componente para manejar el grupo de edad en la URL
const AgeGroupWrapper: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { ageGroup } = useParams<{ ageGroup?: string }>();
  
  // Validar que el grupo de edad sea válido
  const validAgeGroups = ['3-5', '6-8', '9-12'];
  
  if (ageGroup && !validAgeGroups.includes(ageGroup)) {
    return <Navigate to="/science/6-8" replace />;
  }
  
  return <>{element}</>;
};

// Rutas del módulo de ciencias
const ScienceRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Ruta principal con grupo de edad opcional */}
      <Route 
        path="/" 
        element={
          <AgeGroupWrapper 
            element={<ScienceModule />} 
          />
        } 
      />
      
      {/* Ruta con grupo de edad específico */}
      <Route 
        path=":ageGroup" 
        element={
          <AgeGroupWrapper 
            element={<ScienceModule />} 
          />
        } 
      />
      
      {/* Lista de experimentos */}
      <Route 
        path="experiments" 
        element={
          <LazyLoadedComponent 
            component={
              <AgeGroupWrapper 
                element={<ExperimentsListPage />} 
              />
            } 
          />
        } 
      />
      
      {/* Detalle de un experimento específico */}
      <Route 
        path="experiments/:experimentId" 
        element={
          <LazyLoadedComponent 
            component={
              <AgeGroupWrapper 
                element={<ExperimentDetailPage />} 
              />
            } 
          />
        } 
      />
      
      {/* Cuestionarios */}
      <Route 
        path="quizzes" 
        element={
          <LazyLoadedComponent 
            component={
              <AgeGroupWrapper 
                element={<QuizPage />} 
              />
            } 
          />
        } 
      />
      
      {/* Resultados de cuestionario */}
      <Route 
        path="quizzes/results/:quizId" 
        element={
          <LazyLoadedComponent 
            component={
              <AgeGroupWrapper 
                element={<QuizResultsPage />} 
              />
            } 
          />
        } 
      />
      
      {/* Datos curiosos */}
      <Route 
        path="facts" 
        element={
          <LazyLoadedComponent 
            component={
              <AgeGroupWrapper 
                element={<FactsPage />} 
              />
            } 
          />
        } 
      />
      
      {/* Páginas de temas */}
      <Route 
        path="topics/:topicId" 
        element={
          <LazyLoadedComponent 
            component={
              <AgeGroupWrapper 
                element={<TopicPage />} 
              />
            } 
          />
        } 
      />
      
      {/* Redirección para rutas no encontradas */}
      <Route path="*" element={<Navigate to="/science/6-8" replace />} />
    </Routes>
  );
};

export default ScienceRoutes;
