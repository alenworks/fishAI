import { NextRequest, NextResponse } from 'next/server'
import { info, error, streamLog } from '@/lib/utils/logger'
import { getServerUser } from '../../utils/getServerUser'
import { db } from '@/db/db'
import { startOfMonth, isBefore } from 'date-fns'
const defaultLimit = 10000

async function saveTokenUsage(req: NextRequest, usageData: any) {
  try {
    const user = await getServerUser(req)
    if (!user) return

    const usedTokens = usageData.total_tokens || 0
    const model = usageData.model || 'gpt-3.5-turbo'

    const existing = await db.tokenUseage.findUnique({
      where: { userId: user.id },
    })

    if (existing) {
      // ✅ 检查是否进入新月份（自动重置上限）
      const lastUpdated = existing.updatedAt || new Date()
      const startOfCurrentMonth = startOfMonth(new Date())
      const startOfLastUpdatedMonth = startOfMonth(lastUpdated)

      let currentLimit = existing.tokenlimit
      let totalTokens = existing.totalTokens

      // 如果上次更新时间在上个月，则重置
      if (isBefore(startOfLastUpdatedMonth, startOfCurrentMonth)) {
        currentLimit = defaultLimit
        totalTokens = 0
      }

      // ✅ 如果额度已用完，则不再更新
      if (currentLimit <= 0) {
        info(`[TokenUsage] 用户 ${user.id} 已超出当月额度，跳过更新。`)
        return
      }

      // ✅ 计算新的剩余额度
      const newLimit = Math.max(currentLimit - usedTokens, 0)

      await db.tokenUseage.update({
        where: { userId: user.id },
        data: {
          model,
          totalTokens: totalTokens + usedTokens,
          tokenlimit: newLimit,
          updatedAt: new Date(),
        },
      })
    } else {
      // ✅ 新建记录（初始额度）
      const remainingLimit = Math.max(defaultLimit - usedTokens, 0)

      await db.tokenUseage.create({
        data: {
          userId: user.id,
          totalTokens: usedTokens,
          tokenlimit: remainingLimit,
          model,
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

    // ✅ 查询当前 token 使用情况
    const usageRecord = await db.tokenUseage.findUnique({
      where: { userId: user.id },
    })

    let remainingTokens: number

    if (!usageRecord) {
      // ✅ 第一次使用，创建默认额度记录
      await db.tokenUseage.create({
        data: {
          userId: user.id,
          totalTokens: 0,
          tokenlimit: defaultLimit,
          model: 'gpt-3.5-turbo',
        },
      })
      remainingTokens = defaultLimit
    } else {
      // ✅ 检查是否需要重置（新月份）
      const lastUpdated = usageRecord.updatedAt || new Date()
      const startOfCurrentMonth = startOfMonth(new Date())
      const startOfLastUpdatedMonth = startOfMonth(lastUpdated)

      if (isBefore(startOfLastUpdatedMonth, startOfCurrentMonth)) {
        // 🔄 自动重置额度
        await db.tokenUseage.update({
          where: { userId: user.id },
          data: {
            totalTokens: 0,
            tokenlimit: defaultLimit,
            updatedAt: new Date(),
          },
        })
        remainingTokens = defaultLimit
      } else {
        remainingTokens = usageRecord.tokenlimit ?? defaultLimit

        if (remainingTokens <= 0) {
          return NextResponse.json({
            errno: 403,
            msg: 'Token 已用完，请充值或等待下月自动重置。',
          })
        }
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
