import { Group } from './types'
import { toast } from 'sonner'
export const GROUPS: Group[] = [
  // {
  //   name: 'ai',
  //   title: 'AI',
  //   commands: [
  //     {
  //       name: 'aiWriter',
  //       label: 'AI Writer',
  //       iconName: 'Sparkles',
  //       description: 'Let AI finish your thoughts',
  //       shouldBeHidden: (editor) => editor.isActive('columns'),
  //       action: (editor) => editor.chain().focus().setAiWriter().run(),
  //     },
  //     {
  //       name: 'aiImage',
  //       label: 'AI Image',
  //       iconName: 'Sparkles',
  //       description: 'Generate an image from text',
  //       shouldBeHidden: (editor) => editor.isActive('columns'),
  //       action: (editor) => editor.chain().focus().setAiImage().run(),
  //     },
  //   ],
  // },
  {
    name: 'format',
    title: 'Format',
    commands: [
      {
        name: 'heading1',
        label: 'Heading 1 标题1',
        iconName: 'Heading1',
        description: 'High priority section title',
        aliases: ['h1'],
        action: (editor) => {
          editor.chain().focus().setHeading({ level: 1 }).run()
        },
      },
      {
        name: 'heading2',
        label: 'Heading 2 标题2',
        iconName: 'Heading2',
        description: 'Medium priority section title',
        aliases: ['h2'],
        action: (editor) => {
          editor.chain().focus().setHeading({ level: 2 }).run()
        },
      },
      {
        name: 'heading3',
        label: 'Heading 3 标题3',
        iconName: 'Heading3',
        description: 'Low priority section title',
        aliases: ['h3'],
        action: (editor) => {
          editor.chain().focus().setHeading({ level: 3 }).run()
        },
      },
      {
        name: 'heading4',
        label: 'Heading 4 标题4',
        iconName: 'Heading4',
        description: 'Low priority section title',
        aliases: ['h4'],
        action: (editor) => {
          editor.chain().focus().setHeading({ level: 4 }).run()
        },
      },
      {
        name: 'heading5',
        label: 'Heading 5 标题5',
        iconName: 'Heading5',
        description: 'Low priority section title',
        aliases: ['h5'],
        action: (editor) => {
          editor.chain().focus().setHeading({ level: 5 }).run()
        },
      },
      {
        name: 'bulletList',
        label: 'Bullet List 列表',
        iconName: 'List',
        description: 'Unordered list of items',
        aliases: ['ul'],
        action: (editor) => {
          editor.chain().focus().toggleBulletList().run()
        },
      },
      {
        name: 'numberedList',
        label: 'Numbered List 有序列表',
        iconName: 'ListOrdered',
        description: 'Ordered list of items',
        aliases: ['ol'],
        action: (editor) => {
          editor.chain().focus().toggleOrderedList().run()
        },
      },
      {
        name: 'taskList',
        label: 'Task List 任务列表',
        iconName: 'ListTodo',
        description: 'Task list with todo items',
        aliases: ['todo'],
        action: (editor) => {
          editor.chain().focus().toggleTaskList().run()
        },
      },
      {
        name: 'toggleList',
        label: 'Toggle List 展开列表',
        iconName: 'ListCollapse',
        description: 'Toggles can show and hide content',
        aliases: ['toggle'],
        action: (editor) => {
          editor.chain().focus().setDetails().run()
        },
      },
      {
        name: 'blockquote',
        label: 'Blockquote 引用',
        iconName: 'Quote',
        description: 'Element for quoting',
        action: (editor) => {
          editor.chain().focus().setBlockquote().run()
        },
      },
      {
        name: 'codeBlock',
        label: 'Code Block 代码块',
        iconName: 'SquareCode',
        description: 'Code block with syntax highlighting',
        shouldBeHidden: (editor) => editor.isActive('columns'),
        action: (editor) => {
          editor.chain().focus().setCodeBlock().run()
        },
      },
    ],
  },
  {
    name: 'insert',
    title: 'Insert',
    commands: [
      {
        name: 'image',
        label: 'Image 图片',
        iconName: 'Image',
        description: 'Insert an image',
        aliases: ['img'],
        action: (editor) => {
          const url = window.prompt('Image URL')
          console.log(url)
          if (url) {
            editor
              .chain()
              .focus()
              .setImageBlock({
                src: url,
              })
              .run()
          } else {
            console.log(1212)
            toast.warning('请输入图片连接')
          }
        },
      },
      {
        name: 'table',
        label: 'Table 表格',
        iconName: 'Table',
        description: 'Insert a table',
        shouldBeHidden: (editor) => editor.isActive('columns'),
        action: (editor) => {
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: false })
            .run()
        },
      },
      {
        name: 'columns',
        label: 'Columns 多列',
        iconName: 'Columns2',
        description: 'Add two column content',
        aliases: ['cols'],
        shouldBeHidden: (editor) => editor.isActive('columns'),
        action: (editor) => {
          editor
            .chain()
            .focus()
            .setColumns()
            .focus(editor.state.selection.head - 1)
            .run()
        },
      },
      {
        name: 'horizontalRule',
        label: 'Horizontal Rule 分割线',
        iconName: 'Minus',
        description: 'Insert a horizontal divider',
        aliases: ['hr'],
        action: (editor) => {
          editor.chain().focus().setHorizontalRule().run()
        },
      },
    ],
  },
]

export default GROUPS
