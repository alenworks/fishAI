'use client'

import { useEffect, useState } from 'react'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { useYjsAwareness } from '@/hooks/useYjsAwareness'
import { UserInfo } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface DocUpdateStatusProps {
  provider?: HocuspocusProvider | null
  userInfo: UserInfo // 当前用户信息
}

function UserAvatar({ user }: { user: any }) {
  console.log(user)
  let { name } = user || {}
  const { avator, email } = user
  if (!name) name = email
  return (
    <Avatar className="h-7 w-7 border">
      <AvatarImage src={avator || ''} alt={name || ''} />
      <AvatarFallback>{name?.slice(0, 1)}</AvatarFallback>
    </Avatar>
  )
}

export function DocUpdateStatus({ provider, userInfo }: DocUpdateStatusProps) {
  const [connected, setConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<UserInfo[]>([])

  // 监听 Hocuspocus 连接状态
  useEffect(() => {
    if (!provider) return
    const handleStatus = (event: { status: string }) =>
      setConnected(event.status === 'connected')
    provider.on('status', handleStatus)
    return () => {
      provider.off('status', handleStatus)
    }
  }, [provider])

  // 设置本地用户信息到 awareness
  const awareness = useYjsAwareness(provider?.document)
  useEffect(() => {
    if (!awareness || !userInfo) return
    awareness.setLocalStateField('user', userInfo)
  }, [awareness, userInfo])

  // 监听在线用户变化
  useEffect(() => {
    if (!awareness) return
    const updateUsers = () => {
      const states = Array.from(awareness.getStates().values())
      const users = states.map((s: any) => s.user).filter(Boolean) as UserInfo[]

      // 确保当前用户显示在列表里
      const allUsers = users.some((u) => u.id === userInfo.id)
        ? users
        : [userInfo, ...users]

      setOnlineUsers(allUsers)
    }

    awareness.on('change', updateUsers)
    updateUsers()
    return () => {
      awareness.off('change', updateUsers)
    }
  }, [awareness, userInfo])
  console.log(onlineUsers)
  return (
    <div className="flex items-center justify-between w-full h-12 px-4 bg-gray-50 border-b border-gray-200 shadow-sm text-sm gap-1">
      <div className="flex items-center gap-1">
        {/* 闪烁状态点 */}
        <span
          className={`relative flex h-2 w-2 ${
            connected ? 'bg-green-500' : 'bg-gray-400'
          } rounded-full`}
        >
          {connected && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          )}
        </span>
        {/* 状态文字 */}
        <span className="text-sm text-gray-700">
          {connected ? '已连接' : '未连接'}
        </span>
      </div>

      {/* 在线用户 */}
      <div className="flex items-center gap-2">
        {onlineUsers.map((u) => (
          <div key={u.id} className="flex items-center gap-1">
            <UserAvatar user={u} />
          </div>
        ))}
        {onlineUsers.length > 0 && (
          <span className="text-gray-400 text-xs">
            {onlineUsers.length} 人在线
          </span>
        )}
      </div>
    </div>
  )
}
