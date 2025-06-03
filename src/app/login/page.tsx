import Link from 'next/link'
import { auth } from 'auth'
import { HomeNav } from '@/components/HomeNav'
import SignOutButton from '@/components/sign-out-button'

export default async function UserTestPage() {
  const session = await auth()

  if (!session?.user)
    return (
      <Wrapper>
        {/* <SignInButton /> */}
        <Link href="/" className="underline text-xl">
          请到首页登录
        </Link>
      </Wrapper>
    )

  return (
    <Wrapper>
      {/* <p>session: {JSON.stringify(session)}</p> */}
      <div className="flex flex-col items-center">
        <p>你已经登录</p>
        <SignOutButton>退出</SignOutButton>
      </div>
    </Wrapper>
  )
}

// 容器
function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex justify-center items-center">
      <HomeNav />
      {children}
    </div>
  )
}
