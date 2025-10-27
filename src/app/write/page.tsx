import { firstDoc } from './action'
export default async function Write() {
  // 找到第一篇文档，然后跳转过去

  await firstDoc()
  return null
}
