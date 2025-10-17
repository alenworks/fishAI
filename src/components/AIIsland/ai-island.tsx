'use client'

import { useState } from 'react'
import { Sparkles, CornerDownLeft, MoveUpRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Editor } from '@tiptap/react'
import { useAiIslandState } from './useAiIslandState'
import { useDocStore } from '@/stores/doc-stores'
export default function AIIsland({ editor }: { editor: Editor }) {
  const [instruction, setInstruction] = useState('')
  const { isVisible } = useAiIslandState(editor)
  const { title } = useDocStore()
  function handleClick() {
    handleSendMessage([{ role: 'user', content: instruction }])
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 检测是否按下 Enter 键，且没有同时按下 Shift（避免换行）
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault() // 阻止默认换行行为
      handleSendMessage([{ role: 'user', content: instruction }])
    }
  }

  const handleSendMessage = (
    messages: { role: 'user' | 'system' | 'assistant'; content: string }[]
  ) => {
    const basemessages: {
      role: 'user' | 'system' | 'assistant'
      content: string
    }[] = [
      { role: 'system', content: `你正在写一篇文章，文章的标题是${title}。` },
    ]
    messages = basemessages.concat(messages)
    const { selection } = editor.state
    const { to } = selection
    console.log(messages)
    editor.commands.setStreamBlock({
      messages,
      parentEndPos: to,
    })
    setInstruction('')
  }

  return (
    <div
      className={`
      absolute bottom-6 left-1/2
      transform -translate-x-1/2
      flex items-center justify-start
      bg-background
      w-[95vw] max-w-[800px]
      sm:w-[800px]
      px-2
      sm:px-0
      `}
    >
      {isVisible && (
        <div className="flex flex-col w-full">
          <div className="ml-2 sm:ml-4 opacity-50 flex flex-wrap gap-1 sm:gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                const { state } = editor
                const { from } = state.selection
                const docText = state.doc.textBetween(0, from, '\n')
                const limitedText =
                  docText.length > 500 ? docText.slice(-500) : docText
                handleSendMessage([
                  { role: 'user', content: `文章已有哪些内容？` },
                  { role: 'assistant', content: limitedText },
                  {
                    role: 'user',
                    content: `请根据以上内容，续写接下来的内容。200字以内`,
                  },
                ])
              }}
              className="p-2 hover:bg-inherit hover:text-muted-foreground"
            >
              续写
              <MoveUpRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                handleSendMessage([
                  {
                    role: 'user',
                    content: `根据文章标题，头脑风暴，给出一点想法`,
                  },
                ])
              }}
              className="p-2 hover:bg-inherit hover:text-muted-foreground"
            >
              头脑风暴
              <MoveUpRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                handleSendMessage([
                  { role: 'user', content: `根据文章标题，写一个大纲` },
                ])
              }}
              className="p-2 hover:bg-inherit hover:text-muted-foreground"
            >
              写大纲
              <MoveUpRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                const { state } = editor
                const { doc } = state

                // 获取所有 <h> 标签内容
                const headings: string[] = []
                doc.descendants((node) => {
                  if (node.type.name === 'heading') {
                    headings.push(node.textContent)
                  }
                })

                // 获取前 300 字内容
                const docText = doc.textBetween(0, doc.content.size, '\n')
                const startText = docText.slice(0, 100)

                // 获取结尾 200 字内容
                const endText =
                  docText.length > 100 ? docText.slice(-100) : docText

                handleSendMessage([
                  { role: 'user', content: `文章的标题目录是什么` },
                  {
                    role: 'assistant',
                    content: headings.length
                      ? headings
                          .map((h) => {
                            // 判断标题级别，假设格式为 "h1 标题内容" 或 "h2 标题内容"
                            const match = h.match(/^h(\d)\s+(.*)$/)
                            if (match) {
                              const level = Number(match[1])
                              const text = match[2]
                              // 限制级别在 1-6
                              const hashes = '#'.repeat(Math.min(level, 6))
                              return `${hashes} ${text}`
                            }
                            // 默认 h3
                            return `### ${h}`
                          })
                          .join('\n')
                      : '无',
                  },
                  { role: 'user', content: `文章的开始100内容是什么` },
                  { role: 'assistant', content: startText },
                  { role: 'user', content: `文章的结束100内容是什么` },
                  { role: 'assistant', content: endText },
                  { role: 'user', content: `根据文章的标题和内容，写出总结` },
                ])
              }}
              className="p-2 hover:bg-inherit hover:text-muted-foreground"
            >
              总结
              <MoveUpRight className="h-4 w-4" />
            </Button>
            {/* <Button
              variant="ghost"
              className="p-2 hover:bg-inherit hover:text-muted-foreground"
            >
              更多...
            </Button> */}
          </div>
          <div className="flex-auto flex items-center justify-start rounded-2xl p-2 pl-2 sm:pl-4 border shadow w-full">
            <Sparkles size={24} />
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
          <span className="text-xs text-zinc-700 text-center">{`内容为AI生成请谨慎甄别`}</span>
        </div>
      )}
    </div>
  )
}
