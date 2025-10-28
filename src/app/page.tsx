import { Card } from '@/components/ui/card'
import {
  FileText,
  Sparkles,
  Users,
  Zap,
  MessageSquare,
  PenTool,
} from 'lucide-react'
import StartButton from './start-button'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            <span className="text-xl font-semibold">双鱼AI</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              功能特性
            </a>
            <a
              href="#about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              关于我们
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm">
            <Sparkles className="h-4 w-4" />
            <span>AI 驱动的智能文档平台</span>
          </div>
          <h1 className="mb-6 text-balance text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            让文档创作
            <br />
            <span className="text-muted-foreground">更智能、更高效</span>
          </h1>
          <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
            集文档管理、富文本编辑、协作编辑和 AI 写作于一体的现代化工作平台。
            让团队协作更流畅，让创作更轻松。
          </p>
          <div className="flex flex-col items-center justify-center gap-4">
            <StartButton />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section
        id="features"
        className="border-t border-border bg-muted/30 py-20"
      >
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              强大的功能特性
            </h2>
            <p className="text-lg text-muted-foreground">
              一站式解决您的文档创作和管理需求
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="group relative overflow-hidden border-0 p-6 hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 group-hover:from-blue-500/20 group-hover:to-cyan-500/20 transition-all" />
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">文档管理</h3>
                <p className="text-muted-foreground">
                  强大的文档组织系统,支持文件夹、标签和快速搜索,让您的文档井井有条。
                </p>
              </div>
            </Card>

            <Card className="group relative overflow-hidden border-0 p-6 hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all" />
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
                  <PenTool className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">富文本编辑</h3>
                <p className="text-muted-foreground">
                  所见即所得的编辑体验,支持 Markdown、代码块、表格等多种格式。
                </p>
              </div>
            </Card>

            <Card className="group relative overflow-hidden border-0 p-6 hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 group-hover:from-green-500/20 group-hover:to-emerald-500/20 transition-all" />
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">协作编辑</h3>
                <p className="text-muted-foreground">
                  实时协作编辑,团队成员可以同时编辑文档,即时看到彼此的更改。
                </p>
              </div>
            </Card>

            <Card className="group relative overflow-hidden border-0 p-6 hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 group-hover:from-amber-500/20 group-hover:to-orange-500/20 transition-all" />
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">AI 写作助手</h3>
                <p className="text-muted-foreground">
                  智能续写、内容扩展、风格改写,让 AI 成为您的创作伙伴。
                </p>
              </div>
            </Card>

            <Card className="group relative overflow-hidden border-0 p-6 hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-red-500/10 group-hover:from-rose-500/20 group-hover:to-red-500/20 transition-all" />
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-red-500 text-white shadow-lg">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">AI 文本优化</h3>
                <p className="text-muted-foreground">
                  一键优化文本表达,改善语法、提升可读性,让您的文档更专业。
                </p>
              </div>
            </Card>

            <Card className="group relative overflow-hidden border-0 p-6 hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 group-hover:from-indigo-500/20 group-hover:to-violet-500/20 transition-all" />
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">AI 智能对话</h3>
                <p className="text-muted-foreground">
                  随时与 AI 助手对话,获取写作建议、内容灵感和问题解答。
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              准备好开始了吗？
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              立即登录,体验更智能的文档创作方式
            </p>
            <StartButton />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <span className="font-semibold">双鱼AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                让文档创作更智能、更高效
              </p>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">产品</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#features"
                    className="hover:text-foreground transition-colors"
                  >
                    功能特性
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    更新日志
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">公司</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#about"
                    className="hover:text-foreground transition-colors"
                  >
                    关于我们
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    博客
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    招聘
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">支持</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    帮助中心
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    联系我们
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    隐私政策
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            © 2025 双鱼AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
