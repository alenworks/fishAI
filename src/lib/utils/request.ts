'use client'

import { toast } from 'sonner'
import type { ApiMap } from '../apiMap'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface FetchOptions extends Omit<RequestInit, 'method'> {
  params?: Record<string, string | number | boolean | undefined>
  body?: any
  showToast?: boolean
  showLoading?: boolean
}

/** 统一响应结构 */
export interface ApiResponse<T = any> {
  errno: number
  msg?: string
  data?: T
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`
  : '/api'

/**
 * 🌟 自动类型推导：
 * Path 会从 ApiMap 自动推导，返回类型对应 path 对应 method 的 data 类型
 */

type MethodResponse<
  Path extends string,
  M extends HttpMethod,
> = Path extends keyof ApiMap
  ? M extends keyof ApiMap[Path]
    ? ApiMap[Path][M]
    : any
  : any

async function request<M extends HttpMethod, P extends string>(
  method: M,
  path: P,
  options: FetchOptions = {}
): Promise<ApiResponse<MethodResponse<P, M>>> {
  const {
    params,
    body,
    headers,
    showToast = true,
    showLoading = false,
    ...rest
  } = options

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

  const loadingId = showLoading ? toast.loading('加载中...') : undefined

  try {
    const res = await fetch(url, {
      method: method as string,
      headers: {
        'Content-Type': 'application/json',
        ...(headers || {}),
      },
      body: method !== 'GET' ? JSON.stringify(body) : undefined,
      ...rest,
    })

    let data: ApiResponse<any>
    try {
      data = await res.json()
    } catch {
      data = { errno: -1, msg: '返回数据解析失败' }
    }

    if (!res.ok) {
      data.errno = res.status
      data.msg = data.msg || res.statusText || '请求失败'
    }

    if (showToast) {
      if (data.errno === 0) {
        // optionally show success
      } else if (data.errno === 401) {
        toast.error(data.msg || '未授权')
      } else if (data.errno !== 0) {
        toast.error(data.msg || '操作失败')
      }
    }

    // 类型断言：返回的 data 类型由泛型决定（MethodResponse）
    return data as ApiResponse<MethodResponse<P, M>>
  } catch (err: any) {
    console.error('API Error:', err)
    if (showToast) toast.error(err.message || '网络错误，请稍后再试')
    return { errno: -1, msg: err.message || '网络错误' } as ApiResponse<
      MethodResponse<P, M>
    >
  } finally {
    if (loadingId) toast.dismiss(loadingId)
  }
}

// ------------------ 封装便捷方法 ------------------

export const get = <P extends string>(path: P, options?: FetchOptions) =>
  request<'GET', P>('GET', path, options)

export const post = <P extends string>(
  path: P,
  body?: any,
  options?: FetchOptions
) => request<'POST', P>('POST', path, { ...options, body })

export const put = <P extends string>(
  path: P,
  body?: any,
  options?: FetchOptions
) => request<'PUT', P>('PUT', path, { ...options, body })

export const patch = <P extends string>(
  path: P,
  body?: any,
  options?: FetchOptions
) => request<'PATCH', P>('PATCH', path, { ...options, body })

export const del = <P extends string>(path: P, options?: FetchOptions) =>
  request<'DELETE', P>('DELETE', path, options)
