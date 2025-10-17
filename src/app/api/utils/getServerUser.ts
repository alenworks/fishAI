import { NextRequest } from 'next/server'
import { db } from '@/db/db'

export async function getServerUser(req: NextRequest) {
  const cookieHeader = req.headers.get('cookie') // 获取 Cookie 字符串
  if (!cookieHeader) return null

  // 找到 authjs.session-token
  const match = cookieHeader.match(/authjs\.session-token=([^;]+)/)
  if (!match) return null

  const sessionToken = match[1]

  const session = await db.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  })

  if (!session?.user) return null
  return session.user
}
