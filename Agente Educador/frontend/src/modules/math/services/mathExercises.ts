import { MathExercise, AgeGroup } from '../types';

// Datos de ejemplo para ejercicios matemáticos
export const sampleMathExercises: Record<AgeGroup, MathExercise[]> = {
  '3-5': [
    {
      id: '1',
      question: '¿Cuántas manzanas hay? 🍎🍎',
      options: ['1', '2', '3', '4'],
      correctAnswer: 1, // Índice de la opción correcta (0-based)
      difficulty: 'easy',
      ageGroup: '3-5',
      topic: 'Conteo',
      hint: 'Cuenta las manzanas una por una.'
    },
    {
      id: '2',
      question: '¿Qué forma es un círculo?',
      options: ['⬜', '🔺', '🔵', '⭐'],
      correctAnswer: 2,
      difficulty: 'easy',
      ageGroup: '3-5',
      topic: 'Formas',
      hint: 'El círculo es redondo como una pelota.'
    },
  ],
  '6-8': [
    {
      id: '3',
      question: '¿Cuánto es 5 + 3?',
      options: ['6', '7', '8', '9'],
      correctAnswer: 2,
      difficulty: 'easy',
      ageGroup: '6-8',
      topic: 'Sumas',
      hint: 'Cuenta con los dedos si lo necesitas.'
    },
    {
      id: '4',
      question: 'Si tienes 10 dulces y regalas 4, ¿cuántos te quedan?',
      options: ['4', '5', '6', '7'],
      correctAnswer: 2,
      difficulty: 'medium',
      ageGroup: '6-8',
      topic: 'Restas',
      hint: 'Resta 4 de 10.'
    },
  ],
  '9-12': [
    {
      id: '5',
      question: '¿Cuál es el resultado de 7 × 8?',
      options: ['48', '54', '56', '64'],
      correctAnswer: 2,
      difficulty: 'medium',
      ageGroup: '9-12',
      topic: 'Multiplicación',
      hint: 'Recuerda la tabla del 7.'
    },
    {
      id: '6',
      question: 'Si un cuadrado tiene lados de 5 cm, ¿cuál es su perímetro?',
      options: ['10 cm', '15 cm', '20 cm', '25 cm'],
      correctAnswer: 2,
      difficulty: 'hard',
      ageGroup: '9-12',
      topic: 'Geometría',
      hint: 'Un cuadrado tiene 4 lados iguales.'
    },
  ],
};

/**
 * Obtiene ejercicios matemáticos según el grupo de edad
 */
export const getMathExercises = (ageGroup: AgeGroup): Promise<MathExercise[]> => {
  // En una aplicación real, esto haría una llamada a la API
  return new Promise((resolve) => {
    // Simular tiempo de carga
    setTimeout(() => {
      resolve([...sampleMathExercises[ageGroup]]);
    }, 500);
  });
};

/**
 * Obtiene un ejercicio aleatorio del grupo de edad especificado
 */
export const getRandomMathExercise = async (ageGroup: AgeGroup): Promise<MathExercise> => {
  const exercises = await getMathExercises(ageGroup);
  const randomIndex = Math.floor(Math.random() * exercises.length);
  return exercises[randomIndex];
};

/**
 * Envía la respuesta del usuario al servidor
 */
export const submitMathExercise = async (
  exerciseId: string, 
  selectedOption: number, 
  timeSpent: number
): Promise<{ isCorrect: boolean; correctAnswer: number; score: number }> => {
  // En una aplicación real, esto haría una llamada a la API
  return new Promise((resolve) => {
    // Simular tiempo de procesamiento
    setTimeout(() => {
      // Encontrar el ejercicio por ID
      const allExercises = Object.values(sampleMathExercises).flat();
      const exercise = allExercises.find(ex => ex.id === exerciseId);
      
      if (!exercise) {
        throw new Error('Ejercicio no encontrado');
      }
      
      const isCorrect = selectedOption === exercise.correctAnswer;
      const score = calculateScore(timeSpent, isCorrect, exercise.difficulty);
      
      resolve({
        isCorrect,
        correctAnswer: exercise.correctAnswer,
        score
      });
    }, 800);
  });
};

/**
 * Calcula el puntaje basado en el tiempo y la dificultad
 */
const calculateScore = (
  timeSpent: number, 
  isCorrect: boolean, 
  difficulty: 'easy' | 'medium' | 'hard'
): number => {
  if (!isCorrect) return 0;
  
  const baseScores = {
    easy: 10,
    medium: 20,
    hard: 30,
  };
  
  // Bonus por responder rápido (máximo 10 puntos extra)
  const timeBonus = Math.max(0, 10 - Math.floor(timeSpent / 3));
  return baseScores[difficulty] + timeBonus;
};

/**
 * Obtiene el progreso del usuario
 */
export const getUserProgress = async (userId: string) => {
  // En una aplicación real, esto obtendría datos del servidor
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        userId,
        completedExercises: [],
        score: 0,
        level: 1,
        badges: [],
        lastPlayed: new Date().toISOString(),
      });
    }, 500);
  });
};
