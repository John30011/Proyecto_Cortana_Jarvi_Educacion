// Tipos para el módulo de Matemáticas

export type AgeGroup = '3-5' | '6-8' | '9-12';

export interface MathExercise {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ageGroup: AgeGroup;
  topic: string;
  imageUrl?: string;
  hint?: string;
}

export interface MathProgress {
  userId: string;
  completedExercises: string[];
  score: number;
  level: number;
  badges: string[];
  lastPlayed: Date;
}

export interface MathTutorial {
  id: string;
  title: string;
  content: string;
  ageGroup: AgeGroup;
  topic: string;
  videoUrl?: string;
  interactiveExample?: string;
}

export interface MathGame {
  id: string;
  title: string;
  description: string;
  ageGroup: AgeGroup;
  topic: string;
  minPlayers: number;
  maxPlayers: number;
  duration: number; // en minutos
}

// Tipos para las respuestas de la API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Tipos para los eventos del módulo de Matemáticas
export type MathEventType = 'exercise_completed' | 'level_up' | 'badge_earned' | 'tutorial_started';

export interface MathEvent {
  type: MathEventType;
  timestamp: Date;
  userId: string;
  data: Record<string, unknown>;
}

// Tipos para las estadísticas de progreso
export interface ProgressStats {
  totalExercises: number;
  completedExercises: number;
  successRate: number;
  averageScore: number;
  timeSpent: number; // en minutos
  favoriteTopic: string;
  strengths: string[];
  areasForImprovement: string[];
}
