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
async function request<
  Path extends keyof ApiMap,
  Method extends keyof ApiMap[Path] & HttpMethod,
>(
  path: Path,
  method: Method,
  options: FetchOptions = {}
): Promise<ApiResponse<ApiMap[Path][Method]>> {
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
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(headers || {}),
      },
      body: method !== 'GET' ? JSON.stringify(body) : undefined,
      ...rest,
    })

    let data: ApiResponse<ApiMap[Path][Method]>

    try {
      data = await res.json()
    } catch {
      data = { errno: -1, msg: '返回数据解析失败' } as any
    }

    if (!res.ok) {
      data.errno = res.status
      data.msg = data.msg || res.statusText || '请求失败'
    }

    // 自动 toast 提示
    if (showToast) {
      if (data.errno === 0) {
        // toast.success(data.msg || '操作成功')
      } else if (data.errno === 401) {
        toast.error(data.msg || '未授权')
      } else if (data.errno !== 0) {
        toast.error(data.msg || '操作失败')
      }
    }

    return data
  } catch (err: any) {
    console.error('API Error:', err)
    if (showToast) toast.error(err.message || '网络错误，请稍后再试')
    return { errno: -1, msg: err.message || '网络错误' } as ApiResponse<
      ApiMap[Path][Method]
    >
  } finally {
    if (loadingId) toast.dismiss(loadingId)
  }
}

// ------------------ 封装便捷方法 ------------------

export const get = <Path extends keyof ApiMap>(
  path: Path,
  options?: FetchOptions
) => request(path, 'GET' as any, options as any)

export const post = <Path extends keyof ApiMap>(
  path: Path,
  body?: any,
  options?: FetchOptions
) => request(path, 'POST' as any, { ...options, body } as any)

export const put = <Path extends keyof ApiMap>(
  path: Path,
  body?: any,
  options?: FetchOptions
) => request(path, 'PUT' as any, { ...options, body } as any)

export const patch = <Path extends keyof ApiMap>(
  path: Path,
  body?: any,
  options?: FetchOptions
) => request(path, 'PATCH' as any, { ...options, body } as any)

export const del = <Path extends keyof ApiMap>(
  path: Path,
  options?: FetchOptions
) => request(path, 'DELETE' as any, options as any)
