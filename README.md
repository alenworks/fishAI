# doublefishai-web

双鱼 AI 项目 PC 客户端，使用 Next.js 开发。

## 本地运行

git clone 项目。

执行以下命令：

```
npm install
npm run db:push
npx prisma generate
npm run dev
```

## 发布到测试环境

提交 `test-deploy` 分支到 Github ，会触发 GitHub Action 使用 Docker 部署测试环境

注意，其中 `.npmrc` 和 `.env` 文件是在 deploy-test.yml 中动态创建的，内容设置在 GitHub Action Secrets 中

PS：可参考本地的 `.npmrc` 和 `.env.test` 文件

## 发布到阿里云 FC

不同的 git 分支对应不同的环境，把代码提交到该分支，会触发阿里云 FC 应用重新部署。

- 内测环境 `test-deploy`
- 预发环境 `preview-test-deploy`
- 线上环境 `master`

## AI接口服务仓库
https://github.com/alenworks/koa-ai-server
## 协同编辑服务仓库
https://github.com/alenworks/koa-hocuspocus-server
## 心跳检测服务仓库
https://github.com/alenworks/monitor-health-server


