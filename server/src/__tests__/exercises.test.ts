import { describe, it, expect, beforeAll } from 'vitest';
import { createTestApp } from './testHelper.js';

let app: ReturnType<typeof createTestApp>['app'];

beforeAll(() => {
  ({ app } = createTestApp());
});

describe('GET /api/topics/:topicId/exercises', () => {
  it('returns 4 exercises for math-tables with correct fields', async () => {
    const res = await app.request('/api/topics/math-tables/exercises');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.length).toBe(4);
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('topicId');
    expect(data[0]).toHaveProperty('type');
    expect(data[0]).toHaveProperty('question');
    expect(data[0]).toHaveProperty('correctAnswer');
    expect(data[0]).toHaveProperty('explanation');
    expect(data[0]).toHaveProperty('xpReward');
  });

  it('returns default placeholder for unknown topic', async () => {
    const res = await app.request('/api/topics/unknown-topic/exercises');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.length).toBe(1);
    expect(data[0].topicId).toBe('unknown-topic');
    expect(data[0].id).toBe('def-1');
  });

  it('exercise options field is a parsed array (not JSON string)', async () => {
    const res = await app.request('/api/topics/math-tables/exercises');
    const data = await res.json();
    const mcExercise = data.find((e: any) => e.type === 'multiple-choice');
    expect(Array.isArray(mcExercise.options)).toBe(true);
  });
});
