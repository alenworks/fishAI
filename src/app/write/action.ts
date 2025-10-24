'use server'
import { db } from '@/db/db'
import { getUserInfo } from '@/lib/session'
import { redirect } from 'next/navigation'
export async function firstDoc() {
  const user = await getUserInfo()
  const firstDoc = await db.doc.findFirst({
    where: { userId: user.id },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  let pathname = '/write/0'
  if (firstDoc !== null) pathname = `/write/${firstDoc?.id}`
  redirect(pathname)
}
