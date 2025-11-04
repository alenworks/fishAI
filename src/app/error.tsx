'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  let statusCode = 500
  let message = 'Server-side Error'

  // 这里可以尝试从 error.message 中提取状态码
  if (error.message.includes('404')) {
    statusCode = 404
    message = 'Page Not Found'
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-semibold mb-4">
        {statusCode} - {message}
      </h1>
      <p className="text-gray-600 mb-6">
        Sorry, something went wrong on our end.
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Retry
      </button>
    </div>
  )
}
