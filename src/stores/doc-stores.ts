import { UserInfo } from '@/types'
import { create } from 'zustand'

interface IDocsState {
  content: string
  setContent: (content: string) => void
  title: string
  setTitle: (title: string) => void
  userInfo: UserInfo
  setUserInfo: (userInfo: UserInfo) => void
}

export const useDocStore = create<IDocsState>((set) => ({
  content: '',
  title: '',
  userInfo: { id: '', name: '', email: '', avator: '' },
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  setUserInfo: (userInfo: UserInfo) => set({ userInfo }),
}))
