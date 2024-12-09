import { FileText } from 'lucide-react'
export default async function Directory(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  const { id } = params
  return (
    <div className=" h-[800px]">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div
          key={i}
          className="inline-flex items-center w-full p-2 py-1 cursor-pointer hover:bg-card hover:text-secondary-foreground"
        >
          <FileText className="h-4 w-4" />
          &nbsp;动物农场{i} {id}
        </div>
      ))}
      <div className="m-2">（会支持层级嵌套）</div>
    </div>
  )
}
