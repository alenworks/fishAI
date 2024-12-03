import Link from 'next/link'
export function Logo() {
  return (
    <Link href="/" className="blog w-30 overflow-hidden">
      <h1 className="font-bold text-xl bg-muted w-32">
        &nbsp;双鱼&nbsp;
        <span className="text-background bg-foreground">
          &nbsp;AI写作&nbsp;
        </span>
      </h1>
    </Link>
  )
}
