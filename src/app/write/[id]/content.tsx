'use client'
import AIEditor from '@/components/BlockEditor'
import { useState } from 'react'
import debounce from 'lodash.debounce'
import { updateDoc } from './action'
const saveContent = debounce((id: string, content: string) => {
  updateDoc(id, { content })
}, 5000)
export default function Content(props: { id: string; content: string }) {
  const { id } = props
  const [content, setContent] = useState(props.content || '')
  function handleUpdate(content: string) {
    setContent(content)
    saveContent(props.id, content)
  }
  return <AIEditor id={id} rawContent={content} handleUpdate={handleUpdate} />
}
