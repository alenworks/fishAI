import { fetchEventSource } from '@fortaine/fetch-event-source'

// 确保你使用的类型为 `EventSourceMessage`
interface OptionType {
  body: string | object | Blob | ArrayBuffer
  onmessage?: (ev: any) => void // 修改为 EventSourceMessage 类型
  onclose?: () => void
  maxRetries?: number
  onopen?: (res: Response) => void
  onerror?: (error: Error) => void
}

export async function fetchEventSourceFish(
  url: string,
  { body, onopen, onmessage, onclose, onerror, maxRetries = 0 }: OptionType
) {
  let attemptCount = 0 // 当前尝试次数

  // 封装请求逻辑
  const fetchWithRetry = async (ctrl: AbortController) => {
    await fetchEventSource(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(body), // 假设 `body` 是 JSON 数据，按需修改
      signal: ctrl.signal,
      async onopen(res: Response) {
        const contentType = res.headers.get('Content-Type')

        // 如果是非流式的 JSON 数据
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json()

          // 判断数据是否包含错误信息（根据具体的业务逻辑判断）
          if (!data.success) {
            throw new Error(data.errorMsg || 'Unknown error')
          }

          await onopen?.(res) // 调用 onopen 回调
        } else {
          // 如果是流式数据，不做 json 解析
          await onopen?.(res) // 调用 onopen 回调
        }
      },
      onmessage(ev: any) {
        onmessage?.(ev) // 使用 EventSourceMessage 类型的参数
      },
      onclose() {
        onclose?.() // 调用 onclose 回调
      },
      onerror(e: Error) {
        // 处理错误
        if (attemptCount < maxRetries) {
          attemptCount++
        } else {
          onerror?.(e) // 调用 onerror 回调
          throw new Error('Max retries exceeded')
        }
      },
      openWhenHidden: true,
    })
  }

  // 创建 AbortController 以支持取消请求
  const ctrl = new AbortController()
  await fetchWithRetry(ctrl) // 初次请求
}
