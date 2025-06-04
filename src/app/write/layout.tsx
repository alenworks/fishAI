import { getUserInfo } from '@/lib/session'
import { redirect } from 'next/navigation'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getUserInfo()
  if (user === null) {
    redirect('/login')
  }
  return <>{children}</>
}
