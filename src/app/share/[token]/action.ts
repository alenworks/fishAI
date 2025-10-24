import { db } from '@/db/db'

export async function getDocByToken(token: string) {
  const doc = await db.doc.findFirst({
    where: { shareToken: token, isPublic: true },
    include: { User: true },
  })

  if (!doc) {
    return null
  }

  // 返回安全对象给前端
  return {
    id: doc.id,
    title: doc.title ?? '',
    content: doc.content ?? { type: 'doc', content: [] }, // Tiptap JSON
    contentBinary: doc.contentBinary, // Yjs binary，可选用于 Hocuspocus
    user: doc.User
      ? {
          id: doc.User.id,
          name: doc.User.name,
          email: doc.User.email,
          image: doc.User.image ?? '/default-avatar.png',
        }
      : null,
  }
}
