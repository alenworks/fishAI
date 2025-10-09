import { Editor } from '@tiptap/react'
import { useCallback, useEffect, useState } from 'react'
export const useAiIslandState = (editor: Editor) => {
  const [position, setPosition] = useState<{ top: number; selection: any }>({
    top: 0,
    selection: null,
  })

  const [isVisible, setIsVisible] = useState(false)

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const view = editor.view // 获取当前视图
      const isMac = navigator.userAgent.indexOf('Mac') !== -1
      const isCtrlSlash =
        (event.ctrlKey || (isMac && event.metaKey)) && event.key === '/'
      if (isCtrlSlash) {
        const { state } = editor
        const { selection } = state
        const coords = view.coordsAtPos(selection.$to.pos)
        const editorElement = editor.view.dom.getBoundingClientRect()
        setPosition({
          top: coords.bottom + 12 - editorElement.y,
          selection,
        })
        setIsVisible(!isVisible)
      }
    },
    [editor, setPosition, setIsVisible, isVisible]
  )

  const handleClickDown = useCallback(() => {
    const view = editor.view // 获取当前视图
    const { state } = editor
    const { selection } = state
    const coords = view.coordsAtPos(selection.$to.pos)
    const editorElement = editor.view.dom.getBoundingClientRect()
    setPosition({
      top: coords.bottom + 12 - editorElement.y,
      selection,
    })
    setIsVisible(!isVisible)
  }, [editor, setPosition, setIsVisible, isVisible])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return {
    isVisible,
    position,
    setIsVisible,
    handleClickDown,
  }
}
