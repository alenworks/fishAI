import { getUserInfo } from '@/lib/session'
import { db } from '@/db/db'
import {
  genSuccessData,
  genErrorData,
  genUnAuthData,
} from '@/app/api/utils/getResData'

// 获取单个 doc 内容
export async function GET(
  request: Request,
  context: { params: { id: string } } // 直接通过 context 获取 id
) {
  try {
    const user = await getUserInfo()
    if (user == null) return Response.json(genUnAuthData())

    const { id } = await context.params // 直接从 context.params 获取 id
    const doc = await db.doc.findUnique({
      where: { id, userId: user.id },
    })

    if (!doc) {
      return Response.json(genErrorData('Document not found'))
    }

    return Response.json(genSuccessData(doc))
  } catch (error) {
    console.error('Error fetching document', error)
    return Response.json(genErrorData('Error fetching document'))
  }
}

// 更新单个 doc 内容
export async function PATCH(
  request: Request,
  context: { params: { id: string } } // 同样通过 context 获取 id
) {
  try {
    const user = await getUserInfo()
    if (user == null) return Response.json(genUnAuthData())

    const { id } = await context.params // 获取 id
    const body = await request.json()
    if (!body) {
      return Response.json(genErrorData('No data provided'))
    }

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
