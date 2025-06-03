import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  User,
  DollarSign,
  LogOut,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
export function LeftSidebar(props: {
  user: any
  loginout: () => Promise<void>
}) {
  const { loginout } = props
  const [open, setOpen] = useState<boolean>(false)
  const { image, email } = props.user || {}
  let { name } = props.user
  if (!name) name = email
  const items = [
    { title: 'Home', icon: Home },
    { title: 'Inbox', icon: Inbox },
    { title: 'Calendar', icon: Calendar },
    { title: 'Search', icon: Search },
    { title: 'Settings', icon: Settings },
  ]

  const handleMouseEnter = () => setOpen(true)
  const handleMouseLeave = () => setOpen(false)

  return (
    <div className="w-14 h-[100vh]">
      <SidebarProvider
        style={{ '--sidebar-width-icon': '3.5rem' } as React.CSSProperties}
        open={open}
        onOpenChange={setOpen}
      >
        <Sidebar
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="absolute"
          collapsible="icon"
        >
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Application</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a>
                        <Trash2 className="h-4 w-4" />
                        <span>回收站</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a>
                        <User className="h-4 w-4" />
                        <span>我的账户</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a>
                        <DollarSign className="h-4 w-4" />
                        <span>升级 VIP</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a className="cursor-pointer" onClick={() => loginout()}>
                        <LogOut className="h-4 w-4" />
                        <span>退出登录</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
              <SidebarGroupLabel>
                <Avatar className="h-7 w-7">
                  <AvatarImage src={image || ''} alt={name || ''} />
                  <AvatarFallback>{name?.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <span className="ml-2">{name || 'User'}</span>
              </SidebarGroupLabel>
            </SidebarGroup>
          </SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    </div>
  )
}
