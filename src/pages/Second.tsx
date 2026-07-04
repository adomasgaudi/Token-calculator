import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Second() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-slate-800">
      <h1 className="text-3xl font-semibold">Second route</h1>
      <p className="mt-3 text-slate-600">
        Client-side navigation via React Router — no full page reload happened getting here.
      </p>
      <Link to="/" className="mt-6 inline-flex items-center gap-1 text-sm text-emerald-700 hover:underline">
        <ArrowLeft className="h-4 w-4" /> back to the landing page
      </Link>
    </main>
  )
}
