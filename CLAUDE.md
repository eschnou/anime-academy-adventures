# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kaizen Academy — an anime/ninja-themed educational app for kids (ages 6–12+) that teaches math, physics, science, and biology through gamified "missions" and exercises. Built as a single-page React app with no backend; all data is mock/in-memory.

## Commands

- `npm run dev` — Start dev server on port 8080
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm run test` — Run tests once (vitest)
- `npm run test:watch` — Run tests in watch mode
- `npx vitest run src/test/example.test.ts` — Run a single test file

## Architecture

**Stack:** React 18 + TypeScript, Vite (SWC), Tailwind CSS, shadcn/ui (Radix primitives), Framer Motion, React Router, TanStack Query.

**Path alias:** `@/` → `./src/`

**Key layers:**

- `src/lib/api.ts` — Mock API layer with hardcoded topic/exercise/scroll data and simulated latency. Structured for future backend replacement.
- `src/services/topicService.ts` — Business logic layer over the API: user profiles, XP/rank calculations, progress tracking. Holds in-memory state (`currentProfile`).
- `src/pages/` — Route-level components. `Index.tsx` gates on age before showing the dashboard.
- `src/components/` — App components (AgeGate, Dashboard, MissionCard, ExerciseTerminal, TopicDetail, etc.).
- `src/components/ui/` — shadcn/ui primitives (do not edit directly; managed via `npx shadcn-ui@latest add`).

**Flow:** AgeGate → creates UserProfile via TopicService → Dashboard shows age-filtered topics by category → TopicDetail with exercises (multiple-choice, fill-blank, true-false) and info scrolls.

**Theming:** Custom anime-styled design tokens in `tailwind.config.ts` — fonts (Bangers display, Space Grotesk body), custom animations (`power-pulse`, `slide-up`), and a `success` color scale. CSS variables in `src/index.css`.

## Notes

- TypeScript is configured with `strictNullChecks: false` and `noImplicitAny: false`.
- ESLint disables `@typescript-eslint/no-unused-vars`.
- Add new routes in `src/App.tsx` above the catch-all `*` route.
