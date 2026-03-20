// ─── SERVICE LAYER ─── Stateless facade over the backend API

import { API } from '@/lib/api';
import type { Topic, Exercise, InfoScroll, Category, UserProfile, ExerciseResult, ProgressStats } from '@/lib/api';

export type { UserProfile, ExerciseResult, ProgressStats };
export type { NinjaRank, ExerciseAttempt } from '@/lib/api';

export interface EnrichedTopic extends Topic {
  isUnlocked: boolean;
  xpValue: number;
  progress: number; // 0-100
}

const STORAGE_KEY = 'kaizen_userId';

const getUserId = (): string | null => localStorage.getItem(STORAGE_KEY);

export const TopicService = {
  createProfile: async (age: number): Promise<UserProfile> => {
    const profile = await API.createUser(age);
    localStorage.setItem(STORAGE_KEY, profile.id);
    return profile;
  },

  getProfile: async (): Promise<UserProfile | null> => {
    const userId = getUserId();
    if (!userId) return null;
    try {
      return await API.getUser(userId);
    } catch {
      return null;
    }
  },

  clearSession: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  getAvailableMissions: async (userAge: number): Promise<EnrichedTopic[]> => {
    const userId = getUserId();
    const [topics, profile] = await Promise.all([
      API.getTopics(userAge),
      userId ? API.getUser(userId) : Promise.resolve(null),
    ]);
    const completed = profile?.completedExercises ?? [];

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
    return API.getExercises(topicId);
  },

  getInfoScrolls: async (topicId: string): Promise<InfoScroll[]> => {
    return API.getInfoScrolls(topicId);
  },

  getTopicDetail: async (topicId: string) => {
    const [topic, exercises, scrolls] = await Promise.all([
      API.getTopicById(topicId).catch(() => null),
      API.getExercises(topicId),
      API.getInfoScrolls(topicId),
    ]);
    return { topic, exercises, scrolls };
  },

  submitAnswer: async (exercise: Exercise, answer: string): Promise<ExerciseResult> => {
    const userId = getUserId();
    if (!userId) throw new Error('No user session');
    return API.submitAttempt(userId, exercise.id, answer);
  },

  getProgressStats: async (): Promise<ProgressStats> => {
    const userId = getUserId();
    if (!userId) throw new Error('No user session');
    return API.getProgress(userId);
  },

  getCategories: () => API.getCategories(),
};
