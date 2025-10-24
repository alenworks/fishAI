'use client'

import { useEffect, useState } from 'react'
import * as Y from 'yjs'
import { Awareness } from 'y-protocols/awareness'

/**
 * useYjsAwareness
 * @param ydoc Y.Doc | undefined
 */
export function useYjsAwareness(ydoc?: Y.Doc | null) {
  const [awareness, setAwareness] = useState<Awareness | null>(null)

  useEffect(() => {
    if (!ydoc) return

    const aw = new Awareness(ydoc)
    setAwareness(aw)

    return () => {
      aw.destroy()
      setAwareness(null)
    }
  }, [ydoc])

  return awareness
}
