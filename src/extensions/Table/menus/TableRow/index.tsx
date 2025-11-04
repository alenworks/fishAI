import { MenuProps, ShouldShowProps } from '@/types/components'
import { BubbleMenu as BaseBubbleMenu } from '@tiptap/react'
import React, { useCallback } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  BgColor,
  BorderColor,
  DeleteRow,
  InsertRowBottom,
  InsertRowTop,
  MergeCell,
  SplitCell,
} from '../icon'
import { isRowGripSelected } from './utils'
import DropDownTextAlign from '../component/DropDownTextAlign'
import { ColorPicker } from '@/components/panels'
import { Toolbar } from '@/components/ui/Toolbar'
import { Surface } from '@/components/ui/Surface'
const MemoColorPicker = React.memo(ColorPicker)
const MemoButton = React.memo(Toolbar.Button)
export const TableRowMenu = React.memo(
  ({ editor, appendTo }: MenuProps): React.JSX.Element => {
    const shouldShow = useCallback(
      ({ view, state, from }: ShouldShowProps) => {
        if (!state || !from) {
          return false
        }

        return isRowGripSelected({ editor, view, state, from })
      },
      [editor]
    )

    const onAddRowBefore = useCallback(() => {
      editor.chain().focus().addRowBefore().run()
    }, [editor])

    const onAddRowAfter = useCallback(() => {
      editor.chain().focus().addRowAfter().run()
    }, [editor])

    const onDeleteRow = useCallback(() => {
      editor.chain().focus().deleteRow().run()
    }, [editor])

    const mergeCells = useCallback(() => {
      editor.chain().focus().mergeCells().run()
    }, [editor])

    const splitCells = useCallback(() => {
      editor.commands.splitCell()
    }, [editor])

    const changeBgColor = useCallback(
      (value: string) => {
        editor.commands.setCellAttribute('backgroundColor', value)
      },
      [editor]
    )

    const changeBorderColor = useCallback(
      (value: string) => {
        editor.commands.setCellAttribute('border', `1px solid ${value}`)
      },
      [editor]
    )

    const menu = [
      {
        key: '1',
        icon: '',
        label: (
          <MemoButton title="上加一行" onClick={onAddRowBefore}>
            <InsertRowTop style={{ fontSize: 16 }} />
          </MemoButton>
        ),
      },
      {
        key: '2',
        icon: '',
        label: (
          <MemoButton title="下加一行" onClick={onAddRowAfter}>
            <InsertRowBottom style={{ fontSize: 16 }} />
          </MemoButton>
        ),
      },
      {
        key: '3',
        icon: '',
        label: (
          <MemoButton title="删除行" onClick={onDeleteRow}>
            <DeleteRow style={{ fontSize: 16 }} />
          </MemoButton>
        ),
      },
      {
        key: '4',
        label: (
          <MemoButton title="合并单元格" onClick={mergeCells}>
            <MergeCell style={{ fontSize: 16 }} />
          </MemoButton>
        ),
      },
      {
        key: '5',
        label: (
          <MemoButton title="拆分单元格" onClick={splitCells}>
            <SplitCell style={{ fontSize: 16 }} />
          </MemoButton>
        ),
      },
      {
        key: '6',
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
        key: '7',
        icon: '',
        label: (
          <Popover>
            <PopoverTrigger asChild>
              <MemoButton tooltip="设置边框颜色">
                <BorderColor style={{ fontSize: 16 }} />
              </MemoButton>
            </PopoverTrigger>
            <PopoverContent side="top" sideOffset={8} asChild>
              <Surface className="p-1">
                <MemoColorPicker
                  // color={states.currentHighlight}
                  onChange={(value) => changeBorderColor(value)}
                  onClear={() => changeBorderColor('rgb(222,222,222)')}
                />
              </Surface>
            </PopoverContent>
          </Popover>
        ),
      },
      {
        key: '8',
        icon: '',
        label: <DropDownTextAlign editor={editor} />,
      },
    ]

    return (
      <BaseBubbleMenu
        editor={editor}
        pluginKey="tableRowMenu"
        updateDelay={0}
        tippyOptions={{
          appendTo: () => {
            return appendTo?.current
          },
          placement: 'top',
          offset: [0, 15],
          popperOptions: {
            modifiers: [{ name: 'flip', enabled: false }],
          },
        }}
        shouldShow={shouldShow}
        className="bg-white rounded-lg p-4 border border-gray-300"
      >
        <div className="flex items-center">
          {menu.map((item) => (
            <div
              key={item.key}
              className="hover:bg-gray-200 transition-colors duration-300"
              style={{ cursor: 'pointer' }}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>
      </BaseBubbleMenu>
    )
  }
)

TableRowMenu.displayName = 'TableRowMenu'

export default TableRowMenu
