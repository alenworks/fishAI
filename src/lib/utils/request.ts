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

/** 自动类型推导 */
type MethodResponse<
  Path extends keyof ApiMap,
  M extends HttpMethod,
> = M extends keyof ApiMap[Path] ? ApiMap[Path][M] : any

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`
  : '/api'

async function request<M extends HttpMethod, P extends keyof ApiMap | string>(
  method: M,
  path: P,
  options: FetchOptions = {}
): Promise<
  P extends keyof ApiMap ? ApiResponse<MethodResponse<P, M>> : ApiResponse<any>
> {
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

  // ✅ 判断是否是 FormData（用于上传文件）
  const isFormData = body instanceof FormData

  try {
    const res = await fetch(url, {
      method,
      headers: isFormData
        ? headers // ✅ 不要手动加 Content-Type
        : { 'Content-Type': 'application/json', ...(headers || {}) },
      body:
        method !== 'GET'
          ? isFormData
            ? body // ✅ 直接传 FormData
            : JSON.stringify(body ?? {})
          : undefined,
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
      if (data.errno === 401) toast.error(data.msg || '未授权')
      else if (data.errno !== 0) toast.error(data.msg || '操作失败')
    }

    return data as any
  } catch (err: any) {
    console.error('API Error:', err)
    if (showToast) toast.error(err.message || '网络错误，请稍后再试')
    return { errno: -1, msg: err.message || '网络错误' } as any
  } finally {
    if (loadingId) toast.dismiss(loadingId)
  }
}

// ------------------ 便捷方法 ------------------

export const get = <P extends keyof ApiMap | string>(
  path: P,
  options?: FetchOptions
) => request<'GET', P>('GET', path, options)

export const post = <P extends keyof ApiMap | string>(
  path: P,
  body?: any,
  options?: FetchOptions
) => request<'POST', P>('POST', path, { ...options, body })

export const put = <P extends keyof ApiMap | string>(
  path: P,
  body?: any,
  options?: FetchOptions
) => request<'PUT', P>('PUT', path, { ...options, body })

export const patch = <P extends keyof ApiMap | string>(
  path: P,
  body?: any,
  options?: FetchOptions
) => request<'PATCH', P>('PATCH', path, { ...options, body })

export const del = <P extends keyof ApiMap | string>(
  path: P,
  options?: FetchOptions
) => request<'DELETE', P>('DELETE', path, options)
