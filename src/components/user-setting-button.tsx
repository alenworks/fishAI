'use client'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { UserProfileForm } from './user-profile-form'
export default function UserSettingButton({ user }: { user: any }) {
  if (user == null) return null
  const { name, image, email } = user
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full justify-start px-2 " variant="ghost">
          <UserAvatar user={user} />
          &nbsp;&nbsp;账户/设置
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>修改用户信息</DialogTitle>
          <DialogDescription asChild>
            <UserProfileForm
              name={name || ''}
              avatar={image || ''}
              email={email || ''}
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

function UserAvatar({ user }: { user: any }) {
  let { name } = user || {}
  const { image, email } = user
  if (!name) name = email

  return (
    <Avatar className="h-7 w-7 border">
      <AvatarImage src={image || ''} alt={name || ''} />
      <AvatarFallback>{name?.slice(0, 1)}</AvatarFallback>
    </Avatar>
  )
}
