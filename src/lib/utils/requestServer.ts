/**
 * 服务端通用请求封装（Node 端可安全使用）
 * - 用于 Next.js API Route、Server Component、Edge Functions 等
 */

import { error as logError, info } from '@/lib/utils/logger'
import type { ApiMap } from '@/lib/apiMap'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface FetchOptions extends Omit<RequestInit, 'method'> {
  params?: Record<string, string | number | boolean | undefined>
  body?: any
}

/** 统一响应结构 */
export interface ApiResponse<T = any> {
  errno: number
  msg?: string
  data?: T
}

/**
 * 🌍 基础 API 地址
 * - 服务端优先使用环境变量中的后端地址
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`
  : 'http://localhost:3000/api'

/**
 * 泛型工具：根据 path 和 method 返回对应类型（若不存在则 any）
 */
type MethodResponse<
  P extends string,
  M extends HttpMethod,
> = P extends keyof ApiMap
  ? M extends keyof ApiMap[P]
    ? ApiMap[P][M]
    : any
  : any

/**
 * 通用请求函数（支持类型自动推导）
 */
async function requestServer<P extends string, M extends HttpMethod>(
  path: P,
  method: M,
  options: FetchOptions = {}
): Promise<ApiResponse<MethodResponse<P, M>>> {
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

  const url = `${BASE_URL}${String(path)}${queryString}`

  try {
    info(`[SERVER REQUEST] ${method} ${url}`)

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(headers || {}),
      },
      body: method !== 'GET' ? JSON.stringify(body) : undefined,
      cache: 'no-store', // 🚫 禁止缓存
      ...rest,
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`HTTP ${res.status}: ${text}`)
    }

    const data = (await res.json()) as ApiResponse<MethodResponse<P, M>>

    if (data.errno !== 0) {
      logError(`[SERVER BUSINESS ERROR] ${method} ${url}`, data.msg)
      throw new Error(data.msg || '服务端请求失败')
    }

    return data
  } catch (err: any) {
    logError(`[SERVER FETCH ERROR] ${method} ${url}`, err.message || err)
    throw err
  }
}

/** 导出 5 种请求方法（自动推导类型） */
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
