import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    domains: ['avatars.githubusercontent.com'], // 添加头像域名
  },
}

export default nextConfig
