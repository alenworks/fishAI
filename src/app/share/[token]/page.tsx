import Content from '../../write/[id]/(content)/content'
import { getDocByToken } from './action'

interface Props {
  params: Promise<{ token: string }>
}

export default async function SharePage({ params }: Props) {
  const { token } = await params
  const doc = await getDocByToken(token)

  if (!doc) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        分享文档不存在或已被删除。
      </div>
    )
  }

  return (
    <>
      <div className="w-full p-3 bg-blue-50 border-b border-blue-200 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-500" /> {/* link icon */}
        <span className="text-blue-700 text-sm">你正在访问共享文档</span>
      </div>
      <Content
        id={doc.id}
        initialDoc={{
          initTitle: doc.title,
          userInfo: {
            id: doc.user?.id ?? '',
            name: doc.user?.name ?? '匿名',
            email: doc.user?.email ?? '',
            avator: doc.user?.image ?? '/default-avatar.png',
          },
        }}
      />
    </>
  )
}
