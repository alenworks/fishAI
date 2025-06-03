'use server'
import { db } from '@/db/db'
import { revalidatePath } from 'next/cache'
import { getUserInfo } from '@/lib/session'
export async function searchDocById(id: string) {
  const user = await getUserInfo()
  return await db.doc.findUnique({
    where: { id, userId: user.id },
  })
}

export async function updateDoc(
  id: string,
  data: { title?: string; content?: string }
) {
  const user = await getUserInfo()
  try {
    await db.doc.update({
      where: { id, userId: user.id },
      data,
    })
    if (data.title) {
      // 修改 title 时，重新生成页面
      revalidatePath(`/write/${id}`)
    }
  } catch (ex) {
    console.error(ex)
  }
}
