// src/app/api/doc/[id]/share/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db/db'
import crypto from 'crypto'

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params

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

  return NextResponse.json({ shareLink })
}
