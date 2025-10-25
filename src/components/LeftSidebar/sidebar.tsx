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
  SidebarGroupAction,
} from '@/components/ui/sidebar'
import { Home, LogOut, PanelLeftDashed } from 'lucide-react'
import UserSettingButton from '@/components/user-setting-button'
import { useState } from 'react'
export function LeftSidebar(props: {
  user: any
  loginout: () => Promise<void>
}) {
  const { loginout, user } = props
  const [open, setOpen] = useState<boolean>(false)
  const [ifHover, setIfHover] = useState<boolean>(true)
  const items = [{ title: '主页', icon: Home }]

  const handleMouseEnter = () => setOpen(true)
  const handleMouseLeave = () => setOpen(false)

  return (
    <div className={`${ifHover ? 'w-14' : ''} h-[100vh]`}>
      <SidebarProvider
        style={{ '--sidebar-width-icon': '3.5rem' } as React.CSSProperties}
        open={!ifHover || open}
        onOpenChange={setOpen}
      >
        <Sidebar
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`${ifHover ? 'absolute' : ''}`}
          collapsible="icon"
        >
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Application</SidebarGroupLabel>
              <SidebarGroupAction title="">
                <PanelLeftDashed onClick={() => setIfHover(!ifHover)} />{' '}
                <span className="sr-only">Add Project</span>
              </SidebarGroupAction>
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
                  {/* <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a>
                        <Trash2 className="h-4 w-4" />
                        <span>回收站</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem> */}
                  {/* <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a>
                        <DollarSign className="h-4 w-4" />
                        <span>升级 VIP</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem> */}
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
                <UserSettingButton user={user} />
              </SidebarGroupLabel>
            </SidebarGroup>
          </SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    </div>
  )
}
