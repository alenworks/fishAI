import { create, search, searchByFilter } from './action'
import CreateSubmitButton from './CreateSubmitButton'
import Item from './item'
export default async function Directory(props: { params: any }) {
  const params = await props.params
  const docRes = await search()
  const resByFilter = await searchByFilter('文档')
  const { id } = params

  console.log(docRes, resByFilter, id)
  return (
    <div className=" h-[800px]">
      {docRes.map((item) => (
        <Item
          key={item.id}
          id={item.id}
          title={item.title}
          isCurrent={item.id === params.id}
        />
      ))}
      {/* <div className="m-2">（会支持层级嵌套）</div> */}
      <form action={create}>
        <CreateSubmitButton />
      </form>
    </div>
  )
}
