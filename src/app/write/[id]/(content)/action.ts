import debounce from 'lodash.debounce'

export async function getDoc(id: string) {
  const url = `/api/doc/${id}`
  const res = await fetch(url)
  const resData = await res.json()
  if (resData.errno === 0) {
    return resData.data
  } else {
    return resData.data
  }
}

async function updateDoc(
  id: string,
  data: { title?: string; content?: string }
) {
  const url = `/api/doc/${id}`
  const res = await fetch(url, {
    method: 'PATCH', // 大写
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return res
}

export const updateTitle = debounce(async (id: string, title: string) => {
  return await updateDoc(id, { title })
}, 1000)

export const updateContent = debounce(async (id: string, content: string) => {
  return await updateDoc(id, { content })
}, 1000)
