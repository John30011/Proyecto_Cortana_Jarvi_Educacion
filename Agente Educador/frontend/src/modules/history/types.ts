export type AgeGroup = '3-5' | '6-8' | '9-12';
export type HistoryTopic = 'universe' | 'world' | 'venezuela' | 'regions' | 'capitals' | 'cities';

export interface HistoryFact {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  timePeriod?: string;
  location?: string;
  importantFigures?: string[];
  relatedEvents?: string[];
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  duration?: string;
  rating?: number;
  students?: number;
  category?: string;
  topics: string[];
  ageGroup: string;
}

export interface HistoryTimelineEvent {
  id: string;
  title: string;
  description: string;
  year: number;
  month?: number;
  day?: number;
  location: string;
  imageUrl?: string;
  topics: HistoryTopic[];
  ageGroup: AgeGroup;
  significance: 'low' | 'medium' | 'high';
}

export interface HistoryQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ageGroup: AgeGroup;
  topic: HistoryTopic;
  imageUrl?: string;
}
