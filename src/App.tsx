import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router/dom'
import { createQueryClient, queryKeys } from './api/queryClient'
import { router } from './app/router'
import { loginPath } from './auth/returnTo'
import { ToastProvider } from './components/toast/ToastProvider'

const AUTH_FLOW_PATHS = ['/login', '/auth/', '/signup/']

// 로그인한 상태로 쓰다가 세션이 끊기면(401) 지금 주소를 기억한 채 로그인 화면으로 보낸다
function handleUnauthorized() {
  queryClient.setQueryData(queryKeys.me, null)
  const { pathname, search } = router.state.location
  if (AUTH_FLOW_PATHS.some((path) => pathname.startsWith(path))) {
    return
  }
  void router.navigate(loginPath(pathname + search), { replace: true })
}

const queryClient = createQueryClient(handleUnauthorized)

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </QueryClientProvider>
  )
}
