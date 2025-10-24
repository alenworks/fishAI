import { getUserInfo } from '@/lib/session'
import { db } from '@/db/db'
import {
  genSuccessData,
  genErrorData,
  genUnAuthData,
} from '../../utils/getResData'

// 获取单个 doc 内容
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserInfo()
  if (user == null) return Response.json(genUnAuthData())
  const { id } = await params
  const doc = await db.doc.findUnique({
    where: { id, userId: user.id },
  })
  return Response.json(genSuccessData(doc))
}

// 更新单个 doc 内容
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserInfo()
  if (user == null) return Response.json(genUnAuthData())

  const { id } = await params
  const body = await request.json()
  try {
    await db.doc.update({
      where: { id, userId: user.id },
      data: body,
    })

    return Response.json(genSuccessData())
  } catch (ex) {
    console.error('Update doc error', ex)
    return Response.json(genErrorData('Update doc error'))
  }
}
