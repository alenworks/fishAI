'use client'

import { HocuspocusProvider } from '@hocuspocus/provider'
import { uploadImageFn } from './utils/api'

import {
  BlockquoteFigure,
  CharacterCount,
  CodeBlock,
  Color,
  Details,
  DetailsContent,
  DetailsSummary,
  Document,
  Dropcursor,
  // Emoji,
  Figcaption,
  FileHandler,
  Focus,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  HorizontalRule,
  ImageBlock,
  Link,
  Placeholder,
  Selection,
  SlashCommand,
  StarterKit,
  Subscript,
  Superscript,
  Table,
  TableOfContents,
  TableCell,
  TableHeader,
  TableRow,
  TextAlign,
  TextStyle,
  TrailingNode,
  Typography,
  Underline,
  Columns,
  Column,
  TaskItem,
  TaskList,
  UniqueID,
  ImageUpload,
} from '.'

import { isChangeOrigin } from '@tiptap/extension-collaboration'

interface ExtensionKitProps {
  provider?: HocuspocusProvider | null
}

export const ExtensionKit = ({}: ExtensionKitProps) => [
  Document,
  Columns,
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  Column,
  Selection,
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }),
  HorizontalRule,
  UniqueID.configure({
    types: ['paragraph', 'heading', 'blockquote', 'codeBlock', 'table'],
    filterTransaction: (transaction) => !isChangeOrigin(transaction),
  }),
  StarterKit.configure({
    document: false,
    dropcursor: false,
    heading: false,
    horizontalRule: false,
    blockquote: false,
    codeBlock: false,
  }),
  Details.configure({
    persist: true,
    HTMLAttributes: {
      class: 'details',
    },
  }),
  DetailsContent,
  DetailsSummary,
  CodeBlock,
  TextStyle,
  FontSize,
  FontFamily,
  Color,
  TrailingNode,
  Link.configure({
    openOnClick: false,
  }),
  Highlight.configure({ multicolor: true }),
  Underline,
  CharacterCount.configure({ limit: 50000 }),
  TableOfContents,
  ImageBlock,
  ImageUpload,
  FileHandler.configure({
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
    onDrop: (currentEditor, files, pos) => {
      if (files?.length) {
        files.forEach(async (file) => {
          const url = await uploadImageFn(file)
          currentEditor.chain().setImageBlockAt({ pos, src: url }).focus().run()
        })
      }
    },
    onPaste: (currentEditor, files) => {
      if (files?.length) {
        files.forEach(async (file) => {
          const url = await uploadImageFn(file)
          currentEditor
            .chain()
            .setImageBlockAt({
              pos: currentEditor.state.selection.anchor,
              src: url,
            })
            .focus()
            .run()
        })
      }
    },
  }),
  TextAlign.extend({
    addKeyboardShortcuts() {
      return {}
    },
  }).configure({
    types: ['heading', 'paragraph'],
  }),
  Subscript,
  Superscript,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Typography,
  Placeholder.configure({
    includeChildren: true,
    showOnlyCurrent: false,
    placeholder: () => '',
  }),
  SlashCommand,
  Focus,
  Figcaption,
  BlockquoteFigure,
  Dropcursor.configure({
    width: 2,
    class: 'ProseMirror-dropcursor border-black',
  }),
]

export default ExtensionKit
