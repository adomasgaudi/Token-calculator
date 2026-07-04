import { DISTS, fmt, type SliderKey } from '../lib/calc'
import { useSimulator } from '../store/simulator'

interface SliderSpec {
  key: SliderKey
  label: string
  min: number
  max: number
  step: number
}

const SLIDERS: SliderSpec[] = [
  { key: 'pfx', label: 'System prompt + tools (stable prefix)', min: 500, max: 150000, step: 500 },
  { key: 'uin', label: 'New user input per turn', min: 50, max: 20000, step: 50 },
  { key: 'ans', label: 'Answer tokens per turn', min: 100, max: 20000, step: 100 },
  { key: 'rsn', label: 'Reasoning tokens per turn (hidden, billed as output)', min: 0, max: 30000, step: 250 },
  { key: 'tool', label: 'Tool-result tokens per turn (agentic only, enters as input)', min: 0, max: 40000, step: 500 },
  { key: 'turns', label: 'Total turns in session', min: 1, max: 30, step: 1 },
]

function distBackground(key: SliderKey, min: number, max: number): string {
  const d = DISTS[key]
  const pos = (v: number) => Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100))
  return `linear-gradient(90deg, #eceae1 0%, #cde9dd ${pos(d.p10)}%, #0f6e56 ${pos(d.p50)}%, #cde9dd ${pos(d.p90)}%, #eceae1 100%)`
}

function Slider({ spec }: { spec: SliderSpec }) {
  const value = useSimulator((s) => s[spec.key])
  const set = useSimulator((s) => s.set)
  const d = DISTS[spec.key]
  return (
    <>
      <label className="lbl">{spec.label}</label>
      <div className="flex items-center gap-2.5">
        <input
          type="range"
          min={spec.min}
          max={spec.max}
          step={spec.step}
          value={value}
          aria-label={spec.label}
          style={{ background: distBackground(spec.key, spec.min, spec.max) }}
          onChange={(e) => set({ [spec.key]: +e.target.value })}
        />
        <span className="min-w-[74px] text-right font-[family-name:var(--mono)] text-[13px]">
          {spec.key === 'turns' ? value : fmt(value)}
        </span>
      </div>
      <div className="flex justify-between text-[11px] text-[var(--mut)]" title={d.note}>
        <span>low {fmt(d.p10)}</span>
        <b className="text-[var(--meter)]">avg {fmt(d.p50)}</b>
        <span>high {fmt(d.p90)}+</span>
      </div>
    </>
  )
}

export default function ConversationPanel() {
  const { turns, focus, cacheOn, set } = useSimulator()
  return (
    <div className="card">
      <h2>Conversation variables</h2>
      {SLIDERS.map((spec) => (
        <Slider key={spec.key} spec={spec} />
      ))}
      <label className="lbl">Inspect turn № (is it the 1st or the 5th prompt?)</label>
      <div className="flex items-center gap-2.5">
        <input
          type="range"
          min={1}
          max={turns}
          step={1}
          value={focus}
          aria-label="Inspect turn"
          onChange={(e) => set({ focus: +e.target.value })}
        />
        <span className="min-w-[74px] text-right font-[family-name:var(--mono)] text-[13px]">{focus}</span>
      </div>
      <label className="lbl mt-3.5 flex items-center gap-1.5">
        <input
          type="checkbox"
          className="w-auto"
          checked={cacheOn}
          onChange={(e) => set({ cacheOn: e.target.checked })}
        />
        Prompt caching enabled
      </label>
    </div>
  )
}
