import { describe, it, expect, beforeAll } from 'vitest';
import { createTestApp } from './testHelper.js';

let app: ReturnType<typeof createTestApp>['app'];
let userId: string;

const postJson = (path: string, body: any) =>
  app.request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

beforeAll(async () => {
  ({ app } = createTestApp());
  const res = await postJson('/api/users', { age: 10 });
  const data = await res.json();
  userId = data.id;
});

describe('POST /api/users/:id/attempts', () => {
  it('correct answer returns isCorrect=true and xpEarned', async () => {
    const res = await postJson(`/api/users/${userId}/attempts`, { exerciseId: 'mt-1', answer: '56' });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.isCorrect).toBe(true);
    expect(data.xpEarned).toBe(10);
  });

  it('user totalXp increases after correct answer', async () => {
    const res = await app.request(`/api/users/${userId}`);
    const data = await res.json();
    expect(data.totalXp).toBeGreaterThanOrEqual(10);
  });

  it('incorrect answer returns isCorrect=false and xpEarned=0', async () => {
    const res = await postJson(`/api/users/${userId}/attempts`, { exerciseId: 'mt-1', answer: 'wrong' });
    const data = await res.json();
    expect(data.isCorrect).toBe(false);
    expect(data.xpEarned).toBe(0);
  });

  it('returns 404 for invalid exerciseId', async () => {
    const res = await postJson(`/api/users/${userId}/attempts`, { exerciseId: 'nonexistent', answer: 'a' });
    expect(res.status).toBe(404);
  });

  it('returns 400 for missing answer', async () => {
    const res = await postJson(`/api/users/${userId}/attempts`, { exerciseId: 'mt-1' });
    expect(res.status).toBe(400);
  });

  it('shows exercise in completedExercises after correct answer', async () => {
    const res = await app.request(`/api/users/${userId}`);
    const data = await res.json();
    expect(data.completedExercises).toContain('mt-1');
  });

  it('submitting same correct answer twice does not duplicate in completedExercises', async () => {
    await postJson(`/api/users/${userId}/attempts`, { exerciseId: 'mt-1', answer: '56' });
    const res = await app.request(`/api/users/${userId}`);
    const data = await res.json();
    const count = data.completedExercises.filter((id: string) => id === 'mt-1').length;
    expect(count).toBe(1);
  });
});
