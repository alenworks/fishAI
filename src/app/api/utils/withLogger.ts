import { info, error } from '@/lib/utils/logger'

export function withLogging(handler: (req: Request) => Promise<Response>) {
  return async (req: Request): Promise<Response> => {
    const start = Date.now()
    const url = req.url
    const method = req.method

    try {
      const res = await handler(req)

      // ✅ 确保 handler 返回 Response
      if (!(res instanceof Response)) {
        throw new Error('Handler did not return a Response object')
      }

      const duration = Date.now() - start
      info(`[${method}] ${url} ${res.status} - ${duration}ms`)
      return res
    } catch (err: any) {
      const duration = Date.now() - start

      // 记录详细错误日志
      error(`[${method}] ${url} - ERROR after ${duration}ms`, {
        message: err?.message,
        stack: err?.stack,
      })

      // ✅ 判断是否在开发环境
      const isDev = process.env.NODE_ENV !== 'production'

      const body = {
        success: false,
        message: isDev
          ? err?.message || 'Internal Server Error'
          : 'Internal Server Error',
        ...(isDev && err?.stack ? { stack: err.stack } : {}),
      }

      return new Response(JSON.stringify(body), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }
}
