import { useState, useCallback } from 'react'
import { uploadImageFn } from '../../utils/api'
import { toast } from 'sonner'
import { getImageSize } from '../../utils/img'
const useUploader = ({
  onUpload,
}: {
  onUpload: (url: string, ratio: number) => void
}) => {
  const [loading, setLoading] = useState(false)

  const uploadFile = useCallback(
    async (file: File) => {
      setLoading(true)
      try {
        const { width = NaN, height = NaN } = await getImageSize(file) // 获取图片尺寸
        const ratio = parseFloat((width / height).toFixed(2)) // 计算宽高比例
        const url = await uploadImageFn(file) // 上传图片
        console.log(url)
        onUpload(url, ratio) // 上传成功后，调用 onUpload 方法
      } catch (errPayload: any) {
        console.error(errPayload)
        const error = errPayload?.response?.data?.error || '上传失败'
        toast.error(error)
      }
      setLoading(false)
    },
    [onUpload, setLoading]
  )

  return { loading, uploadFile }
}
export default useUploader
