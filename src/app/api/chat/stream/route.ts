import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages } = body

    console.log('[Next.js API] 收到消息:', messages)

    const koaSSEApiUrl = 'http://localhost:3001/api/ai/chat/stream'
    const response = await fetch(koaSSEApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    })

    if (!response?.ok) {
      return NextResponse.json(
        { error: `Koa 接口错误: ${response.status}` },
        { status: response.status }
      )
    }

    if (!response?.body) {
      return NextResponse.json(
        { error: 'Koa 接口未返回可读流' },
        { status: 500 }
      )
    }

    // 用于累积所有 dataContent
    let accumulatedContent = ''

    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const decoder = new TextDecoder()
        const text = decoder.decode(chunk, { stream: true })

        const lines = text.split('\n')
        let eventType = 'message'
        let dataContent = ''

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            eventType = line.substring(7).trim()
          } else if (line.startsWith('data: ')) {
            dataContent =
              JSON.parse(line.substring(6).trim() || '')?.content || ''
          }
        }

        if (dataContent) {
          // 累积内容
          accumulatedContent += dataContent

          // 构造当前块
          const wrapped = {
            process: eventType,
            content: dataContent,
          }

          const sseFormatted = `event: ${eventType}\ndata: ${JSON.stringify(wrapped)}\n\n`
          controller.enqueue(new TextEncoder().encode(sseFormatted))
        }
      },

      // ✅ 关键：在流结束时调用，发送总结消息
      flush(controller) {
        console.log('[TransformStream] 流已结束，发送 done 消息')

        const doneMessage = {
          process: 'done',
          content: accumulatedContent, // 前面所有 dataContent 的总和
        }

        const sseFormatted = `event: done\ndata: ${JSON.stringify(doneMessage)}\n\n`
        controller.enqueue(new TextEncoder().encode(sseFormatted))
        // controller.close(); // 可选，但通常 flush 后流会自动结束
      },
    })

    // 返回代理后的流
    return new NextResponse(response.body.pipeThrough(transformStream), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('[Next.js API 路由异常]', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}
