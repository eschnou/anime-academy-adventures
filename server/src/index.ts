import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import { initDb } from './db.js';
import topicsRoutes from './routes/topics.js';
import exercisesRoutes from './routes/exercises.js';
import scrollsRoutes from './routes/scrolls.js';
import usersRoutes from './routes/users.js';

const app = new Hono();

app.use('*', logger());
app.use('*', cors({ origin: 'http://localhost:8080' }));

initDb();

app.get('/api/health', (c) => c.json({ status: 'ok' }));

app.route('/api', topicsRoutes);
app.route('/api', exercisesRoutes);
app.route('/api', scrollsRoutes);
app.route('/api', usersRoutes);

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'Internal server error' }, 500);
});

serve({ fetch: app.fetch, port: 3001 }, (info) => {
  console.log(`Listening on port ${info.port}`);
});

export default app;
