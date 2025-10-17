'use client'

import { toast } from 'sonner'

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

async function request<T>(
  method: HttpMethod,
  path: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
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

  const url = `${BASE_URL}${path}${queryString}`

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

    let data: ApiResponse<T>

    try {
      data = await res.json()
    } catch {
      data = { errno: -1, msg: '返回数据解析失败' }
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
    return { errno: -1, msg: err.message || '网络错误' }
  } finally {
    if (loadingId) toast.dismiss(loadingId)
  }
}

// ------------------ 导出方法 ------------------
export const get = <T>(path: string, options?: FetchOptions) =>
  request<T>('GET', path, options)

export const post = <T>(path: string, body?: any, options?: FetchOptions) =>
  request<T>('POST', path, { ...options, body })

export const put = <T>(path: string, body?: any, options?: FetchOptions) =>
  request<T>('PUT', path, { ...options, body })

export const patch = <T>(path: string, body?: any, options?: FetchOptions) =>
  request<T>('PATCH', path, { ...options, body })

export const del = <T>(path: string, options?: FetchOptions) =>
  request<T>('DELETE', path, options)
