import { Hono } from 'hono';
import { getDb } from '../db.js';
import type { InfoScroll } from '../../../shared/types.js';

const app = new Hono();

const DEFAULT_SCROLL: Omit<InfoScroll, 'topicId'> = {
  id: 'def-s1',
  title: 'Scroll Under Construction',
  content: 'Our scribes are still writing this scroll. Check back soon for ancient knowledge!',
  funFact: 'Knowledge is the ultimate power-up!',
};

const mapScroll = (row: any): InfoScroll => ({
  id: row.id,
  topicId: row.topic_id,
  title: row.title,
  content: row.content,
  funFact: row.fun_fact,
});

app.get('/topics/:topicId/scrolls', (c) => {
  const topicId = c.req.param('topicId');
  const db = getDb();
  const rows = db.prepare('SELECT * FROM info_scrolls WHERE topic_id = ?').all(topicId);

  if (rows.length === 0) {
    return c.json([{ ...DEFAULT_SCROLL, topicId }]);
  }

  return c.json(rows.map(mapScroll));
});

export default app;
