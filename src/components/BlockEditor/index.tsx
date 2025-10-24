'use client'

import { useEffect, useMemo, useState } from 'react'
import { Doc as YDoc } from 'yjs'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { useSearchParams } from 'next/navigation'
import { BlockEditor } from './BlockEditor'
import { useCollabStore } from '@/stores/collab-stires'
interface AIEditorProps {
  id: string
  userInfo: {
    name?: string | null
    email?: string | null
    avator?: string | null
  }
}

export default function AIEditor({ id }: AIEditorProps) {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const { provider, setProvider, setYDoc } = useCollabStore()
  const hasCollab = parseInt(searchParams?.get('noCollab') ?? '0') !== 1

  // 创建 Yjs 文档
  const ydoc = useMemo(() => new YDoc(), [])

  // 初始化 HocuspocusProvider
  useEffect(() => {
    if (!hasCollab || !id) return

    const wsProvider = new HocuspocusProvider({
      url: 'ws://localhost:1234/collaboration',
      name: id,
      document: ydoc,
    })

    setProvider(wsProvider)
    setYDoc(ydoc)

    wsProvider.on('status', (event: { status: string }) => {
      if (event.status === 'connected') setLoading(false)
    })

    return () => wsProvider.destroy()
  }, [id, ydoc, hasCollab, setProvider, setYDoc])

  // 更丰富的 Loading UI
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
