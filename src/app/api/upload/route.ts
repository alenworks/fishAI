import { v4 as uuid } from 'uuid'
import { getUserInfo } from '@/lib/session'
import {
  genSuccessData,
  genUnAuthData,
  genErrorData,
} from '../utils/getResData'
import { ossClient } from '@/lib/oss'

export async function POST(req: Request) {
  const user = await getUserInfo()
  if (user == null) return Response.json(genUnAuthData())

  const formData = await req.formData()
  const file = formData.get('file') as File // `file` 是 FormData key

  // oss 文件名： `/` 可自动创建文件夹，`uuid()` 用于避免文件名重复
  const ossFileName = `files/${user.id}/imgs/${uuid()}.${file.name}`

  try {
    const result = await ossClient.put(
      ossFileName,
      Buffer.from(await file.arrayBuffer())
    )
    // 可自定义 headers，定义文档的属性，具体参考 ali-oss 文档

    return Response.json(genSuccessData(result))
  } catch (e) {
    console.error('upload error', e)
    return Response.json(genErrorData('upload error'))
  }
}
