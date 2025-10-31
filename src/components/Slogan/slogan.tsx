'use client'
import React from 'react'
import Typed from 'typed.js'

export function Slogan() {
  // Create reference to store the DOM element containing the animation
  const el = React.useRef(null)

  React.useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        '集文档管理、富文本编辑、协作编辑和 AI 写作于一体的现代化工作平台。 让团队协作更流畅，让创作更轻松。',
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
