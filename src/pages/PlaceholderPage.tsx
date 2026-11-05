import { AppBar } from '../components/AppBar'
import { EmptyState } from '../components/EmptyState'

type PlaceholderPageProps = {
  title: string
  ticket: string
}

/** 아직 만들지 않은 화면. 해당 Jira 작업에서 진짜 화면으로 바꾼다 */
export function PlaceholderPage({ title, ticket }: PlaceholderPageProps) {
  return (
    <>
      <AppBar title={title} back />
      <EmptyState title="아직 만들지 않은 화면이에요" description={`${ticket} 작업에서 만들어요.`} />
    </>
  )
}
