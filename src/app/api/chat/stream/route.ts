import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()
    console.log('[Next.js API] 收到消息:', messages)

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
      return NextResponse.json(
        { error: `请求 Koa 接口失败: ${err}` },
        { status: 200 }
      )
    }

    if (!response?.body) {
      return NextResponse.json(
        { error: 'Koa 接口未返回可读流' },
        { status: 200 }
      )
    }

    let accumulatedContent = ''

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

              // 累积消息内容
              if (parsed.content) accumulatedContent += parsed.content

              // 直接把 Koa 返回的事件原样透传，包括 usage
              const sseFormatted = `event: message\ndata: ${JSON.stringify(parsed)}\n\n`
              controller.enqueue(new TextEncoder().encode(sseFormatted))
            } catch (err) {
              const errorMsg = `解析 data 错误: ${err}`
              controller.enqueue(
                new TextEncoder().encode(
                  `event: error\ndata: ${JSON.stringify({ content: errorMsg })}\n\n`
                )
              )
            }
          }
        }
      },
      flush(controller) {
        const doneMessage = { process: 'done', content: accumulatedContent }
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
  } catch (error) {
    console.error('[Next.js API 路由异常]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : error },
      { status: 200 }
    )
  }
}
