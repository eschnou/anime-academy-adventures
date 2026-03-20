# 001 — Backend API — Tasks

## Phase 1: Project Scaffolding & Shared Types

**Goal:** Backend project boots, shared types compile, both frontend and backend start with one command.

### Tasks

- [ ] **1.1** Create `shared/types.ts` with all interfaces from design (Topic, Exercise, InfoScroll, UserProfile,
  ExerciseResult, ExerciseAttempt, ProgressStats, CategoryInfo, Category, Difficulty, NinjaRank)
- [ ] **1.2** Create `server/` directory with `package.json` (hono, @hono/node-server, better-sqlite3, tsx, vitest,
  @types/better-sqlite3)
- [ ] **1.3** Create `server/tsconfig.json` — target ESNext, module NodeNext, paths to resolve `../../shared`
- [ ] **1.4** Create `server/src/index.ts` — Hono app with logger, CORS, `onError` handler, listening on port 3001 via
  `@hono/node-server`. Add a `GET /api/health` route returning `{ status: 'ok' }`
- [ ] **1.5** Create `server/.gitignore` — `data/*.db`, `node_modules/`
- [ ] **1.6** Update root `package.json` — add `concurrently` devDependency, update scripts: `dev` (concurrently),
  `dev:frontend` (vite), `dev:server` (npm --prefix server run dev), `db:seed`
- [ ] **1.7** Update `vite.config.ts` — add proxy: `'/api' → 'http://localhost:3001'`
- [ ] **1.8** Update `tsconfig.app.json` — add `../shared` to `include` so frontend can import shared types
- [ ] **1.9** Run `npm install` in root and `server/`. Verify `npm run dev` starts both processes

### Tests

- [ ] **T1.1** `server/src/__tests__/health.test.ts` — `app.request('/api/health')` returns 200 with `{ status: 'ok' }`

### Verification

Run `npm run dev`. Backend logs `Listening on port 3001`. `curl http://localhost:8080/api/health` returns
`{ "status": "ok" }` (proxied through Vite).

---

## Phase 2: Database & Seed

**Goal:** SQLite schema is created, seed script populates all content data, row counts match existing mock data.

### Tasks

- [ ] **2.1** Create `server/data/` directory (empty, gitignored)
- [ ] **2.2** Create `server/src/db.ts` — initialize better-sqlite3, WAL mode, foreign keys, `initDb()` with full CREATE
  TABLE/INDEX statements from design. Export `db` instance and `initDb`. Accept optional db path parameter for
  testability (default: `server/data/kaizen.db`)
- [ ] **2.3** Create `server/src/seed.ts` — standalone script. Calls `initDb()`, then DELETE FROM
  topics/exercises/info_scrolls, inserts all data from the existing TOPICS, EXERCISES, INFO_SCROLLS arrays (copy data
  from `src/lib/api.ts`). Log row counts on completion
- [ ] **2.4** Wire `initDb()` call in `server/src/index.ts` (before routes mount)

### Tests

- [ ] **T2.1** `server/src/__tests__/db.test.ts` — `initDb()` with `:memory:` database creates all 5 tables (query
  sqlite_master)
- [ ] **T2.2** `server/src/__tests__/seed.test.ts` — run seed logic against `:memory:` db, verify: 12 topics, correct
  exercise counts per topic, correct scroll counts per topic

### Verification

Run `npm run db:seed`. Check `server/data/kaizen.db` exists. Run again — idempotent, no errors.

---

## Phase 3: Content API Routes (Topics, Exercises, Scrolls)

**Goal:** All read-only content endpoints return correct data matching the existing frontend type contracts.

### Tasks

- [ ] **3.1** Create `server/src/routes/topics.ts` — Hono router with:
    - `GET /topics` — query param `age` (validate 1-99), `SELECT * FROM topics WHERE min_age <= ?`, map snake_case →
      camelCase
    - `GET /topics/:id` — return single topic or 404
    - `GET /categories` — return static array of 4 categories
- [ ] **3.2** Create `server/src/routes/exercises.ts` — Hono router with:
    - `GET /topics/:topicId/exercises` — `SELECT * FROM exercises WHERE topic_id = ?`, parse `options` JSON, map
      columns. Return default placeholder if no rows
- [ ] **3.3** Create `server/src/routes/scrolls.ts` — Hono router with:
    - `GET /topics/:topicId/scrolls` — `SELECT * FROM info_scrolls WHERE topic_id = ?`, map columns. Return default
      placeholder if no rows
- [ ] **3.4** Mount all three routers in `server/src/index.ts` under `/api`

### Tests

- [ ] **T3.1** `server/src/__tests__/topics.test.ts`:
    - GET /api/topics?age=8 returns only topics with minAge <= 8
    - GET /api/topics?age=99 returns all 12 topics
    - GET /api/topics?age=0 returns empty array
    - GET /api/topics without age param returns 400
    - GET /api/topics/math-tables returns correct topic
    - GET /api/topics/nonexistent returns 404
    - GET /api/categories returns 4 categories with correct shape
- [ ] **T3.2** `server/src/__tests__/exercises.test.ts`:
    - GET /api/topics/math-tables/exercises returns 4 exercises with correct fields
    - GET /api/topics/unknown-topic/exercises returns default placeholder exercise
    - Exercise options field is a parsed array (not JSON string)
- [ ] **T3.3** `server/src/__tests__/scrolls.test.ts`:
    - GET /api/topics/math-tables/scrolls returns 2 scrolls
    - GET /api/topics/unknown-topic/scrolls returns default placeholder scroll

### Verification

Start the server. `curl http://localhost:3001/api/topics?age=10` returns JSON array of topics.
`curl http://localhost:3001/api/topics/math-tables/exercises` returns exercises with parsed options arrays.

---

## Phase 4: Users & Progress API

**Goal:** Users can be created, answers submitted, XP tracked, and progress stats retrieved — all persisted.

### Tasks

- [ ] **4.1** Create `server/src/routes/users.ts` — Hono router with:
    - `POST /users` — validate `{ age }` (1-99), generate UUID, insert into users table, compute rank via
      `getRankForAge(age)`, return UserProfile (id, age, rank, totalXp: 0, completedExercises: [])
    - `GET /users/:id` — select user, derive rank from age, query completed exercises (
      `SELECT DISTINCT exercise_id FROM exercise_attempts WHERE user_id = ? AND is_correct = 1`), return UserProfile.
      404 if not found
    - `POST /users/:id/attempts` — validate `{ exerciseId, answer }`, look up exercise from DB, compare answer to
      correct_answer, insert attempt row, if correct update `users.total_xp += xp_reward`, return ExerciseResult with
      message
    - `GET /users/:id/progress` — aggregate exercise_attempts: total, correct, accuracy, category breakdown (join
      exercises to get topic_id, derive category from topic_id prefix), exercise type breakdown, last 10 attempts.
      Return ProgressStats
- [ ] **4.2** Mount users router in `server/src/index.ts` under `/api`

### Tests

- [ ] **T4.1** `server/src/__tests__/users.test.ts`:
    - POST /api/users with age=8 returns user with id, rank=Genin, totalXp=0
    - POST /api/users with age=10 returns rank=Chunin
    - POST /api/users with age=13 returns rank=Jonin
    - POST /api/users with invalid age returns 400
    - GET /api/users/:id returns created user
    - GET /api/users/nonexistent returns 404
- [ ] **T4.2** `server/src/__tests__/attempts.test.ts`:
    - POST correct answer → isCorrect=true, xpEarned matches exercise xpReward, user totalXp increases
    - POST incorrect answer → isCorrect=false, xpEarned=0, user totalXp unchanged
    - POST with invalid exerciseId → 404
    - POST with missing answer → 400
    - GET /api/users/:id after correct answer shows exercise in completedExercises
    - Submitting same correct answer twice does not duplicate in completedExercises
- [ ] **T4.3** `server/src/__tests__/progress.test.ts`:
    - GET /api/users/:id/progress with no attempts returns zeros and empty arrays
    - After multiple attempts: accuracy is correct, categoryBreakdown has correct counts, exerciseTypeBreakdown has
      correct counts, recentAttempts returns last 10 in reverse chronological order

### Verification

Using curl or a REST client:

1. `POST /api/users` with `{ "age": 10 }` → get user ID
2. `POST /api/users/{id}/attempts` with `{ "exerciseId": "mt-1", "answer": "56" }` → correct
3. `GET /api/users/{id}` → totalXp increased, completedExercises contains "mt-1"
4. `GET /api/users/{id}/progress` → stats reflect the attempt

---

## Phase 5: Frontend Integration

**Goal:** Frontend uses the real backend. App works end-to-end: age gate → dashboard → exercises → progress tracker.

### Tasks

- [ ] **5.1** Rewrite `src/lib/api.ts` — remove all mock data and `simulateLatency`. Export `API` object with
  fetch-based methods (using `/api` prefix, proxied by Vite). Re-export types from `../../shared/types`
- [ ] **5.2** Rewrite `src/services/topicService.ts`:
    - Remove in-memory state (`currentProfile`, `attemptHistory`)
    - `createProfile(age)` → async, calls `API.createUser(age)`, stores `userId` in `localStorage`, returns UserProfile
    - `getProfile()` → async, reads userId from `localStorage`, calls `API.getUser(userId)`. Returns null if no userId
    - `getAvailableMissions(age)` → async, calls `API.getTopics(age)`, enriches with progress (call `API.getUser` for
      completedExercises)
    - `getMissionsByCategory(age, category)` → filter result of `getAvailableMissions`
    - `getExercises(topicId)` → delegates to `API.getExercises`
    - `getInfoScrolls(topicId)` → delegates to `API.getInfoScrolls`
    - `getTopicDetail(topicId)` → parallel fetch of topic, exercises, scrolls
    - `submitAnswer(exercise, answer)` → async, calls `API.submitAttempt(userId, exerciseId, answer)`
    - `getProgressStats()` → async, calls `API.getProgress(userId)`
    - `getCategories()` → delegates to `API.getCategories`
    - `getUserId()` → helper, reads from localStorage
    - `clearSession()` → removes userId from localStorage
- [ ] **5.3** Update `src/pages/Index.tsx`:
    - On mount, check `localStorage` for existing userId. If found, restore profile via `TopicService.getProfile()` and
      skip to dashboard
    - `handleAgeSubmit` becomes async
- [ ] **5.4** Update `src/components/Dashboard.tsx`:
    - `loadTopics` already async, just ensure it calls the updated `TopicService`
    - After returning from TopicDetail, re-fetch profile to update XP display in header
- [ ] **5.5** Update `src/components/ExerciseTerminal.tsx`:
    - `handleSubmit` becomes async, awaits `TopicService.submitAnswer()`
- [ ] **5.6** Update `src/components/ProgressTracker.tsx`:
    - Load stats in `useEffect` (was synchronous), add loading state
    - `TopicService.getProgressStats()` is now async

### Tests

- [ ] **T5.1** Manual end-to-end test (no automated frontend tests for MVP):
    1. Start app with `npm run dev`
    2. Enter age → creates user (check Network tab: POST /api/users)
    3. Browse topics → GET /api/topics?age=N
    4. Open a topic → exercises and scrolls load from API
    5. Submit answers → POST /api/users/:id/attempts, XP updates
    6. View progress → GET /api/users/:id/progress, stats display
    7. Refresh browser → session restored from localStorage, profile loaded from API

### Verification

Full app flow works in the browser. Open DevTools Network tab — all requests go to `/api/*`, no mock data. Refresh the
page — user session persists. Run `npm run db:seed` — content resets but user progress preserved.
