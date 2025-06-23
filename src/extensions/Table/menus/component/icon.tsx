import Image from 'next/image'
import itemTop from '../../../../../public/icon/item-top.svg' // Updated path
import itemMiddle from '../../../../../public/icon/item-center.svg' // Updated path
import itemBottom from '../../../../../public/icon/item-bottom.svg' // Updated path

export const ItemTop = (props) => (
  <Image {...props} src={itemTop} alt="itemTop" />
)
export const ItemMiddle = (props) => (
  <Image {...props} src={itemMiddle} alt="itemMiddle" />
)
export const ItemBottom = (props) => (
  <Image {...props} src={itemBottom} alt="itemBottom" />
)
