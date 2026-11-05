import { errorMessage } from '../api/errors'
import { Button } from './Button'
import { EmptyState } from './EmptyState'

type ErrorStateProps = {
  error: unknown
  onRetry?: () => void
}

/** 화면 전체를 불러오지 못했을 때. 서버 문구를 보여 주고 다시 시도할 수 있게 한다 */
export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <EmptyState
      title="화면을 불러오지 못했어요"
      description={errorMessage(error)}
      action={
        onRetry && (
          <Button variant="secondary" onClick={onRetry}>
            다시 불러오기
          </Button>
        )
      }
    />
  )
}
