// Utilidades para el módulo de Matemáticas

export * from './mathOperations';
export * from './formatters';
export * from './validators';

/**
 * Genera un ID único
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Calcula el puntaje basado en el tiempo y la precisión
 */
export const calculateScore = (timeSpent: number, isCorrect: boolean, difficulty: 'easy' | 'medium' | 'hard'): number => {
  const baseScores = {
    easy: 10,
    medium: 20,
    hard: 30,
  };
  
  const timeBonus = Math.max(0, 30 - Math.floor(timeSpent / 1000)); // Bonus por responder rápido
  return isCorrect ? baseScores[difficulty] + timeBonus : 0;
};

/**
 * Formatea el tiempo en segundos a un string legible (MM:SS)
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Obtiene un mensaje de retroalimentación basado en el puntaje
 */
export const getFeedbackMessage = (score: number, maxScore: number): string => {
  const percentage = (score / maxScore) * 100;
  
  if (percentage >= 90) return '¡Excelente trabajo! Eres un genio de las matemáticas.';
  if (percentage >= 70) return '¡Muy bien! Sigue practicando para mejorar aún más.';
  if (percentage >= 50) return 'Buen intento. Sigue practicando para mejorar.';
  return 'No te rindas. Sigue intentándolo y verás cómo mejoras.';
};
