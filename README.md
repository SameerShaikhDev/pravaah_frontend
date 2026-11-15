# Pravaah — AI Mock Interview Platform (Frontend)

React 19 + Vite + Tailwind CSS frontend wired to the Node/Express + MongoDB + Gemini backend.

## Setup

```bash
npm install
# .env already sets VITE_API_BASE_URL=/api/v1 — edit it if your backend lives elsewhere
npm run dev
```

Runs on http://localhost:5173, proxies /api to http://localhost:5000 in dev (see vite.config.js).

## Notes on backend wiring

Services in `src/services/*.service.js` are written to match this project's actual backend route
contracts (auth, interviews, resumes, coding, leaderboard, admin, questions, notifications).
A few admin/analytics endpoints (`/admin/dashboard`, `/analytics/student-growth`) are called
optimistically — if your backend doesn't expose them yet, those specific chart panels render an
empty state instead of crashing.

## Design system

- Semantic colour tokens (`ink`, `surface`, `line`, `accent`, `success`, `warn`, `danger`) defined as CSS variables in `src/styles/index.css`; dark is default, light via `ThemeContext` (`data-theme` on `<html>`)
- Brand: indigo → aqua "flow" gradient; saffron for highlights
- Fonts: Bricolage Grotesque (display), Instrument Sans (body), JetBrains Mono (timers, scores, code)
- Motion: framer-motion for UI responses, a dependency-free canvas `FlowField` for the hero, `useTilt` for 3D tilt; all respect `prefers-reduced-motion`
- Shared building blocks: `components/common/*`, `components/layout/AppShell` (all signed-in areas), `components/layout/AuthShell` (all signed-out forms)

## Deployment checklist (backend ↔ frontend)
1. Set `VITE_API_BASE_URL` to the full backend URL in production (see `.env.example`). The relative `/api/v1` only works locally through the Vite proxy.
2. On the backend set `CLIENT_URL` to the exact frontend origin (use `http://localhost:5173` in dev).
3. Cross-site cookies (`sameSite: none`) can be blocked by Safari; serving frontend and API under one domain avoids refresh-token logouts.
