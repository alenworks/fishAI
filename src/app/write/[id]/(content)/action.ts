import debounce from 'lodash.debounce'
import { get, patch } from '@/lib/utils/request'
export async function getDoc(id: string) {
  const url = `/doc/${id}`
  const res = await get(url)
  return res.data
}

async function updateDoc(
  id: string,
  data: { title?: string; content?: string }
) {
  const url = `/doc/${id}`
  const res = await patch(url, data)
  return res.data
}

export const updateTitle = debounce(async (id: string, title: string) => {
  return await updateDoc(id, { title })
}, 1000)

export const updateContent = debounce(async (id: string, content: string) => {
  return await updateDoc(id, { content })
}, 1000)
