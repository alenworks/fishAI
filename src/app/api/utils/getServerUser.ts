// lib/auth.ts
import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function getServerUser(req: NextRequest) {
  try {
    // 使用 next-auth 提供的 getToken 获取 JWT payload
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET, // 你的 NextAuth secret
    })

    // token 为 null 表示未登录
    if (!token) return null

    // token 就是 JWT payload，包含你在 jwt() callback 中扩展的字段
    // 例如: { sub: 'userId', email, name, role, iat, exp }
    // 你可以根据需要映射成 user 对象
    return {
      id: token.sub ?? '',
      email: token.email,
      name: token.name,
      role: token.role,
      image: token.picture,
    }
  } catch (err) {
    console.error('getServerUser error', err)
    return null
  }
}
