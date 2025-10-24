import { create } from 'zustand'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { Doc as YDoc } from 'yjs'

interface CollaborationState {
  ydoc: YDoc | null
  provider: HocuspocusProvider | null
  setYDoc: (ydoc: YDoc) => void
  setProvider: (provider: HocuspocusProvider) => void
}

export const useCollabStore = create<CollaborationState>((set) => ({
  ydoc: null,
  provider: null,
  setYDoc: (ydoc) => set({ ydoc }),
  setProvider: (provider) => set({ provider }),
}))
