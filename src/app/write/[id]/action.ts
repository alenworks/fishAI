import { db } from '@/db/db'

export async function getDoc(id: string) {
  try {
    const doc = await db.doc.findUnique({
      where: { id },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    if (!doc) {
      throw new Error('Document not found')
    }

    // ✅ 将 User 改为小写 user 返回
    const { User, ...rest } = doc
    return { ...rest, user: User }
  } catch (error) {
    console.error('❌ Failed to fetch doc:', error)
    throw error
  }
}
