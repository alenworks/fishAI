import Link from 'next/link'
import { auth } from 'auth'
import { HomeNav } from '@/components/HomeNav'
import SignOutButton from '@/components/sign-out-button'

export default async function UserTestPage() {
  try {
    const session = await auth()

    if (!session?.user) {
      return (
        <Wrapper>
          <Link href="/" className="underline text-xl">
            请到首页登录
          </Link>
        </Wrapper>
      )
    }

    // ✅ 已登录
    return (
      <Wrapper>
        <div className="flex flex-col items-center">
          <p>登录信息验证失败</p>
          <SignOutButton>退出</SignOutButton>
        </div>
      </Wrapper>
    )
  } catch (err) {
    console.error('❌ 获取 session 失败:', err)

    // ⚠️ Supabase 出错
    return (
      <Wrapper>
        <p className="text-xl">连接认证服务失败，请稍后重试。</p>
        <Link href="/" className="underline mt-2">
          返回首页
        </Link>
      </Wrapper>
    )
  }
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex justify-center items-center flex-col text-center">
      <HomeNav />
      {children}
    </div>
  )
}
