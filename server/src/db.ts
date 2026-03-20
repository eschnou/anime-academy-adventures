import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DB_PATH = path.join(__dirname, '..', 'data', 'kaizen.db');

let db: Database.Database;

export function getDb(): Database.Database {
  return db;
}

export function initDb(dbPath?: string): Database.Database {
  db = new Database(dbPath ?? DEFAULT_DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS topics (
      id            TEXT PRIMARY KEY,
      title         TEXT    NOT NULL,
      category      TEXT    NOT NULL,
      min_age       INTEGER NOT NULL,
      difficulty    TEXT    NOT NULL,
      description   TEXT    NOT NULL,
      icon          TEXT    NOT NULL,
      mission_count INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS exercises (
      id             TEXT PRIMARY KEY,
      topic_id       TEXT    NOT NULL REFERENCES topics(id),
      type           TEXT    NOT NULL,
      question       TEXT    NOT NULL,
      options        TEXT,
      correct_answer TEXT    NOT NULL,
      explanation    TEXT    NOT NULL,
      xp_reward      INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS info_scrolls (
      id       TEXT PRIMARY KEY,
      topic_id TEXT NOT NULL REFERENCES topics(id),
      title    TEXT NOT NULL,
      content  TEXT NOT NULL,
      fun_fact TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id         TEXT PRIMARY KEY,
      age        INTEGER NOT NULL,
      total_xp   INTEGER NOT NULL DEFAULT 0,
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS exercise_attempts (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     TEXT    NOT NULL REFERENCES users(id),
      exercise_id TEXT    NOT NULL REFERENCES exercises(id),
      is_correct  INTEGER NOT NULL,
      xp_earned   INTEGER NOT NULL,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_topics_min_age ON topics(min_age);
    CREATE INDEX IF NOT EXISTS idx_exercises_topic_id ON exercises(topic_id);
    CREATE INDEX IF NOT EXISTS idx_scrolls_topic_id ON info_scrolls(topic_id);
    CREATE INDEX IF NOT EXISTS idx_attempts_user_id ON exercise_attempts(user_id);
  `);

  return db;
}

export default db!;
