import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db/db'
import crypto from 'crypto'
import { genSuccessData } from '@/app/api/utils/getResData'
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ 关键修改
) {
  const { id } = await context.params // ✅ 注意这里也要 await

  const doc = await db.doc.findUnique({ where: { id } })
  if (!doc)
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })

  const token = crypto.randomBytes(8).toString('hex')

  await db.doc.update({
    where: { id },
    data: {
      shareToken: token,
      isPublic: true,
    },
  })

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const shareLink = `${baseUrl}/share/${token}`

  return NextResponse.json(genSuccessData({ shareLink }))
}
