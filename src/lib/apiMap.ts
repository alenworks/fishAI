/* eslint-disable */
// ⚙️ 自动生成文件，请勿手动修改

// Minimal declarations for ReturnType usage
declare function GET(...args: any[]): Promise<{ data: any }>
declare function POST(...args: any[]): Promise<{ data: any }>
declare function PATCH(...args: any[]): Promise<{ data: any }>
declare function PUT(...args: any[]): Promise<{ data: any }>
declare function DELETE(...args: any[]): Promise<{ data: any }>

export interface ApiMap {
  '/ai': {
    POST: Awaited<ReturnType<typeof POST>>['data']
  }
  '/chat/stream': {
    POST: Awaited<ReturnType<typeof POST>>['data']
  }
  '/chat/useage': {
    GET: Awaited<ReturnType<typeof GET>>['data']
    POST: Awaited<ReturnType<typeof POST>>['data']
  }
  '/config': {
    GET: Awaited<ReturnType<typeof GET>>['data']
  }
  '/doc/test-write': {
    POST: Awaited<ReturnType<typeof POST>>['data']
  }
  '/doc/[id]': {
    GET: Awaited<ReturnType<typeof GET>>['data']
    PATCH: Awaited<ReturnType<typeof PATCH>>['data']
  }
  '/doc/[id]/share': {
    POST: Awaited<ReturnType<typeof POST>>['data']
  }
  '/health': {
    GET: Awaited<ReturnType<typeof GET>>['data']
  }
  '/user': {
    PATCH: Awaited<ReturnType<typeof PATCH>>['data']
  }
}
