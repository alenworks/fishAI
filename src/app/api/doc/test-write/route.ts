// app/api/doc/test-write/route.ts
import { db } from '@/db/db'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    await db.$transaction(async (tx) => {
      await tx.doc.create({
        data: {
          title: 'health-check',
          content: 'ping',
          userId: 'cmb99lhf80000awzolfb9x4wm',
        },
      })
      // ❗回滚，不实际写入
      throw new Error('rollback')
    })
  } catch (err: any) {
    if (err.message === 'rollback') {
      return NextResponse.json({ status: 'ok', message: 'write test passed' })
    }
    console.error('DB Write Check Error:', err)
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}
