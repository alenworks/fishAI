import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { v4 as uuidv4 } from 'uuid'
import { StreamBlockView } from './StreamBlockView'
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    templateCard: {
      setStreamBlock: ({
        messages,
        type,
        parentEndPos,
      }: {
        messages: { role: 'user' | 'system' | 'assistant'; content: string }[]
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
  isolated: true, // 节点独立，方便在保存时排除
  draggable: false,
  //定义节点时，可以通过 addOptions 为节点设置一些默认的属性，这些属性将会在渲染时被使用
  addOptions() {
    return {}
  },
  //渲染节点的时候节点上所带的属性和方法
  addAttributes() {
    return {
      messages: {
        default: [],
        parseHTML: (element) => {
          const messages = element.getAttribute('messages')
          try {
            return messages ? JSON.parse(messages) : []
          } catch {
            return []
          }
        },
        renderHTML: (attributes) => {
          return {
            messages: JSON.stringify(attributes.messages ?? []),
          }
        },
      },
      type: {
        default: null,
        parseHTML: (element) => element.getAttribute('type'),
        renderHTML: (attributes) => {
          return {
            type: attributes.type,
          }
        },
      },
      customnodeid: {
        default: null,
        parseHTML: (element) => element.getAttribute('customnodeid'),
        renderHTML: (attributes) => {
          return {
            customnodeid: attributes.customnodeid,
          }
        },
      },
    }
  },

  parseHTML() {
    // 不从 HTML 中解析节点
    return []
  },

  renderHTML({ HTMLAttributes }) {
    // 不生成可见 HTML，但返回一个空 span 占位，满足类型要求
    return ['span', mergeAttributes({}, HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setStreamBlock:
        ({ messages, type, parentEndPos }) =>
        ({ chain }) => {
          if (parentEndPos) {
            return chain()
              .focus()
              .insertContentAt(parentEndPos, [
                {
                  type: this.name,
                  attrs: {
                    messages: messages, // 将选中的内容传递给节点属性
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
                  messages: messages, // 将选中的内容传递给节点属性
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
