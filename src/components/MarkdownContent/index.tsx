import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css' // KaTeX 样式必须引入！
import Image from 'next/image'
import remarkGfm from 'remark-gfm'
interface MarkdownContentProps {
  data: string
  style?: React.CSSProperties
  projectUniqueCode?: string
  loading?: boolean
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ data, style }) => {
  if (!data) {
    return null // 或者返回加载状态 / 空状态
  }

  return (
    <div style={{ padding: 12, ...style }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]} // ✅ 支持数学公式语法（如 $...$ 或 $$...$$）
        rehypePlugins={[rehypeKatex, rehypeSanitize]} // ✅ 渲染 KaTeX + 安全过滤
        components={{
          // ✅ 自定义表格（如果你需要完全控制表格结构）
          table: ({ children, ...props }) => (
            <table className="my-custom-table" {...props}>
              <tbody>{children}</tbody>
            </table>
          ),
          // ✅ 自定义图片：设置默认宽高或处理 src
          img: ({ src, alt, width, height, ...props }) => {
            // 你可以在这里控制默认宽高，或者从 src 解析等
            const defaultWidth = width || 300
            const defaultHeight = height || 200
            return (
              <Image
                {...props}
                src={src || ''}
                width={Number(defaultWidth)}
                height={Number(defaultHeight)}
                alt={alt || ''}
              />
            )
          },
        }}
      >
        {data}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownContent
