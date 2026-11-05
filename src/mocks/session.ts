// 목업 로그인 상태. 새로고침해도 유지되게 브라우저 저장소에 둔다 (저장소를 못 쓰면 메모리로)
const KEY = 'hanjari.mock.loggedIn'
let memory = false

export const mockSession = {
  isLoggedIn(): boolean {
    try {
      return localStorage.getItem(KEY) === 'true'
    } catch {
      return memory
    }
  },
  setLoggedIn(value: boolean) {
    memory = value
    try {
      localStorage.setItem(KEY, String(value))
    } catch {
      // 사생활 보호 모드 등에서 저장소를 못 쓰면 메모리 값만 쓴다
    }
  },
}
