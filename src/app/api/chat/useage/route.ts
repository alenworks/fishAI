import { NextRequest, NextResponse } from 'next/server'
import { getServerUser } from '../../utils/getServerUser'
import { db } from '@/db/db'
import {
  genSuccessData,
  genErrorData,
  genUnAuthData,
} from '@/app/api/utils/getResData'

// ✅ GET：获取用户 Token 使用情况
export async function GET(req: NextRequest) {
  try {
    const user = await getServerUser(req)
    if (!user) {
      return NextResponse.json(genUnAuthData('用户未登录'))
    }

    const record = await db.tokenUseage.findUnique({
      where: { userId: user.id },
    })

    // 没有记录则返回初始值
    if (!record) {
      return NextResponse.json(
        genSuccessData({
          userId: user.id,
          totalTokens: 0,
          tokenlimit: 10000,
          model: 'gpt-3.5-turbo',
        })
      )
    }

    return NextResponse.json(genSuccessData(record))
  } catch (error) {
    console.error('GET token-usage error:', error)
    return NextResponse.json(genErrorData('获取失败'))
  }
}

/**
 * ✅ POST: 保存 / 更新用户 Token 使用情况
 * - 自动区分是否存在记录
 * - 支持不同模型的累计记录
 * - 可扩展记录请求次数、更新时间等
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getServerUser(req)
    console.log('user', user)
    if (!user) {
      return NextResponse.json(genUnAuthData('用户未登录'))
    }

    const { id: userId } = user
    const body = await req.json()
    const { model = 'gpt-3.5-turbo', tokens = 0 } = body

    if (typeof tokens !== 'number' || tokens < 0) {
      return NextResponse.json(genErrorData('tokens 参数无效'))
    }

    const existing = await db.tokenUseage.findUnique({ where: { userId } })
    let result

    if (existing) {
      // ✅ 更新已存在记录
      result = await db.tokenUseage.update({
        where: { userId },
        data: {
          model,
          totalTokens: { increment: tokens },
          updatedAt: new Date(),
        },
      })
    } else {
      // ✅ 创建新记录
      if (userId) {
        result = await db.tokenUseage.create({
          data: {
            userId,
            model,
            totalTokens: tokens,
            tokenlimit: 10000,
          },
        })
      }
    }

    return NextResponse.json(genSuccessData(result))
  } catch (error) {
    console.error('POST token-usage error:', error)
    return NextResponse.json(genErrorData('更新失败'))
  }
}
