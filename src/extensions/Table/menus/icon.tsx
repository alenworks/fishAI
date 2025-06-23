import Image from 'next/image'
import bgColor from '../../../../public/icon/bgColor.svg' // 更新路径
import borderColor from '../../../../public/icon/borderColor.svg' // 更新路径
import deleteColumn from '../../../../public/icon/delete-column.svg' // 更新路径
import deleteRow from '../../../../public/icon/delete-row.svg' // 更新路径
import deleteTable from '../../../../public/icon/deleteTable.svg' // 更新路径
import insertColumnLeft from '../../../../public/icon/insert-column-left.svg' // 更新路径
import insertColumnRight from '../../../../public/icon/insert-column-right.svg' // 更新路径
import insertRowBottom from '../../../../public/icon/insert-row-bottom.svg' // 更新路径
import insertRowTop from '../../../../public/icon/insert-row-top.svg' // 更新路径
import mergeCell from '../../../../public/icon/mergeCell.svg' // 更新路径
import splitCell from '../../../../public/icon/splitCell.svg' // 更新路径
import { cn } from '@/lib/utils'
export const BgColor = (props) => (
  <Image
    className={cn('w-4 h-4', props.className)}
    {...props}
    src={bgColor}
    alt="bgColor"
  />
)
export const BorderColor = (props) => (
  <Image
    className={cn('w-4 h-4', props.className)}
    {...props}
    src={borderColor}
    alt="borderColor"
  />
)
export const DeleteColumn = (props) => (
  <Image
    className={cn('w-4 h-4', props.className)}
    {...props}
    src={deleteColumn}
    alt="deleteColumn"
  />
)
export const DeleteRow = (props) => (
  <Image
    className={cn('w-4 h-4', props.className)}
    {...props}
    src={deleteRow}
    alt="deleteRow"
  />
)
export const DeleteTable = (props) => (
  <Image
    className={cn('w-4 h-4', props.className)}
    {...props}
    src={deleteTable}
    alt="deleteTable"
  />
)
export const InsertColumnLeft = (props) => (
  <Image
    className={cn('w-4 h-4', props.className)}
    {...props}
    src={insertColumnLeft}
    alt="insertColumnLeft"
  />
)
export const InsertColumnRight = (props) => (
  <Image
    className={cn('w-4 h-4', props.className)}
    {...props}
    src={insertColumnRight}
    alt="insertColumnRight"
  />
)
export const InsertRowBottom = (props) => (
  <Image
    className={cn('w-4 h-4', props.className)}
    {...props}
    src={insertRowBottom}
    alt="insertRowBottom"
  />
)
export const InsertRowTop = (props) => (
  <Image
    className={cn('w-4 h-4', props.className)}
    {...props}
    src={insertRowTop}
    alt="insertRowTop"
  />
)
export const MergeCell = (props) => (
  <Image
    className={cn('w-4 h-4', props.className)}
    {...props}
    src={mergeCell}
    alt="mergeCell"
  />
)
export const SplitCell = (props) => (
  <Image
    className={cn('w-4 h-4', props.className)}
    {...props}
    src={splitCell}
    alt="splitCell"
  />
)
