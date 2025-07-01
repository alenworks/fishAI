import { cn } from '@/lib/utils'
import { Node } from '@tiptap/pm/model'
import { Editor, NodeViewWrapper } from '@tiptap/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { CONTENT_WIDTH } from '@/lib/constants'
// import Image from 'next/image'

interface ImageBlockViewProps {
  editor: Editor
  getPos: () => number
  node: Node
  updateAttributes: (attrs: Record<string, string>) => void
}

export const ImageBlockView = (props: ImageBlockViewProps) => {
  const { editor, getPos, node } = props as ImageBlockViewProps & {
    node: Node & {
      attrs: {
        src: string
        ratio: number
      }
    }
  }
  const imgContainerRef = useRef<HTMLDivElement>(null)
  const { src } = node.attrs
  // 增加 ali-oss 图片裁剪参数
  const srcUrlObj = new URL(src)
  srcUrlObj.searchParams.set(
    'x-oss-process',
    `image/resize,w_${CONTENT_WIDTH},m_lfit`
  )
  srcUrlObj.searchParams.set('x-oss-process', 'image/resize,w_800,m_lfit') // w_800 表示宽度 800px，m_lfit 表示等比缩放
  const resizedSrc = srcUrlObj.href
  const wrapperClassName = cn(
    node.attrs.align === 'left' ? 'ml-0' : 'ml-auto',
    node.attrs.align === 'right' ? 'mr-0' : 'mr-auto',
    node.attrs.align === 'center' && 'mx-auto',
    'bg-muted'
  )

  const onClick = useCallback(() => {
    editor.commands.setNodeSelection(getPos())
  }, [getPos, editor.commands])

  const onDoubleClick = useCallback(() => {
    window.open(src, '_blank')
  }, [src])

  const [height, setHeight] = useState('auto')
  useEffect(() => {
    if (isNaN(node.attrs.ratio)) return
    if (!node.attrs.ratio) return
    let w = imgContainerRef.current!.clientWidth
    if (!w) {
      w = CONTENT_WIDTH * (parseInt(node.attrs.width) / 100) // 如 node.attrs.width 是 50%
    }
    setHeight(`${w / node.attrs.ratio}px`) // 根据宽高比例计算高度
  }, [setHeight, node.attrs.width, node.attrs.ratio])
  return (
    <NodeViewWrapper>
      <div
        ref={imgContainerRef}
        className={wrapperClassName}
        style={{ width: node.attrs.width, height }}
      >
        {/* eslint-disable-next-line  */}
        <img
          className="block"
          src={resizedSrc}
          alt=""
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          style={{ height: '100%' }}
        />
      </div>
    </NodeViewWrapper>
  )
}

export default ImageBlockView
