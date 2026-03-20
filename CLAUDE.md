# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kaizen Academy — an anime/ninja-themed educational app for kids (ages 6–12+) that teaches math, physics, science, and biology through gamified "missions" and exercises. Built as a React SPA with a Hono + SQLite backend.

## Commands

- `npm run dev` — Start frontend (port 8080) and backend (port 3001) concurrently
- `npm run dev:frontend` — Start only the Vite dev server
- `npm run dev:server` — Start only the backend server
- `npm run db:seed` — Seed the database with content data
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm run test` — Run frontend tests once (vitest)
- `npm run test:watch` — Run frontend tests in watch mode
- `npm --prefix server run test` — Run backend tests
- `npx vitest run src/test/example.test.ts` — Run a single test file

## Architecture

**Frontend Stack:** React 18 + TypeScript, Vite (SWC), Tailwind CSS, shadcn/ui (Radix primitives), Framer Motion, React Router, TanStack Query.

**Backend Stack:** Hono (Node.js), SQLite via better-sqlite3, tsx (dev runner).

**Path alias:** `@/` → `./src/`

**Key layers:**

- `shared/types.ts` — Shared TypeScript interfaces used by both frontend and backend.
- `src/lib/api.ts` — Fetch-based API client calling `/api/*` endpoints (proxied to backend via Vite).
- `src/services/topicService.ts` — Stateless service facade over the API. User ID stored in localStorage.
- `src/pages/` — Route-level components. `Index.tsx` restores session from localStorage on mount.
- `src/components/` — App components (AgeGate, Dashboard, MissionCard, ExerciseTerminal, TopicDetail, etc.).
- `src/components/ui/` — shadcn/ui primitives (do not edit directly; managed via `npx shadcn-ui@latest add`).
- `server/src/index.ts` — Hono app with CORS, logger, error handler, route mounting.
- `server/src/db.ts` — SQLite initialization, schema creation, WAL mode.
- `server/src/routes/` — API route handlers (topics, exercises, scrolls, users).
- `server/src/seed.ts` — Standalone seed script for content data.

**Flow:** AgeGate → creates UserProfile via POST /api/users → Dashboard shows age-filtered topics → TopicDetail with exercises and scrolls → Submit answers via POST /api/users/:id/attempts → Progress tracked in SQLite.

**Theming:** Custom anime-styled design tokens in `tailwind.config.ts` — fonts (Bangers display, Space Grotesk body), custom animations (`power-pulse`, `slide-up`), and a `success` color scale. CSS variables in `src/index.css`.

## Notes

- TypeScript is configured with `strictNullChecks: false` and `noImplicitAny: false`.
- ESLint disables `@typescript-eslint/no-unused-vars`.
- Add new routes in `src/App.tsx` above the catch-all `*` route.
- Database file is at `server/data/kaizen.db` (gitignored). Run `npm run db:seed` to populate.
- Vite proxies `/api` requests to `http://localhost:3001` in dev mode.

## Development Process

### Steering Documents
The `./specs` folder contains steering documents for the project:
- `./specs/product.md` - Business-level overview of the application
- `./specs/index.md` - Index of all feature specs

### Spec-Driven Development
For each new major feature, create a new folder in `./specs` with sequential numbering (e.g., `001-feature-name`) containing:
- `requirements.md` - Detailed description of the feature requirements
- `design.md` - Detailed design of the feature
- `tasks.md` - List of tasks, grouped by phases, to implement the feature

### Documentation
When a user request is completed, create or update documentation in `./documentation` to reflect the changes:
1. Keep one file per functional or technical domain area
2. **Always update `./documentation/index.md`** when adding new documentation files
3. Before finishing any task that adds or modifies features, check if documentation needs updating
4. Reference `./documentation/index.md` to see existing documentation topics
