'use client'

import { useState } from 'react'
import { Sparkles, CornerDownLeft, MoveUpRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Editor } from '@tiptap/react'

export default function AIIsland({ editor }: { editor: Editor }) {
  const [instruction, setInstruction] = useState('')

  function handleClick() {
    handleSendMessage()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 检测是否按下 Enter 键，且没有同时按下 Shift（避免换行）
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault() // 阻止默认换行行为
      handleSendMessage()
    }
  }

  const handleSendMessage = () => {
    const { selection } = editor.state
    const { to } = selection // $from 表示选区的起始位置
    editor.commands.setStreamBlock({
      problemData: instruction,
      parentEndPos: to,
    })
    setInstruction('')
  }

  return (
    <div
      className={`
      absolute bottom-6 left-1/2
      transform -translate-x-1/2
      rounded-2xl p-2 pl-4 border shadow bg-background
      flex items-center justify-start
      `}
    >
      <Sparkles size={24} />
      <div className="flex-auto flex items-center justify-start">
        <Input
          placeholder="请输入 AI 指令，如：根据标题写大纲"
          value={instruction}
          onKeyDown={handleKeyDown}
          onChange={(e) => setInstruction(e.target.value)}
          className="text-base bg-inherit border-none focus-visible:ring-offset-0 focus-visible:ring-0"
        />
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-inherit hover:text-muted-foreground"
          onClick={handleClick}
          disabled={!instruction}
        >
          <CornerDownLeft size={24} />
        </Button>
      </div>
      <div className="ml-4 opacity-50">
        <Button
          variant="ghost"
          className="p-2 hover:bg-inherit hover:text-muted-foreground"
        >
          续写
          <MoveUpRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="p-2 hover:bg-inherit hover:text-muted-foreground"
        >
          头脑风暴
          <MoveUpRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="p-2 hover:bg-inherit hover:text-muted-foreground"
        >
          总结
          <MoveUpRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="p-2 hover:bg-inherit hover:text-muted-foreground"
        >
          更多...
        </Button>
      </div>
    </div>
  )
}
