import { searchDocById } from './action'
import Title from './title'
import Content from './content'
export default async function Write(props: {
  params: Promise<{ id: string }>
}) {
  const { params } = props
  const { id } = await params

  const doc = await searchDocById(id)

  if (!doc) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>找不到文档...</p>
      </div>
    )
  }

  return (
    <>
      <Title id={doc?.id} title={doc?.title} />
      <Content id={doc?.id} content={doc.content} />
    </>
  )
}
