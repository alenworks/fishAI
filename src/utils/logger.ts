// src/lib/logger.ts
import fs from 'fs'
import path from 'path'

// ✅ 判断是否运行在 Node.js 环境（Next Edge runtime 下不可用 fs）
const isNode = typeof process !== 'undefined' && !!process.versions?.node

// 日志目录
const logDir = isNode ? path.resolve(process.cwd(), 'logs') : ''
if (isNode && !fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true })

// 写入流
const fileLogStream = isNode
  ? fs.createWriteStream(path.join(logDir, 'next-app.log'), { flags: 'a' })
  : null

// 时间戳
const timestamp = () => new Date().toISOString()

// 工具函数：安全写入日志文件
const writeLog = (line: string) => {
  if (!isNode || !fileLogStream) return
  fileLogStream.write(line + '\n')
}

// 通用日志格式
const formatLog = (level: string, msg: string, meta?: any) => {
  const metaStr = meta ? ` ${JSON.stringify(meta, null, 2)}` : ''
  return `[${level}] ${timestamp()} - ${msg}${metaStr}`
}

// 🟩 info 日志
export const info = (msg: string, meta?: any) => {
  writeLog(formatLog('INFO', msg, meta))
}

// 🟨 warn 日志
export const warn = (msg: string, meta?: any) => {
  writeLog(formatLog('WARN', msg, meta))
}

// 🟥 error 日志（带过滤逻辑）
export const error = (err: unknown, meta?: any) => {
  if (!err) return

  // ✅ 忽略 Next.js 内部 redirect/notFound 错误
  if (
    err instanceof Error &&
    (err.message === 'NEXT_REDIRECT' || err.message === 'NEXT_NOT_FOUND')
  ) {
    return
  }

  let msg = ''
  if (err instanceof Error) {
    msg = err.stack || err.message
  } else if (typeof err === 'string') {
    msg = err
  } else {
    msg = JSON.stringify(err)
  }

  writeLog(formatLog('ERROR', msg, meta))
}

// 🌀 流式日志
export const streamLog = (message: string) => {
  writeLog(formatLog('STREAM', message))
}

// 🌐 全局错误捕获（仅在 Node 环境中使用）
export const handleProcessErrors = () => {
  if (!isNode) return

  process.on('uncaughtException', (err) => {
    error(err, { type: 'uncaughtException' })

    // ⚠️ 不要在 Next 开发环境强制退出，否则会打断热更新
    if (process.env.NODE_ENV === 'production') {
      setTimeout(() => process.exit(1), 200).unref()
    }
  })

  process.on('unhandledRejection', (reason) => {
    error(reason, { type: 'unhandledRejection' })
  })
}
