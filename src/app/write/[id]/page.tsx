import Content from './(content)/content'

export default async function Write(props: {
  params: Promise<{ id: string }>
}) {
  const { params } = props
  const { id } = await params

  return <Content id={id} />
}
