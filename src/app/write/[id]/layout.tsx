import { cookies } from 'next/headers'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { LeftSidebar, LeftNav } from '@/components'
import { WriteNav } from '@/components'
export default async function Layout(props: {
  children: React.ReactNode
  directory: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const params = await props.params

  const { children, directory } = props

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true'
  const { id } = params
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <LeftSidebar />
      <LeftNav
        directory={directory}
        content={
          <main className="flex flex-1 flex-col">
            <div className="flex items-center">
              <SidebarTrigger />
              <WriteNav workId={id} />
            </div>
            {children}
          </main>
        }
      />
    </SidebarProvider>
  )
}
