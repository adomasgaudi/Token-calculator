export type ModelKey =
  | 'fable'
  | 'opus48'
  | 'sonnet5'
  | 'haiku'
  | 'opus47'
  | 'opus46'
  | 'opus3'
  | 'sonnet46'
  | 'deepseek'
  | 'custom'

/** [input, output, cache write, cache hit] — $ per 1M tokens */
export type Prices = [number, number, number, number]

export const MODELS: Record<Exclude<ModelKey, 'custom'>, Prices> = {
  fable: [10, 50, 12.5, 1.0],
  opus48: [5, 25, 6.25, 0.5],
  sonnet5: [2, 10, 2.5, 0.2],
  haiku: [1, 5, 1.25, 0.1],
  opus47: [5, 25, 6.25, 0.5],
  opus46: [5, 25, 6.25, 0.5],
  opus3: [15, 75, 18.75, 1.5],
  sonnet46: [3, 15, 3.75, 0.3],
  deepseek: [0.28, 1.1, 0.28, 0.028],
}

export const MODEL_LABELS: Record<Exclude<ModelKey, 'custom'>, string> = {
  fable: 'Claude Fable 5 ($10 / $50)',
  opus48: 'Claude Opus 4.8 ($5 / $25)',
  sonnet5: 'Claude Sonnet 5 ($2 / $10 intro)',
  haiku: 'Claude Haiku 4.5 ($1 / $5)',
  opus47: 'Claude Opus 4.7 ($5 / $25)',
  opus46: 'Claude Opus 4.6 ($5 / $25)',
  opus3: 'Claude Opus 3 ($15 / $75, legacy)',
  sonnet46: 'Claude Sonnet 4.6 ($3 / $15)',
  deepseek: 'DeepSeek V4-class ($0.28 / $1.10)',
}

export const modelName = (key: ModelKey): string =>
  key === 'custom' ? 'Custom' : MODEL_LABELS[key].split('(')[0].trim()

export type PresetKey = 'swe' | 'know' | 'doc'

export interface Preset {
  pfx: number
  uin: number
  ans: number
  rsn: number
  tool: number
  turns: number
  d: string
}

export const PRESETS: Record<PresetKey, Preset> = {
  swe: {
    pfx: 12000,
    uin: 400,
    ans: 1500,
    rsn: 2000,
    tool: 8000,
    turns: 8,
    d: '<b>SWE / agentic:</b> big tool definitions in the prefix, heavy tool results (diffs, test logs) flowing back as input every turn, moderate reasoning. Input volume explodes with turns — caching is what makes agents affordable.',
  },
  know: {
    pfx: 2000,
    uin: 150,
    ans: 800,
    rsn: 4000,
    tool: 0,
    turns: 5,
    d: "<b>Knowledge Q&amp;A:</b> small prefix, short questions, but a thinking model burns thousands of hidden reasoning tokens per answer. Output line dominates; caching helps less because there's little to cache.",
  },
  doc: {
    pfx: 6000,
    uin: 2500,
    ans: 4000,
    rsn: 1000,
    tool: 0,
    turns: 6,
    d: '<b>Document drafting:</b> pasted source material as input, long generated drafts as output, iterative revisions where each draft re-enters history. Costs grow because every revision re-reads all previous drafts.',
  },
}

export type SliderKey = 'pfx' | 'uin' | 'ans' | 'rsn' | 'tool' | 'turns'

export interface Dist {
  p10: number
  p50: number
  p90: number
  note: string
}

export const DISTS: Record<SliderKey, Dist> = {
  pfx: { p10: 2000, p50: 12000, p90: 60000, note: 'chatbot 2k · agent w/ tools 12k · Claude Code-scale 60k+' },
  uin: { p10: 100, p50: 350, p90: 3000, note: 'short question 100 · typical 350 · pasted doc 3k+' },
  ans: { p10: 400, p50: 1500, p90: 6000, note: 'brief 400 · typical 1.5k · long report 6k+' },
  rsn: { p10: 0, p50: 2500, p90: 12000, note: 'no thinking 0 · typical 2.5k · hard problem 12k+' },
  tool: { p10: 0, p50: 6000, p90: 25000, note: 'no tools 0 · typical agent 6k · log-heavy 25k+' },
  turns: { p10: 2, p50: 6, p90: 20, note: 'quick ask 2 · typical 6 · long session 20+' },
}

export const fmt = (n: number): string =>
  n >= 1e6 ? (n / 1e6).toFixed(2) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'k' : String(Math.round(n))

export const usd = (n: number): string => '$' + (n < 10 ? n.toFixed(3) : n.toFixed(2))

export interface TurnRow {
  t: number
  ctx: number
  write: number
  hit: number
  fresh: number
  out: number
  c: number
  cum: number
}

export interface SimInputs {
  pfx: number
  uin: number
  ans: number
  /** already effort-scaled reasoning tokens */
  rsn: number
  tool: number
  turns: number
  cacheOn: boolean
  /** per-token rates ($/token), discount already applied */
  rIn: number
  rOut: number
  rW: number
  rH: number
}

export interface SimResult {
  rows: TurnRow[]
  cumSeries: number[]
  /** cumulative cost without caching */
  cumNoCache: number
  cumCached: number
  totW: number
  totH: number
  totF: number
  totO: number
  totTok: number
}

/** Same math as the original artifact, turn by turn. */
export function simulate(i: SimInputs): SimResult {
  const rows: TurnRow[] = []
  const cumSeries: number[] = []
  let cumC = 0
  let cumN = 0
  let cached = 0
  let totW = 0
  let totH = 0
  let totF = 0
  let totO = 0
  let totTok = 0
  for (let t = 1; t <= i.turns; t++) {
    const history = (t - 1) * (i.uin + i.tool + i.ans)
    const ctx = i.pfx + history + i.uin + i.tool
    const out = i.ans + i.rsn
    const noC = ctx * i.rIn + out * i.rOut
    let hit = 0
    let write = 0
    let fresh = ctx
    if (i.cacheOn) {
      hit = Math.min(cached, ctx)
      fresh = 0
      write = ctx - hit
      cached = ctx
    }
    const c = hit * i.rH + write * i.rW + fresh * i.rIn + out * i.rOut
    cumC += c
    cumN += noC
    totW += write * i.rW
    totH += hit * i.rH
    totF += fresh * i.rIn
    totO += out * i.rOut
    totTok += ctx + out
    rows.push({ t, ctx, write, hit, fresh, out, c, cum: cumC })
    cumSeries.push(cumC)
  }
  return { rows, cumSeries, cumNoCache: cumN, cumCached: cumC, totW, totH, totF, totO, totTok }
}

/** Comparison model cumulative-cost series (dashed line), same formula as the artifact. */
export function compareSeries(
  i: Pick<SimInputs, 'pfx' | 'uin' | 'ans' | 'rsn' | 'tool' | 'turns' | 'cacheOn'>,
  prices: Prices,
  disc: number,
): number[] {
  const [pIn, pOut, pW, pH] = prices
  const bIn = (pIn / 1e6) * disc
  const bOut = (pOut / 1e6) * disc
  const bW = (pW / 1e6) * disc
  const bH = (pH / 1e6) * disc
  const series: number[] = []
  let bc = 0
  for (let t = 1; t <= i.turns; t++) {
    const ctx = i.pfx + (t - 1) * (i.uin + i.tool + i.ans) + i.uin + i.tool
    const out = i.ans + i.rsn
    const c = i.cacheOn
      ? (t === 1 ? ctx * bW : (ctx - (i.uin + i.tool + i.ans)) * bH + (i.uin + i.tool + i.ans) * bW) + out * bOut
      : ctx * bIn + out * bOut
    bc += c
    series.push(bc)
  }
  return series
}
