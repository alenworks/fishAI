import { info, error } from '@/lib/utils/logger'

export function withLogging(handler: (req: Request) => Promise<Response>) {
  return async (req: Request): Promise<Response> => {
    const start = Date.now()
    const url = req.url
    const method = req.method

    try {
      const res = await handler(req)

      // ✅ 确保 handler 返回的是 Response
      if (!(res instanceof Response)) {
        throw new Error('Handler did not return a Response object')
      }

      const duration = Date.now() - start
      info(`[${method}] ${url} ${res.status} - ${duration}ms`)
      return res
    } catch (err: any) {
      const duration = Date.now() - start
      error(`[${method}] ${url} - ERROR after ${duration}ms`, {
        message: err?.message,
        stack: err?.stack,
      })

      // ✅ 返回标准化 Response，而不是 undefined
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Internal Server Error',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }
}
