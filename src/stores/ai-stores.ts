import { create } from 'zustand'

interface AiState {
  token: { totalTokens: number; tokenlimit: number }
  setToken: (token: { totalTokens: number; tokenlimit: number }) => void
}

export const useAiStore = create<AiState>((set) => ({
  token: { totalTokens: 0, tokenlimit: 0 },
  setToken: (token: { totalTokens: number; tokenlimit: number }) =>
    set({ token }),
}))
