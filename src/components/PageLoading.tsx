import { Spinner } from './Spinner'

export function PageLoading() {
  return (
    <div className="grid flex-1 place-items-center py-24 text-seat" role="status">
      <Spinner className="size-7" />
      <span className="sr-only">불러오는 중</span>
    </div>
  )
}
