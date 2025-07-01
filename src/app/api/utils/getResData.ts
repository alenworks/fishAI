export function genUnAuthData(msg?: string) {
  return { errno: 401, msg: msg || 'Unauthorized' }
}

export function genSuccessData(data?: any) {
  const res: any = { errno: 0 }
  if (data) res.data = data
  return res
}

export function genErrorData(msg?: string) {
  return { errno: -1, msg: msg || 'server error' }
}
