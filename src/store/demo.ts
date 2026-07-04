import { create } from 'zustand'

interface DemoState {
  count: number
  increment: () => void
  reset: () => void
}

export const useDemoStore = create<DemoState>((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
  reset: () => set({ count: 0 }),
}))
