# R19-vite-tw-rr-z

Starter template: **React 19 + Vite + TypeScript (strict) + Tailwind v4 + Radix UI + React Router 7 + Zustand 5**, with Playwright e2e tests and GitHub Pages deployment pre-wired. No app content — just a landing page that describes the stack and proves each piece works.

## Use

1. GitHub → **Use this template** → create your repo
2. `pnpm install`
3. `pnpm dev`
4. Replace `src/pages/Landing.tsx` with your app

## Scripts

| Script | What it does |
|---|---|
| `pnpm dev` | Vite dev server with HMR |
| `pnpm build` | typecheck + production build |
| `pnpm preview` | serve the production build locally |
| `pnpm test:e2e` | Playwright tests (starts the dev server itself) |

## Deployment

Pushing to `main` builds and deploys to GitHub Pages via `.github/workflows/pages.yml`. In the new repo, enable Pages once: **Settings → Pages → Source: GitHub Actions**. The workflow sets `BASE_PATH=/<repo-name>/` so assets and routing work under the Pages subpath.
