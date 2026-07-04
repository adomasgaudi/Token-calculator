import * as Dialog from '@radix-ui/react-dialog'
import * as Tooltip from '@radix-ui/react-tooltip'
import { ArrowRight, Check, Minus, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useDemoStore } from '../store/demo'

const stack = [
  { name: 'React 19', role: 'UI runtime', why: 'Concurrent rendering, actions, the ecosystem default.' },
  { name: 'Vite 6', role: 'Build & dev server', why: 'Instant HMR, esbuild-fast builds, zero config to start.' },
  { name: 'TypeScript 5 (strict)', role: 'Language', why: 'Strict mode on from day one — refactors stay safe as the app grows.' },
  { name: 'Tailwind v4', role: 'Styling', why: 'CSS-first config via @import, no tailwind.config.js needed.' },
  { name: 'Radix UI', role: 'Headless components', why: 'Accessible dialogs, dropdowns, tooltips — you own the styling.' },
  { name: 'React Router 7', role: 'Routing', why: 'Nested routes and data APIs when pages multiply.' },
  { name: 'Zustand 5', role: 'State', why: 'One store hook, no boilerplate, scales from a counter to app-wide state.' },
  { name: 'Playwright', role: 'E2E tests', why: 'Real-browser tests wired into CI from the first commit.' },
]

const pros = [
  'Everything is pre-wired: routing, state, styling, accessible primitives, e2e tests, Pages deploy.',
  'Strict TypeScript and a typecheck step in the build catch errors before they ship.',
  'No runtime CSS-in-JS, no heavy UI kit — small bundles, full design control.',
  'Each piece is replaceable: swap Zustand for Redux or Radix for another kit without touching the rest.',
]

const cons = [
  'No server: SPA only — no SSR/SEO out of the box (reach for Next/Remix if you need that).',
  'Radix is headless: you style every component yourself, which is slower than a themed kit.',
  'No data-fetching layer included — add TanStack Query or similar when you talk to APIs.',
  'GitHub Pages is static hosting: no redirects, functions, or auth until you move to Netlify/Vercel.',
]

export default function Landing() {
  const { count, increment, reset } = useDemoStore()
  return (
    <Tooltip.Provider>
      <main className="mx-auto max-w-3xl px-6 py-16 text-slate-800">
        <p className="font-mono text-sm text-emerald-700">adomasgaudi/R19-vite-tw-rr-z</p>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight">
          React 19 starter template
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          A content-free web-dev starting point that can safely expand: React 19 + Vite +
          TypeScript + Tailwind v4 + Radix + React Router + Zustand, with Playwright and a
          GitHub Pages deploy already wired.
        </p>

        <h2 className="mt-12 text-xl font-semibold">The stack</h2>
        <ul className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200">
          {stack.map((s) => (
            <li key={s.name} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-baseline sm:gap-4">
              <span className="w-48 shrink-0 font-medium">{s.name}</span>
              <span className="w-40 shrink-0 text-sm text-slate-500">{s.role}</span>
              <span className="text-sm text-slate-600">{s.why}</span>
            </li>
          ))}
        </ul>

        <h2 className="mt-12 text-xl font-semibold">Live proof it works</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={increment}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Zustand counter: {count}
          </button>
          <button onClick={reset} className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100">
            reset
          </button>

          <Dialog.Root>
            <Dialog.Trigger className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100">
              Radix dialog
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40" />
              <Dialog.Content className="fixed left-1/2 top-1/2 w-80 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl">
                <Dialog.Title className="font-semibold">Accessible by default</Dialog.Title>
                <Dialog.Description className="mt-2 text-sm text-slate-600">
                  Focus trapping, Escape to close, aria wiring — Radix handles it; Tailwind styles it.
                </Dialog.Description>
                <Dialog.Close className="mt-4 rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-white">
                  Close
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          <Tooltip.Root>
            <Tooltip.Trigger className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100">
              Radix tooltip
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="rounded-md bg-slate-900 px-3 py-1.5 text-xs text-white" sideOffset={6}>
                Rendered in a portal, positioned automatically.
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>

          <Link
            to="/second"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
          >
            Router demo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <Check className="h-5 w-5 text-emerald-600" /> Pros
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {pros.map((p) => (
                <li key={p} className="flex gap-2">
                  <Minus className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {p}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <X className="h-5 w-5 text-rose-600" /> Cons
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {cons.map((c) => (
                <li key={c} className="flex gap-2">
                  <Minus className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                  {c}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <p className="mt-12 text-sm text-slate-500">
          Use it: GitHub → “Use this template” → <code className="font-mono">pnpm install</code> →{' '}
          <code className="font-mono">pnpm dev</code>. Delete this page and start building.
        </p>
      </main>
    </Tooltip.Provider>
  )
}
