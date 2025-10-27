'use client'

import { Input } from '@/components/ui/input'
import TiptapEditor from '@/components/BlockEditor'
import { useDocStore } from '@/stores/doc-stores'
import { useEffect } from 'react'
import { useCollabStore } from '@/stores/collab-stires'

export default function Content(props: {
  id: string
  initialDoc: {
    initTitle: string
    userInfo: {
      id: string
      name?: string | null
      email?: string | null
      avator?: string | null
    }
  }
}) {
  const { id, initialDoc } = props
  const { setUserInfo, title, setTitle } = useDocStore()
  const { ydoc } = useCollabStore()
  const yTitle = ydoc?.getText('title')
  // 初始化用户信息
  useEffect(() => {
    setUserInfo(initialDoc.userInfo)
  }, [initialDoc, setUserInfo])

  // 监听 Yjs 标题变化（协同同步）
  useEffect(() => {
    if (!yTitle) return

    // 初始化时，若 doc 有内容，用它覆盖 state
    if (yTitle.toString() && yTitle.toString() !== title) {
      setTitle(yTitle.toString())
    }

    // 当协作者修改时触发
    const observer = () => {
      setTitle(yTitle.toString())
    }
    yTitle.observe(observer)

    return () => {
      yTitle.unobserve(observer)
    }
  }, [yTitle])

  // 本地修改时 -> 更新 Yjs
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newTitle = e.target.value
    setTitle(newTitle)

    if (yTitle) {
      yTitle.delete(0, yTitle.length)
      yTitle.insert(0, newTitle)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Input
          placeholder="请输入标题..."
          value={title}
          onChange={handleChange}
          className="border-none text-4xl font-bold focus-visible:ring-transparent md:text-4xl"
        />
      </div>
      <div className="flex-1 min-h-0">
        <TiptapEditor id={id} userInfo={initialDoc.userInfo} />
      </div>
    </div>
  )
}
