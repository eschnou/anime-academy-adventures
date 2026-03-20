import { describe, it, expect } from 'vitest';
import { initDb } from '../db.js';

describe('initDb', () => {
  it('creates all 5 tables with :memory: database', () => {
    const db = initDb(':memory:');
    const tables = db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    ).all() as { name: string }[];

    const tableNames = tables.map((t) => t.name).sort();
    expect(tableNames).toEqual([
      'exercise_attempts',
      'exercises',
      'info_scrolls',
      'topics',
      'users',
    ]);
  });
});
