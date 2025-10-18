import fs from 'fs'
import path from 'path'
import * as rfs from 'rotating-file-stream'

const isNode = typeof process !== 'undefined' && !!process.versions?.node

const logDir = isNode ? path.resolve(process.cwd(), 'logs') : ''
if (isNode && !fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true })

const accessLogStream = isNode
  ? rfs.createStream(
      (time, index) => {
        if (!time) return 'next-app.log'
        const d = time instanceof Date ? time : new Date(time)
        const date = d.toISOString().split('T')[0]
        return `next-app-${date}${index ? `.${index}` : ''}.log.gz`
      },
      {
        interval: '1d',
        path: logDir,
        maxSize: '50M',
        compress: 'gzip',
        size: '50M',
      }
    )
  : null

const timestamp = () => new Date().toISOString()

const writeLog = (line: string) => {
  if (!isNode || !accessLogStream) return
  accessLogStream.write(line + '\n')
}

const formatLog = (level: string, msg: string, meta?: any) => {
  const metaStr = meta ? ` ${JSON.stringify(meta, null, 2)}` : ''
  return `[${level}] ${timestamp()} - ${msg}${metaStr}`
}

export const info = (msg: string, meta?: any) =>
  writeLog(formatLog('INFO', msg, meta))
export const warn = (msg: string, meta?: any) =>
  writeLog(formatLog('WARN', msg, meta))
export const error = (err: unknown, meta?: any) => {
  if (!err) return
  if (
    err instanceof Error &&
    ['NEXT_REDIRECT', 'NEXT_NOT_FOUND'].includes(err.message)
  )
    return
  const msg =
    err instanceof Error
      ? err.stack || err.message
      : typeof err === 'string'
        ? err
        : JSON.stringify(err)
  writeLog(formatLog('ERROR', msg, meta))
}
export const streamLog = (message: string) =>
  writeLog(formatLog('STREAM', message))

export const handleProcessErrors = () => {
  if (!isNode) return
  process.on('uncaughtException', (err) => {
    error(err, { type: 'uncaughtException' })
    if (process.env.NODE_ENV === 'production')
      setTimeout(() => process.exit(1), 200).unref()
  })
  process.on('unhandledRejection', (reason) =>
    error(reason, { type: 'unhandledRejection' })
  )
}
