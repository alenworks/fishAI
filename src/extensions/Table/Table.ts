import { Table as TiptapTable } from '@tiptap/extension-table'

export const Table = TiptapTable.configure({
  resizable: true,
  allowTableNodeSelection: true,
  HTMLAttributes: {
    style: 'border-collapse: collapse; width: 100%;',
  },
})
export default Table
