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
import AIIsland from '@/components/ai-island'
// import emitter from '@/lib/emitter'
// import { EVENT_KEY_AI_EDIT } from '@/constants'
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

  // 监听 AI island 事件
  // useEffect(() => {
  //   function handler(payload: any) {
  //     if (editor == null) return
  //     const { content = '', pos = 0 } = payload || {}
  //     if (!content) return

  //     editor.commands.insertContentAt(pos,content)
  //   }
  //   emitter.on(EVENT_KEY_AI_EDIT, handler)
  //   return () => emitter.off(EVENT_KEY_AI_EDIT, handler) // 及时清除自定义事件
  // }, [editor])

  if (!editor || !users) {
    return <div>Loading...</div>
  }

  return (
    <div ref={menuContainerRef} className="flex w-full h-full">
      <div className="relative flex-1">
        <EditorContent
          id="editorContent"
          editor={editor}
          className="h-[calc(100vh-110px)] overflow-y-auto pb-3"
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
