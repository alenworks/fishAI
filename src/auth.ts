import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import type { NextAuthConfig } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { type Adapter } from 'next-auth/adapters'
import { db } from '@/db/db'
import Email from 'next-auth/providers/nodemailer'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST, // "smtp.163.com"
        port: Number(process.env.EMAIL_SERVER_PORT), // 25
        auth: {
          user: process.env.EMAIL_SERVER_USER, // "13567481362"
          pass: process.env.EMAIL_SERVER_PASSWORD, // "LxianJIN0311"
        },
      },
      from: process.env.EMAIL_FROM, // "13567481362@163.com"
    }),
  ],
  adapter: PrismaAdapter(db) as Adapter,
  trustHost: true,
  theme: {
    logo: 'https://next-auth.js.org/img/logo/logo-sm.png',
  },
  basePath: '/auth',
  // pages: {
  //   signIn: '/login',
  // },
  callbacks: {
    authorized({}) {
      // const { pathname } = request.nextUrl
      // if (pathname.startsWith('/write/')) return !!auth
      return true
    },
    jwt({ token, trigger, session }) {
      if (trigger === 'update') token.name = session.user.name
      return token
    },
  },
} satisfies NextAuthConfig)
