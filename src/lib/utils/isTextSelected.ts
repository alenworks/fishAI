import { isTextSelection } from '@tiptap/core'
import { Editor } from '@tiptap/react'

export const isTextSelected = ({ editor }: { editor: Editor }) => {
  const {
    state: {
      doc,
      selection,
      selection: { empty, from, to },
    },
  } = editor

  // 判断是否选中的是表格单元格
  const isTableCellSelected = selection.$anchor.node().type.name === 'tableCell'

  // 如果是空选择、选中的是表格单元格或者编辑器不可编辑，则返回 false
  if (empty || isTableCellSelected || !editor.isEditable) {
    return false
  }

  // Sometime check for `empty` is not enough.
  // Doubleclick an empty paragraph returns a node size of 2.
  // So we check also for an empty text size.
  const isEmptyTextBlock =
    !doc.textBetween(from, to).length && isTextSelection(selection)

  // 如果是空文本块，返回 false
  if (isEmptyTextBlock) {
    return false
  }

  return true
}

export default isTextSelected
