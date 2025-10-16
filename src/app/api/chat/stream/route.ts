import { NextRequest, NextResponse } from 'next/server'
import { info, error, streamLog } from '@/utils/logger'
export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()
    info('[Next.js API] 收到消息', messages) // 写入日志

    let response: Response
    try {
      response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ai/chat/stream`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages }),
        }
      )
    } catch (err) {
      const msg = `请求 Koa 接口失败: ${err}`
      error(msg)
      return NextResponse.json(
        { process: 'error', content: msg },
        { status: 200 }
      )
    }

    if (!response?.body) {
      const msg = 'Koa 接口未返回可读流'
      error(msg)
      return NextResponse.json(
        { process: 'error', content: msg },
        { status: 200 }
      )
    }

    let accumulatedContent = ''
    let usageSent = false

    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk, { stream: true })
        const lines = text.split('\n')

        for (const line of lines) {
          if (!line.trim()) continue
          if (line.startsWith('event: ')) continue

          if (line.startsWith('data: ')) {
            try {
              const parsed = JSON.parse(line.substring(6).trim())

              if (parsed.event === 'usage' && !usageSent) {
                const sseData = { process: 'usage', content: parsed.data }
                streamLog(`[USAGE] ${JSON.stringify(parsed.data)}`) // 写日志
                controller.enqueue(
                  new TextEncoder().encode(
                    `event: usage\ndata: ${JSON.stringify(sseData)}\n\n`
                  )
                )
                usageSent = true
                continue
              }

              if (parsed.content) accumulatedContent += parsed.content

              if (parsed.content) {
                const msg = { process: 'message', content: parsed.content }
                streamLog(`[STREAM MESSAGE] ${parsed.content}`) // 写日志
                controller.enqueue(
                  new TextEncoder().encode(
                    `event: message\ndata: ${JSON.stringify(msg)}\n\n`
                  )
                )
              }
            } catch (err) {
              const errMsg = `解析 data 错误: ${err}`
              error(errMsg)
              controller.enqueue(
                new TextEncoder().encode(
                  `event: error\ndata: ${JSON.stringify({ process: 'error', content: errMsg })}\n\n`
                )
              )
            }
          }
        }
      },
      flush(controller) {
        const doneMessage = { process: 'done', content: accumulatedContent }
        streamLog(`[DONE] ${accumulatedContent}`) // 写日志
        controller.enqueue(
          new TextEncoder().encode(
            `event: done\ndata: ${JSON.stringify(doneMessage)}\n\n`
          )
        )
      },
    })

    return new NextResponse(response.body.pipeThrough(transformStream), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : err
    error('[Next.js API 路由异常]', msg)
    return NextResponse.json(
      { process: 'error', content: msg },
      { status: 200 }
    )
  }
}
