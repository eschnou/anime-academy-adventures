// ─── SERVICE LAYER ─── Business logic, progress tracking, XP calculations

import { MockAPI, type Topic, type Exercise, type InfoScroll, type Category } from '@/lib/api';

export type NinjaRank = 'Genin' | 'Chunin' | 'Jonin';

export interface UserProfile {
  age: number;
  rank: NinjaRank;
  totalXp: number;
  completedExercises: string[];
}

export interface EnrichedTopic extends Topic {
  isUnlocked: boolean;
  xpValue: number;
  progress: number; // 0-100
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

const getRankForAge = (age: number): NinjaRank => {
  if (age <= 8) return 'Genin';
  if (age <= 11) return 'Chunin';
  return 'Jonin';
};

const TOPIC_PREFIX_TO_CATEGORY: Record<string, Category> = {
  math: 'math',
  physics: 'physics',
  science: 'science',
  bio: 'biology',
};

const getCategoryFromTopicId = (topicId: string): Category => {
  const prefix = topicId.split('-')[0];
  return TOPIC_PREFIX_TO_CATEGORY[prefix] ?? prefix as Category;
};

// In-memory state (will be replaced by backend)
let currentProfile: UserProfile | null = null;
let attemptHistory: ExerciseAttempt[] = [];

export const TopicService = {
  createProfile: (age: number): UserProfile => {
    currentProfile = {
      age,
      rank: getRankForAge(age),
      totalXp: 0,
      completedExercises: [],
    };
    attemptHistory = [];
    return currentProfile;
  },

  getProfile: (): UserProfile | null => currentProfile,

  getAvailableMissions: async (userAge: number): Promise<EnrichedTopic[]> => {
    const topics = await MockAPI.getTopics(userAge);
    const completed = currentProfile?.completedExercises ?? [];
    
    return topics.map(topic => ({
      ...topic,
      isUnlocked: true,
      xpValue: topic.missionCount * 10,
      progress: Math.min(100, Math.floor(
        (completed.filter(id => id.startsWith(topic.id.slice(0, 3))).length / topic.missionCount) * 100
      )),
    }));
  },

  getMissionsByCategory: async (userAge: number, category: Category): Promise<EnrichedTopic[]> => {
    const all = await TopicService.getAvailableMissions(userAge);
    return all.filter(t => t.category === category);
  },

  getExercises: async (topicId: string): Promise<Exercise[]> => {
    return MockAPI.getExercises(topicId);
  },

  getInfoScrolls: async (topicId: string): Promise<InfoScroll[]> => {
    return MockAPI.getInfoScrolls(topicId);
  },

  getTopicDetail: async (topicId: string) => {
    const [topic, exercises, scrolls] = await Promise.all([
      MockAPI.getTopicById(topicId),
      MockAPI.getExercises(topicId),
      MockAPI.getInfoScrolls(topicId),
    ]);
    return { topic, exercises, scrolls };
  },

  submitAnswer: (exercise: Exercise, answer: string): ExerciseResult => {
    const isCorrect = answer === exercise.correctAnswer;
    const xpEarned = isCorrect ? exercise.xpReward : 0;

    if (currentProfile && isCorrect) {
      currentProfile.totalXp += xpEarned;
      if (!currentProfile.completedExercises.includes(exercise.id)) {
        currentProfile.completedExercises.push(exercise.id);
      }
    }

    attemptHistory.push({
      exerciseId: exercise.id,
      topicId: exercise.topicId,
      category: getCategoryFromTopicId(exercise.topicId),
      exerciseType: exercise.type,
      isCorrect,
      xpEarned,
      timestamp: Date.now(),
    });

    return {
      exerciseId: exercise.id,
      isCorrect,
      xpEarned,
      message: isCorrect
        ? 'S-RANK ATTAINED. YOUR BRAIN IS OVER 9000!'
        : 'MISSION FAILED. RETREAT, REGROUP, RE-LEARN.',
    };
  },

  getAttemptHistory: (): ExerciseAttempt[] => attemptHistory,

  getProgressStats: (): ProgressStats => {
    const totalAttempts = attemptHistory.length;
    const correctAttempts = attemptHistory.filter(a => a.isCorrect).length;
    const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

    const categories: Category[] = ['math', 'physics', 'science', 'biology'];
    const categoryBreakdown = {} as ProgressStats['categoryBreakdown'];
    for (const cat of categories) {
      const catAttempts = attemptHistory.filter(a => a.category === cat);
      const catCorrect = catAttempts.filter(a => a.isCorrect).length;
      categoryBreakdown[cat] = {
        attempts: catAttempts.length,
        correct: catCorrect,
        accuracy: catAttempts.length > 0 ? Math.round((catCorrect / catAttempts.length) * 100) : 0,
      };
    }

    const types = ['multiple-choice', 'fill-blank', 'true-false'];
    const exerciseTypeBreakdown = {} as ProgressStats['exerciseTypeBreakdown'];
    for (const t of types) {
      const typeAttempts = attemptHistory.filter(a => a.exerciseType === t);
      exerciseTypeBreakdown[t] = {
        attempts: typeAttempts.length,
        correct: typeAttempts.filter(a => a.isCorrect).length,
      };
    }

    const recentAttempts = attemptHistory.slice(-10).reverse();

    return { totalAttempts, correctAttempts, accuracy, categoryBreakdown, exerciseTypeBreakdown, recentAttempts };
  },

  getCategories: () => MockAPI.getAllCategories(),
};
