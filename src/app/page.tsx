import { HomeNav, Slogan } from '@/components'
import StartButton from './start-button'
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center text-center">
      <HomeNav />
      <h2 className="scroll-m-20 text-4xl tracking-tight lg:text-5xl">
        <span className="font-extrabold">双鱼 AI</span>，智启笔端，创意无限
      </h2>
      <Slogan />
      <section className="mt-10 flex justify-center space-x-4">
        <StartButton />
      </section>
    </main>
  )
}
