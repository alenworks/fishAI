import { NextRequest, NextResponse } from 'next/server'
import { info, error, streamLog } from '@/lib/utils/logger'
import { getServerUser } from '../../utils/getServerUser'
import { db } from '@/db/db'

async function saveTokenUsage(req: NextRequest, usageData: any) {
  try {
    const user = await getServerUser(req)
    if (!user) return

    const existing = await db.tokenUseage.findUnique({
      where: { userId: user.id },
    })
    if (existing) {
      await db.tokenUseage.update({
        where: { userId: user.id },
        data: {
          totalTokens: { increment: usageData.total_tokens || 0 },
          model: usageData.model || 'gpt-3.5-turbo',
          updatedAt: new Date(),
        },
      })
    } else {
      await db.tokenUseage.create({
        data: {
          userId: user.id,
          totalTokens: usageData.total_tokens || 0,
          model: usageData.model || 'gpt-3.5-turbo',
          tokenlimit: 10000,
        },
      })
    }

    info(`[TokenUsage] Saved for user ${user.id}`, usageData)
  } catch (err) {
    error('保存 TokenUsage 失败', err)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser(request)
    if (!user) {
      return NextResponse.json({ errno: 401, msg: '用户未登录' })
    }

    // 查询当前 token 使用情况
    const usageRecord = await db.tokenUseage.findUnique({
      where: { userId: user.id },
    })

    let remainingTokens: number
    if (!usageRecord) {
      // 第一次请求，默认额度 10000
      remainingTokens = 10000
    } else {
      remainingTokens =
        (usageRecord.tokenlimit ?? 10000) - (usageRecord.totalTokens ?? 0)
      if (remainingTokens <= 0) {
        return NextResponse.json({
          errno: 403,
          msg: 'Token 已用完，请充值或等待重置',
        })
      }
    }

    const { messages } = await request.json()
    info('[Next.js API] 收到消息', messages)

    const response = await fetch(
      `${process.env.KOA_PUBLIC_API_BASE_URL}/api/ai/chat/stream`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      }
    )

    if (!response.ok || !response.body)
      throw new Error(`Koa 接口异常: ${response.status}`)

    // 分流：一份返回前端，一份后台处理 usage
    const [clientStream, logStream] = response.body.tee()

    ;(async () => {
      const reader = logStream.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let usageData: any = null

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })

          // 按空行分割 SSE 事件块
          const events = buffer.split(/\r?\n\r?\n/)
          buffer = events.pop() || '' // 保留最后不完整块

          for (const block of events) {
            if (!block.trim()) continue

            const lines = block.split(/\r?\n/)
            let eventType = 'message'
            let data: any = null
            for (const line of lines) {
              if (line.startsWith('event:')) {
                eventType = line.replace(/^event:\s*/, '').trim()
              } else if (line.startsWith('data:')) {
                try {
                  data = JSON.parse(line.replace(/^data:\s*/, ''))
                } catch (err) {
                  error('解析 SSE data 错误', err)
                }
              }
            }

            // 根据 eventType 处理
            switch (eventType) {
              case 'usage':
                if (data?.data) {
                  usageData = data.data
                  streamLog(`[USAGE] ${JSON.stringify(usageData)}`)
                }
                break
              case 'message':
                if (data?.content) streamLog(`[MESSAGE] ${data.content}`)
                break
              case 'done':
                if (data?.content) streamLog(`[DONE] ${data.content}`)
                break
              default:
                console.warn('Unknown SSE event:', eventType, data)
            }
          }
        }

        if (usageData) await saveTokenUsage(request, usageData)
      } catch (err) {
        error('处理 SSE 流时出错', err)
      } finally {
        reader.releaseLock()
      }
    })()

    return new NextResponse(clientStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    error('[Next.js API 异常]', msg)
    return NextResponse.json(
      { process: 'error', content: msg },
      { status: 200 }
    )
  }
}
