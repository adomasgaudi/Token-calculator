import { useMemo } from 'react'
import { useSimulator } from '../store/simulator'
import { MODELS, compareSeries, modelName, simulate, type SimResult } from './calc'

export interface Rates {
  rIn: number
  rOut: number
  rW: number
  rH: number
}

export interface SimView extends SimResult {
  rates: Rates
  disc: number
  rsnScaled: number
  aName: string
  bName: string
  bSeries: number[] | null
  cumB: number
}

export function useSimResults(): SimView {
  const s = useSimulator()
  return useMemo(() => {
    const disc = (s.batch ? 0.5 : 1) * (s.promo && s.model === 'fable' ? 0 : 1)
    const rates: Rates = {
      rIn: (s.pIn / 1e6) * disc,
      rOut: (s.pOut / 1e6) * disc,
      rW: (s.pW / 1e6) * disc,
      rH: (s.pH / 1e6) * disc,
    }
    const rsnScaled = Math.round(s.rsn * s.effort)
    const inputs = {
      pfx: s.pfx,
      uin: s.uin,
      ans: s.ans,
      rsn: rsnScaled,
      tool: s.tool,
      turns: s.turns,
      cacheOn: s.cacheOn,
      ...rates,
    }
    const result = simulate(inputs)
    const bSeries = s.modelB ? compareSeries(inputs, MODELS[s.modelB], disc) : null
    return {
      ...result,
      rates,
      disc,
      rsnScaled,
      aName: modelName(s.model),
      bName: s.modelB ? modelName(s.modelB) : '',
      bSeries,
      cumB: bSeries ? bSeries[bSeries.length - 1] : 0,
    }
  }, [s])
}
