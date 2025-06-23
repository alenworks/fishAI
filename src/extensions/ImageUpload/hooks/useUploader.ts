import { useState, useCallback } from 'react'
import { uploadImageAPI } from '../../utils/api'
import { toast } from 'sonner'

const useUploader = ({ onUpload }: { onUpload: (url: string) => void }) => {
  const [loading, setLoading] = useState(false)

  const uploadFile = useCallback(
    async (file: File) => {
      setLoading(true)
      try {
        console.log(file)
        const url = await uploadImageAPI() // 上传图片
        onUpload(url) // 上传成功后，调用 onUpload 方法
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
