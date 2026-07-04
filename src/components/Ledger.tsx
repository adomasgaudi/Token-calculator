import { fmt, usd } from '../lib/calc'
import { useSimResults } from '../lib/useSimResults'
import { useSimulator } from '../store/simulator'

export default function Ledger() {
  const { rows, rates } = useSimResults()
  const { focus, ledgerView, set } = useSimulator()
  const { rIn, rW, rH, rOut } = rates
  const isCost = ledgerView === 'cost'
  const cell = (tok: number, cost: number) => (isCost ? usd(cost) : fmt(tok))
  return (
    <div className="card">
      <h2 className="flex items-center justify-between">
        Per-turn ledger
        <span className="flex gap-1">
          <button className={`toggle-btn${!isCost ? ' on' : ''}`} onClick={() => set({ ledgerView: 'tok' })}>
            Tokens
          </button>
          <button className={`toggle-btn${isCost ? ' on' : ''}`} onClick={() => set({ ledgerView: 'cost' })}>
            Cost
          </button>
        </span>
      </h2>
      <div className="overflow-x-auto">
        <table className="ledger">
          <thead>
            <tr>
              <th title="Which request in the conversation, 1 = first prompt">Turn</th>
              <th title="Full context sent this turn: prefix + all history + new input + tool results">Ctx in</th>
              <th title="Tokens written to cache for the first time this turn — billed at 1.25x input price" style={{ color: 'var(--write)' }}>
                Write
              </th>
              <th title="Tokens reused from cache — billed at ~0.1x input price" style={{ color: 'var(--hit)' }}>
                Hit
              </th>
              <th title="Tokens billed at full input price (only when caching is off)" style={{ color: 'var(--input)' }}>
                Fresh in
              </th>
              <th title="Tokens generated: visible answer + hidden reasoning — billed at output price" style={{ color: 'var(--out)' }}>
                Out
              </th>
              <th title="What this single turn costs">Cost</th>
              <th title="Running total from turn 1 up to here">Cum.</th>
            </tr>
          </thead>
          <tbody data-testid="ledger-body">
            {rows.map((r) => (
              <tr key={r.t} className={r.t === focus ? 'focus' : undefined}>
                <td>{r.t}</td>
                <td>{cell(r.ctx, r.hit * rH + r.write * rW + r.fresh * rIn)}</td>
                <td style={{ color: 'var(--write)' }}>{cell(r.write, r.write * rW)}</td>
                <td style={{ color: 'var(--hit)' }}>{cell(r.hit, r.hit * rH)}</td>
                <td style={{ color: 'var(--input)' }}>{cell(r.fresh, r.fresh * rIn)}</td>
                <td style={{ color: 'var(--out)' }}>{cell(r.out, r.out * rOut)}</td>
                <td>{usd(r.c)}</td>
                <td>{usd(r.cum)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2.5 text-xs leading-[1.8] text-[var(--mut)]">
        <b>Turn</b> — request number in the session · <b>Ctx in</b> — everything sent to the model (prefix + accumulated
        history + new message + tool results) · <b style={{ color: 'var(--write)' }}>Write</b> — new tokens stored in
        cache this turn (1.25× input price) · <b style={{ color: 'var(--hit)' }}>Hit</b> — context reused from cache
        (~0.1× input price; this is where savings live) · <b style={{ color: 'var(--input)' }}>Fresh in</b> — context
        billed at full input price (nonzero only with caching off) · <b style={{ color: 'var(--out)' }}>Out</b> —
        generated tokens: answer + hidden reasoning (output price, usually the expensive line) · <b>Cost</b> — this turn
        alone · <b>Cum.</b> — total so far. Colors match the bars in the chart above. Hover any column header for the
        same hint.
      </div>
      <p className="mt-2.5 text-xs text-[var(--mut)]">
        Ctx in = full context sent that turn (prefix + accumulated history + new input + tool results). With caching,
        most of it lands as a cheap cache hit; each turn also writes its new suffix so the next turn can hit it.
      </p>
    </div>
  )
}
