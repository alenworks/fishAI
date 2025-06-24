export async function uploadImageFn(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })
  const dataRes = await res.json()
  if (dataRes.errno !== 0) {
    throw new Error('upload error')
  }

  const { url } = dataRes.data // OSS url

  // 替换 CDN 域名
  const cdnUrl = url.replace(
    'http://huashuiai-web-dev.oss-cn-hongkong.aliyuncs.com',
    'https://file-dev.huashuiai.com'
  )

  return cdnUrl
}
