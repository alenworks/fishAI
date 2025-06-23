import { MenuProps, ShouldShowProps } from '@/types/components'
import { BubbleMenu as BaseBubbleMenu } from '@tiptap/react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Toolbar } from '@/components/ui/Toolbar'
import React, { useCallback } from 'react'
import {
  BgColor,
  BorderColor,
  DeleteTable,
  InsertColumnLeft,
  InsertColumnRight,
  InsertRowBottom,
  InsertRowTop,
  MergeCell,
  SplitCell,
} from '../icon'
import { Surface } from '@/components/ui/Surface'
import { isAllTableSelected } from './utils'
import DropDownTextAlign from '../component/DropDownTextAlign'
import { ColorPicker } from '@/components/panels'
const MemoColorPicker = React.memo(ColorPicker)
const MemoButton = React.memo(Toolbar.Button)

export const TableMenu = React.memo(
  ({ editor, appendTo }: MenuProps): JSX.Element => {
    const onAddColumnBefore = useCallback(() => {
      editor.chain().focus().addColumnBefore().run()
    }, [editor])

    const onAddColumnAfter = useCallback(() => {
      editor.chain().focus().addColumnAfter().run()
    }, [editor])

    const onAddRowBefore = useCallback(() => {
      editor.chain().focus().addRowBefore().run()
    }, [editor])

    const onAddRowAfter = useCallback(() => {
      editor.chain().focus().addRowAfter().run()
    }, [editor])

    const onDeleteTable = useCallback(() => {
      editor.chain().focus().deleteTable().run()
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
          <MemoButton tooltip="前加一列" onClick={onAddColumnBefore}>
            <InsertColumnLeft style={{ fontSize: 16 }} />
          </MemoButton>
        ),
      },
      {
        key: '2',
        icon: '',
        label: (
          <MemoButton tooltip="后加一列" onClick={onAddColumnAfter}>
            <InsertColumnRight style={{ fontSize: 16 }} />
          </MemoButton>
        ),
      },
      {
        key: '8',
        icon: '',
        label: (
          <MemoButton tooltip="上加一行" onClick={onAddRowBefore}>
            <InsertRowTop style={{ fontSize: 16 }} />
          </MemoButton>
        ),
      },
      {
        key: '9',
        icon: '',
        label: (
          <MemoButton tooltip="下加一行" onClick={onAddRowAfter}>
            <InsertRowBottom style={{ fontSize: 16 }} />
          </MemoButton>
        ),
      },
      {
        key: '3',
        icon: '',
        label: (
          <MemoButton tooltip="删除表格" onClick={onDeleteTable}>
            <DeleteTable style={{ fontSize: 16 }} />
          </MemoButton>
        ),
      },
      {
        key: '4',
        label: (
          <MemoButton tooltip="合并单元格" onClick={mergeCells}>
            <MergeCell style={{ fontSize: 16 }} />
          </MemoButton>
        ),
      },
      {
        key: '5',
        label: (
          <MemoButton tooltip="拆分单元格" onClick={splitCells}>
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
              <MemoButton tooltip="设置背景颜色">
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
        return isAllTableSelected({ editor, view, state, from: from || 0 })
      },
      [editor]
    )

    return (
      <BaseBubbleMenu
        editor={editor}
        pluginKey="tableMenu"
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

TableMenu.displayName = 'TableMenu'

export default TableMenu
