'use server'
import { db } from '@/db/db'
import { revalidatePath } from 'next/cache'
import { getUserInfo } from '@/lib/session'

export async function create() {
  const user = await getUserInfo()

  const newDoc = await db.doc.create({
    data: {
      title: '新建文档 ' + Date.now().toString().slice(-4),
      content: '',
      userId: user.id,
    },
  })
  revalidatePath(`/write/${newDoc.id}`)
}

export async function getDocList() {
  try {
    const user = await getUserInfo()

    if (user == null) return []
    const list = await db.doc.findMany({
      select: {
        id: true,
        title: true,
        parentId: true,
      },
      where: {
        userId: user.id || '',
      },
      orderBy: {
        id: 'asc',
      },
    })
    return list
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function searchByFilter(param: string) {
  try {
    return await db.doc.findMany({
      where: {
        title: {
          endsWith: param,
        },
      },
    })
  } catch (error) {
    console.error(error)
  }
}

export async function del(id: string) {
  // 删除
  const user = await getUserInfo()

  // 删除
  await db.doc.delete({
    where: {
      id,
      userId: user.id,
    },
  })

  const list = await getDocList()
  const uidList = list.map((doc) => doc.id)
  const otherUid = uidList.find((uid) => uid !== id)
  revalidatePath(`/write/${otherUid}`) // 删除以后，定位到其他文档
}
