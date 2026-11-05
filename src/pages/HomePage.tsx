import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router'
import { api, refreshCsrfToken } from '../api/client'
import { errorMessage } from '../api/errors'
import { queryKeys } from '../api/queryClient'
import { screens } from '../app/screens'
import { useMe } from '../auth/useMe'
import { AppBar } from '../components/AppBar'
import { Button } from '../components/Button'
import { useToast } from '../components/toast/useToast'

/**
 * 임시 홈. 진짜 홈(내 클럽·다가오는 신청)은 HJR-97에서 만든다.
 * 지금은 화면 사이를 오가며 확인할 수 있게 화면 목록을 보여 준다
 */
export function HomePage() {
  const { data: me } = useMe()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const toast = useToast()

  const logout = useMutation({
    mutationFn: () => api<void>('/auth/logout', { method: 'POST' }),
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.me, null)
      navigate('/login', { replace: true })
      // 로그아웃하면 서버가 예전 CSRF 토큰을 지우므로 새로 받아 둔다
      refreshCsrfToken().catch(() => {})
      toast.show('로그아웃했어요')
    },
    onError: (error) => toast.show(errorMessage(error), 'error'),
  })

  return (
    <>
      <AppBar
        title="한자리"
        right={
          <Button variant="ghost" pending={logout.isPending} onClick={() => logout.mutate()}>
            로그아웃
          </Button>
        }
      />
      <section className="px-5 pt-6 pb-4">
        <h2 className="text-xl font-bold">{me?.nickname}님, 반가워요</h2>
        <p className="mt-1 text-[15px] text-ink-soft">아래 화면들은 각 Jira 작업에서 하나씩 만들어요.</p>
      </section>
      <ul className="divide-y divide-line border-y border-line">
        {screens.map((screen) => {
          const to = screen.example ?? screen.path
          return (
            <li key={screen.path}>
              <Link to={to} className="flex items-baseline gap-3 px-5 py-3.5 hover:bg-paper">
                <span className="flex-1 font-semibold">{screen.title}</span>
                <span className="text-[13px] text-ink-soft tabular-nums">{screen.ticket}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}
