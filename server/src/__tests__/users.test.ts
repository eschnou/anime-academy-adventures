import { describe, it, expect, beforeAll } from 'vitest';
import { createTestApp } from './testHelper.js';

let app: ReturnType<typeof createTestApp>['app'];

beforeAll(() => {
  ({ app } = createTestApp());
});

const postJson = (path: string, body: any) =>
  app.request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

describe('POST /api/users', () => {
  it('creates user with age=8 returning Genin rank', async () => {
    const res = await postJson('/api/users', { age: 8 });
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.id).toBeTruthy();
    expect(data.rank).toBe('Genin');
    expect(data.totalXp).toBe(0);
    expect(data.completedExercises).toEqual([]);
  });

  it('creates user with age=10 returning Chunin rank', async () => {
    const res = await postJson('/api/users', { age: 10 });
    const data = await res.json();
    expect(data.rank).toBe('Chunin');
  });

  it('creates user with age=13 returning Jonin rank', async () => {
    const res = await postJson('/api/users', { age: 13 });
    const data = await res.json();
    expect(data.rank).toBe('Jonin');
  });

  it('returns 400 for invalid age', async () => {
    const res = await postJson('/api/users', { age: 0 });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/users/:id', () => {
  it('returns created user', async () => {
    const createRes = await postJson('/api/users', { age: 10 });
    const user = await createRes.json();
    const res = await app.request(`/api/users/${user.id}`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.id).toBe(user.id);
    expect(data.age).toBe(10);
  });

  it('returns 404 for nonexistent user', async () => {
    const res = await app.request('/api/users/nonexistent');
    expect(res.status).toBe(404);
  });
});
