import { EditorContent } from '@tiptap/react'
import React, { useRef, useState } from 'react'
import { Sidebar, useSidebar } from '@/components/RightSidebar'
import { PanelRightClose } from 'lucide-react'
import { useBlockEditor } from '@/hooks/useBlockEditor'
import * as Y from 'yjs'
import { TiptapCollabProvider } from '@hocuspocus/provider'
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
// import debounce from 'lodash.debounce'
// import { updateDoc } from '@/app/write/[id]/action'

// const saveContent = debounce((uid: string, content: string) => {
//   updateDoc(uid, { content })
// }, 1000)
interface TableContent {
  id: string
}

export const BlockEditor = ({
  aiToken,
  ydoc,
  provider,
  content,
  handleUpdate,
}: {
  aiToken?: string
  hasCollab: boolean
  ydoc: Y.Doc
  provider?: TiptapCollabProvider | null | undefined
  content: string
  handleUpdate: (content: string) => void
}) => {
  const [tableContent, setTableContent] = useState<TableContent[]>([])
  const menuContainerRef = useRef(null)
  // 获取编辑器和用户列表
  const { editor, users } = useBlockEditor({
    aiToken,
    ydoc,
    provider,
    onTableContentUpdate: (items: TableContent[]) => setTableContent(items),
    handleUpdate,
    content,
  })
  const rightSidebar = useSidebar()

  if (!editor || !users) {
    return <div>Loading...</div>
  }

  return (
    <div ref={menuContainerRef} className="flex w-full h-full">
      <div className="relative flex-1">
        <EditorContent
          id="editorContent"
          editor={editor}
          className="h-[calc(100vh-90px)] overflow-y-auto"
        />
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
