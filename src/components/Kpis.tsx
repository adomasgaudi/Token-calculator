import { fmt, usd } from '../lib/calc'
import { useSimResults } from '../lib/useSimResults'
import { useSimulator } from '../store/simulator'

export default function Kpis() {
  const r = useSimResults()
  const eurR = useSimulator((s) => s.eur) || 0.92
  const eur = (n: number) => ' / €' + (n * eurR < 10 ? (n * eurR).toFixed(3) : (n * eurR).toFixed(2))
  const kpi = 'rounded-[10px] border border-[var(--line)] bg-[var(--card)] px-3.5 py-3'
  const label = 'text-xs text-[var(--mut)]'
  const value = 'mt-0.5 font-[family-name:var(--mono)] text-[22px] font-semibold'
  return (
    <div className="mb-4 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3">
      <div className={kpi}>
        <div className={label}>Session cost (no cache)</div>
        <div className={value} data-testid="kpi-nocache">
          {usd(r.cumNoCache)}
          <span className="text-[13px] text-[var(--mut)]">{eur(r.cumNoCache)}</span>
        </div>
      </div>
      <div className={kpi}>
        <div className={label}>Session cost (cached)</div>
        <div className={value} data-testid="kpi-cached">
          {usd(r.cumCached)}
          <span className="text-[13px] text-[var(--mut)]">{eur(r.cumCached)}</span>
        </div>
      </div>
      <div className={`${kpi} border-[var(--meter)] bg-[var(--meter-soft)]`}>
        <div className={label}>Caching saves</div>
        <div className={`${value} text-[var(--meter)]`}>
          {r.cumNoCache > 0 ? Math.round((1 - r.cumCached / r.cumNoCache) * 100) + '%' : '–'}
        </div>
      </div>
      <div className={kpi}>
        <div className={label}>Total tokens processed</div>
        <div className={value}>{fmt(r.totTok)}</div>
      </div>
    </div>
  )
}
