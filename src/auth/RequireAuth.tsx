import { Navigate, Outlet, useLocation } from 'react-router'
import { ErrorState } from '../components/ErrorState'
import { PageLoading } from '../components/PageLoading'
import { loginPath } from './returnTo'
import { useMe } from './useMe'

/** 로그인이 필요한 화면을 감싼다. 로그인하지 않았으면 지금 주소를 기억한 채 로그인 화면으로 보낸다 */
export function RequireAuth() {
  const location = useLocation()
  const { data: me, isPending, isFetching, isError, error, refetch } = useMe()

  // 예전에 받은 "로그인 안 함(null)"을 다시 확인하는 중이면 기다린다 (방금 로그인했을 수 있다)
  if (isPending || (!me && isFetching)) {
    return <PageLoading />
  }
  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />
  }
  if (!me) {
    return <Navigate to={loginPath(location.pathname + location.search)} replace />
  }
  return <Outlet />
}
