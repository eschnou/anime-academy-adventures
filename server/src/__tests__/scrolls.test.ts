import { describe, it, expect, beforeAll } from 'vitest';
import { createTestApp } from './testHelper.js';

let app: ReturnType<typeof createTestApp>['app'];

beforeAll(() => {
  ({ app } = createTestApp());
});

describe('GET /api/topics/:topicId/scrolls', () => {
  it('returns 2 scrolls for math-tables', async () => {
    const res = await app.request('/api/topics/math-tables/scrolls');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.length).toBe(2);
  });

  it('returns default placeholder for unknown topic', async () => {
    const res = await app.request('/api/topics/unknown-topic/scrolls');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.length).toBe(1);
    expect(data[0].topicId).toBe('unknown-topic');
    expect(data[0].id).toBe('def-s1');
  });
});
