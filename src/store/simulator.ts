import { create } from 'zustand'
import { MODELS, PRESETS, type ModelKey, type PresetKey } from '../lib/calc'

export type LedgerView = 'tok' | 'cost'
export type ChartView = 'cost' | 'tok'

interface SimulatorState {
  preset: PresetKey
  model: ModelKey
  modelB: Exclude<ModelKey, 'custom'> | ''
  effort: number
  batch: boolean
  promo: boolean
  pIn: number
  pOut: number
  pW: number
  pH: number
  eur: number
  pfx: number
  uin: number
  ans: number
  rsn: number
  tool: number
  turns: number
  focus: number
  cacheOn: boolean
  chartView: ChartView
  ledgerView: LedgerView
  setPreset: (k: PresetKey) => void
  setModel: (k: ModelKey) => void
  /** editing any price flips the model select to Custom */
  setPrice: (field: 'pIn' | 'pOut' | 'pW' | 'pH', value: number) => void
  set: (partial: Partial<SimulatorState>) => void
}

export const useSimulator = create<SimulatorState>((set) => ({
  preset: 'swe',
  model: 'fable',
  modelB: '',
  effort: 1,
  batch: false,
  promo: false,
  pIn: MODELS.fable[0],
  pOut: MODELS.fable[1],
  pW: MODELS.fable[2],
  pH: MODELS.fable[3],
  eur: 0.92,
  ...PRESETS.swe,
  focus: 5,
  cacheOn: true,
  chartView: 'cost',
  ledgerView: 'tok',
  setPreset: (k) => {
    const p = PRESETS[k]
    set((s) => ({
      preset: k,
      pfx: p.pfx,
      uin: p.uin,
      ans: p.ans,
      rsn: p.rsn,
      tool: p.tool,
      turns: p.turns,
      focus: Math.min(s.focus, p.turns),
    }))
  },
  setModel: (k) => {
    if (k === 'custom') {
      set({ model: k })
      return
    }
    const [pIn, pOut, pW, pH] = MODELS[k]
    set({ model: k, pIn, pOut, pW, pH })
  },
  setPrice: (field, value) => set({ [field]: value, model: 'custom' }),
  set: (partial) =>
    set((s) => {
      const next = { ...partial }
      const turns = next.turns ?? s.turns
      const focus = next.focus ?? s.focus
      if (focus > turns) next.focus = turns
      return next
    }),
}))
