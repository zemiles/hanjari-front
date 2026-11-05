import { createContext } from 'react'

export type ToastTone = 'info' | 'success' | 'error'

export type ToastApi = {
  /** 화면 아래에 잠깐 알림을 띄운다. 문구는 일어난 일 그대로 쓴다 (예: "신청을 취소했어요") */
  show: (message: string, tone?: ToastTone) => void
}

export const ToastContext = createContext<ToastApi | null>(null)
