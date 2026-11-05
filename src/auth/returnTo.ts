// 로그인 뒤 돌아갈 주소로 받지 않는 경로 (돌아가면 다시 로그인 흐름에 빠지거나 API를 여는 곳)
const BLOCKED_ROOTS = ['/login', '/auth', '/signup', '/api']

// 브라우저는 주소 안의 탭·줄바꿈을 지운다. '/\t/evil.com'이 '//evil.com'(다른 사이트)이 되므로 제어 문자는 통째로 거부한다
function hasControlChars(value: string): boolean {
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i)
    if (code <= 0x1f || code === 0x7f) {
      return true
    }
  }
  return false
}

/**
 * 로그인 뒤 돌아갈 주소는 이 사이트 안의 허용된 경로만 받는다.
 * 문자열 검사만으로 끝내지 않고, 주소로 해석한 결과가 같은 출처인지 확인한다.
 * 막히면 '/'(홈)로 보낸다. 서버도 로그인 시작 API에서 같은 규칙으로 검사한다 (HJR-109)
 */
export function safeReturnTo(value: string | null | undefined): string {
  if (!value || hasControlChars(value) || value.includes('\\') || !value.startsWith('/') || value.startsWith('//')) {
    return '/'
  }

  let url: URL
  try {
    url = new URL(value, window.location.origin)
  } catch {
    return '/'
  }
  // 정규화 뒤 이중 슬래시로 시작하는 경로도 상대 주소로 반환하지 않는다.
  if (url.origin !== window.location.origin || url.pathname.startsWith('//')) {
    return '/'
  }
  if (BLOCKED_ROOTS.some((root) => url.pathname === root || url.pathname.startsWith(`${root}/`))) {
    return '/'
  }
  return url.pathname + url.search + url.hash
}

export function loginPath(returnTo: string): string {
  return `/login?returnTo=${encodeURIComponent(safeReturnTo(returnTo))}`
}
