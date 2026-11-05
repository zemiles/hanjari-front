import { Link } from 'react-router'
import { AppBar } from '../components/AppBar'
import { EmptyState } from '../components/EmptyState'

export function NotFoundPage() {
  return (
    <>
      <AppBar title="한자리" back />
      <EmptyState
        title="없는 주소예요"
        description="링크가 잘못됐거나 지워진 화면이에요. 받은 링크를 다시 확인해 주세요."
        action={
          <Link to="/" className="font-semibold text-seat underline underline-offset-4">
            처음 화면으로 가기
          </Link>
        }
      />
    </>
  )
}
