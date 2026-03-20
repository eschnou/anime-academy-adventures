# 001 — Backend API — Design

## Overview

Add a Hono + SQLite backend in `./server/` that replaces the mock API layer. The frontend's `src/lib/api.ts` switches
from hardcoded data to `fetch` calls. Shared types live in `./shared/`. The backend is flat — no deep abstractions, just
routes calling a thin DB module.

## Architecture

```
┌─────────────────────────────┐     HTTP      ┌──────────────────────────────┐
│         Frontend            │  ◄──────────► │          Backend             │
│  src/lib/api.ts (fetch)     │  :8080→:3001  │  server/src/index.ts (Hono)  │
│  src/services/topicService  │               │  server/src/db.ts (SQLite)   │
└─────────────────────────────┘               └──────────┬───────────────────┘
                                                         │
                                              ┌──────────▼───────────────────┐
                                              │  server/data/kaizen.db       │
                                              │  (SQLite via better-sqlite3) │
                                              └──────────────────────────────┘

shared/types.ts ── imported by both frontend and backend
```

## Project Structure

```
├── shared/
│   └── types.ts                 # All shared interfaces
├── server/
│   ├── package.json             # Separate package (hono, better-sqlite3, tsx)
│   ├── tsconfig.json
│   ├── data/                    # .gitignored, holds kaizen.db
│   ├── src/
│   │   ├── index.ts             # Hono app, middleware, mount routes
│   │   ├── db.ts                # Database init, schema, query helpers
│   │   ├── seed.ts              # Seed script (runnable standalone)
│   │   └── routes/
│   │       ├── topics.ts        # GET /api/topics, /api/topics/:id, /api/categories
│   │       ├── exercises.ts     # GET /api/topics/:topicId/exercises
│   │       ├── scrolls.ts       # GET /api/topics/:topicId/scrolls
│   │       └── users.ts         # POST /api/users, GET /api/users/:id, POST /api/users/:id/attempts, GET /api/users/:id/progress
│   └── .gitignore               # data/*.db
├── src/                         # Existing frontend (modified files only listed)
│   ├── lib/api.ts               # Rewritten: fetch calls to backend
│   └── services/topicService.ts # Simplified: delegates to api.ts, userId from localStorage
```

## Components and Interfaces

### Backend: `server/src/index.ts`

Entry point. Creates a Hono app, registers middleware, mounts route groups.

```ts
import {Hono} from 'hono';
import {cors} from 'hono/cors';
import {logger} from 'hono/logger';
import {initDb} from './db';
import topicsRoutes from './routes/topics';
import exercisesRoutes from './routes/exercises';
import scrollsRoutes from './routes/scrolls';
import usersRoutes from './routes/users';

const app = new Hono();
app.use('*', logger());
app.use('*', cors({origin: 'http://localhost:8080'}));

initDb(); // Create tables if not exist

app.route('/api', topicsRoutes);
app.route('/api', exercisesRoutes);
app.route('/api', scrollsRoutes);
app.route('/api', usersRoutes);

export default {port: 3001, fetch: app.fetch};
```

### Backend: `server/src/db.ts`

Thin wrapper around `better-sqlite3`. Exports the db instance and an `initDb()` that creates tables idempotently.

```ts
import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', 'data', 'kaizen.db');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDb() {
    db.exec(`
    CREATE TABLE IF NOT EXISTS topics ( ... );
    CREATE TABLE IF NOT EXISTS exercises ( ... );
    CREATE TABLE IF NOT EXISTS info_scrolls ( ... );
    CREATE TABLE IF NOT EXISTS users ( ... );
    CREATE TABLE IF NOT EXISTS exercise_attempts ( ... );
    CREATE INDEX IF NOT EXISTS idx_topics_min_age ON topics(min_age);
    CREATE INDEX IF NOT EXISTS idx_exercises_topic_id ON exercises(topic_id);
    CREATE INDEX IF NOT EXISTS idx_scrolls_topic_id ON info_scrolls(topic_id);
    CREATE INDEX IF NOT EXISTS idx_attempts_user_id ON exercise_attempts(user_id);
  `);
}

export default db;
```

### Backend: Route files

Each route file exports a `Hono` instance with its endpoints. Routes contain inline logic (no separate service layer —
keeping it flat for MVP).

**`routes/topics.ts`**

- `GET /topics?age=N` — `SELECT * FROM topics WHERE min_age <= ?`
- `GET /topics/:id` — `SELECT * FROM topics WHERE id = ?`
- `GET /categories` — return static category list (4 items, not worth a table)

**`routes/exercises.ts`**

- `GET /topics/:topicId/exercises` — `SELECT * FROM exercises WHERE topic_id = ?`
- If no rows, return default placeholder exercise (hardcoded constant, same as current behavior)

**`routes/scrolls.ts`**

- `GET /topics/:topicId/scrolls` — `SELECT * FROM info_scrolls WHERE topic_id = ?`
- If no rows, return default placeholder scroll

**`routes/users.ts`**

- `POST /users` — insert user with generated UUID, compute rank from age, return full profile
- `GET /users/:id` — select user + their completed exercise IDs (from attempts where `is_correct = 1`, deduplicated)
- `POST /users/:id/attempts` — look up exercise by ID, compare answer, insert attempt row, update user XP if correct,
  return `ExerciseResult`
- `GET /users/:id/progress` — aggregate attempts into `ProgressStats` (category breakdown, type breakdown, last 10
  attempts)

### Backend: `server/src/seed.ts`

Standalone script (`npx tsx server/src/seed.ts`). Drops and recreates all content tables (topics, exercises,
info_scrolls), inserts the existing mock data. Does NOT touch the users or exercise_attempts tables.

### Frontend: `src/lib/api.ts` (rewrite)

Replace all hardcoded data and `simulateLatency` with fetch calls.

```ts
const API_BASE = 'http://localhost:3001/api';

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, init);
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `API error ${res.status}`);
    }
    return res.json();
}

export const API = {
    getTopics: (age: number) => apiFetch<Topic[]>(`/topics?age=${age}`),
    getTopicById: (id: string) => apiFetch<Topic>(`/topics/${id}`),
    getExercises: (topicId: string) => apiFetch<Exercise[]>(`/topics/${topicId}/exercises`),
    getInfoScrolls: (topicId: string) => apiFetch<InfoScroll[]>(`/topics/${topicId}/scrolls`),
    getCategories: () => apiFetch<CategoryInfo[]>('/categories'),
    createUser: (age: number) => apiFetch<UserProfile>('/users', {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({age})
    }),
    getUser: (id: string) => apiFetch<UserProfile>(`/users/${id}`),
    submitAttempt: (userId: string, exerciseId: string, answer: string) =>
        apiFetch<ExerciseResult>(`/users/${userId}/attempts`, {
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({exerciseId, answer})
        }),
    getProgress: (userId: string) => apiFetch<ProgressStats>(`/users/${userId}/progress`),
};
```

Types (`Topic`, `Exercise`, etc.) are re-exported from `shared/types.ts`.

### Frontend: `src/services/topicService.ts` (simplify)

Remove all in-memory state (`currentProfile`, `attemptHistory`). The service becomes a stateless facade:

- `createProfile(age)` → calls `API.createUser(age)`, stores returned `id` in `localStorage`
- `getProfile()` → calls `API.getUser(id)` using ID from `localStorage`
- `submitAnswer(exercise, answer)` → calls `API.submitAttempt(userId, exerciseId, answer)`
- `getProgressStats()` → calls `API.getProgress(userId)` (becomes async)
- Other methods delegate directly to `API.*`

Key change: `getProgressStats()` and `getProfile()` become **async**. Callers (`ProgressTracker.tsx`, `Dashboard.tsx`)
must be updated to use `useEffect`/`useState` or TanStack Query for these calls.

### Frontend: Component changes

| Component              | Change                                                                                                                       |
|------------------------|------------------------------------------------------------------------------------------------------------------------------|
| `Index.tsx`            | `handleAgeSubmit` becomes async. On mount, check `localStorage` for existing userId and restore session via `API.getUser()`. |
| `Dashboard.tsx`        | `profile.totalXp` now comes from server. After exercise completion, re-fetch profile to get updated XP.                      |
| `ExerciseTerminal.tsx` | `handleSubmit` becomes async, calls `TopicService.submitAnswer()` which now returns a Promise.                               |
| `ProgressTracker.tsx`  | `TopicService.getProgressStats()` is now async — load stats in `useEffect`, show loading state.                              |

## Data Models

### `shared/types.ts`

All existing types move here. One addition: `UserProfile` gains an `id: string` field.

```ts
export type Category = 'math' | 'physics' | 'science' | 'biology';
export type Difficulty = 'D-Rank' | 'C-Rank' | 'B-Rank' | 'A-Rank' | 'S-Rank';
export type NinjaRank = 'Genin' | 'Chunin' | 'Jonin';

export interface Topic {
    id: string;
    title: string;
    category: Category;
    minAge: number;
    difficulty: Difficulty;
    description: string;
    icon: string;
    missionCount: number;
}

export interface Exercise {
    id: string;
    topicId: string;
    type: 'multiple-choice' | 'fill-blank' | 'true-false';
    question: string;
    options?: string[];
    correctAnswer: string;
    explanation: string;
    xpReward: number;
}

export interface InfoScroll {
    id: string;
    topicId: string;
    title: string;
    content: string;
    funFact: string;
}

export interface UserProfile {
    id: string;              // NEW — UUID
    age: number;
    rank: NinjaRank;
    totalXp: number;
    completedExercises: string[];
}

export interface ExerciseResult {
    exerciseId: string;
    isCorrect: boolean;
    xpEarned: number;
    message: string;
}

export interface ExerciseAttempt {
    exerciseId: string;
    topicId: string;
    category: Category;
    exerciseType: 'multiple-choice' | 'fill-blank' | 'true-false';
    isCorrect: boolean;
    xpEarned: number;
    timestamp: number;
}

export interface ProgressStats {
    totalAttempts: number;
    correctAttempts: number;
    accuracy: number;
    categoryBreakdown: Record<Category, { attempts: number; correct: number; accuracy: number }>;
    exerciseTypeBreakdown: Record<'multiple-choice' | 'fill-blank' | 'true-false', {
        attempts: number;
        correct: number
    }>;
    recentAttempts: ExerciseAttempt[];
}

export interface CategoryInfo {
    id: Category;
    label: string;
    icon: string;
}
```

### SQLite Schema

```sql
CREATE TABLE topics
(
    id            TEXT PRIMARY KEY,
    title         TEXT    NOT NULL,
    category      TEXT    NOT NULL,
    min_age       INTEGER NOT NULL,
    difficulty    TEXT    NOT NULL,
    description   TEXT    NOT NULL,
    icon          TEXT    NOT NULL,
    mission_count INTEGER NOT NULL
);

CREATE TABLE exercises
(
    id             TEXT PRIMARY KEY,
    topic_id       TEXT    NOT NULL REFERENCES topics (id),
    type           TEXT    NOT NULL,
    question       TEXT    NOT NULL,
    options        TEXT, -- JSON array, nullable (fill-blank has none)
    correct_answer TEXT    NOT NULL,
    explanation    TEXT    NOT NULL,
    xp_reward      INTEGER NOT NULL
);

CREATE TABLE info_scrolls
(
    id       TEXT PRIMARY KEY,
    topic_id TEXT NOT NULL REFERENCES topics (id),
    title    TEXT NOT NULL,
    content  TEXT NOT NULL,
    fun_fact TEXT NOT NULL
);

CREATE TABLE users
(
    id         TEXT PRIMARY KEY,
    age        INTEGER NOT NULL,
    total_xp   INTEGER NOT NULL DEFAULT 0,
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE exercise_attempts
(
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     TEXT    NOT NULL REFERENCES users (id),
    exercise_id TEXT    NOT NULL REFERENCES exercises (id),
    is_correct  INTEGER NOT NULL, -- 0 or 1
    xp_earned   INTEGER NOT NULL,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);
```

Column naming: snake_case in DB, camelCase in TypeScript. Route handlers map between the two when reading rows.

`exercises.options` is stored as a JSON string (`JSON.stringify(options)`). Parsed on read.

`users` table has no `rank` column — rank is derived from `age` at query time, same as the current `getRankForAge`
function.

`completedExercises` for a user is derived:
`SELECT DISTINCT exercise_id FROM exercise_attempts WHERE user_id = ? AND is_correct = 1`.

## Error Handling

All routes use a shared error pattern:

```ts
// In each route handler
const age = Number(c.req.query('age'));
if (isNaN(age) || age < 1 || age > 99) {
    return c.json({error: 'age must be a number between 1 and 99'}, 400);
}
```

Hono's `onError` handler catches unhandled exceptions:

```ts
app.onError((err, c) => {
    console.error(err);
    return c.json({error: 'Internal server error'}, 500);
});
```

All responses are JSON. Error shape: `{ error: string }`.

## Testing Strategy

- **Backend unit tests**: Use Vitest. Test each route file by creating a Hono app instance and using `app.request()` (
  Hono's built-in test helper — no HTTP server needed). Seed an in-memory SQLite database (`:memory:`) for each test.
- **Seed script test**: Verify seed inserts expected row counts.
- **Frontend**: Existing component behavior unchanged. No new frontend tests required for MVP — the API contract is
  validated by backend tests.

## Performance Considerations

- SQLite WAL mode for concurrent read performance
- Indexes on all foreign key and filter columns (defined in schema)
- All queries are simple single-table lookups or single-join aggregations — no complex queries
- `ProgressStats` aggregation uses SQL `GROUP BY` rather than fetching all rows to JS

## Security Considerations

- All SQL uses parameterized queries (`db.prepare('... WHERE id = ?').get(id)`) — no string interpolation
- Input validation on all endpoints: numeric ranges, non-empty strings, ID format checks
- No authentication for MVP — acceptable for a local-only educational app
- CORS restricted to `http://localhost:8080`
- `exercises.correct_answer` is returned in GET responses (current behavior) — acceptable since this is a kids learning
  app, not a secure exam

## Dev Workflow

### Package Scripts (root `package.json`)

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:server\"",
    "dev:frontend": "vite",
    "dev:server": "npm --prefix server run dev",
    "db:seed": "npm --prefix server run seed"
  }
}
```

### Server `package.json`

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "seed": "tsx src/seed.ts",
    "test": "vitest run"
  },
  "dependencies": {
    "hono": "^4",
    "@hono/node-server": "^1",
    "better-sqlite3": "^11"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7",
    "tsx": "^4",
    "vitest": "^3"
  }
}
```

`concurrently` added as a root devDependency.

### Frontend `tsconfig.app.json`

Add `../shared` to the include paths so the frontend can import from `shared/types.ts`. Update the path alias or use a
relative import (`../../shared/types`).

### Vite Config

Add a proxy to avoid CORS in production-like dev setup (optional, CORS middleware is the primary mechanism):

```ts
server: {
    port: 8080,
        proxy
:
    {
        '/api'
    :
        'http://localhost:3001'
    }
}
```

If the Vite proxy is used, `API_BASE` can be just `/api` instead of the full URL, simplifying the frontend and removing
the need for CORS. This is the preferred approach.
