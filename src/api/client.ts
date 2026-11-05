import { ApiError, ErrorCode } from './errors'
import type { ErrorResponse } from './types'

/**
 * CSRF: Spring Security 기본 토큰 방식 (API 계약 D1, csrf.spa()).
 * 서버가 준 XSRF-TOKEN 쿠키 값을 변경 요청의 X-XSRF-TOKEN 헤더로 보낸다
 */
export const CSRF_COOKIE = 'XSRF-TOKEN'
export const CSRF_HEADER = 'X-XSRF-TOKEN'

const STATE_CHANGING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

type ApiOptions = Omit<RequestInit, 'body'> & {
  /** JSON 본문. 사용자 입력은 주소가 아니라 여기에 담는다 (주소는 서버 로그에 남는다) */
  json?: unknown
}

export function readCsrfToken(): string | null {
  const prefix = `${CSRF_COOKIE}=`
  const found = document.cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith(prefix))
  if (!found) {
    return null
  }
  try {
    return decodeURIComponent(found.slice(prefix.length))
  } catch {
    return null
  }
}

/**
 * CSRF 토큰을 새로 받는다 (XSRF-TOKEN 쿠키가 다시 생긴다).
 * 앱 시작, 로그인·가입·로그아웃 직후에 부른다. 로그인·로그아웃 때 서버가 예전 토큰을 지우기 때문이다
 */
export async function refreshCsrfToken(): Promise<void> {
  let response: Response
  try {
    response = await fetch('/api/csrf', { credentials: 'same-origin', headers: { Accept: 'application/json' } })
  } catch {
    throw ApiError.network()
  }
  // 발급 실패를 성공으로 처리하면 원래의 503 대신 CSRF 오류가 나고 변경 요청까지 보내게 된다.
  await readResponse(response)
}

/**
 * 같은 출처의 /api를 부른다. 세션은 HttpOnly 쿠키라 프론트는 세션 값을 다루지 않는다.
 * 실패하면 ApiError를 던진다 (화면은 code로 분기하고 message를 그대로 보여 준다)
 */
export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const method = (options.method ?? 'GET').toUpperCase()
  const stateChanging = STATE_CHANGING_METHODS.has(method)

  if (stateChanging && readCsrfToken() === null) {
    await refreshCsrfToken()
  }

  try {
    return await send<T>(path, options, method, stateChanging)
  } catch (error) {
    // 토큰이 바뀐 사이에 보낸 요청이면 한 번만 새 토큰으로 다시 보낸다
    if (stateChanging && error instanceof ApiError && error.code === ErrorCode.CSRF_REJECTED) {
      await refreshCsrfToken()
      return send<T>(path, options, method, stateChanging)
    }
    throw error
  }
}

async function send<T>(path: string, options: ApiOptions, method: string, stateChanging: boolean): Promise<T> {
  const { json, headers: initHeaders, ...init } = options
  const headers = new Headers(initHeaders)
  headers.set('Accept', 'application/json')
  if (stateChanging) {
    const token = readCsrfToken()
    if (token) {
      headers.set(CSRF_HEADER, token)
    }
  }

  let body: string | undefined
  if (json !== undefined) {
    headers.set('Content-Type', 'application/json')
    body = JSON.stringify(json)
  }

  let response: Response
  try {
    response = await fetch(`/api${path}`, { ...init, method, headers, body, credentials: 'same-origin' })
  } catch {
    throw ApiError.network()
  }

  return await readResponse(response) as T
}

async function readResponse(response: Response): Promise<unknown> {
  const data = await readJson(response)
  if (!response.ok) {
    if (isErrorResponse(data)) {
      throw new ApiError(response.status, data.code, data.message)
    }
    throw ApiError.unknown(response.status)
  }
  return data
}

async function readJson(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined
  }
  const text = await response.text()
  if (!text) {
    return undefined
  }
  try {
    return JSON.parse(text)
  } catch {
    return undefined
  }
}

function isErrorResponse(value: unknown): value is ErrorResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as ErrorResponse).status === 'number' &&
    typeof (value as ErrorResponse).code === 'string' &&
    typeof (value as ErrorResponse).message === 'string'
  )
}
