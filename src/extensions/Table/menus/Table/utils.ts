import { EditorState } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'
import { Editor } from '@tiptap/react'

import { Table } from '../../index'
import { isTableSelected } from '../../utils'

export const isAllTableSelected = ({
  editor,
  view,
  state,
  from,
}: {
  editor: Editor
  view: EditorView
  state: EditorState
  from: number
}) => {
  const domAtPos = view?.domAtPos(from)?.node as HTMLElement
  const nodeDOM = view?.nodeDOM(from) as HTMLElement
  const node = nodeDOM || domAtPos
  if (!editor.isActive(Table.name) || !node) {
    return false
  }

  return isTableSelected(state.selection)
}

export default isAllTableSelected
