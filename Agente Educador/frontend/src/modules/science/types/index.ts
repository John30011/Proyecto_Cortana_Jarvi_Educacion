// Tipos para el módulo de Ciencias

export type AgeGroup = '3-5' | '6-8' | '9-12';
export type ScienceTopic = 'biology' | 'chemistry' | 'physics' | 'earth' | 'space' | 'experiments';

export interface ScienceQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ageGroup: AgeGroup;
  topic: ScienceTopic;
  imageUrl?: string;
  videoUrl?: string;
}

export interface ScienceExperiment {
  id: string;
  title: string;
  description: string;
  materials: string[];
  steps: string[];
  safetyNotes: string[];
  ageGroup: AgeGroup;
  topic: ScienceTopic;
  duration: number; // en minutos
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
  videoUrl?: string;
}

export interface ScienceFact {
  id: string;
  title: string;
  content: string;
  ageGroup: AgeGroup;
  topic: ScienceTopic;
  imageUrl?: string;
  videoUrl?: string;
}

export interface ScienceProgress {
  userId: string;
  completedExperiments: string[];
  completedQuizzes: string[];
  badges: string[];
  points: number;
  lastActivity: Date;
  favoriteTopic?: ScienceTopic;
}

export interface ScienceQuiz {
  id: string;
  title: string;
  description: string;
  questions: string[]; // IDs de preguntas
  ageGroup: AgeGroup;
  topic: ScienceTopic;
  duration?: number; // en minutos, opcional
  passingScore: number; // puntuación mínima para aprobar (0-100)
}

// Tipos para las respuestas de la API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Tipos para los eventos del módulo de Ciencias
export type ScienceEventType = 
  | 'experiment_started' 
  | 'experiment_completed' 
  | 'quiz_completed' 
  | 'fact_viewed'
  | 'badge_earned';

export interface ScienceEvent {
  type: ScienceEventType;
  timestamp: Date;
  userId: string;
  data: Record<string, unknown>;
}

// Tipos para las estadísticas de progreso
export interface ScienceStats {
  totalExperiments: number;
  completedExperiments: number;
  totalQuizzes: number;
  completedQuizzes: number;
  successRate: number;
  totalPoints: number;
  favoriteTopic: ScienceTopic;
  timeSpent: number; // en minutos
  badges: string[];
}
