'use client'

import { useEffect, useMemo, useState } from 'react'
import * as Y from 'yjs'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { useSearchParams } from 'next/navigation'
import { BlockEditor } from './BlockEditor'
import { useCollabStore } from '@/stores/collab-stires'

interface AIEditorProps {
  id: string
  userInfo: {
    name?: string | null
    email?: string | null
    avatar?: string | null
  }
}

export default function AIEditor({ id, userInfo }: AIEditorProps) {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const { provider, setProvider, setYDoc } = useCollabStore()
  const hasCollab = parseInt(searchParams?.get('noCollab') ?? '0') !== 1

  // 创建 Yjs 文档，只初始化一次
  const ydoc = useMemo(() => new Y.Doc(), [])

  // 随机颜色生成函数
  const randomColor = () => {
    const colors = ['#FF8A80', '#80D8FF', '#A7FFEB', '#FFD180', '#EA80FC']
    return colors[Math.floor(Math.random() * colors.length)]
  }
  // 初始化 Hocuspocus 协同编辑
  useEffect(() => {
    if (!hasCollab || !id) return

    const wsProvider = new HocuspocusProvider({
      url: `${process.env.NEXT_PUBLIC_HOCUSPOCUS_BASE_URL || 'ws://localhost:1234'}/collaboration`,
      name: id,
      document: ydoc,
    })

    setProvider(wsProvider)
    setYDoc(ydoc)

    // 连接状态监听
    wsProvider.on('status', (event: { status: string }) => {
      if (event.status === 'connected') setLoading(false)
    })

    // ⚡ 设置光标信息
    if (userInfo) {
      wsProvider?.awareness?.setLocalStateField('user', {
        name: userInfo.name || userInfo.email || '匿名用户',
        color: randomColor(),
        avatar: userInfo.avatar || null,
      })
    }

    return () => {
      wsProvider.destroy()
    }
  }, [id, ydoc, hasCollab, setProvider, setYDoc, userInfo])

  // Loading 状态骨架 UI
  if (hasCollab && loading) {
    return (
      <div className="flex flex-col h-full w-full p-4 gap-4 animate-pulse">
        <div className="h-12 bg-gray-200 rounded-md w-1/2" /> {/* 标题骨架 */}
        <div className="flex-1 bg-gray-100 rounded-md" /> {/* 编辑区域骨架 */}
        <div className="h-6 bg-gray-200 rounded-md w-1/4" />{' '}
        {/* 状态/工具栏骨架 */}
      </div>
    )
  }

  return <BlockEditor hasCollab={hasCollab} ydoc={ydoc} provider={provider} />
}
