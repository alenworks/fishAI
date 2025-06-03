'use client'
import { Textarea } from '@/components/ui/Textarea'
import { useState } from 'react'
import debounce from 'lodash.debounce'
import { updateDoc } from './action'
const saveContent = debounce((id: string, content: string) => {
  updateDoc(id, { content })
}, 1000)
export default function Content(props: { id: string; content: string }) {
  const [content, setContent] = useState(props.content || '')
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newContent = e.target.value
    setContent(newContent)
    saveContent(props.id, newContent)
  }
  return (
    <div>
      <Textarea
        placeholder="请输入标题..."
        value={content}
        onChange={handleChange}
        className="border-none p-0 text-base focus-visible:ring-transparent"
      />
    </div>
  )
}
