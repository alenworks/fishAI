# doublefishai-web

双鱼 AI 项目 PC 客户端，基于 **Next.js** 开发，支持文档协作、AI 生成、实时编辑等功能。

## 目录

- [项目简介](#项目简介)
- [技术栈](#技术栈)
- [功能特性](#功能特性)
- [环境配置](#环境配置)
- [本地运行](#本地运行)
- [数据库操作](#数据库操作)
- [常见问题](#常见问题)
- [贡献指南](#贡献指南)

---

## 项目简介

`doublefishai-web` 是双鱼 AI 的 PC 客户端应用，主要功能包括：

- AI 文档生成与协作
- 多人实时编辑
- AI 辅助内容推荐
- 可在本地、测试环境及云端环境部署

---

## 技术栈

- 前端：Next.js 15+
- UI 框架：Tailwind CSS / Ant Design（可根据项目情况调整）
- 后端：Next.js API Routes
- 数据库：PostgreSQL / MySQL（Prisma ORM）
- 部署：Docker / 阿里云函数计算（FC）
- 实时协作：WebSocket / Hocuspocus Provider / Yjs

---

## 功能特性

1. **文档协作**：多人实时编辑同一文档，支持内容同步。
2. **AI 辅助生成**：根据输入提示自动生成文本、摘要或推荐内容。
3. **用户管理**：用户注册、登录及权限管理。
4. **多环境部署**：支持本地、测试环境、预发环境及线上环境。
5. **安全认证**：JWT 或 Session 管理用户登录状态。

---

## 环境配置

以下是 `doublefishai-web` 项目的 `.env` 示例，所有敏感信息已脱敏，并标注了如何获取。

# ------------------------------

# 数据库配置（Supabase / PostgreSQL）

# ------------------------------

# 连接池方式连接数据库（用于日常运行）

DATABASE_URL="postgresql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:6543/<DB_NAME>?pgbouncer=true"

# <DB_USER>/<DB_PASSWORD>/<DB_HOST>/<DB_NAME> 可在 Supabase 控制台获取

# 直接连接数据库（用于迁移）

DIRECT_URL="postgresql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:5432/<DB_NAME>"

# 用于 prisma migrate 等操作，端口 5432 是默认 PostgreSQL 端口

# ------------------------------

# NextAuth / 用户认证配置

# ------------------------------

# 通用加密密钥，用于 session、JWT 等

AUTH_SECRET="<YOUR_SECRET_KEY>"

# Linux: `openssl rand -hex 32` 或 https://generate-secret.vercel.app/32

# GitHub OAuth

AUTH_GITHUB_ID="<YOUR_GITHUB_OAUTH_CLIENT_ID>"
AUTH_GITHUB_SECRET="<YOUR_GITHUB_OAUTH_CLIENT_SECRET>"

# 在 GitHub 开发者设置 -> OAuth Apps 创建应用获取

# NextAuth URL 与路径

NEXTAUTH_URL="http://localhost:3000" # 本地开发地址
NEXTAUTH_BASE_PATH="/auth" # 可保持默认

# ------------------------------

# 邮件服务配置（用于通知 / 注册邮件）

# ------------------------------

EMAIL_SERVER_HOST="<SMTP_HOST>" # 例如 smtp.qq.com
EMAIL_SERVER_PORT="<SMTP_PORT>" # 一般 587 或 465
EMAIL_SERVER_USER="<EMAIL_ACCOUNT>" # 发件邮箱账号
EMAIL_SERVER_PASSWORD="<EMAIL_PASSWORD>" # 邮箱授权码或密码
EMAIL_FROM="<EMAIL_FROM_ADDRESS>" # 显示发件人

# ------------------------------

# 阿里云 OSS 上传配置

# ------------------------------

Upload_ID="<ALIYUN_UPLOAD_ID>" # 阿里云账号访问 ID
Upload_ID_SECRET="<ALIYUN_UPLOAD_SECRET>" # 阿里云账号访问密钥
OSS_ACCESS_KEY_ID="<ALIYUN_OSS_ACCESS_KEY_ID>" # OSS Access Key ID
OSS_ACCESS_KEY_SECRET="<ALIYUN_OSS_ACCESS_KEY_SECRET>" # OSS Access Key Secret

# 可在阿里云控制台 -> RAM 用户 -> 创建 AccessKey 获取

# ------------------------------

# 其他可选配置

# ------------------------------

# 服务地址

NEXT_PUBLIC_API_BASE_URL = "http://localhost:3000"
KOA_PUBLIC_API_BASE_URL = "http://localhost:3001"
NEXT_PUBLIC_HOCUSPOCUS_BASE_URL = "ws://localhost:1234"

# Redis（可选，用于协作、缓存）

REDIS_URL="redis://localhost:6379"

# 如果使用 Redis 集群或云服务，修改 host/port

# 应用端口

PORT=3000

## 本地运行

git clone 项目。

执行以下命令：

## 安装依赖

npm i pnpm -g
pnpm install # 推荐pnpm

## 数据库初始化与 Prisma Client 生成

pnpm run db:push # 将 Prisma schema 同步到数据库
npx prisma generate # 生成 Prisma Client

## 启动开发环境

pnpm run dev

## 打开浏览器访问

http://localhost:3000

## 数据库操作

1. pnpm run db:push #同步 Prisma schema

2. npx prisma migrate dev #数据库迁移

3. npx prisma studio #可视化管理数据库

## 常见问题

1. 数据库连接失败
   检查 .env 中 DATABASE_URL 配置是否正确
   检车是否能连接到supebase，有条件考虑挂代理

2. next.js 报错
   rm -rf node_modules package-lock.json
   pnpm install

## 贡献指南

1. Fork 本仓库

2. 新建 feature 分支：feature/xxx

3. 提交代码并发起 PR

4. PR 通过后合并到 test-deploy 分支进行测试
