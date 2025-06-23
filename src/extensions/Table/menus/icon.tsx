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

export const BgColor = (props) => (
  <Image {...props} src={bgColor} alt="bgColor" />
)
export const BorderColor = (props) => (
  <Image {...props} src={borderColor} alt="borderColor" />
)
export const DeleteColumn = (props) => (
  <Image {...props} src={deleteColumn} alt="deleteColumn" />
)
export const DeleteRow = (props) => (
  <Image {...props} src={deleteRow} alt="deleteRow" />
)
export const DeleteTable = (props) => (
  <Image {...props} src={deleteTable} alt="deleteTable" />
)
export const InsertColumnLeft = (props) => (
  <Image {...props} src={insertColumnLeft} alt="insertColumnLeft" />
)
export const InsertColumnRight = (props) => (
  <Image {...props} src={insertColumnRight} alt="insertColumnRight" />
)
export const InsertRowBottom = (props) => (
  <Image {...props} src={insertRowBottom} alt="insertRowBottom" />
)
export const InsertRowTop = (props) => (
  <Image {...props} src={insertRowTop} alt="insertRowTop" />
)
export const MergeCell = (props) => (
  <Image {...props} src={mergeCell} alt="mergeCell" />
)
export const SplitCell = (props) => (
  <Image {...props} src={splitCell} alt="splitCell" />
)
