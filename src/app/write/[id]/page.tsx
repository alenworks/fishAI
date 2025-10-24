import Content from './(content)/content'
import { getDoc } from './action'
import { Suspense } from 'react'

export default async function Write({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const doc = await getDoc(id)
  // 🔹 判断是否存在
  if (!doc) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        文档不存在或已被删除。
      </div>
    )
  }

  return (
    <Suspense
      fallback={
        <div className="flex flex-col h-screen w-full p-6 gap-4 animate-pulse">
          {/* 标题骨架 */}
          <div className="h-12 w-1/2 bg-gray-200 rounded-lg" />

          {/* 工具栏骨架 */}
          <div className="h-8 w-full bg-gray-100 rounded-lg" />

          {/* 编辑器区域骨架 */}
          <div className="flex-1 bg-gray-100 rounded-lg" />
        </div>
      }
    >
      <Content
        id={id}
        initialDoc={{
          initTitle: doc.title,
          userInfo: {
            ...doc.user,
            id: doc?.user?.id ?? '',
            avator: doc?.user?.image ?? '/default-avatar.png',
          },
        }}
      />
    </Suspense>
  )
}
