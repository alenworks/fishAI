'use client'
import { TiptapCollabProvider } from '@hocuspocus/provider'
import 'iframe-resizer/js/iframeResizer.contentWindow'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Doc as YDoc } from 'yjs'
import { BlockEditor } from './BlockEditor'
interface AIEditorProps {
  rawContent: string
  handleUpdate: (content: string) => void
  id: string
}
export default function AIEditor(props: AIEditorProps) {
  const { id, handleUpdate, rawContent } = props
  // Resolving the `id` value from the Promise
  const [collabToken, setCollabToken] = useState<string | null>(null)
  const [aiToken, setAiToken] = useState<string | null>(null)
  const [provider, setProvider] = useState<TiptapCollabProvider | null>(null)
  const searchParams = useSearchParams()

  const hasCollab =
    parseInt(searchParams?.get('noCollab') as string) !== 1 &&
    collabToken !== null

  // Fetch Collab Token
  useEffect(() => {
    const fetchCollabToken = async () => {
      try {
        const response = await fetch('/api/collaboration', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('No collaboration token provided.')
        }

        const data = await response.json()
        setCollabToken(data.token)
      } catch (error) {
        console.error('Error fetching collab token:', error)
        setCollabToken(null)
      }
    }

    fetchCollabToken()
  }, [])

  // Fetch AI Token
  useEffect(() => {
    const fetchAiToken = async () => {
      try {
        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('No AI token provided.')
        }

        const data = await response.json()
        setAiToken(data.token)
      } catch (error) {
        console.error('Error fetching AI token:', error)
        setAiToken(null)
      }
    }

    fetchAiToken()
  }, [])

  const ydoc = useMemo(() => new YDoc(), [])

  // Initialize Tiptap Collab provider only when collabToken is available
  useEffect(() => {
    if (hasCollab && collabToken && id) {
      const tiptapProvider = new TiptapCollabProvider({
        name: `${process.env.NEXT_PUBLIC_COLLAB_DOC_PREFIX}${id}`,
        appId: process.env.NEXT_PUBLIC_TIPTAP_COLLAB_APP_ID ?? '',
        token: collabToken,
        document: ydoc,
      })
      setProvider(tiptapProvider)
    }
  }, [collabToken, ydoc, id, hasCollab])

  // Render the BlockEditor only after all necessary data is available
  if (
    (hasCollab && !provider) ||
    aiToken === undefined ||
    collabToken === undefined ||
    id === undefined
  ) {
    return <div>Loading...</div>
  }

  return (
    <BlockEditor
      hasCollab={hasCollab}
      ydoc={ydoc}
      provider={provider}
      handleUpdate={handleUpdate}
      content={rawContent}
    />
  )
}
