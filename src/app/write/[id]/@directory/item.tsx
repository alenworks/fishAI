'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  FileText,
  Ellipsis,
  Trash2,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { del } from './action'
import emitter from '@/lib/emitter'
import scrollIntoView from 'scroll-into-view-if-needed'

// 存储修改过的标题的
const changedTitleObj: { [key: string]: string } = {} // { id, changedTitle }
// 获取标题
function getTitle(id: string, curTitle: string) {
  let res = '<无标题>'
  if (curTitle) res = curTitle
  const changedTitle = changedTitleObj[id]
  if (changedTitle) res = changedTitle // 如果有 changedTitle ，则用这个
  return res
}
interface IProps {
  id: string
  title: string
  paramId: string
  list: Array<{ id: string; title: string; parentId: string | null }>
}
export default function Item(props: IProps) {
  const { id, title, list = [], paramId } = props
  const isCurrent = id === paramId
  const titleSpanRef = useRef<HTMLSpanElement>(null)
  const titleContainerRef = useRef<HTMLDivElement>(null)
  const children = list.filter((i) => i.parentId === id)
  const hasChildren = children.length > 0
  const [showChildren, setShowChildren] = useState(true)
  function toggleShowChildren(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
    setShowChildren(!showChildren)
  }
  useEffect(() => {
    // 修改标题时触发事件
    const eventKey = `CHANGE_DOC_TITLE_${id}`
    emitter.on(eventKey, (payload) => {
      const newTitle = payload as string
      changedTitleObj[id] = newTitle // 记录下
      if (titleSpanRef.current) {
        titleSpanRef.current!.textContent = newTitle // 修改 DOM
      }
    })
  }, [id])

  // 滚动到当前标题
  useEffect(() => {
    if (!isCurrent) return
    if (titleContainerRef.current == null) return
    scrollIntoView(titleContainerRef.current!, {
      scrollMode: 'if-needed',
      behavior: 'smooth',
      block: 'center',
    })
  }, [isCurrent])

  return (
    <div>
      <div
        ref={titleContainerRef}
        className={cn(
          'flex justify-between items-center w-full hover:text-secondary-foreground group',
          isCurrent ? 'bg-card' : 'hover:bg-card'
        )}
      >
        {/* icon 显示/隐藏 children */}
        {hasChildren && (
          <div className="w-4 pl-1 cursor-pointer" onClick={toggleShowChildren}>
            {showChildren && <ChevronDown className="h-4 w-4" />}
            {!showChildren && <ChevronRight className="h-4 w-4" />}
          </div>
        )}

        {/* 标题链接 */}
        <Link
          href={`/write/${id}`}
          className="flex-auto overflow-hidden p-1.5 flex items-center"
        >
          {!hasChildren && (
            <div className="w-4 mr-1">
              <FileText className="h-4 w-4" />
            </div>
          )}
          <span ref={titleSpanRef} className="truncate flex-auto">
            {getTitle(id, title)}
          </span>
        </Link>
        {/* 操作按钮 */}
        <div className="inline-flex items-center invisible group-hover:visible ml-1 w-6 pr-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Ellipsis className="h-4 w-4 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => del(id)}
              >
                <Trash2 className="h-4 w-4" />
                &nbsp;删除
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>其他操作</DropdownMenuItem>
              <DropdownMenuItem>其他操作</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* children */}
      {hasChildren && showChildren && (
        <div className="ml-3">
          {children.map((doc) => {
            const { id, title } = doc
            return (
              <Item
                key={id}
                id={id}
                title={title}
                paramId={paramId}
                list={list}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
