export type AgeGroup = '3-5' | '6-8' | '9-12';
export type ScienceTopic = 'biology' | 'chemistry' | 'physics' | 'space' | 'earth' | 'animals' | 'human-body' | 'technology' | 'environment';

export interface ScienceFact {
  id: string;
  title: string;
  description: string;
  fact: string;
  imageUrl?: string;
  topics: ScienceTopic[];
  ageGroup: AgeGroup;
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
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
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
  rating?: number;
  students?: number;
}

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
}