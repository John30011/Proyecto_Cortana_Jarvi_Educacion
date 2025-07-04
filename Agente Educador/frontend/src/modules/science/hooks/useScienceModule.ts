import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { 
  ScienceExperiment, 
  ScienceQuestion, 
  ScienceFact, 
  AgeGroup, 
  ScienceTopic 
} from '../types';
import { 
  getScienceExperiments, 
  getScienceQuestions, 
  getRandomFact,
  saveExperimentProgress,
  saveQuizResults,
  saveFavoriteFact
} from '../services';
import { logError } from '../../../utils/logger';

interface UseScienceModuleProps {
  initialAgeGroup?: AgeGroup;
  initialTopic?: ScienceTopic;
}

interface ScienceProgress {
  completedExperiments: string[];
  completedQuizzes: string[];
  favoriteFacts: string[];
  points: number;
  lastActivity: Date | null;
}

const useScienceModule = ({ 
  initialAgeGroup = '6-8',
  initialTopic
}: UseScienceModuleProps = {}) => {
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(initialAgeGroup);
  const [topic, setTopic] = useState<ScienceTopic | undefined>(initialTopic);
  const [experiments, setExperiments] = useState<ScienceExperiment[]>([]);
  const [questions, setQuestions] = useState<ScienceQuestion[]>([]);
  const [randomFact, setRandomFact] = useState<ScienceFact | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<ScienceProgress>({
    completedExperiments: [],
    completedQuizzes: [],
    favoriteFacts: [],
    points: 0,
    lastActivity: null
  });
  
  const toast = useToast();
  
  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
    // Cargar progreso guardado del localStorage
    loadProgress();
  }, [ageGroup, topic]);
  
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Cargar experimentos
      const exps = await getScienceExperiments(ageGroup);
      setExperiments(exps);
      
      // Cargar preguntas (solo algunas para vista previa)
      const qs = await getScienceQuestions(ageGroup, topic, 'easy', 5);
      setQuestions(qs);
      
      // Cargar un hecho aleatorio
      const fact = await getRandomFact(ageGroup, topic);
      setRandomFact(fact);
      
    } catch (err) {
      logError('Error al cargar datos de ciencias', err);
      setError('No se pudieron cargar los datos. Por favor, inténtalo de nuevo más tarde.');
      
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los datos de ciencias.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cargar progreso guardado
  const loadProgress = useCallback(() => {
    try {
      const savedProgress = localStorage.getItem('scienceProgress');
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
    } catch (err) {
      logError('Error al cargar el progreso', err);
    }
  }, []);
  
  // Guardar progreso
  const saveProgress = useCallback((updatedProgress: Partial<ScienceProgress>) => {
    try {
      const newProgress = {
        ...progress,
        ...updatedProgress,
        lastActivity: new Date()
      };
      
      setProgress(newProgress);
      localStorage.setItem('scienceProgress', JSON.stringify(newProgress));
      
      // Mostrar notificación de puntos ganados si corresponde
      if (updatedProgress.points !== undefined && updatedProgress.points > progress.points) {
        const pointsEarned = updatedProgress.points - progress.points;
        if (pointsEarned > 0) {
          toast({
            title: '¡Puntos ganados!',
            description: `Has ganado ${pointsEarned} puntos por completar la actividad.`,
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        }
      }
      
      return newProgress;
    } catch (err) {
      logError('Error al guardar el progreso', err);
      return progress;
    }
  }, [progress, toast]);
  
  // Manejar la finalización de un experimento
  const handleExperimentComplete = async (
    experimentId: string, 
    notes?: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Guardar en el servidor (simulado)
      await saveExperimentProgress('current-user-id', experimentId, notes);
      
      // Actualizar progreso local
      const updatedProgress = saveProgress({
        completedExperiments: [...new Set([...progress.completedExperiments, experimentId])],
        points: progress.points + 10 // 10 puntos por experimento completado
      });
      
      // Mostrar notificación
      toast({
        title: '¡Experimento completado!',
        description: 'Has ganado 10 puntos por completar este experimento.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      return true;
    } catch (err) {
      logError('Error al guardar el progreso del experimento', err);
      
      toast({
        title: 'Error',
        description: 'No se pudo guardar el progreso del experimento.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Manejar la finalización de un cuestionario
  const handleQuizComplete = async (
    quizId: string, 
    answers: { questionId: string; answerIndex: number }[],
    timeSpent: number // en segundos
  ) => {
    try {
      setIsLoading(true);
      
      // Preparar datos para guardar
      const questionIds = answers.map(a => a.questionId);
      const answerIndices = answers.map(a => a.answerIndex);
      
      // Guardar resultados (simulado)
      const result = await saveQuizResults(
        'current-user-id',
        questionIds,
        answerIndices,
        timeSpent
      );
      
      // Calcular puntos (10 puntos por respuesta correcta)
      const pointsEarned = result.correctAnswers * 10;
      
      // Actualizar progreso local
      const updatedProgress = saveProgress({
        completedQuizzes: [...new Set([...progress.completedQuizzes, quizId])],
        points: progress.points + pointsEarned
      });
      
      // Mostrar resultados
      return {
        ...result,
        pointsEarned,
        totalPoints: updatedProgress.points
      };
      
    } catch (err) {
      logError('Error al guardar los resultados del cuestionario', err);
      
      toast({
        title: 'Error',
        description: 'No se pudieron guardar los resultados del cuestionario.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Manejar el guardado de un hecho como favorito
  const handleSaveFavoriteFact = async (factId: string): Promise<boolean> => {
    try {
      // Guardar en el servidor (simulado)
      await saveFavoriteFact('current-user-id', factId);
      
      // Actualizar progreso local
      saveProgress({
        favoriteFacts: [...new Set([...progress.favoriteFacts, factId])],
        points: progress.points + 5 // 5 puntos por guardar un hecho favorito
      });
      
      // Mostrar notificación
      toast({
        title: 'Hecho guardado',
        description: 'Has guardado este hecho en tus favoritos. ¡Ganaste 5 puntos!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      return true;
    } catch (err) {
      logError('Error al guardar el hecho favorito', err);
      
      toast({
        title: 'Error',
        description: 'No se pudo guardar el hecho en favoritos.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      
      return false;
    }
  };
  
  // Cargar un nuevo hecho aleatorio
  const loadNewRandomFact = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const fact = await getRandomFact(ageGroup, topic);
      setRandomFact(fact);
    } catch (err) {
      logError('Error al cargar un nuevo hecho', err);
      
      toast({
        title: 'Error',
        description: 'No se pudo cargar un nuevo hecho. Inténtalo de nuevo.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filtrar experimentos por tema
  const getFilteredExperiments = (filters: {
    topic?: ScienceTopic;
    difficulty?: 'easy' | 'medium' | 'hard';
  } = {}) => {
    return experiments.filter(exp => {
      let matches = true;
      
      if (filters.topic && exp.topic !== filters.topic) {
        matches = false;
      }
      
      if (filters.difficulty && exp.difficulty !== filters.difficulty) {
        matches = false;
      }
      
      return matches;
    });
  };
  
  // Verificar si un experimento está completado
  const isExperimentCompleted = (experimentId: string): boolean => {
    return progress.completedExperiments.includes(experimentId);
  };
  
  // Verificar si un cuestionario está completado
  const isQuizCompleted = (quizId: string): boolean => {
    return progress.completedQuizzes.includes(quizId);
  };
  
  // Verificar si un hecho está en favoritos
  const isFactFavorite = (factId: string): boolean => {
    return progress.favoriteFacts.includes(factId);
  };
  
  return {
    // Estado
    ageGroup,
    setAgeGroup,
    topic,
    setTopic,
    experiments,
    questions,
    randomFact,
    isLoading,
    error,
    progress,
    
    // Métodos
    loadNewRandomFact,
    handleExperimentComplete,
    handleQuizComplete,
    handleSaveFavoriteFact,
    getFilteredExperiments,
    isExperimentCompleted,
    isQuizCompleted,
    isFactFavorite,
    saveProgress
  };
};

export default useScienceModule;
