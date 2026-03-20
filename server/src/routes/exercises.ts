import { Hono } from 'hono';
import { getDb } from '../db.js';
import type { Exercise } from '../../../shared/types.js';

const app = new Hono();

const DEFAULT_EXERCISE: Omit<Exercise, 'topicId'> = {
  id: 'def-1',
  type: 'multiple-choice',
  question: 'Training mission coming soon! What rank do you want to achieve?',
  options: ['D-Rank', 'C-Rank', 'B-Rank', 'S-Rank'],
  correctAnswer: 'S-Rank',
  explanation: "That's the spirit! Aim for the highest rank!",
  xpReward: 5,
};

const mapExercise = (row: any): Exercise => ({
  id: row.id,
  topicId: row.topic_id,
  type: row.type,
  question: row.question,
  options: row.options ? JSON.parse(row.options) : undefined,
  correctAnswer: row.correct_answer,
  explanation: row.explanation,
  xpReward: row.xp_reward,
});

app.get('/topics/:topicId/exercises', (c) => {
  const topicId = c.req.param('topicId');
  const db = getDb();
  const rows = db.prepare('SELECT * FROM exercises WHERE topic_id = ?').all(topicId);

  if (rows.length === 0) {
    return c.json([{ ...DEFAULT_EXERCISE, topicId }]);
  }

  return c.json(rows.map(mapExercise));
});

export default app;
