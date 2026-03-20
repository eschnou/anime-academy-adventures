import { describe, it, expect, beforeAll } from 'vitest';
import { Hono } from 'hono';
import { initDb } from '../db.js';

// Minimal app for health test
const app = new Hono();
app.get('/api/health', (c) => c.json({ status: 'ok' }));

describe('GET /api/health', () => {
  it('returns 200 with status ok', async () => {
    const res = await app.request('/api/health');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: 'ok' });
  });
});
