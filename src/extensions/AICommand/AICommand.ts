import { Extension } from '@tiptap/core'
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    aiCommand: {
      customCommand: () => ReturnType
    }
  }
}

export const AICommand = Extension.create({
  name: 'aiCommand',

  addCommands() {
    return {
      customCommand:
        () =>
        ({ commands }) => {
          return commands.setContent('Custom command executed')
        },
    }
  },
})
