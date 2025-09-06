import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, Star } from 'lucide-react'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
export function LeftNav({
  directory,
  content,
}: {
  directory: React.ReactNode
  content: React.ReactNode
}) {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel style={{ minWidth: 180 }} defaultSize={15}>
        <div className="flex flex-col h-screen bg-muted text-muted-foreground p-2">
          <div>
            <Button className="w-full justify-start px-2" variant="ghost">
              <Search className="h-4 w-4" />
              &nbsp;&nbsp;搜索
            </Button>
            <Button className="w-full justify-start px-2" variant="ghost">
              <Star className="h-4 w-4" />
              &nbsp;&nbsp;收藏夹
            </Button>
          </div>
          <Separator className="my-4" />
          <ScrollArea className="flex-auto">{directory}</ScrollArea>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={85}>
        <div className="h-screen flex flex-col">{content}</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
