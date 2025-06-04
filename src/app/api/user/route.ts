import { getUserInfo } from '@/lib/session'
import { db } from '@/db/db'

export async function PATCH(request: Request) {
  const user = await getUserInfo()
  if (user == null) return Response.json({ errno: 401, msg: 'Unauthorized' })

  const body = await request.json()
  const { name, avatar } = body
  await db.user.update({
    where: { id: user.id },
    data: {
      name,
      image: avatar,
      // 暂不更新 email
    },
  })

  return Response.json({ errno: 0 })
}
