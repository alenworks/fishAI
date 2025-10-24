// src/app/api/doc/[id]/share/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db/db'
import crypto from 'crypto'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  const doc = await db.doc.findUnique({ where: { id } })
  if (!doc)
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })

  // 生成随机 token
  const token = crypto.randomBytes(8).toString('hex')

  // 更新文档
  await db.doc.update({
    where: { id },
    data: {
      shareToken: token,
      isPublic: true,
    },
  })

  // 返回分享链接
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const shareLink = `${baseUrl}/share/${token}`

  return NextResponse.json({ shareLink })
}
