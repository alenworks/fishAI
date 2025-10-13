// utils/api.ts
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface FetchOptions extends Omit<RequestInit, 'method'> {
  params?: Record<string, string | number | boolean | undefined>
  body?: any
}

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api` || '/api'

async function request<T>(
  method: HttpMethod,
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, body, headers, ...rest } = options

  // 拼接 query 参数
  const queryString = params
    ? '?' +
      Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(
          ([k, v]) =>
            `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
        )
        .join('&')
    : ''

  const url = `${BASE_URL}${path}${queryString}`
  console.log(url, body)
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    body: method !== 'GET' ? JSON.stringify(body) : undefined,
    ...rest,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API request failed: ${res.status} ${text}`)
  }

  return res.json() as Promise<T>
}

// 直接暴露简化方法
export const api = {
  get: <T>(path: string, options?: FetchOptions) =>
    request<T>('GET', path, options),
  post: <T>(path: string, body?: any, options?: FetchOptions) =>
    request<T>('POST', path, { ...options, body }),
  put: <T>(path: string, body?: any, options?: FetchOptions) =>
    request<T>('PUT', path, { ...options, body }),
  delete: <T>(path: string, options?: FetchOptions) =>
    request<T>('DELETE', path, options),
}
