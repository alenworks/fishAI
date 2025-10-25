import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Email from 'next-auth/providers/nodemailer'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/db/db'
import type { NextAuthConfig } from 'next-auth'
import type { Adapter } from 'next-auth/adapters'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],

  // ✅ 使用 PrismaAdapter 仍然是可以的（它只负责用户信息，不影响 JWT session）
  adapter: PrismaAdapter(db) as Adapter,

  // ✅ 保持 JWT 模式
  session: {
    strategy: 'jwt',
  },

  trustHost: true,
  theme: {
    logo: 'https://next-auth.js.org/img/logo/logo-sm.png',
  },
  pages: {
    signIn: '/signin',
    verifyRequest: '/signin/verifyRequest',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 首次登录时，user 存在，附加信息到 token
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.image = user.image
      }

      // 如果是 “update session” 触发，合并新 session 数据
      if (trigger === 'update' && session?.user) {
        token.name = session.user.name
      }

      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          name: token.name,
          email: token.email || '',
          image: token.image || null,
        },
      } as any
    },
    authorized() {
      // 可选：控制哪些路由需要登录
      return true
    },
  },
} satisfies NextAuthConfig)
