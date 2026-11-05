import { Outlet, ScrollRestoration } from 'react-router'

/** 휴대폰 한 손 화면이 기준. 넓은 화면에서는 가운데 480px 기둥으로 보여 준다 */
export function RootLayout() {
  return (
    <div className="min-h-dvh bg-paper">
      <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-surface sm:border-x sm:border-line">
        <Outlet />
      </div>
      <ScrollRestoration />
    </div>
  )
}
