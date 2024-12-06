import {
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  User2,
  ChevronUp,
  User,
  DollarSign,
  LogOut,
  Trash2,
} from 'lucide-react'
export function LeftSidebar() {
  const items = [
    {
      title: 'Home',
      icon: Home,
    },
    {
      title: 'Inbox',
      icon: Inbox,
    },
    {
      title: 'Calendar',
      icon: Calendar,
    },
    {
      title: 'Search',
      icon: Search,
    },
    {
      title: 'Settings',
      icon: Settings,
    },
  ]

  return (
    <Sidebar collapsible="icon">
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
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <Trash2 className="h-4 w-4" />
                  &nbsp;&nbsp;回收站
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="h-4 w-4" />
                  &nbsp;&nbsp;我的账户
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <DollarSign className="h-4 w-4" />
                  &nbsp;&nbsp;升级 VIP
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="h-4 w-4" />
                  &nbsp;&nbsp;退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
