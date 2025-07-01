'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import TiptapEditor from '@/components/BlockEditor'
import { getDoc, updateContent, updateTitle } from './action'
import emitter from '@/lib/emitter'

export default function Content(props: { id: string }) {
  const { id } = props

  // loading
  const [loading, setLoading] = useState(true)

  // 找不到文章
  const [notFound, setNotFound] = useState(false)
  // 标题
  const [title, setTitle] = useState('')
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newTitle = e.target.value
    setTitle(newTitle)
    updateTitle(id, newTitle)

    // 触发事件，以更新左侧列表的文章标题
    const key = `CHANGE_DOC_TITLE_${id}`
    emitter.emit(key, newTitle)
  }

  // 编辑器内容
  const [editorContent, SetEditorContent] = useState('')
  function handleUpdate(content: string) {
    updateContent(id, content)
  }

  // 获取文章内容
  useEffect(() => {
    setLoading(true)
    getDoc(id).then((data: any) => {
      // 通过 id 找不到 doc
      if (data == null) {
        setNotFound(true)
        return
      }
      setTitle(data.title)
      SetEditorContent(data.content)
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-12 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>找不到文档...</p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 pb-4 px-6 border-b">
        <Input
          placeholder="请输入标题..."
          value={title}
          onChange={handleChange}
          className="border-none p-0 text-4xl font-bold focus-visible:ring-transparent"
        />
        {/* 可能还会再增加其他功能，例如设置 Icon 、背景等 */}
      </div>
      <TiptapEditor
        id={id}
        rawContent={editorContent}
        handleUpdate={handleUpdate}
      />
    </>
  )
}
