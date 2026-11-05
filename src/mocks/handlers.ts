import { delay, http, HttpResponse } from 'msw'
import { mockMe } from './data'
import { clearCsrfCookie, errorResponse, issueCsrfCookie, noContent, rejectCsrf, unauthorized } from './http'
import { mockSession } from './session'

// API 계약(백엔드 저장소 docs/api-contract.md) 그대로 응답한다. 화면 작업마다 해당 API의 목업을 더한다
export const handlers = [
  // ── CSRF 토큰 (계약 1절) ──
  http.get('/api/csrf', () => {
    issueCsrfCookie()
    return noContent()
  }),

  // ── 목업 전용: 로그인 상태 켜기 (진짜 카카오 로그인은 HJR-95) ──
  http.post('/api/__mock/login', ({ request }) => {
    const rejected = rejectCsrf(request)
    if (rejected) {
      return rejected
    }
    mockSession.setLoggedIn(true)
    clearCsrfCookie()
    return noContent()
  }),

  // ── 회원·인증 ──
  http.get('/api/members/me', async () => {
    await delay(150)
    return mockSession.isLoggedIn() ? HttpResponse.json(mockMe) : unauthorized()
  }),

  http.post('/api/auth/logout', ({ request }) => {
    const rejected = rejectCsrf(request)
    if (rejected) {
      return rejected
    }
    mockSession.setLoggedIn(false)
    clearCsrfCookie()
    return noContent()
  }),

  // ── 목업이 없는 API는 바로 알 수 있게 404로 돌려준다 (반드시 맨 마지막) ──
  http.all('/api/*', ({ request }) => {
    console.warn(`[목업 없음] ${request.method} ${new URL(request.url).pathname}`)
    return errorResponse(404, '9005', '목업이 없는 API예요.')
  }),
]
