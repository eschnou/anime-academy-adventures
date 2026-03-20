import { describe, it, expect, beforeAll } from 'vitest';
import { createTestApp } from './testHelper.js';

let app: ReturnType<typeof createTestApp>['app'];

const postJson = (path: string, body: any) =>
  app.request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

describe('GET /api/users/:id/progress', () => {
  it('returns zeros and empty arrays with no attempts', async () => {
    ({ app } = createTestApp());
    const userRes = await postJson('/api/users', { age: 10 });
    const user = await userRes.json();

    const res = await app.request(`/api/users/${user.id}/progress`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.totalAttempts).toBe(0);
    expect(data.correctAttempts).toBe(0);
    expect(data.accuracy).toBe(0);
    expect(data.recentAttempts).toEqual([]);
  });

  it('returns correct stats after multiple attempts', async () => {
    ({ app } = createTestApp());
    const userRes = await postJson('/api/users', { age: 10 });
    const user = await userRes.json();

    // Submit some attempts
    await postJson(`/api/users/${user.id}/attempts`, { exerciseId: 'mt-1', answer: '56' }); // correct (math, mc)
    await postJson(`/api/users/${user.id}/attempts`, { exerciseId: 'mt-2', answer: 'wrong' }); // incorrect (math, mc)
    await postJson(`/api/users/${user.id}/attempts`, { exerciseId: 'pg-1', answer: 'Gravity' }); // correct (physics, mc)

    const res = await app.request(`/api/users/${user.id}/progress`);
    const data = await res.json();

    expect(data.totalAttempts).toBe(3);
    expect(data.correctAttempts).toBe(2);
    expect(data.accuracy).toBe(67); // round(2/3*100)

    // Category breakdown
    expect(data.categoryBreakdown.math.attempts).toBe(2);
    expect(data.categoryBreakdown.math.correct).toBe(1);
    expect(data.categoryBreakdown.physics.attempts).toBe(1);
    expect(data.categoryBreakdown.physics.correct).toBe(1);

    // Exercise type breakdown
    expect(data.exerciseTypeBreakdown['multiple-choice'].attempts).toBe(3);
    expect(data.exerciseTypeBreakdown['multiple-choice'].correct).toBe(2);

    // Recent attempts (reverse chronological)
    expect(data.recentAttempts.length).toBe(3);
    expect(data.recentAttempts[0].exerciseId).toBe('pg-1');
    expect(data.recentAttempts[2].exerciseId).toBe('mt-1');
  });
});
