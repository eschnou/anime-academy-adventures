import { describe, it, expect, beforeAll } from 'vitest';
import { createTestApp } from './testHelper.js';

let app: ReturnType<typeof createTestApp>['app'];

beforeAll(() => {
  ({ app } = createTestApp());
});

describe('GET /api/topics', () => {
  it('returns only topics with minAge <= 8', async () => {
    const res = await app.request('/api/topics?age=8');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.every((t: any) => t.minAge <= 8)).toBe(true);
    // age 8: math-tables(6), math-fractions(8), bio-cells(8) = 3
    expect(data.length).toBe(3);
  });

  it('returns all 12 topics with age=99', async () => {
    const res = await app.request('/api/topics?age=99');
    const data = await res.json();
    expect(data.length).toBe(12);
  });

  it('returns empty array with age=0', async () => {
    const res = await app.request('/api/topics?age=0');
    expect(res.status).toBe(400);
  });

  it('returns 400 without age param', async () => {
    const res = await app.request('/api/topics');
    expect(res.status).toBe(400);
  });

  it('returns correct topic by id', async () => {
    const res = await app.request('/api/topics/math-tables');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.id).toBe('math-tables');
    expect(data.title).toBe('Multiplication Arts');
    expect(data.minAge).toBe(6);
  });

  it('returns 404 for nonexistent topic', async () => {
    const res = await app.request('/api/topics/nonexistent');
    expect(res.status).toBe(404);
  });
});

describe('GET /api/categories', () => {
  it('returns 4 categories with correct shape', async () => {
    const res = await app.request('/api/categories');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.length).toBe(4);
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('label');
    expect(data[0]).toHaveProperty('icon');
  });
});
