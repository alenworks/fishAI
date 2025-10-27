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
      // ✅ 未找到时返回空结构
      return {
        id,
        title: '',
        content: '',
        user: null,
        createdAt: null,
        updatedAt: null,
        isNew: true, // 方便前端识别是空文档
      }
    }

    const { User, ...rest } = doc
    return { ...rest, user: User, isNew: false }
  } catch (error) {
    console.error('❌ Failed to fetch doc:', error)

    // ✅ 数据库出错时也返回安全的空对象
    return {
      id,
      title: '',
      content: '',
      user: null,
      createdAt: null,
      updatedAt: null,
      isNew: true,
      error: true, // 可选：前端可以据此显示“加载失败，请重试”
    }
  }
}
