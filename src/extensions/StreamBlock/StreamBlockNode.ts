import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { v4 as uuidv4 } from 'uuid'
import { StreamBlockView } from './StreamBlockView'
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    templateCard: {
      setStreamBlock: ({
        problemData,
        type,
        parentEndPos,
      }: {
        problemData: string
        type?: any
        parentEndPos?: number
      }) => ReturnType
    }
  }
}

export const StreamBlock = Node.create({
  name: 'streamBlock',
  group: 'block',
  atom: true,
  draggable: false,
  //定义节点时，可以通过 addOptions 为节点设置一些默认的属性，这些属性将会在渲染时被使用
  addOptions() {
    return {}
  },
  //渲染节点的时候节点上所带的属性和方法
  addAttributes() {
    return {
      problemData: {
        default: '', // 默认属性为一个空字符串
      },
      type: {
        default: null,
      },
      askData: {
        default: null,
        parseHTML() {
          // 解析时不接收该属性
          return null
        },
        renderHTML() {
          // 渲染时返回 null，不包括 askData
          return null
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'streamBlock-component',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    // 获取选中范围的矩形位置

    return [
      'streamBlock-component',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ]
  },
  addCommands() {
    return {
      setStreamBlock:
        ({ problemData, type, parentEndPos }) =>
        ({ chain }) => {
          if (parentEndPos) {
            return chain()
              .focus()
              .insertContentAt(parentEndPos, [
                {
                  type: this.name,
                  attrs: {
                    problemData: problemData, // 将选中的内容传递给节点属性
                    type,
                    customnodeid: uuidv4(),
                  },
                },
              ])
              .run()
          } else {
            return chain()
              .focus()
              .insertContent({
                type: this.name,
                attrs: {
                  problemData: problemData, // 将选中的内容传递给节点属性
                  type,
                  customnodeid: uuidv4(),
                },
              })
              .run()
          }
        },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(StreamBlockView)
  },
})

export default StreamBlock
