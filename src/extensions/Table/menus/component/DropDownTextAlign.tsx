import { ChevronDown, Check } from 'lucide-react'
import type { Editor } from '@tiptap/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import React, { useCallback } from 'react'
import { ItemTop, ItemBottom, ItemMiddle } from './icon'
import { Icon } from '@/components/ui/Icon'

type MenuItemWithTitle = {
  key?: string
  title?: string
  label?: React.JSX.Element
  type?: string
}

const TextAlignMap: { label: string; value: string; icon: any }[] = [
  {
    label: '顶对齐',
    value: 'top',
    icon: <ItemTop style={{ fontSize: 16 }} className="mr-1" />,
  },
  {
    label: '垂直居中',
    value: 'middle',
    icon: <ItemMiddle style={{ fontSize: 16 }} className="mr-1" />,
  },
  {
    label: '底对齐',
    value: 'bottom',
    icon: <ItemBottom style={{ fontSize: 16 }} className="mr-1" />,
  },
]

const DropDownTextAlign: React.FC<{ editor: Editor }> = ({ editor }) => {
  const changeTextAlign = useCallback(
    (value: string) => {
      editor.commands.setCellAttribute('verticalAlign', value)
    },
    [editor]
  )

  const items: MenuItemWithTitle[] = [
    ...TextAlignMap.map((item) => ({
      key: item.value,
      title: item.label,
      label: (
        <div className="w-full flex justify-between gap-1">
          <span>
            {item.icon}
            {item.label}
          </span>
        </div>
      ),
    })),
    { type: 'divider' },
    {
      key: 'Left',
      title: '左对齐',
      label: (
        <div className="w-full flex justify-between gap-1">
          <span>
            <Icon name="AlignLeft" />
            左对齐
          </span>
          {editor.isActive({ textAlign: 'left' }) && <Check />}
        </div>
      ),
    },
    {
      key: 'Center',
      title: '居中对齐',
      label: (
        <div className="w-full flex justify-between gap-1">
          <span>
            <Icon name="AlignCenter" />
            居中对齐
          </span>
          {editor.isActive({ textAlign: 'center' }) && <Check />}
        </div>
      ),
    },
    {
      key: 'Right',
      title: '右对齐',
      label: (
        <div className="w-full flex justify-between gap-1">
          <span>
            <Icon name="AlignRight" />
            右对齐
          </span>
          {editor.isActive({ textAlign: 'right' }) && <Check />}
        </div>
      ),
    },
    {
      key: 'Justify',
      title: '两端对齐',
      label: (
        <div className="w-full flex justify-between gap-1">
          <span>
            <Icon name="AlignJustify" />
            两端对齐
          </span>
          {editor.isActive({ textAlign: 'justify' }) && <Check />}
        </div>
      ),
    },
  ]

  const handleMenuItemClick = (key: string) => {
    switch (key) {
      case 'Left':
        editor.chain().focus().setTextAlign('left').run()
        break
      case 'Right':
        editor.chain().focus().setTextAlign('right').run()
        break
      case 'Center':
        editor.chain().focus().setTextAlign('center').run()
        break
      case 'Justify':
        editor.chain().focus().setTextAlign('justify').run()
        break
      default:
        changeTextAlign(key)
        break
    }
  }

  const onClick = ({ key }: { key?: string }) => {
    if (key) {
      handleMenuItemClick(key)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div
          style={{ cursor: 'pointer', fontSize: 12, height: 32 }}
          className="flex justify-between px-1 hover:bg-gray-200 rounded-md items-center"
        >
          <Icon name="AlignJustify" />
          <ChevronDown />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        {items.map((item) =>
          item.type === 'divider' ? (
            <DropdownMenuSeparator key="divider" />
          ) : (
            <DropdownMenuItem
              key={item.key}
              onClick={() => onClick({ key: item.key })}
            >
              {item.label}
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DropDownTextAlign
