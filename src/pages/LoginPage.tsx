import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router'
import { api, refreshCsrfToken } from '../api/client'
import { errorMessage } from '../api/errors'
import { queryKeys } from '../api/queryClient'
import { safeReturnTo } from '../auth/returnTo'
import { AppBar } from '../components/AppBar'
import { Button } from '../components/Button'
import { useToast } from '../components/toast/useToast'

const MOCK_ENABLED = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK !== 'false'

/**
 * 임시 로그인 화면. 카카오 로그인은 HJR-95에서 만든다.
 * 지금은 목업 모드에서 로그인 상태를 켜서 "로그인 필요 → 로그인 → 원래 화면" 흐름만 확인한다
 */
export function LoginPage() {
  const [searchParams] = useSearchParams()
  const returnTo = safeReturnTo(searchParams.get('returnTo'))
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const toast = useToast()

  const mockLogin = useMutation({
    mutationFn: () => api<void>('/__mock/login', { method: 'POST' }),
    onSuccess: async () => {
      // 로그인하면 서버가 예전 CSRF 토큰을 지우므로 새로 받는다
      await refreshCsrfToken()
      // 로그인 화면에서는 useMe를 쓰지 않아 기본 무효화로는 다시 불러오지 않는다. 직접 다시 불러온 뒤 이동한다
      await queryClient.invalidateQueries({ queryKey: queryKeys.me, refetchType: 'all' })
      navigate(returnTo, { replace: true })
    },
    onError: (error) => toast.show(errorMessage(error), 'error'),
  })

  return (
    <>
      <AppBar title="로그인" />
      <section className="px-5 py-12">
        <h2 className="text-2xl leading-snug font-bold">
          한자리에 오신 걸
          <br />
          환영해요
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          카카오 로그인은 HJR-95 작업에서 만들어요.
          {returnTo !== '/' && <> 로그인하면 보던 화면({returnTo})으로 돌아가요.</>}
        </p>
        {MOCK_ENABLED && (
          <Button className="mt-8" size="lg" block pending={mockLogin.isPending} onClick={() => mockLogin.mutate()}>
            목업 계정으로 로그인
          </Button>
        )}
      </section>
    </>
  )
}
