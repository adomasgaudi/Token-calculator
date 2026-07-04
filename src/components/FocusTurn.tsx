import { fmt, usd } from '../lib/calc'
import { useSimResults } from '../lib/useSimResults'
import { useSimulator } from '../store/simulator'

export default function FocusTurn() {
  const { rows, rates } = useSimResults()
  const focus = useSimulator((s) => s.focus)
  const cacheOn = useSimulator((s) => s.cacheOn)
  const f = rows[focus - 1] ?? rows[rows.length - 1]
  const { rIn, rOut, rW, rH } = rates
  const ft = (cacheOn ? f.hit * rH + f.write * rW : f.ctx * rIn) + f.out * rOut || 1
  const seg = (v: number) => Math.max(v / ft, 0.01)
  return (
    <div className="card">
      <h2>Inspected turn — anatomy of one request</h2>
      <div className="turnbox" data-testid="focus-box">
        Turn <b>{f.t}</b> sends <b>{fmt(f.ctx)}</b> context tokens
        {cacheOn ? (
          <>
            {' '}
            — <b>{fmt(f.hit)}</b> arrive as cache hits ({usd(f.hit * rH)}), <b>{fmt(f.write)}</b> are written fresh (
            {usd(f.write * rW)})
          </>
        ) : (
          <> at full input price ({usd(f.ctx * rIn)})</>
        )}{' '}
        — and generates <b>{fmt(f.out)}</b> output tokens ({usd(f.out * rOut)}). Turn cost: <b>{usd(f.c)}</b>.{' '}
        {f.t === 1
          ? 'First prompt: nothing to hit yet — the whole context is a cache write.'
          : 'By this turn the prefix and earlier history are warm, so context is nearly free; output is the bill.'}
      </div>
      <div className="bar mt-3">
        {cacheOn ? (
          <>
            <div style={{ background: 'var(--write)', flex: seg(f.write * rW) }} />
            <div style={{ background: 'var(--hit)', flex: seg(f.hit * rH) }} />
            <div style={{ background: 'var(--out)', flex: seg(f.out * rOut) }} />
          </>
        ) : (
          <>
            <div style={{ background: 'var(--input)', flex: seg(f.ctx * rIn) }} />
            <div style={{ background: 'var(--out)', flex: seg(f.out * rOut) }} />
          </>
        )}
      </div>
    </div>
  )
}
