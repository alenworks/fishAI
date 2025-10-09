import { create } from 'zustand'

interface IDocsState {
  content: string
  setContent: (content: string) => void
  title: string
  setTitle: (title: string) => void
}

export const useDocStore = create<IDocsState>((set) => ({
  content: '',
  title: '',
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
}))
