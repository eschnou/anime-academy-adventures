import { Hono } from 'hono';
import { getDb } from '../db.js';
import type { Topic, CategoryInfo } from '../../../shared/types.js';

const app = new Hono();

const mapTopic = (row: any): Topic => ({
  id: row.id,
  title: row.title,
  category: row.category,
  minAge: row.min_age,
  difficulty: row.difficulty,
  description: row.description,
  icon: row.icon,
  missionCount: row.mission_count,
});

app.get('/topics', (c) => {
  const ageParam = c.req.query('age');
  if (!ageParam) return c.json({ error: 'age query parameter is required' }, 400);

  const age = Number(ageParam);
  if (isNaN(age) || age < 1 || age > 99) {
    return c.json({ error: 'age must be a number between 1 and 99' }, 400);
  }

  const db = getDb();
  const rows = db.prepare('SELECT * FROM topics WHERE min_age <= ? ORDER BY min_age ASC').all(age);
  return c.json(rows.map(mapTopic));
});

app.get('/topics/:id', (c) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM topics WHERE id = ?').get(c.req.param('id'));
  if (!row) return c.json({ error: 'Topic not found' }, 404);
  return c.json(mapTopic(row));
});

app.get('/categories', (c) => {
  const categories: CategoryInfo[] = [
    { id: 'math', label: 'MATH', icon: '🔢' },
    { id: 'physics', label: 'PHYSICS', icon: '⚡' },
    { id: 'science', label: 'SCIENCE', icon: '🧪' },
    { id: 'biology', label: 'BIOLOGY', icon: '🧬' },
  ];
  return c.json(categories);
});

export default app;
