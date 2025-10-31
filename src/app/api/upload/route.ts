import { v4 as uuid } from 'uuid'
import { getUserInfo } from '@/lib/session'
import {
  genSuccessData,
  genUnAuthData,
  genErrorData,
} from '../utils/getResData'
import { ossClient } from '@/lib/oss'
import { withLogging } from '../utils/withLogger'

async function handler(req: Request): Promise<Response> {
  const user = await getUserInfo()
  if (user == null) return Response.json(genUnAuthData(), { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file)
    return Response.json(genErrorData('No file provided'), { status: 400 })
  if (
    process.env.OSS_ACCESS_KEY_ID === undefined ||
    process.env.OSS_ACCESS_KEY_SECRET === undefined
  ) {
    return Response.json(genErrorData('OSS not configured'), { status: 500 })
  }
  const ossFileName = `files/${user.id}/imgs/${uuid()}`
  try {
    const result = await ossClient.put(
      ossFileName,
      Buffer.from(await file.arrayBuffer())
    )
    return Response.json(genSuccessData(result))
  } catch (e) {
    return Response.json(genErrorData(`upload error:${e}`), { status: 500 })
  }
}

export const POST = withLogging(handler)
