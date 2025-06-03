// import { cookies } from 'next/headers'
// import { SidebarProvider } from '@/components/ui/sidebar'
import { LeftSidebar, LeftNav } from '@/components'
import { WriteNav } from '@/components'
import { getUserInfo } from '@/lib/session'
import { signOut } from 'auth'
export default async function Layout(props: {
  children: React.ReactNode
  directory: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  const user = await getUserInfo()
  const { children, directory } = props

  // const cookieStore = await cookies()
  // const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true'
  const loginOut = async () => {
    'use server'
    await signOut()
  }
  const { id } = params
  return (
    <div className="flex">
      <LeftSidebar user={user} loginout={loginOut} />
      <LeftNav
        directory={directory}
        content={
          <main className="flex flex-1 flex-col">
            <div className="flex items-center">
              <WriteNav writeId={id} />
            </div>
            {children}
          </main>
        }
      />
    </div>
  )
}
