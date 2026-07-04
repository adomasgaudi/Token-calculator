import { MODEL_LABELS, modelName, type ModelKey } from '../lib/calc'
import { useSimulator } from '../store/simulator'

const MODEL_KEYS = Object.keys(MODEL_LABELS) as Exclude<ModelKey, 'custom'>[]

export default function PricingPanel() {
  const s = useSimulator()
  return (
    <div className="card">
      <h2>Model &amp; pricing ($ / 1M tokens)</h2>
      <select value={s.model} onChange={(e) => s.setModel(e.target.value as ModelKey)} aria-label="Model">
        {MODEL_KEYS.map((k) => (
          <option key={k} value={k}>
            {MODEL_LABELS[k]}
          </option>
        ))}
        <option value="custom">Custom</option>
      </select>
      <label className="lbl mt-3">Compare with (dashed line)</label>
      <select
        value={s.modelB}
        onChange={(e) => s.set({ modelB: e.target.value as typeof s.modelB })}
        aria-label="Compare model"
      >
        <option value="">— none —</option>
        {MODEL_KEYS.map((k) => (
          <option key={k} value={k}>
            {modelName(k)}
          </option>
        ))}
      </select>
      <label className="lbl">Effort level (scales hidden reasoning tokens)</label>
      <select value={s.effort} onChange={(e) => s.set({ effort: +e.target.value })} aria-label="Effort">
        <option value={0.25}>Low (×0.25 reasoning)</option>
        <option value={0.5}>Medium (×0.5)</option>
        <option value={1}>High (×1)</option>
        <option value={2}>Xhigh (×2)</option>
        <option value={4}>Max (×4)</option>
      </select>
      <label className="lbl mt-3.5 flex items-center gap-1.5">
        <input type="checkbox" className="w-auto" checked={s.batch} onChange={(e) => s.set({ batch: e.target.checked })} />
        Batch API (−50% input &amp; output, async only)
      </label>
      <label className="lbl flex items-center gap-1.5">
        <input type="checkbox" className="w-auto" checked={s.promo} onChange={(e) => s.set({ promo: e.target.checked })} />
        Subscription promo: Fable 5 included until Jul 7 (token cost $0)
      </label>
      <div className="mt-2.5 grid grid-cols-2 gap-2">
        {(
          [
            ['pIn', 'Input — tokens you send ($/1M)'],
            ['pOut', 'Output — tokens model generates ($/1M)'],
            ['pW', 'Cache write — first-time storing of prefix ($/1M)'],
            ['pH', 'Cache hit — reusing stored prefix ($/1M)'],
          ] as const
        ).map(([field, label]) => (
          <div key={field}>
            <label className="lbl">{label}</label>
            <input type="number" step="0.01" value={s[field]} onChange={(e) => s.setPrice(field, +e.target.value)} />
          </div>
        ))}
        <div>
          <label className="lbl">USD → EUR rate</label>
          <input type="number" step="0.01" value={s.eur} onChange={(e) => s.set({ eur: +e.target.value })} />
        </div>
      </div>
    </div>
  )
}
