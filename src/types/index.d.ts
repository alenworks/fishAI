export interface User {
  id: string
  name?: string | null | undefined
  email?: string | null | undefined
  image?: string | null | undefined
}

export interface Doc {
  id: string
  title: string
  content: string
  parentId?: string | null
  userId: string
  createdAt: Date
  updatedAt: Date
  user?: User
}

export interface TokenUsage {
  userId: string
  model: string
  totalTokens: number
  tokenlimit: number
  createdAt: Date
  updatedAt: Date
}

export interface UserInfo {
  name?: string | null | undefined
  email?: string | null | undefined
  avator?: string | null | undefined
  id: string
}
