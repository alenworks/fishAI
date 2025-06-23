import Image from 'next/image'
import itemTop from '../../../../../public/icon/item-top.svg' // Updated path
import itemMiddle from '../../../../../public/icon/item-center.svg' // Updated path
import itemBottom from '../../../../../public/icon/item-bottom.svg' // Updated path
import { cn } from '@/lib/utils'

export const ItemTop = (props) => (
  <Image
    className={cn('w-4 h-4', props.className)}
    {...props}
    src={itemTop}
    alt="itemTop"
  />
)
export const ItemMiddle = (props) => (
  <Image
    className={cn('w-4 h-4', props.className)}
    {...props}
    src={itemMiddle}
    alt="itemMiddle"
  />
)
export const ItemBottom = (props) => (
  <Image
    className={cn('w-4 h-4', props.className)}
    {...props}
    src={itemBottom}
    alt="itemBottom"
  />
)
