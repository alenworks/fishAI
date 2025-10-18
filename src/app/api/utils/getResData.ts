// src/app/api/utils/getResData.ts

/** 通用接口响应结构 */
export interface ApiResponse<T = any> {
  errno: number
  msg?: string
  data?: T
}

/** 401 未授权 */
export function genUnAuthData(msg?: string): ApiResponse<null> {
  return { errno: 401, msg: msg || 'Unauthorized' }
}

/** 200 成功 */
export function genSuccessData<T = any>(data?: T): ApiResponse<T> {
  const res: ApiResponse<T> = { errno: 0 }
  if (data !== undefined) res.data = data
  return res
}

/** -1 服务端错误 */
export function genErrorData(msg?: string): ApiResponse<null> {
  return { errno: -1, msg: msg || 'server error' }
}
