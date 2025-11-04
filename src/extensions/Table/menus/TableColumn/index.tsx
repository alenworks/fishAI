import { MenuProps, ShouldShowProps } from '@/types/components'
import { BubbleMenu as BaseBubbleMenu } from '@tiptap/react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import React, { useCallback } from 'react'
import {
  BgColor,
  BorderColor,
  DeleteColumn,
  InsertColumnLeft,
  InsertColumnRight,
  MergeCell,
  SplitCell,
} from '../icon'
import { isColumnGripSelected } from './utils'
import DropDownTextAlign from '../component/DropDownTextAlign'
import { ColorPicker } from '@/components/panels'
import { Toolbar } from '@/components/ui/Toolbar'
import { Surface } from '@/components/ui/Surface'
const MemoColorPicker = React.memo(ColorPicker)
const MemoButton = React.memo(Toolbar.Button)
export const TableColumnMenu = React.memo(
  ({ editor, appendTo }: MenuProps): React.JSX.Element => {
    const onAddColumnBefore = useCallback(() => {
      editor.chain().focus().addColumnBefore().run()
    }, [editor])

    const onAddColumnAfter = useCallback(() => {
      editor.chain().focus().addColumnAfter().run()
    }, [editor])

    const onDeleteColumn = useCallback(() => {
      editor.chain().focus().deleteColumn().run()
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
          <MemoButton title="前加一列" onClick={onAddColumnBefore}>
            <InsertColumnLeft style={{ fontSize: 16 }} />
          </MemoButton>
        ),
      },
      {
        key: '2',
        icon: '',
        label: (
          <MemoButton title="后加一列" onClick={onAddColumnAfter}>
            <InsertColumnRight style={{ fontSize: 16 }} />
          </MemoButton>
        ),
      },

      {
        key: '3',
        icon: '',
        label: (
          <MemoButton title="删除列" onClick={onDeleteColumn}>
            <DeleteColumn style={{ fontSize: 16 }} />
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

    const shouldShow = useCallback(
      ({ view, state, from }: ShouldShowProps) => {
        if (!state) {
          return false
        }
        return isColumnGripSelected({ editor, view, state, from: from || 0 })
      },
      [editor]
    )

    return (
      <BaseBubbleMenu
        editor={editor}
        pluginKey="tableColumnMenu"
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
        <div className="flex items-center">
          {menu.map((item) => (
            <div
              className="hover:bg-gray-200 transition-colors duration-300"
              style={{ cursor: 'pointer' }}
              key={item.key}
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

TableColumnMenu.displayName = 'TableColumnMenu'

export default TableColumnMenu
