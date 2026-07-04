import { useEffect, useRef } from 'react'
import { fmt, usd } from '../lib/calc'
import { useSimResults } from '../lib/useSimResults'
import { useSimulator } from '../store/simulator'

const COLS = { hit: '#0f6e56', write: '#b3421f', fresh: '#534ab7', out: '#a06508' } as const

function Bubble({ name, cost, tok, color, dashed }: { name: string; cost: number; tok: number; color: string; dashed?: boolean }) {
  return (
    <div
      className="flex items-center gap-1.5 rounded-[20px] px-3.5 py-1.5 text-[13px]"
      style={{ background: color + '18', border: `2px ${dashed ? 'dashed' : 'solid'} ${color}` }}
    >
      <b>{name}</b>
      <span className="font-[family-name:var(--mono)]">{usd(cost)}</span>
      <span className="font-[family-name:var(--mono)] text-[var(--mut)]">{fmt(tok)} tok</span>
    </div>
  )
}

export default function TrajectoryChart() {
  const r = useSimResults()
  const { turns, focus, chartView, set } = useSimulator()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tokView = chartView === 'tok'
  const totalTok = r.rows.reduce((a, row) => a + row.ctx + row.out, 0)

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx2 = cv.getContext('2d')
    if (!ctx2) return
    const { rIn, rOut, rW, rH } = r.rates
    ctx2.clearRect(0, 0, cv.width, cv.height)
    const W = cv.width
    const H = cv.height
    const pad = 44
    const T = turns
    const F = focus
    const comp = r.rows.map((row) =>
      tokView
        ? { hit: row.hit, write: row.write, fresh: row.fresh, out: row.out }
        : { hit: row.hit * rH, write: row.write * rW, fresh: row.fresh * rIn, out: row.out * rOut },
    )
    const totals = comp.map((c) => c.hit + c.write + c.fresh + c.out)
    const maxBar = Math.max(...totals) || 1
    const bw = Math.min(44, ((W - 2 * pad) / T) * 0.62)
    const gap = (W - 2 * pad) / T
    const Yb = (v: number) => H - pad - (H - 2 * pad) * (v / maxBar)
    ctx2.strokeStyle = '#d8d4c8'
    ctx2.beginPath()
    ctx2.moveTo(pad, H - pad)
    ctx2.lineTo(W - pad, H - pad)
    ctx2.stroke()
    ctx2.font = '12px monospace'
    comp.forEach((c, i) => {
      const x = pad + gap * i + (gap - bw) / 2
      let y = H - pad
      ;(['hit', 'write', 'fresh', 'out'] as const).forEach((k) => {
        const h = (H - 2 * pad) * (c[k] / maxBar)
        if (h > 0.5) {
          ctx2.fillStyle = COLS[k]
          ctx2.fillRect(x, y - h, bw, h)
          y -= h
        }
      })
      ctx2.fillStyle = i + 1 === F ? '#1d2129' : '#6d6a5f'
      if (T <= 16 || i % 2 === 0 || i + 1 === F) ctx2.fillText(String(i + 1), x + bw / 2 - 4, H - pad + 16)
      if (i + 1 === F) {
        ctx2.strokeStyle = '#1d2129'
        ctx2.setLineDash([3, 3])
        ctx2.strokeRect(x - 2, Yb(totals[i]) - 2, bw + 4, H - pad - Yb(totals[i]) + 2)
        ctx2.setLineDash([])
      }
    })
    ctx2.fillStyle = '#1d2129'
    ctx2.fillText(
      tokView ? 'per-turn tokens: hit + write + fresh in + out' : 'per-turn cost: hit + write + fresh in + out',
      pad,
      pad - 18,
    )
    const fT = totals[F - 1] ?? totals[totals.length - 1]
    ctx2.fillText('turn ' + F + ': ' + (tokView ? fmt(fT) + ' tok' : usd(fT)), pad, pad - 4)
    ctx2.fillStyle = COLS.hit
    ctx2.fillText('■ hit', W - pad - 260, pad - 4)
    ctx2.fillStyle = COLS.write
    ctx2.fillText('■ write', W - pad - 205, pad - 4)
    ctx2.fillStyle = COLS.fresh
    ctx2.fillText('■ fresh in', W - pad - 135, pad - 4)
    ctx2.fillStyle = COLS.out
    ctx2.fillText('■ out', W - pad - 45, pad - 4)
    if (!tokView && r.bSeries) {
      const maxC = Math.max(...r.bSeries, ...r.cumSeries)
      const Yl = (v: number) => H - pad - (H - 2 * pad) * (v / maxC)
      const X = (i: number) => pad + gap * i + gap / 2
      const draw = (s: number[], col: string, dash?: number[]) => {
        ctx2.setLineDash(dash ?? [])
        ctx2.strokeStyle = col
        ctx2.lineWidth = 2
        ctx2.beginPath()
        s.forEach((v, i) => (i ? ctx2.lineTo(X(i), Yl(v)) : ctx2.moveTo(X(0), Yl(v))))
        ctx2.stroke()
        ctx2.setLineDash([])
      }
      draw(r.cumSeries, '#0f6e56')
      draw(r.bSeries, '#b3421f', [6, 4])
      ctx2.fillStyle = '#b3421f'
      ctx2.fillText(r.bName + ' cum. ' + usd(r.cumB) + ' vs ' + r.aName + ' ' + usd(r.cumCached), pad, H - 8)
    }
  }, [r, turns, focus, tokView])

  return (
    <div className="card">
      <h2 className="flex items-center justify-between">
        Session trajectory
        <span className="flex gap-1">
          <button className={`toggle-btn${!tokView ? ' on' : ''}`} onClick={() => set({ chartView: 'cost' })}>
            Cost
          </button>
          <button className={`toggle-btn${tokView ? ' on' : ''}`} onClick={() => set({ chartView: 'tok' })}>
            Tokens
          </button>
        </span>
      </h2>
      <div className="mb-2.5 flex flex-wrap gap-2.5">
        <Bubble name={r.aName} cost={r.cumCached} tok={totalTok} color="#0f6e56" />
        {r.bSeries && <Bubble name={r.bName} cost={r.cumB} tok={totalTok} color="#b3421f" dashed />}
      </div>
      <canvas ref={canvasRef} width={900} height={300} className="h-[200px] w-full" />
    </div>
  )
}
