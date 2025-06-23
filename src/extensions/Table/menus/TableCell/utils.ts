import { EditorState } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'
import { Editor } from '@tiptap/react'

import { Table } from '../../index'
import { isCellSelection, isTableSelected } from '../../utils'

export const isCellSelected = ({
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
  if (
    !editor.isActive(Table.name) ||
    !node ||
    isTableSelected(state.selection)
  ) {
    return false
  }

  return isCellSelection(state.selection)
}

export default isCellSelected

export const canMergeOrSplit = ({ editor }: { editor: Editor }) => {
  const { state } = editor
  const { selection } = state

  // 获取当前选区
  const { $from, $to } = selection

  // 检查是否选中了表格单元格
  if (
    $from.node().type.name === 'tableCell' &&
    $to.node().type.name === 'tableCell'
  ) {
    const selectedCells: any[] = []

    // 如果选中的单元格为连续单元格
    state.doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
      if (node.type.name === 'tableCell') {
        selectedCells.push({ node, pos })
      }
    })

    if (selectedCells.length > 1) {
      // 选中了多个单元格，可以进行合并
      return 'merge'
    } else {
      // 只有一个单元格，可以进行拆分（如果已合并）
      const currentCell = selectedCells[0].node
      if (currentCell.attrs.colspan > 1 || currentCell.attrs.rowspan > 1) {
        return 'split'
      } else {
        return false
      }
    }
  } else {
    console.log('当前选择不是表格单元格')
  }
}
