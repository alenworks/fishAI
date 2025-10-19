import { db } from '@/db/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // ✅ 1. 检查数据库连通性（轻量查询）
    await db.$queryRaw`SELECT 1`

    // ✅ 3. 返回健康状态
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    })
  } catch (err: any) {
    console.error('[HealthCheck] Error:', err)
    return NextResponse.json(
      { status: 'error', message: err.message },
      { status: 500 }
    )
  }
}
