import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/ui/theme-provider'
import localFont from 'next/font/local'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'
import { handleProcessErrors } from '@/lib/utils/logger'
import { SessionProvider } from 'next-auth/react'
if (typeof process !== 'undefined' && process.versions?.node) {
  handleProcessErrors() // ✅ 仅在 Node.js 服务端执行一次
}
const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: '双鱼AI',
  description: 'AIGC for this',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full font-sans">
      <head>
        {/* ✅ 这里放 _document.js 中 <Head> 内的 meta/script/link 标签 */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-full`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>{children}</SessionProvider>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
