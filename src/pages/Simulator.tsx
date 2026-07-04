import ConversationPanel from '../components/ConversationPanel'
import CostBreakdown from '../components/CostBreakdown'
import FocusTurn from '../components/FocusTurn'
import Kpis from '../components/Kpis'
import Ledger from '../components/Ledger'
import PresetPicker from '../components/PresetPicker'
import PricingPanel from '../components/PricingPanel'
import TrajectoryChart from '../components/TrajectoryChart'

export default function Simulator() {
  return (
    <div className="mx-auto max-w-[980px] px-4 py-8">
      <h1 className="mb-1 text-[26px] font-semibold tracking-[-0.3px]">
        LLM token &amp; cost simulator
        <span className="ml-2.5 inline-block rounded-xl border border-[var(--line)] bg-[var(--card)] px-2.5 py-0.5 align-middle font-[family-name:var(--mono)] text-xs font-semibold tracking-[0.05em] text-[var(--mut)]">
          v1.1
        </span>
      </h1>
      <p className="mb-6 text-sm text-[var(--mut)]">
        Simulates a real multi-turn conversation: history accumulates, the prefix gets cached, output tokens (reasoning
        + answer) dominate the bill. All prices are editable — defaults are illustrative per-million-token rates.
      </p>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[340px_1fr]">
        <div>
          <PresetPicker />
          <PricingPanel />
          <ConversationPanel />
        </div>
        <div>
          <TrajectoryChart />
          <Kpis />
          <CostBreakdown />
          <FocusTurn />
          <Ledger />
        </div>
      </div>
      <p className="mt-2.5 text-xs text-[var(--mut)]">
        Model of a real conversation: turn n's input = stable prefix + all previous turns' (user input + tool results +
        answer) + this turn's user input. Reasoning tokens are billed as output but not fed back into history (typical
        for API reasoning models). Cache assumed warm across the whole session (each turn refreshes the TTL). Prices are
        defaults — edit them to match the actual model and date.
      </p>
    </div>
  )
}
