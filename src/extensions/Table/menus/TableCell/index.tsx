import DropDownTextAlign from '../component/DropDownTextAlign'
import { MenuProps, ShouldShowProps } from '@/types/components'
import { BubbleMenu as BaseBubbleMenu } from '@tiptap/react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import React, { useCallback } from 'react'
import { BgColor, MergeCell, SplitCell } from '../icon'
import { isColumnGripSelected } from '../TableColumn/utils'
import { isRowGripSelected } from '../TableRow/utils'
import { isCellSelected } from './utils'
import { ColorPicker } from '@/components/panels'
import { Toolbar } from '@/components/ui/Toolbar'
import { Surface } from '@/components/ui/Surface'

const MemoColorPicker = React.memo(ColorPicker)
const MemoButton = React.memo(Toolbar.Button)
export const TableCellMenu = React.memo(
  ({ editor, appendTo }: MenuProps): React.JSX.Element => {
    const mergeCells = useCallback(() => {
      editor.commands.mergeCells()
    }, [editor])

    const changeBgColor = useCallback(
      (value: string) => {
        editor.commands.setCellAttribute('backgroundColor', value)
      },
      [editor]
    )

    // const changeBorderColor = useCallback((value: string) => {
    //     editor.commands.setCellAttribute('border', `1px solid ${value}`)
    // }, [editor])

    const splitCells = useCallback(() => {
      editor.commands.splitCell()
    }, [editor])

    const menu = [
      {
        key: '1',
        label: (
          <MemoButton tooltip="合并单元格" onClick={mergeCells}>
            <MergeCell style={{ fontSize: 16 }} />
          </MemoButton>
        ),
      },
      {
        key: '4',
        label: (
          <MemoButton tooltip="拆分单元格" onClick={splitCells}>
            <SplitCell style={{ fontSize: 16 }} />
          </MemoButton>
        ),
      },
      {
        key: '2',
        icon: '',
        label: (
          <Popover>
            <PopoverTrigger asChild>
              <MemoButton tooltip="背景色">
                <BgColor style={{ fontSize: 16 }} />
              </MemoButton>
            </PopoverTrigger>
            <PopoverContent side="top" sideOffset={8} asChild>
              <Surface className="p-1">
                <MemoColorPicker
                  // color={states.currentHighlight}
                  onChange={(color: string) => changeBgColor(color)}
                  onClear={() => changeBgColor('')}
                />
              </Surface>
            </PopoverContent>
          </Popover>
        ),
      },
      {
        key: '3',
        icon: '',
        label: <DropDownTextAlign editor={editor} />,
      },
    ]

    const shouldShow = useCallback(
      ({ view, state, from }: ShouldShowProps) => {
        if (!state) {
          return false
        }
        if (
          isColumnGripSelected({ editor, view, state, from: from || 0 }) ||
          isRowGripSelected({ editor, view, state, from: from || 0 })
        ) {
          return false
        }
        return isCellSelected({ editor, view, state, from: from || 0 })
      },
      [editor]
    )

    return (
      <BaseBubbleMenu
        editor={editor}
        pluginKey="tableCellMenu"
        updateDelay={0}
        tippyOptions={{
          appendTo: () => {
            return appendTo?.current
          },
          offset: [0, 15],
          popperOptions: {
            modifiers: [{ name: 'flip', enabled: false }],
          },
        }}
        className="bg-white rounded-lg p-2 border border-gray-300 z-9999"
        shouldShow={(props) => {
          return shouldShow(props)
        }}
      >
        <div className="flex gap-1 items-center">
          {menu.map((item) => (
            <div
              className="hover:bg-gray-200 transition-colors duration-300"
              style={{ cursor: 'pointer' }}
              key={item.key}
            >
              {item.label}
            </div>
          ))}
        </div>
      </BaseBubbleMenu>
    )
  }
)

TableCellMenu.displayName = 'TableCellMenu'

export default TableCellMenu
