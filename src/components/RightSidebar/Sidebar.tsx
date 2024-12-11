import { cn } from '@/lib/utils'
import { Editor } from '@tiptap/react'
import { memo, useCallback } from 'react'
import { TableOfContents } from '../TableOfContent'

export const Sidebar = memo(
  ({
    editor,
    isOpen,
    onClose,
    items,
  }: {
    editor: Editor
    isOpen?: boolean
    onClose: () => void
    items: any[]
  }) => {
    const handlePotentialClose = useCallback(() => {
      if (window.innerWidth < 1024) {
        onClose()
      }
    }, [onClose])

    const windowClassName = cn(
      'absolute top-0 left-0 bg-white lg:bg-white/30 lg:backdrop-blur-xl h-full lg:h-auto lg:relative w-0 duration-300 transition-all',
      'dark:bg-black lg:dark:bg-black/30',
      !isOpen && 'border-r-transparent',
      isOpen && 'w-80 border-r border-r-neutral-200 dark:border-r-neutral-800'
    )

    return (
      <div className={windowClassName}>
        <div className="mb-2 text-1xl p-3 font-semibold uppercase text-neutral-500 dark:text-neutral-400">
          目录
        </div>
        <div className="w-full overflow-x-hidden flex-1 ">
          <div className="w-full h-full p-3 pt-0 overflow-y-auto overflow-x-hidden">
            <TableOfContents
              content={items}
              onItemClick={handlePotentialClose}
              editor={editor}
            />
          </div>
        </div>
      </div>
    )
  }
)

Sidebar.displayName = 'TableOfContentSidepanel'
