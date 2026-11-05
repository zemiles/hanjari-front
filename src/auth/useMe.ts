import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'
import { isUnauthorized } from '../api/errors'
import { queryKeys } from '../api/queryClient'
import type { MemberMe } from '../api/types'

/** 지금 로그인한 회원. 로그인하지 않았으면 null (401을 에러로 보지 않는다) */
export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: async (): Promise<MemberMe | null> => {
      try {
        return await api<MemberMe>('/members/me')
      } catch (error) {
        if (isUnauthorized(error)) {
          return null
        }
        throw error
      }
    },
    staleTime: 5 * 60_000,
  })
}
