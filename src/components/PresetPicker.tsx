import { PRESETS, type PresetKey } from '../lib/calc'
import { useSimulator } from '../store/simulator'

const LABELS: Record<PresetKey, string> = {
  swe: 'SWE / agentic coding',
  know: 'Knowledge Q&A',
  doc: 'Document drafting',
}

export default function PresetPicker() {
  const preset = useSimulator((s) => s.preset)
  const setPreset = useSimulator((s) => s.setPreset)
  return (
    <div className="card">
      <h2>Request type</h2>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(PRESETS) as PresetKey[]).map((k) => (
          <button key={k} className={`preset-btn${preset === k ? ' on' : ''}`} onClick={() => setPreset(k)}>
            {LABELS[k]}
          </button>
        ))}
      </div>
      <div className="turnbox" dangerouslySetInnerHTML={{ __html: PRESETS[preset].d }} />
    </div>
  )
}
