export type Category = 'math' | 'physics' | 'science' | 'biology';
export type Difficulty = 'D-Rank' | 'C-Rank' | 'B-Rank' | 'A-Rank' | 'S-Rank';
export type NinjaRank = 'Genin' | 'Chunin' | 'Jonin';

export interface Topic {
  id: string;
  title: string;
  category: Category;
  minAge: number;
  difficulty: Difficulty;
  description: string;
  icon: string;
  missionCount: number;
}

export interface Exercise {
  id: string;
  topicId: string;
  type: 'multiple-choice' | 'fill-blank' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  xpReward: number;
}

export interface InfoScroll {
  id: string;
  topicId: string;
  title: string;
  content: string;
  funFact: string;
}

export interface UserProfile {
  id: string;
  age: number;
  rank: NinjaRank;
  totalXp: number;
  completedExercises: string[];
}

export interface ExerciseResult {
  exerciseId: string;
  isCorrect: boolean;
  xpEarned: number;
  message: string;
}

export interface ExerciseAttempt {
  exerciseId: string;
  topicId: string;
  category: Category;
  exerciseType: 'multiple-choice' | 'fill-blank' | 'true-false';
  isCorrect: boolean;
  xpEarned: number;
  timestamp: number;
}

export interface ProgressStats {
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number;
  categoryBreakdown: Record<Category, { attempts: number; correct: number; accuracy: number }>;
  exerciseTypeBreakdown: Record<'multiple-choice' | 'fill-blank' | 'true-false', { attempts: number; correct: number }>;
  recentAttempts: ExerciseAttempt[];
}

export interface CategoryInfo {
  id: Category;
  label: string;
  icon: string;
}
