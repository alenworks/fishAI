'use client'
import React from 'react'
import Typed from 'typed.js'

export function Slogan() {
  // Create reference to store the DOM element containing the animation
  const el = React.useRef(null)

  React.useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        '基于 GPT 模型，AI 写作，AI 智能提示，AI 文本处理，多人协同编辑',
      ],
      startDelay: 300,
      typeSpeed: 100,
      backSpeed: 100,
      backDelay: 100,
      cursorChar: ' _',
    })

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy()
    }
  }, [])

  return (
    <div className="mt-10">
      <span ref={el} />
    </div>
  )
}
