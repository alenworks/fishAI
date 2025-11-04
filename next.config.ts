import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    domains: ['avatars.githubusercontent.com'], // 添加头像域名
  },
  experimental: {
    reactCompiler: true,
  },
  reactStrictMode: true,
}

export default nextConfig
