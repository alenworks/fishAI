import { useState } from 'react'
import { toast } from 'sonner'
import { get } from '@/lib/utils/request'
export function ShareButton({ docId }: { docId: string }) {
  const [link, setLink] = useState('')

  async function handleShare() {
    try {
      const res = await get(`/doc/${docId}/share`)
      if (res.data?.shareLink) {
        // 保存到 state
        setLink(res.data.shareLink)

        // 自动复制到剪贴板
        await navigator.clipboard.writeText(res.data.shareLink)

        // 可选：显示提示
        toast.success('分享链接已复制到剪贴板！', { position: 'top-center' })
      }
    } catch (err) {
      console.error('分享失败', err)
      toast.error('分享失败，请重试', { position: 'top-center' })
    }
  }

  return (
    <div onClick={handleShare} className="px-4 py-2 rounded">
      生成分享链接
      {link && (
        <div className="mt-2 text-sm text-gray-700">
          分享链接：<a href={link}>{link}</a>
        </div>
      )}
    </div>
  )
}
