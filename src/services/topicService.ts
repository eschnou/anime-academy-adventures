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

const getRankForAge = (age: number): NinjaRank => {
  if (age <= 8) return 'Genin';
  if (age <= 11) return 'Chunin';
  return 'Jonin';
};

// In-memory state (will be replaced by backend)
let currentProfile: UserProfile | null = null;

export const TopicService = {
  createProfile: (age: number): UserProfile => {
    currentProfile = {
      age,
      rank: getRankForAge(age),
      totalXp: 0,
      completedExercises: [],
    };
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

    return {
      exerciseId: exercise.id,
      isCorrect,
      xpEarned,
      message: isCorrect
        ? 'S-RANK ATTAINED. YOUR BRAIN IS OVER 9000!'
        : 'MISSION FAILED. RETREAT, REGROUP, RE-LEARN.',
    };
  },

  getCategories: () => MockAPI.getAllCategories(),
};
