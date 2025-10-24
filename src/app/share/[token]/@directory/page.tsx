import { getDocList } from './action'
import Item from './item'
export default async function Directory(props: { params: any }) {
  const params = await props.params
  const list = await getDocList()
  // const resByFilter = await searchByFilter('文档')
  // const { id } = params
  return (
    <div className="h-[800px]">
      {list.map((doc) => {
        const { id, title } = doc
        return <Item key={id} id={id} title={title} paramId={params.id} />
      })}
      {/* <div className="m-2">（会支持层级嵌套）</div> */}
    </div>
  )
}
