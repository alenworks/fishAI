// app/api/upload/route.ts
import { v4 as uuid } from 'uuid'
import { getUserInfo } from '@/lib/session'
import {
  genSuccessData,
  genUnAuthData,
  genErrorData,
} from '@/app/api/utils/getResData'
import { createOssClient } from '@/lib/oss'
import { withLogging } from '@/app/api/utils/withLogger'

async function handler(req: Request): Promise<Response> {
  // 身份
  const user = await getUserInfo()
  if (user == null) return Response.json(genUnAuthData(), { status: 401 })

  // 检查 Content-Type（调试用）
  // const ct = req.headers.get('content-type') || ''
  // 解析 formData（仅支持 multipart/form-data 或 x-www-form-urlencoded）
  let formData: FormData
  try {
    formData = await req.formData()
  } catch (err: any) {
    return Response.json(
      genErrorData(`Invalid content-type or body: ${err?.message}`),
      {
        status: 400,
      }
    )
  }

  const file = formData.get('file') as File | null
  if (!file)
    return Response.json(genErrorData('No file provided'), { status: 400 })

  const ossFileName = `files/${user.id}/imgs/${uuid()}`

  try {
    const ossClient = createOssClient()
    if (!ossClient) {
      return Response.json(
        genErrorData('OSS client not configured (missing env vars)'),
        {
          status: 500,
        }
      )
    }

    // Buffer.from(await file.arrayBuffer()) 在 node 环境可用
    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await ossClient.put(ossFileName, buffer)

    return Response.json(genSuccessData({ url: result.url, res: result }))
  } catch (e: any) {
    // 把真实错误信息记录到日志（withLogging 会记录），返回友好提示
    return Response.json(
      genErrorData(`upload error: ${e?.message || String(e)}`),
      {
        status: 500,
      }
    )
  }
}

export const POST = withLogging(handler)
