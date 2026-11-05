import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router'

type AppBarProps = {
  title: string
  /** 뒤로 가기 버튼. 카톡 링크로 바로 들어와 이전 기록이 없으면 backTo로 간다 */
  back?: boolean
  backTo?: string
  right?: ReactNode
}

export function AppBar({ title, back = false, backTo = '/', right }: AppBarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const goBack = () => {
    // 이 사이트에서 처음 연 화면이면 key가 'default'다. 이때 history.back()은 사이트 밖으로 나가므로 backTo로 보낸다
    if (location.key === 'default') {
      navigate(backTo, { replace: true })
    } else {
      navigate(-1)
    }
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-1 border-b border-line bg-surface/95 px-2 backdrop-blur">
      {back ? (
        <button
          type="button"
          onClick={goBack}
          className="grid size-10 place-items-center rounded-(--radius-control) text-ink hover:bg-paper"
          aria-label="뒤로 가기"
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : (
        <span className="w-2" />
      )}
      <h1 className="min-w-0 flex-1 truncate text-[17px] font-semibold">{title}</h1>
      {right && <div className="flex shrink-0 items-center gap-1">{right}</div>}
    </header>
  )
}
