import MarkdownContent from '@/components/MarkdownContent'
interface AnswerComponentProp {
  askData: string
  loading?: boolean
  style?: any
}
export const AnswerComponent: React.FC<AnswerComponentProp> = ({
  askData,
  loading,
}) => {
  return (
    <div>
      <MarkdownContent data={askData} loading={loading} />
    </div>
  )
}
