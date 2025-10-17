/**
 * 服务端通用请求封装（Node 端可安全使用）
 * - 用于 Next.js API Route、Server Component、Edge Functions 等
 */

import { error as logError, info } from '@/lib/utils/logger'

/**
 * HTTP 方法类型
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/**
 * 请求参数类型定义
 */
interface FetchOptions extends Omit<RequestInit, 'method'> {
  params?: Record<string, string | number | boolean | undefined>
  body?: any
}

/**
 * 返回数据的通用类型
 */
interface ApiResponse<T = any> {
  errno: number
  msg?: string
  data?: T
}

/**
 * 基础 URL
 * - 优先取 Koa 服务地址（服务端环境更安全）
 */
const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'localhost:3000'}/api`

/**
 * 通用请求函数
 */
async function requestServer<T>(
  method: HttpMethod,
  path: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { params, body, headers, ...rest } = options

  // 拼接查询参数
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

  try {
    info(`[SERVER REQUEST] ${method} ${url}`)
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
      throw new Error(`HTTP ${res.status}: ${text}`)
    }

    const data = (await res.json()) as ApiResponse<T>

    // 判断业务逻辑错误
    if (data.errno !== 0) {
      logError(`[SERVER REQUEST ERROR] ${method} ${url}`, data.msg)
      throw new Error(data.msg || '服务端请求失败')
    }

    return data
  } catch (err: any) {
    logError(`[SERVER FETCH ERROR] ${method} ${url}`, err.message || err)
    throw err
  }
}

/**
 * 导出五种请求方法
 */
export const getServer = <T>(path: string, options?: FetchOptions) =>
  requestServer<T>('GET', path, options)

export const postServer = <T>(
  path: string,
  body?: any,
  options?: FetchOptions
) => requestServer<T>('POST', path, { ...options, body })

export const putServer = <T>(
  path: string,
  body?: any,
  options?: FetchOptions
) => requestServer<T>('PUT', path, { ...options, body })

export const patchServer = <T>(
  path: string,
  body?: any,
  options?: FetchOptions
) => requestServer<T>('PATCH', path, { ...options, body })

export const delServer = <T>(path: string, options?: FetchOptions) =>
  requestServer<T>('DELETE', path, options)
