import Logo from '../logo'
import { Button } from '../ui/button'
import { Github } from 'lucide-react'
export default function HomeNav() {
  return (
    <div className="text-secondary-foreground fixed top-0 left-0 right-0 h-10 flex">
      <div className="flex-1 text-start p-2">
        <Logo />
      </div>
      <div className="flex-1 text-end p-2">
        <div className="inline-flex items-center">
          <Button variant="ghost" size="icon">
            <Github className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
