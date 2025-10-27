import { get } from '@/lib/utils/request'
export async function getTokens() {
  const url = `/chat/useage`
  const res = await get(url)
  console.log(res, 'res')
  return res.data
}
