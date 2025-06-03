import { cn } from '@/lib/utils'
import { Editor as CoreEditor } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'
import { memo } from 'react'

export type TableOfContentsProps = {
  editor: CoreEditor
  onItemClick?: () => void
  editorContent?: unknown
  content: unknown[]
}

export const TableOfContents = memo(
  ({ editor, onItemClick, content }: TableOfContentsProps) => {
    // const content = useEditorState({
    //   editor,
    //   selector: (ctx) =>
    //     (ctx.editor.storage.tableOfContents as TableOfContentsStorage).content,
    // });
    const handleItemClick = (e: any, id: string) => {
      e.preventDefault()

      if (editor) {
        const element = editor.view.dom.querySelector(
          `[data-toc-id="${id}"`
        ) as Element
        const scrollableContainer = document.getElementById(
          'editorContent'
        ) as Element
        const pos = editor.view.posAtDOM(element, 0)

        // set focus
        const tr = editor.view.state.tr

        tr.setSelection(new TextSelection(tr.doc.resolve(pos)))

        editor.view.dispatch(tr)

        editor.view.focus()

        if (history.replaceState) {
          // eslint-disable-line
          history.replaceState(null, '', `#${id}`)
        }
        scrollableContainer?.scrollTo({
          top:
            element.getBoundingClientRect().top +
            scrollableContainer.scrollTop -
            95,
          behavior: 'smooth',
        })
        onItemClick?.()
      }
    }

    return (
      <>
        {content.length > 0 ? (
          <div className="flex flex-col gap-1">
            {content.map((item: any) => (
              <div
                key={item.id}
                // href={`#${item.id}`}
                style={{
                  paddingLeft: `${1 * item.level - 1}rem`,
                  cursor: 'pointer',
                }}
                onClick={(e) => handleItemClick(e, item.id)}
                className={cn(
                  'block font-medium text-neutral-500 dark:text-neutral-300 p-1 rounded bg-opacity-10 text-sm hover:text-neutral-800 transition-all hover:bg-black hover:bg-opacity-5 truncate w-full',
                  item.isActive &&
                    'text-neutral-800 bg-neutral-100 dark:text-neutral-100 dark:bg-neutral-900'
                )}
              >
                {item.textContent}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-neutral-500">
            请开始编辑你的文档。。。
          </div>
        )}
      </>
    )
  }
)

TableOfContents.displayName = 'TableOfContents'
