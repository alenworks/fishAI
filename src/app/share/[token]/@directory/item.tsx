'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { FileText, Ellipsis, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { del } from './action'
import scrollIntoView from 'scroll-into-view-if-needed'
import { ShareButton } from '@/components/ShareButton'

// 临时缓存修改过的标题
const changedTitleObj: Record<string, string> = {}

function getTitle(id: string, curTitle: string) {
  return changedTitleObj[id] || curTitle || '<无标题>'
}

interface IProps {
  id: string
  title: string
  paramId: string
}

export default function Item({ id, title, paramId }: IProps) {
  const isCurrent = id === paramId
  const titleContainerRef = useRef<HTMLDivElement>(null)

  // 滚动到当前选中项
  useEffect(() => {
    if (!isCurrent || !titleContainerRef.current) return
    scrollIntoView(titleContainerRef.current, {
      scrollMode: 'if-needed',
      behavior: 'smooth',
      block: 'center',
    })
  }, [isCurrent])

  return (
    <div
      ref={titleContainerRef}
      className={cn(
        'flex justify-between items-center w-full hover:text-secondary-foreground group',
        isCurrent ? 'bg-card' : 'hover:bg-card'
      )}
    >
      {/* 文档标题 */}
      <Link
        href={`/write/${id}`}
        className="flex-auto overflow-hidden p-1.5 flex items-center"
      >
        <div className="w-4 mr-1">
          <FileText className="h-4 w-4" />
        </div>
        <span className="truncate flex-auto">{getTitle(id, title)}</span>
      </Link>

      {/* 操作菜单 */}
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
            <DropdownMenuItem>
              <ShareButton docId={id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
