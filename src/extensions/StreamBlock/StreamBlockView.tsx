import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { AnswerComponent } from '@/components/AnswerComponent'
import { useEffect, useState, useRef } from 'react'
import { fetchEventSourceFish } from '@/lib/utils/FetchEventSourceAbi'
// import { EVENT_KEY_AI_EDIT } from '@/constants' // 在这里获取内容宽度，不要直接使用数字
// import emitter from '@/lib/emitter'
import md from '@/lib/utils/markDownUse'
export const StreamBlockView = ({
  editor,
  node,
  deleteNode,
  getPos,
  updateAttributes,
}: NodeViewProps) => {
  const [showAskData, setShowAskData] = useState('')
  const [loading, setLoading] = useState(false)
  const { problemData } = node.attrs
  const hasFetchRef = useRef(false)

  const getAskData = async () => {
    const messages = [{ role: 'user', content: problemData }]
    hasFetchRef.current = true
    console.log(1)

    // Fetch data only once
    if (hasFetchRef.current) {
      await fetchEventSourceFish('/api/chat/stream', {
        body: { messages },
        async onopen() {
          setLoading(true)
        },
        onmessage(msg: any) {
          const data = JSON.parse(msg.data)
          if (data.process === 'message') {
            setShowAskData((pre) => {
              const value = pre + data.content || ''
              return value
            })
          } else if (data.process === 'done') {
            editor.commands.insertContentAt(
              getPos() || 0,
              md.render(data.content || '')
            )
            deleteNode()
            setShowAskData(() => data.content || '')
            setAskData(data.content || '')
          }
        },
        onclose() {
          setLoading(false)
        },
        async onerror(e: any) {
          console.log(e)
          setLoading(false)
        },
      })
    }
  }

  const setAskData = (data: string) => {
    updateAttributes({ askData: data })
  }

  useEffect(() => {
    if (!hasFetchRef.current) {
      getAskData()
    }
  }, [])

  return (
    <NodeViewWrapper
      key={`StreamBlockView${node.attrs.customnodeid}`}
      className="my-3"
      draggable
      id="StreamBlockView"
    >
      <AnswerComponent
        askData={showAskData}
        loading={loading}
        style={{ color: '#919191' }}
      />
    </NodeViewWrapper>
  )
}
