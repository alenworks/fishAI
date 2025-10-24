import { useEffect, useState } from 'react'
import { useEditor, useEditorState } from '@tiptap/react'
import type { AnyExtension, Editor } from '@tiptap/core'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import { HocuspocusProvider, WebSocketStatus } from '@hocuspocus/provider'
import type { Doc as YDoc } from 'yjs'
import {
  TableOfContents,
  getHierarchicalIndexes,
} from '@tiptap-pro/extension-table-of-contents'
import { ExtensionKit } from '@/extensions/extension-kit'
import { userColors } from '../lib/constants'
import { randomElement } from '../lib/utils'
import type { EditorUser } from '../components/BlockEditor/types'
import { useDocStore } from '@/stores/doc-stores'

declare global {
  interface Window {
    editor: Editor | null
  }
}

interface TableContent {
  id: string
}

export const useBlockEditor = ({
  ydoc,
  provider,
  hasCollab = true, // ✅ 默认开启协同
  onTableContentUpdate,
}: {
  ydoc: YDoc
  provider?: HocuspocusProvider | null | undefined
  hasCollab?: boolean
  userId?: string
  userName?: string
  onTableContentUpdate: (item: TableContent[]) => void
}) => {
  const [collabState, setCollabState] = useState<WebSocketStatus>(
    provider && hasCollab
      ? WebSocketStatus.Connecting
      : WebSocketStatus.Disconnected
  )

  const { userInfo } = useDocStore()

  const editor = useEditor(
    {
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
      autofocus: true,
      onCreate: (ctx) => {
        if (provider && hasCollab && !provider.isSynced) {
          provider.on('synced', () => {
            setTimeout(() => {
              if (ctx.editor.isEmpty) {
                console.log('editor provider synced...')
              }
            }, 0)
          })
        } else if (ctx.editor.isEmpty) {
          ctx.editor.commands.focus('start', { scrollIntoView: true })
        }
      },
      extensions: [
        TableOfContents.configure({
          getIndex: getHierarchicalIndexes,
          onUpdate(content) {
            onTableContentUpdate(content)
          },
        }),
        ...ExtensionKit({
          provider,
        }),

        // ✅ 启用协同时才加载以下两个扩展
        hasCollab && provider
          ? Collaboration.configure({
              document: ydoc,
            })
          : undefined,

        hasCollab && provider
          ? CollaborationCursor.configure({
              provider,
              user: {
                name: userInfo.name || '匿名用户',
                color: randomElement(userColors),
              },
            })
          : undefined,
      ].filter((e): e is AnyExtension => e !== undefined),
      editorProps: {
        attributes: {
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          class: 'min-h-full',
        },
      },
    },
    [ydoc, provider, hasCollab]
  )

  const users = useEditorState({
    editor,
    selector: (ctx): (EditorUser & { initials: string })[] => {
      if (!ctx.editor?.storage.collaborationCursor?.users) {
        return []
      }

      return ctx.editor.storage.collaborationCursor.users.map(
        (user: EditorUser) => {
          const names = user.name?.split(' ')
          const firstName = names?.[0]
          const lastName = names?.[names.length - 1]
          const initials = `${firstName?.[0] || '?'}${lastName?.[0] || '?'}`
          return { ...user, initials: initials.length ? initials : '?' }
        }
      )
    },
  })

  useEffect(() => {
    if (provider && hasCollab) {
      provider.on('status', (event: { status: WebSocketStatus }) => {
        setCollabState(event.status)
      })
    }
  }, [provider, hasCollab])

  // window.editor = editor

  return { editor, users, collabState }
}
