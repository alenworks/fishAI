import { cookies } from 'next/headers'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { LeftSidebar } from '@/components/LeftSidebar'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true'
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <LeftSidebar />
      <main className="flex flex-1">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
