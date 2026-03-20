# Backend API

## Overview

The backend is a Hono app running on Node.js (port 3001) with SQLite via better-sqlite3. It provides REST API endpoints consumed by the React frontend.

## Project Structure

```
server/
├── package.json
├── tsconfig.json
├── .gitignore
├── data/                    # SQLite database (gitignored)
└── src/
    ├── index.ts             # App entry point, middleware, route mounting
    ├── db.ts                # Database init, schema, WAL mode
    ├── seed.ts              # Standalone seed script
    ├── routes/
    │   ├── topics.ts        # GET /api/topics, /api/topics/:id, /api/categories
    │   ├── exercises.ts     # GET /api/topics/:topicId/exercises
    │   ├── scrolls.ts       # GET /api/topics/:topicId/scrolls
    │   └── users.ts         # User CRUD, attempts, progress
    └── __tests__/           # Vitest tests (32 tests)
shared/
└── types.ts                 # Shared TypeScript interfaces
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/health | Health check |
| GET | /api/topics?age=N | Topics filtered by min_age <= N |
| GET | /api/topics/:id | Single topic |
| GET | /api/categories | Static list of 4 categories |
| GET | /api/topics/:topicId/exercises | Exercises for topic (or default placeholder) |
| GET | /api/topics/:topicId/scrolls | Info scrolls for topic (or default placeholder) |
| POST | /api/users | Create user `{ age }` → UserProfile |
| GET | /api/users/:id | Get user profile with completed exercises |
| POST | /api/users/:id/attempts | Submit answer `{ exerciseId, answer }` → ExerciseResult |
| GET | /api/users/:id/progress | Aggregated progress stats |

## Database

SQLite with WAL mode and foreign keys enabled. Tables: `topics`, `exercises`, `info_scrolls`, `users`, `exercise_attempts`.

Column naming is snake_case in DB, mapped to camelCase in API responses.

## Seed Script

`npm run db:seed` populates topics, exercises, and info scrolls. Does NOT touch users or attempts. Idempotent (deletes and re-inserts content data).

## Testing

Run `npm --prefix server run test`. Tests use in-memory SQLite (`:memory:`) and Hono's `app.request()` helper — no HTTP server needed.
