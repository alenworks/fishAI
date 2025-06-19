import { create } from 'zustand'

interface IDocsState {
  content: string
  setContent: (content: string) => void
}

export const useBearStore = create<IDocsState>((set) => ({
  content: '',
  setContent: (content) => set({ content }),
}))
