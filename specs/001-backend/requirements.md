# 001 — Backend API

## Introduction

Replace the in-memory mock API layer (`src/lib/api.ts`) and in-memory state in `src/services/topicService.ts` with a
real Node.js backend that persists data, serves content via REST endpoints, and manages user profiles and progress.

## Alignment with Product Vision

The product overview explicitly states the app is "designed for future backend integration via a structured mock API
layer." This feature delivers on that promise, enabling:

- Persistent progress tracking across sessions (core to the gamification loop)
- Foundation for multi-device access and future features (leaderboards, parent dashboards)
- A real data layer that can scale beyond hardcoded seed data

## Framework Choice: Hono

**Hono** is the recommended framework for this MVP backend:

- Ultra-lightweight (~14KB), minimal boilerplate
- TypeScript-first with excellent type inference
- Built-in middleware for CORS, logging, error handling
- Runs on Node.js (and can later deploy to edge runtimes if needed)
- Simple file-based routing pattern, no heavy abstractions

## Requirements

### R1 — Project Setup

**As a** developer, **I want** a backend project initialized alongside the frontend, **so that** I can develop and run
both locally.

**Acceptance Criteria:**

- Backend lives in `./server/` at the project root
- Uses TypeScript with Hono on Node.js
- `npm run dev:server` starts the backend on port 3001
- `npm run dev` starts both frontend and backend concurrently
- Shared types between frontend and backend via a `./shared/` directory
- CORS configured to allow requests from the frontend dev server (port 8080)

### R2 — Database Layer

**As a** developer, **I want** a lightweight embedded database, **so that** data persists without external
infrastructure.

**Acceptance Criteria:**

- Use SQLite via `better-sqlite3` for persistence
- Database file stored at `./server/data/kaizen.db`
- Schema covers: `users`, `topics`, `exercises`, `info_scrolls`, `exercise_attempts`
- Seed script populates the database with existing mock data from `src/lib/api.ts`
- `npm run db:seed` re-seeds the database

### R3 — Topics API

**As a** learner, **I want** to browse topics filtered by my age, **so that** I only see content appropriate for me.

**Acceptance Criteria:**

- `GET /api/topics?age={number}` — returns topics where `minAge <= age`
- `GET /api/topics/:id` — returns a single topic by ID
- `GET /api/categories` — returns the list of categories with label and icon
- Response shapes match existing `Topic` and `Category` types

### R4 — Exercises API

**As a** learner, **I want** to fetch exercises for a topic, **so that** I can complete missions.

**Acceptance Criteria:**

- `GET /api/topics/:topicId/exercises` — returns exercises for a topic
- Returns default placeholder exercises for topics without specific content (preserving current behavior)
- Response shape matches existing `Exercise` type

### R5 — Info Scrolls API

**As a** learner, **I want** to read info scrolls for a topic, **so that** I can learn before attempting exercises.

**Acceptance Criteria:**

- `GET /api/topics/:topicId/scrolls` — returns info scrolls for a topic
- Returns default placeholder scrolls for topics without specific content
- Response shape matches existing `InfoScroll` type

### R6 — User Profiles API

**As a** learner, **I want** my profile to persist, **so that** my progress is saved across sessions.

**Acceptance Criteria:**

- `POST /api/users` with `{ age: number }` — creates a new user, returns `UserProfile` with a generated `id`
- `GET /api/users/:id` — returns the user profile including `totalXp`, `rank`, and `completedExercises`
- Rank is computed server-side based on age (same logic as `getRankForAge`)
- User ID is returned on creation and used by the frontend for subsequent requests

### R7 — Answer Submission & Progress API

**As a** learner, **I want** to submit answers and track my progress, **so that** I earn XP and see my stats.

**Acceptance Criteria:**

- `POST /api/users/:userId/attempts` with `{ exerciseId: string, answer: string }` — validates the answer, records the
  attempt, updates XP if correct
- Returns `ExerciseResult` (isCorrect, xpEarned, message)
- `GET /api/users/:userId/progress` — returns `ProgressStats` (accuracy, category breakdown, exercise type breakdown,
  recent attempts)
- XP and completed exercises are updated atomically in the database

### R8 — Frontend Integration

**As a** developer, **I want** the frontend to call the real backend, **so that** the mock layer is no longer needed at
runtime.

**Acceptance Criteria:**

- Replace `MockAPI` calls in `src/lib/api.ts` with `fetch` calls to the backend
- `TopicService` delegates to the API instead of holding in-memory state
- User ID is stored in `localStorage` for session continuity
- The frontend gracefully handles API errors (network failures, 500s) with user-friendly messages
- No simulated latency — real network latency replaces it

## Non-Functional Requirements

### Architecture

- Backend follows a layered structure: routes → services → database
- Shared TypeScript types in `./shared/types.ts` imported by both frontend and backend
- No ORM — use raw SQL via `better-sqlite3` for simplicity and control

### Performance

- API responses under 100ms for all endpoints (SQLite is local)
- Database queries use indexes on `topics.minAge`, `exercises.topicId`, `info_scrolls.topicId`,
  `exercise_attempts.userId`

### Security

- Input validation on all endpoints (age must be a number 1-99, answer must be a non-empty string, IDs must match
  expected patterns)
- No authentication for MVP (single-user, local app)
- SQL injection prevented by using parameterized queries exclusively

### Reliability

- Backend returns structured error responses: `{ error: string, status: number }`
- Database initialization is idempotent — app starts cleanly even if the DB already exists

### Usability

- Single `npm run dev` command starts the full stack
- `npm run db:seed` is runnable at any time to reset data
