/**
 * 服务端通用请求封装（Node 端可安全使用）
 * 支持携带 cookie/session
 * 统一错误返回，不抛异常
 */

import { error as logError, info } from '@/lib/utils/logger'
import type { ApiMap } from '@/lib/apiMap'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface FetchOptions extends Omit<RequestInit, 'method'> {
  params?: Record<string, string | number | boolean | undefined>
  body?: any
  /** 可选传入 cookie，用于服务端请求携带 session */
  cookie?: string
}

/** 统一响应结构 */
export interface ApiResponse<T = any> {
  errno: number
  msg?: string
  data?: T
}

/** 基础 API 地址 */
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`
  : 'http://localhost:3000/api'

type MethodResponse<
  P extends string,
  M extends HttpMethod,
> = P extends keyof ApiMap
  ? M extends keyof ApiMap[P]
    ? ApiMap[P][M]
    : any
  : any
export async function requestServer<P extends string, M extends HttpMethod>(
  path: P,
  method: M,
  options: FetchOptions = {}
): Promise<ApiResponse<MethodResponse<P, M>>> {
  const { params, body, headers, cookie, ...rest } = options

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

  const url = `${BASE_URL}${String(path)}${queryString}`

  try {
    info(`[SERVER REQUEST] ${method} ${url}`)
    console.log(cookie, '<<< Cookie sent in server request')
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(headers || {}),
        ...(cookie ? { cookie } : {}), // 添加 cookie
      },
      body: method !== 'GET' ? JSON.stringify(body) : undefined,
      cache: 'no-store',
      redirect: 'manual', // 不自动跟随重定向
      ...rest,
    })

    // 如果返回重定向到登录页，直接返回错误
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location') || '未知地址'
      logError(`[SERVER REDIRECT] ${method} ${url}`, location)
      return { errno: -1, msg: `服务端请求被重定向到 ${location}` }
    }

    // 确认返回 JSON
    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      const text = await res.text()
      logError(
        `[SERVER NON-JSON RESPONSE] ${method} ${url}`,
        `status=${res.status}, body=${text.slice(0, 100)}...`
      )
      return { errno: -1, msg: '服务端返回非 JSON 内容' }
    }

    const data: ApiResponse<MethodResponse<P, M>> = await res.json()

    if (data.errno !== 0) {
      logError(`[SERVER BUSINESS ERROR] ${method} ${url}`, data.msg)
      return { errno: data.errno || -1, msg: data.msg || '服务端请求失败' }
    }

    return data
  } catch (err: any) {
    logError(`[SERVER FETCH ERROR] ${method} ${url}`, err.message || err)
    return { errno: -1, msg: err.message || '网络请求失败' }
  }
}

// ---------------- 5 种请求方法 ----------------

export const getServer = <P extends string>(path: P, options?: FetchOptions) =>
  requestServer(path, 'GET', options)

export const postServer = <P extends string>(
  path: P,
  body?: any,
  options?: FetchOptions
) => requestServer(path, 'POST', { ...options, body })

export const putServer = <P extends string>(
  path: P,
  body?: any,
  options?: FetchOptions
) => requestServer(path, 'PUT', { ...options, body })

export const patchServer = <P extends string>(
  path: P,
  body?: any,
  options?: FetchOptions
) => requestServer(path, 'PATCH', { ...options, body })

export const delServer = <P extends string>(path: P, options?: FetchOptions) =>
  requestServer(path, 'DELETE', options)
