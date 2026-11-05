import { HttpResponse } from 'msw'
import { CSRF_COOKIE, CSRF_HEADER, readCsrfToken } from '../api/client'

/** 서버의 ErrorResponse 모양 그대로 에러를 돌려준다 */
export function errorResponse(status: number, code: string, message: string) {
  return HttpResponse.json({ status, code, message }, { status })
}

export const unauthorized = () => errorResponse(401, '8001', '로그인이 필요합니다.')

export const noContent = () => new HttpResponse(null, { status: 204 })

// 목업은 브라우저 안에서 돌기 때문에 서버 대신 XSRF-TOKEN 쿠키를 직접 만든다
export function issueCsrfCookie() {
  const token = crypto.randomUUID()
  document.cookie = `${CSRF_COOKIE}=${token}; path=/; SameSite=Strict`
}

/** 로그인·로그아웃 때 서버(CsrfAuthenticationStrategy·CsrfLogoutHandler)가 예전 토큰을 지우는 것을 흉내 낸다 */
export function clearCsrfCookie() {
  document.cookie = `${CSRF_COOKIE}=; path=/; Max-Age=0`
}

/** 변경 요청의 CSRF 토큰이 없거나 쿠키와 다르면 서버처럼 403으로 거부한다 (API 클라이언트 실수를 일찍 잡으려고) */
export function rejectCsrf(request: Request) {
  const sent = request.headers.get(CSRF_HEADER)
  return sent === null || sent !== readCsrfToken()
    ? errorResponse(403, '9009', '요청을 처리할 수 없습니다.')
    : null
}
