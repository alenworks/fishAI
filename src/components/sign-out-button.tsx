import { signOut } from 'auth'
import { Button } from '@/components/ui/button'

export default function SignOutButton({
  children,
  className,
  size,
  variant,
}: {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'lg'
  variant?:
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'default'
    | 'destructive'
    | 'outline'
    | null
}) {
  return (
    <form
      action={async () => {
        'use server'
        await signOut()
      }}
      className="w-full"
    >
      <Button className={className} size={size} variant={variant}>
        {children}
      </Button>
    </form>
  )
}
