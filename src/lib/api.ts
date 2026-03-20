// ─── API LAYER ─── Fetch-based API client for the backend

export type { Category, Difficulty, Topic, Exercise, InfoScroll, UserProfile, ExerciseResult, ExerciseAttempt, ProgressStats, CategoryInfo, NinjaRank } from '../../shared/types';

import type { Topic, Exercise, InfoScroll, UserProfile, ExerciseResult, ProgressStats, CategoryInfo } from '../../shared/types';

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `API error ${res.status}`);
  }
  return res.json();
}

export const API = {
  getTopics: (age: number) => apiFetch<Topic[]>(`/topics?age=${age}`),
  getTopicById: (id: string) => apiFetch<Topic>(`/topics/${id}`),
  getExercises: (topicId: string) => apiFetch<Exercise[]>(`/topics/${topicId}/exercises`),
  getInfoScrolls: (topicId: string) => apiFetch<InfoScroll[]>(`/topics/${topicId}/scrolls`),
  getCategories: () => apiFetch<CategoryInfo[]>('/categories'),
  createUser: (age: number) => apiFetch<UserProfile>('/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ age }),
  }),
  getUser: (id: string) => apiFetch<UserProfile>(`/users/${id}`),
  submitAttempt: (userId: string, exerciseId: string, answer: string) =>
    apiFetch<ExerciseResult>(`/users/${userId}/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exerciseId, answer }),
    }),
  getProgress: (userId: string) => apiFetch<ProgressStats>(`/users/${userId}/progress`),
};
