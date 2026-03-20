# Kaizen Academy — Anime Academy Adventures

An anime/ninja-themed educational app for kids (ages 6–12+) that teaches **math**, **physics**, **science**, and **biology** through gamified "missions" and interactive exercises.

Students progress through age-appropriate topics, complete exercises in an arcade-style terminal, and unlock knowledge scrolls — all wrapped in a vibrant anime aesthetic.

## Tech Stack

| Layer    | Technologies                                                        |
| -------- | ------------------------------------------------------------------- |
| Frontend | React 18, TypeScript, Vite (SWC), Tailwind CSS, shadcn/ui, Framer Motion, React Router, TanStack Query |
| Backend  | Hono (Node.js), SQLite via better-sqlite3                           |
| Testing  | Vitest, Testing Library, Playwright                                 |

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

## Getting Started

```bash
# Install dependencies (frontend + backend)
npm install
npm --prefix server install

# Seed the database with content
npm run db:seed

# Start both frontend and backend in development mode
npm run dev
```

The frontend runs on **http://localhost:8080** and the backend API on **http://localhost:3001**. Vite proxies `/api` requests to the backend automatically.

## Available Scripts

| Command                          | Description                              |
| -------------------------------- | ---------------------------------------- |
| `npm run dev`                    | Start frontend and backend concurrently  |
| `npm run dev:frontend`           | Start only the Vite dev server           |
| `npm run dev:server`             | Start only the Hono backend              |
| `npm run db:seed`                | Seed the SQLite database with content    |
| `npm run build`                  | Production build (frontend)              |
| `npm run lint`                   | Run ESLint                               |
| `npm run test`                   | Run frontend tests (Vitest)              |
| `npm run test:watch`             | Run frontend tests in watch mode         |
| `npm --prefix server run test`   | Run backend tests                        |

## Project Structure

```
├── src/                  # Frontend source
│   ├── components/       # App components (Dashboard, ExerciseTerminal, etc.)
│   ├── components/ui/    # shadcn/ui primitives
│   ├── lib/              # API client and utilities
│   ├── pages/            # Route-level components
│   └── services/         # Service layer (topicService, etc.)
├── server/               # Backend source
│   └── src/
│       ├── index.ts      # Hono app entry point
│       ├── db.ts         # SQLite setup
│       ├── routes/       # API route handlers
│       └── seed.ts       # Database seed script
├── shared/               # Shared TypeScript types
└── specs/                # Feature specifications
```

## How It Works

1. **Age Gate** — The student selects their age group to create a profile.
2. **Dashboard** — Age-filtered topics are displayed as mission cards.
3. **Topic Detail** — Each topic contains exercises and knowledge scrolls.
4. **Exercise Terminal** — Students submit answers; progress is tracked in SQLite.

## License

This project is licensed under the [MIT License](LICENSE).
