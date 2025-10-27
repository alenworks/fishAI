/* eslint-disable */
// ⚙️ 自动生成文件，请勿手动修改

export interface ApiMap {
  '/ai': {
    POST: any
  }
  '/chat/stream': {
    POST: any
  }
  '/chat/useage': {
    GET: any
    POST: any
  }
  '/config': {
    GET: import('./../app/api/config/route.ts').ConfigResponse
  }
  '/doc/test-write': {
    POST: any
  }
  '/doc/[id]': {
    GET: any
    PATCH: any
  }
  '/doc/[id]/share': {
    GET: any
  }
  '/health': {
    GET: any
  }
  '/user': {
    PATCH: any
  }
}
