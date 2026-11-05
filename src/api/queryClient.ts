import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { isApiError, isUnauthorized } from './errors'

declare module '@tanstack/react-query' {
  interface Register {
    // 로그인 없이도 부를 수 있는 요청은 401이 와도 로그인 화면으로 보내지 않는다
    queryMeta: { allowUnauthorized?: boolean }
    mutationMeta: { allowUnauthorized?: boolean }
  }
}

/** 서버 상태 캐시. 세션이 끊겨 401이 오면 onUnauthorized로 로그인 화면에 보낸다 */
export function createQueryClient(onUnauthorized: () => void) {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (isUnauthorized(error) && !query.meta?.allowUnauthorized) {
          onUnauthorized()
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _onMutateResult, mutation) => {
        if (isUnauthorized(error) && !mutation.meta?.allowUnauthorized) {
          onUnauthorized()
        }
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 10_000,
        // 4xx는 다시 불러도 같으므로 재시도하지 않는다. 네트워크·5xx만 한 번 더
        retry: (failureCount, error) => {
          const clientError = isApiError(error) && error.status >= 400 && error.status < 500
          return !clientError && failureCount < 1
        },
      },
      mutations: {
        // 변경 요청은 자동으로 다시 보내지 않는다 (신청은 화면이 같은 멱등키로 직접 재시도)
        retry: false,
      },
    },
  })
}

export const queryKeys = {
  me: ['me'] as const,
}
