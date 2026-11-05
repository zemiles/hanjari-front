import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { refreshCsrfToken } from './api/client'
import { App } from './App'

// 개발 모드에서는 MSW 목업을 먼저 켠다 (VITE_USE_MOCK=false면 끈다).
// 운영 모드에서는 실행하지 않는다. 목업은 개발 모드에서만 불러온다
async function enableMocking() {
  if (!import.meta.env.DEV || import.meta.env.VITE_USE_MOCK === 'false') {
    return
  }
  const { worker } = await import('./mocks/browser')
  await worker.start({ onUnhandledFrame: 'bypass' })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  void import('./fonts')
  // 변경 요청에 쓸 CSRF 토큰을 미리 받아 둔다 (없으면 API 클라이언트가 요청 직전에 받는다)
  refreshCsrfToken().catch(() => {})
})
