import imageCompression from 'browser-image-compression'
import { post } from '@/lib/utils/request'
// 压缩图片的配置，参考文档 https://www.npmjs.com/package/browser-image-compression
const imageCompressionOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1200,
  useWebWorker: true,
}
export async function uploadImageFn(file: File) {
  const blob = await imageCompression(file, imageCompressionOptions)
  const compressedFile = new File([blob], file.name)
  const formData = new FormData()
  formData.append('file', compressedFile)

  const dataRes = await post<{ url: string }>('/upload', formData)
  if (dataRes.errno !== 0) {
    throw new Error('upload error')
  }
  if (dataRes.data) {
    const { url } = dataRes.data // OSS url

    // 替换 CDN 域名
    const cdnUrl = url.replace(
      'http://fish-web-dev.oss-cn-hongkong.aliyuncs.com',
      'https://file-dev.doublefishesai.cn'
    )
    return cdnUrl
  }
  throw new Error('upload error')
}
