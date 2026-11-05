import { isRouteErrorResponse, useRouteError } from 'react-router'
import { NotFoundPage } from './NotFoundPage'

/** 화면을 그리다 예상하지 못한 오류가 났을 때. 레이아웃 바깥에서 그려지므로 기둥 모양을 직접 둔다 */
export function RouteErrorPage() {
  const error = useRouteError()
  const notFound = isRouteErrorResponse(error) && error.status === 404

  return (
    <div className="min-h-dvh bg-paper">
      <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-surface sm:border-x sm:border-line">
        {notFound ? (
          <NotFoundPage />
        ) : (
          <section className="px-5 py-16">
            <h1 className="text-lg font-bold">화면을 그리지 못했어요</h1>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
              새로고침해도 같으면 처음 화면에서 다시 시작해 주세요.
            </p>
            <a href="/" className="mt-6 inline-block font-semibold text-seat underline underline-offset-4">
              처음 화면으로 가기
            </a>
          </section>
        )}
      </div>
    </div>
  )
}
