import 'server-only' // 标记只在服务端使用（客户端组件引入会报错）
import { auth } from 'auth'
import { redirect } from 'next/navigation'

export async function getUserInfo() {
  const session = await auth()
  if (!session?.user || !session?.user.id) {
    redirect('/login')
  }

  return session.user // 格式如 { id, name, email, image }
}
