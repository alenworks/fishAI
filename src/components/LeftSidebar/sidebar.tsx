import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react'
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
    </Sidebar>
  )
}
