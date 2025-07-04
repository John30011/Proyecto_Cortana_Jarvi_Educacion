import { useState, useEffect, useCallback } from 'react';
import { MathExercise, AgeGroup } from '../types';
import { getRandomMathExercise, submitMathExercise, getUserProgress } from '../services/mathExercises';

export const useMathExercises = (ageGroup: AgeGroup, userId: string) => {
  const [currentExercise, setCurrentExercise] = useState<MathExercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState({
    completed: 0,
    total: 10, // Por defecto, 10 ejercicios por sesión
  });
  const [userProgress, setUserProgress] = useState<{
    level: number;
    badges: string[];
    totalScore: number;
  } | null>(null);

  // Cargar el progreso del usuario al inicio
  useEffect(() => {
    const loadUserProgress = async () => {
      try {
        const progressData = await getUserProgress(userId);
        setUserProgress({
          level: progressData.level || 1,
          badges: progressData.badges || [],
          totalScore: progressData.score || 0,
        });
      } catch (err) {
        console.error('Error al cargar el progreso:', err);
        // Inicializar con valores por defecto si hay un error
        setUserProgress({
          level: 1,
          badges: [],
          totalScore: 0,
        });
      }
    };

    loadUserProgress();
  }, [userId]);

  // Cargar un nuevo ejercicio
  const loadNewExercise = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const exercise = await getRandomMathExercise(ageGroup);
      setCurrentExercise(exercise);
    } catch (err) {
      console.error('Error al cargar el ejercicio:', err);
      setError('No se pudo cargar el ejercicio. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, [ageGroup]);

  // Cargar el primer ejercicio al montar el componente
  useEffect(() => {
    loadNewExercise();
  }, [loadNewExercise]);

  // Manejar la respuesta del usuario
  const handleAnswer = useCallback(async (selectedOption: number, timeSpent: number) => {
    if (!currentExercise) return;
    
    try {
      const result = await submitMathExercise(
        currentExercise.id,
        selectedOption,
        timeSpent
      );
      
      // Actualizar puntuación si la respuesta es correcta
      if (result.isCorrect) {
        setScore(prev => prev + result.score);
        
        // Actualizar el progreso del usuario
        if (userProgress) {
          const newTotalScore = userProgress.totalScore + result.score;
          const newLevel = Math.floor(newTotalScore / 100) + 1; // Cada 100 puntos subes de nivel
          
          setUserProgress(prev => ({
            ...prev!,
            totalScore: newTotalScore,
            level: newLevel,
          }));
          
          // Verificar si se ha ganado alguna insignia
          const newBadges = [...(userProgress.badges || [])];
          if (newTotalScore >= 50 && !newBadges.includes('bronze')) {
            newBadges.push('bronze');
          }
          if (newTotalScore >= 200 && !newBadges.includes('silver')) {
            newBadges.push('silver');
          }
          if (newTotalScore >= 500 && !newBadges.includes('gold')) {
            newBadges.push('gold');
          }
          
          if (newBadges.length > (userProgress.badges?.length || 0)) {
            setUserProgress(prev => ({
              ...prev!,
              badges: newBadges,
            }));
          }
        }
      }
      
      // Actualizar progreso de la sesión
      setProgress(prev => ({
        ...prev,
        completed: prev.completed + 1,
      }));
      
      return result;
    } catch (err) {
      console.error('Error al enviar la respuesta:', err);
      throw err;
    }
  }, [currentExercise, userProgress]);

  // Ir al siguiente ejercicio
  const nextExercise = useCallback(() => {
    if (progress.completed >= progress.total) {
      // Sesión completada
      return false;
    }
    
    loadNewExercise();
    return true;
  }, [loadNewExercise, progress]);

  // Reiniciar la sesión
  const resetSession = useCallback(() => {
    setScore(0);
    setProgress({
      completed: 0,
      total: 10,
    });
    loadNewExercise();
  }, [loadNewExercise]);

  return {
    currentExercise,
    isLoading,
    error,
    score,
    progress,
    userProgress,
    handleAnswer,
    nextExercise,
    resetSession,
  };
};

export default useMathExercises;
