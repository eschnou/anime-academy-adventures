import { Hono } from 'hono';
import { getDb } from '../db.js';
import crypto from 'crypto';
import type { NinjaRank, UserProfile, ExerciseResult, ProgressStats, Category, ExerciseAttempt } from '../../../shared/types.js';

const app = new Hono();

const getRankForAge = (age: number): NinjaRank => {
  if (age <= 8) return 'Genin';
  if (age <= 11) return 'Chunin';
  return 'Jonin';
};

const TOPIC_PREFIX_TO_CATEGORY: Record<string, Category> = {
  math: 'math',
  physics: 'physics',
  science: 'science',
  bio: 'biology',
};

const getCategoryFromTopicId = (topicId: string): Category => {
  const prefix = topicId.split('-')[0];
  return TOPIC_PREFIX_TO_CATEGORY[prefix] ?? (prefix as Category);
};

// POST /users
app.post('/users', async (c) => {
  const body = await c.req.json();
  const age = Number(body.age);
  if (isNaN(age) || age < 1 || age > 99) {
    return c.json({ error: 'age must be a number between 1 and 99' }, 400);
  }

  const id = crypto.randomUUID();
  const db = getDb();
  db.prepare('INSERT INTO users (id, age) VALUES (?, ?)').run(id, age);

  const profile: UserProfile = {
    id,
    age,
    rank: getRankForAge(age),
    totalXp: 0,
    completedExercises: [],
  };
  return c.json(profile, 201);
});

// GET /users/:id
app.get('/users/:id', (c) => {
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(c.req.param('id')) as any;
  if (!user) return c.json({ error: 'User not found' }, 404);

  const completedRows = db.prepare(
    'SELECT DISTINCT exercise_id FROM exercise_attempts WHERE user_id = ? AND is_correct = 1'
  ).all(user.id) as any[];

  const profile: UserProfile = {
    id: user.id,
    age: user.age,
    rank: getRankForAge(user.age),
    totalXp: user.total_xp,
    completedExercises: completedRows.map((r) => r.exercise_id),
  };
  return c.json(profile);
});

// POST /users/:id/attempts
app.post('/users/:id/attempts', async (c) => {
  const db = getDb();
  const userId = c.req.param('id');

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
  if (!user) return c.json({ error: 'User not found' }, 404);

  const body = await c.req.json();
  const { exerciseId, answer } = body;

  if (!exerciseId || answer === undefined || answer === null || answer === '') {
    return c.json({ error: 'exerciseId and answer are required' }, 400);
  }

  const exercise = db.prepare('SELECT * FROM exercises WHERE id = ?').get(exerciseId) as any;
  if (!exercise) return c.json({ error: 'Exercise not found' }, 404);

  const isCorrect = String(answer) === exercise.correct_answer;
  const xpEarned = isCorrect ? exercise.xp_reward : 0;

  db.prepare(
    'INSERT INTO exercise_attempts (user_id, exercise_id, is_correct, xp_earned) VALUES (?, ?, ?, ?)'
  ).run(userId, exerciseId, isCorrect ? 1 : 0, xpEarned);

  if (isCorrect) {
    db.prepare('UPDATE users SET total_xp = total_xp + ? WHERE id = ?').run(xpEarned, userId);
  }

  const result: ExerciseResult = {
    exerciseId,
    isCorrect,
    xpEarned,
    message: isCorrect
      ? 'S-RANK ATTAINED. YOUR BRAIN IS OVER 9000!'
      : 'MISSION FAILED. RETREAT, REGROUP, RE-LEARN.',
  };
  return c.json(result);
});

// GET /users/:id/progress
app.get('/users/:id/progress', (c) => {
  const db = getDb();
  const userId = c.req.param('id');

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
  if (!user) return c.json({ error: 'User not found' }, 404);

  const attempts = db.prepare(`
    SELECT ea.*, e.topic_id, e.type as exercise_type
    FROM exercise_attempts ea
    JOIN exercises e ON ea.exercise_id = e.id
    WHERE ea.user_id = ?
    ORDER BY ea.created_at ASC
  `).all(userId) as any[];

  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter((a) => a.is_correct).length;
  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  const categories: Category[] = ['math', 'physics', 'science', 'biology'];
  const categoryBreakdown = {} as ProgressStats['categoryBreakdown'];
  for (const cat of categories) {
    const catAttempts = attempts.filter((a) => getCategoryFromTopicId(a.topic_id) === cat);
    const catCorrect = catAttempts.filter((a) => a.is_correct).length;
    categoryBreakdown[cat] = {
      attempts: catAttempts.length,
      correct: catCorrect,
      accuracy: catAttempts.length > 0 ? Math.round((catCorrect / catAttempts.length) * 100) : 0,
    };
  }

  const types = ['multiple-choice', 'fill-blank', 'true-false'] as const;
  const exerciseTypeBreakdown = {} as ProgressStats['exerciseTypeBreakdown'];
  for (const t of types) {
    const typeAttempts = attempts.filter((a) => a.exercise_type === t);
    exerciseTypeBreakdown[t] = {
      attempts: typeAttempts.length,
      correct: typeAttempts.filter((a) => a.is_correct).length,
    };
  }

  const recentAttempts: ExerciseAttempt[] = attempts.slice(-10).reverse().map((a) => ({
    exerciseId: a.exercise_id,
    topicId: a.topic_id,
    category: getCategoryFromTopicId(a.topic_id),
    exerciseType: a.exercise_type,
    isCorrect: !!a.is_correct,
    xpEarned: a.xp_earned,
    timestamp: new Date(a.created_at).getTime(),
  }));

  const stats: ProgressStats = {
    totalAttempts,
    correctAttempts,
    accuracy,
    categoryBreakdown,
    exerciseTypeBreakdown,
    recentAttempts,
  };
  return c.json(stats);
});

export default app;
