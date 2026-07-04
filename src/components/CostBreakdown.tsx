import { useSimResults } from '../lib/useSimResults'

export default function CostBreakdown() {
  const { totW, totH, totF, totO } = useSimResults()
  const tot = totW + totH + totF + totO || 1
  const seg = (v: number) => Math.max(v / tot, 0.01)
  const pct = (v: number) => Math.round((v / tot) * 100) + '%'
  return (
    <div className="card">
      <h2>Where the money goes (whole session, cached)</h2>
      <div className="bar">
        <div style={{ background: 'var(--write)', flex: seg(totW) }} />
        <div style={{ background: 'var(--hit)', flex: seg(totH) }} />
        <div style={{ background: 'var(--input)', flex: seg(totF) }} />
        <div style={{ background: 'var(--out)', flex: seg(totO) }} />
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-[var(--mut)]">
        {(
          [
            ['Cache writes', 'var(--write)', pct(totW)],
            ['Cache hits', 'var(--hit)', pct(totH)],
            ['Fresh input', 'var(--input)', pct(totF)],
            ['Output', 'var(--out)', pct(totO)],
          ] as const
        ).map(([name, color, p]) => (
          <span key={name}>
            <i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-[2px] align-[-1px]" style={{ background: color }} />
            {name} <b>{p}</b>
          </span>
        ))}
      </div>
    </div>
  )
}
