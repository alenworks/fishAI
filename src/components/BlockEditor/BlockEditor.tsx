'use client'

import { EditorContent } from '@tiptap/react'
import React, { useRef, useState } from 'react'
import { Sidebar, useSidebar } from '@/components/RightSidebar'
import { PanelRightClose } from 'lucide-react'
import * as Y from 'yjs'
import { HocuspocusProvider } from '@hocuspocus/provider' // ✅ 使用你自己的 provider
import '@/styles/index.css'
import { ColumnsMenu } from '@/extensions/MultiColumn/menus'
import {
  TableColumnMenu,
  TableRowMenu,
  TableMenu,
  TableCellMenu,
} from '@/extensions/Table/menus'
import { TextMenu } from '../menus/TextMenu'
import { ContentItemMenu } from '../menus/ContentItemMenu'
import { LinkMenu } from '@/components/menus'
import AIIsland from '@/components/AIIsland/ai-island'
import { useBlockEditor } from '@/hooks/useBlockEditor'

// 表格内容类型
interface TableContent {
  id: string
}

export const BlockEditor = ({
  ydoc,
  provider,
  hasCollab,
}: {
  hasCollab: boolean
  ydoc: Y.Doc
  provider?: HocuspocusProvider | null
}) => {
  const [tableContent, setTableContent] = useState<TableContent[]>([])
  const menuContainerRef = useRef(null)

  // ✅ useBlockEditor 支持协同
  const { editor, users } = useBlockEditor({
    ydoc,
    provider,
    hasCollab,
    onTableContentUpdate: (items: TableContent[]) => setTableContent(items),
  })

  const rightSidebar = useSidebar()

  if (!editor || !users) {
    return <div>Loading collaborative editor...</div>
  }

  return (
    <div ref={menuContainerRef} className="flex w-full h-full">
      <div className="relative flex-1">
        <EditorContent
          id="editorContent"
          editor={editor}
          className="h-full overflow-y-auto pb-3"
        />
        <AIIsland editor={editor} />
      </div>
      <PanelRightClose onClick={rightSidebar.toggle} />
      <div className="max-h-full">
        <Sidebar
          isOpen={rightSidebar.isOpen}
          onClose={rightSidebar.close}
          editor={editor}
          items={tableContent}
        />
      </div>

      {/* 菜单组件 */}
      <ContentItemMenu editor={editor} />
      <LinkMenu editor={editor} appendTo={menuContainerRef} />
      <TextMenu editor={editor} />
      <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
      <TableMenu editor={editor} appendTo={menuContainerRef} />
      <TableCellMenu editor={editor} appendTo={menuContainerRef} />
      <TableRowMenu editor={editor} appendTo={menuContainerRef} />
      <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
    </div>
  )
}

export default BlockEditor
