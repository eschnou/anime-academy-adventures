import { Hono } from 'hono';
import { initDb, getDb } from '../db.js';
import topicsRoutes from '../routes/topics.js';
import exercisesRoutes from '../routes/exercises.js';
import scrollsRoutes from '../routes/scrolls.js';
import usersRoutes from '../routes/users.js';

export function createTestApp() {
  const db = initDb(':memory:');
  seedTestData(db);

  const app = new Hono();
  app.get('/api/health', (c) => c.json({ status: 'ok' }));
  app.route('/api', topicsRoutes);
  app.route('/api', exercisesRoutes);
  app.route('/api', scrollsRoutes);
  app.route('/api', usersRoutes);

  return { app, db };
}

function seedTestData(db: ReturnType<typeof initDb>) {
  const TOPICS = [
    { id: 'math-tables', title: 'Multiplication Arts', category: 'math', minAge: 6, difficulty: 'D-Rank', description: 'desc', icon: '✖️', missionCount: 8 },
    { id: 'math-fractions', title: 'Fraction Jutsu', category: 'math', minAge: 8, difficulty: 'C-Rank', description: 'desc', icon: '🔪', missionCount: 6 },
    { id: 'math-geometry', title: 'Sacred Geometry', category: 'math', minAge: 10, difficulty: 'B-Rank', description: 'desc', icon: '📐', missionCount: 7 },
    { id: 'physics-gravity', title: 'Gravity Manipulation', category: 'physics', minAge: 10, difficulty: 'B-Rank', description: 'desc', icon: '🍎', missionCount: 5 },
    { id: 'physics-energy', title: 'Energy Transfer', category: 'physics', minAge: 12, difficulty: 'A-Rank', description: 'desc', icon: '⚡', missionCount: 6 },
    { id: 'physics-motion', title: 'Laws of Motion', category: 'physics', minAge: 11, difficulty: 'B-Rank', description: 'desc', icon: '🚀', missionCount: 5 },
    { id: 'science-atoms', title: 'Atomic Structure', category: 'science', minAge: 10, difficulty: 'B-Rank', description: 'desc', icon: '⚛️', missionCount: 6 },
    { id: 'science-elements', title: 'Elemental Mastery', category: 'science', minAge: 9, difficulty: 'C-Rank', description: 'desc', icon: '🧪', missionCount: 8 },
    { id: 'science-reactions', title: 'Chemical Reactions', category: 'science', minAge: 12, difficulty: 'A-Rank', description: 'desc', icon: '💥', missionCount: 5 },
    { id: 'bio-cells', title: 'Cell Division', category: 'biology', minAge: 8, difficulty: 'C-Rank', description: 'desc', icon: '🧬', missionCount: 6 },
    { id: 'bio-ecosystems', title: 'Ecosystem Wars', category: 'biology', minAge: 9, difficulty: 'C-Rank', description: 'desc', icon: '🌿', missionCount: 5 },
    { id: 'bio-human', title: 'Human Body Fortress', category: 'biology', minAge: 11, difficulty: 'B-Rank', description: 'desc', icon: '🫀', missionCount: 7 },
  ];

  const EXERCISES = [
    { id: 'mt-1', topicId: 'math-tables', type: 'multiple-choice', question: 'What is 7 × 8?', options: ['54', '56', '58', '64'], correctAnswer: '56', explanation: 'e', xpReward: 10 },
    { id: 'mt-2', topicId: 'math-tables', type: 'multiple-choice', question: 'What is 9 × 6?', options: ['45', '54', '56', '63'], correctAnswer: '54', explanation: 'e', xpReward: 10 },
    { id: 'mt-3', topicId: 'math-tables', type: 'fill-blank', question: '12 × 12 = ___', options: null, correctAnswer: '144', explanation: 'e', xpReward: 15 },
    { id: 'mt-4', topicId: 'math-tables', type: 'true-false', question: '11 × 11 = 111', options: ['True', 'False'], correctAnswer: 'False', explanation: 'e', xpReward: 10 },
    { id: 'mf-1', topicId: 'math-fractions', type: 'multiple-choice', question: 'q', options: ['a', 'b'], correctAnswer: '3/4', explanation: 'e', xpReward: 15 },
    { id: 'mf-2', topicId: 'math-fractions', type: 'true-false', question: 'q', options: ['True', 'False'], correctAnswer: 'False', explanation: 'e', xpReward: 10 },
    { id: 'pg-1', topicId: 'physics-gravity', type: 'multiple-choice', question: 'q', options: ['Gravity', 'Wind'], correctAnswer: 'Gravity', explanation: 'e', xpReward: 10 },
    { id: 'pg-2', topicId: 'physics-gravity', type: 'true-false', question: 'q', options: ['True', 'False'], correctAnswer: 'True', explanation: 'e', xpReward: 20 },
    { id: 'se-1', topicId: 'science-elements', type: 'multiple-choice', question: 'q', options: ['H2O', 'O2'], correctAnswer: 'H2O', explanation: 'e', xpReward: 10 },
    { id: 'se-2', topicId: 'science-elements', type: 'multiple-choice', question: 'q', options: ['Oxygen', 'Carbon'], correctAnswer: 'Oxygen', explanation: 'e', xpReward: 10 },
    { id: 'bc-1', topicId: 'bio-cells', type: 'multiple-choice', question: 'q', options: ['Mitochondria', 'Nucleus'], correctAnswer: 'Mitochondria', explanation: 'e', xpReward: 15 },
    { id: 'bc-2', topicId: 'bio-cells', type: 'true-false', question: 'q', options: ['True', 'False'], correctAnswer: 'True', explanation: 'e', xpReward: 10 },
  ];

  const SCROLLS = [
    { id: 'ms-1', topicId: 'math-tables', title: 't', content: 'c', funFact: 'f' },
    { id: 'ms-2', topicId: 'math-tables', title: 't', content: 'c', funFact: 'f' },
    { id: 'pg-s1', topicId: 'physics-gravity', title: 't', content: 'c', funFact: 'f' },
    { id: 'pg-s2', topicId: 'physics-gravity', title: 't', content: 'c', funFact: 'f' },
    { id: 'se-s1', topicId: 'science-elements', title: 't', content: 'c', funFact: 'f' },
    { id: 'bc-s1', topicId: 'bio-cells', title: 't', content: 'c', funFact: 'f' },
  ];

  const insertTopic = db.prepare('INSERT INTO topics (id, title, category, min_age, difficulty, description, icon, mission_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  for (const t of TOPICS) insertTopic.run(t.id, t.title, t.category, t.minAge, t.difficulty, t.description, t.icon, t.missionCount);

  const insertExercise = db.prepare('INSERT INTO exercises (id, topic_id, type, question, options, correct_answer, explanation, xp_reward) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  for (const e of EXERCISES) insertExercise.run(e.id, e.topicId, e.type, e.question, e.options ? JSON.stringify(e.options) : null, e.correctAnswer, e.explanation, e.xpReward);

  const insertScroll = db.prepare('INSERT INTO info_scrolls (id, topic_id, title, content, fun_fact) VALUES (?, ?, ?, ?, ?)');
  for (const s of SCROLLS) insertScroll.run(s.id, s.topicId, s.title, s.content, s.funFact);
}
