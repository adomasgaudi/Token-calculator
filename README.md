# Token-calculator

**LLM token & cost simulator** — models a real multi-turn conversation: history accumulates, the stable prefix gets prompt-cached, and output tokens (answer + hidden reasoning) dominate the bill.

Features: request-type presets (SWE/agentic, knowledge Q&A, document drafting), editable per-model pricing with a comparison model, effort multiplier for reasoning tokens, batch/promo discounts, per-turn ledger (tokens or cost), session-trajectory chart, cache on/off comparison, and a per-turn "anatomy of one request" breakdown.

Built from the [R19-vite-tw-rr-z](https://github.com/adomasgaudi/R19-vite-tw-rr-z) template: React 19 + Vite + TypeScript (strict) + Tailwind v4 + React Router 7 + Zustand 5, Playwright e2e, GitHub Pages deploy.

## Structure

- `src/lib/calc.ts` — pure, typed simulation math (models, presets, per-turn cache hit/write formulas)
- `src/store/simulator.ts` — Zustand store holding every input
- `src/lib/useSimResults.ts` — memoized derived results
- `src/components/` — PresetPicker, PricingPanel, ConversationPanel, TrajectoryChart, Kpis, CostBreakdown, FocusTurn, Ledger
- `src/pages/Simulator.tsx` — the page

## Scripts

| Script | What it does |
|---|---|
| `pnpm dev` | Vite dev server with HMR |
| `pnpm build` | typecheck + production build |
| `pnpm preview` | serve the production build locally |
| `pnpm test:e2e` | Playwright tests (starts the dev server itself) |

## Deployment

Pushing to `main` deploys to GitHub Pages via `.github/workflows/pages.yml` (source: GitHub Actions). The workflow sets `BASE_PATH=/Token-calculator/` so assets resolve under the Pages subpath.
