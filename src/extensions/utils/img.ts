// 根据宽高比例获取 width percent （25% 50% 75% 100%）
export function getWidthPercent(ratio: number) {
  if (ratio > 2) return 100 // 如 width: 200px, height: 100px
  if (ratio > 1.5) return 75 // 如 width: 150px, height: 100px
  if (ratio > 0.85) return 50 // 如 width: 85px, height: 100px
  if (ratio > 0.5) return 25 // 如 width: 100px, height: 200px
  return 100
}

import imageCompression from 'browser-image-compression'

// 压缩图片的配置，参考文档 https://www.npmjs.com/package/browser-image-compression
const imageCompressionOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1200,
  useWebWorker: true,
}

// 压缩图片
export async function compressImage(file: File) {
  const blob = await imageCompression(file, imageCompressionOptions)
  const compressedFile = new File([blob], file.name)
  return compressedFile
}

// 获取图片尺寸
export async function getImageSize(file: File) {
  return new Promise<{ width: number; height: number }>((resolve) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }
  })
}
