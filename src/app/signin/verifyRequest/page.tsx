'use client'

import { useRouter } from 'next/navigation'
import { HomeNav } from '@/components/HomeNav'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
export default function VerifyRequestPage() {
  const router = useRouter()
  const { status } = useSession()
  console.log('当前登录状态:', status)

  // 点击跳转
  const handleContinue = () => {
    if (status === 'authenticated') {
      // 已登录，跳回首页
      router.push('/')
    } else {
      // 未登录，可以刷新页面或提示用户已验证邮件后刷新
      toast.error('请完成邮件验证', { position: 'top-center' })
    }
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800">
      <HomeNav />
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-secondary-foreground">
            检查你的邮件
          </h1>
          <p className="text-gray-500">登录链接已经发送到你的邮箱</p>
        </div>

        {/* 跳转按钮 */}
        <Button
          className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-medium"
          onClick={handleContinue}
        >
          验证完成，继续
        </Button>
      </div>
    </div>
  )
}
