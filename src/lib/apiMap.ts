/* eslint-disable */
// ⚙️ 自动生成文件，请勿手动修改

export interface ApiMap {
  '/ai': {
    POST: Awaited<
      ReturnType<(typeof import('./../app/api/ai/route.ts'))['POST']>
    > extends never
      ? any
      : Awaited<ReturnType<(typeof import('./../app/api/ai/route.ts'))['POST']>>
  }
  '/chat/stream': {
    POST: Awaited<
      ReturnType<(typeof import('./../app/api/chat/stream/route.ts'))['POST']>
    > extends never
      ? any
      : Awaited<
          ReturnType<
            (typeof import('./../app/api/chat/stream/route.ts'))['POST']
          >
        >
  }
  '/chat/useage': {
    GET: Awaited<
      ReturnType<(typeof import('./../app/api/chat/useage/route.ts'))['GET']>
    > extends never
      ? any
      : Awaited<
          ReturnType<
            (typeof import('./../app/api/chat/useage/route.ts'))['GET']
          >
        >
    POST: Awaited<
      ReturnType<(typeof import('./../app/api/chat/useage/route.ts'))['POST']>
    > extends never
      ? any
      : Awaited<
          ReturnType<
            (typeof import('./../app/api/chat/useage/route.ts'))['POST']
          >
        >
  }
  '/config': {
    GET: Awaited<
      ReturnType<(typeof import('./../app/api/config/route.ts'))['GET']>
    > extends never
      ? any
      : Awaited<
          ReturnType<(typeof import('./../app/api/config/route.ts'))['GET']>
        >
  }
  '/doc/test-write': {
    POST: Awaited<
      ReturnType<
        (typeof import('./../app/api/doc/test-write/route.ts'))['POST']
      >
    > extends never
      ? any
      : Awaited<
          ReturnType<
            (typeof import('./../app/api/doc/test-write/route.ts'))['POST']
          >
        >
  }
  '/doc/[id]': {
    GET: Awaited<
      ReturnType<(typeof import('./../app/api/doc/[id]/route.ts'))['GET']>
    > extends never
      ? any
      : Awaited<
          ReturnType<(typeof import('./../app/api/doc/[id]/route.ts'))['GET']>
        >
    PATCH: Awaited<
      ReturnType<(typeof import('./../app/api/doc/[id]/route.ts'))['PATCH']>
    > extends never
      ? any
      : Awaited<
          ReturnType<(typeof import('./../app/api/doc/[id]/route.ts'))['PATCH']>
        >
  }
  '/doc/[id]/share': {
    POST: Awaited<
      ReturnType<
        (typeof import('./../app/api/doc/[id]/share/route.ts'))['POST']
      >
    > extends never
      ? any
      : Awaited<
          ReturnType<
            (typeof import('./../app/api/doc/[id]/share/route.ts'))['POST']
          >
        >
  }
  '/health': {
    GET: Awaited<
      ReturnType<(typeof import('./../app/api/health/route.ts'))['GET']>
    > extends never
      ? any
      : Awaited<
          ReturnType<(typeof import('./../app/api/health/route.ts'))['GET']>
        >
  }
  '/user': {
    PATCH: Awaited<
      ReturnType<(typeof import('./../app/api/user/route.ts'))['PATCH']>
    > extends never
      ? any
      : Awaited<
          ReturnType<(typeof import('./../app/api/user/route.ts'))['PATCH']>
        >
  }
}
