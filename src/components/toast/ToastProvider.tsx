import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { ToastContext, type ToastTone } from './ToastContext'

type Toast = { id: number; message: string; tone: ToastTone }

const DURATION_MS = 3500

const dotColor: Record<ToastTone, string> = {
  info: 'bg-white/60',
  success: 'bg-[#6fd6b8]',
  error: 'bg-[#ff9a90]',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null)
  const nextId = useRef(0)

  const show = useCallback((message: string, tone: ToastTone = 'info') => {
    nextId.current += 1
    setToast({ id: nextId.current, message, tone })
  }, [])

  useEffect(() => {
    if (!toast) {
      return
    }
    const timer = window.setTimeout(() => setToast(null), DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [toast])

  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* 화면 아래 고정 버튼(신청하기 등) 위에 뜨도록 여백을 둔다 */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] z-50 flex justify-center px-4"
        role="status"
        aria-live="polite"
      >
        {toast && (
          <p
            key={toast.id}
            className={cn(
              'flex max-w-[448px] items-start gap-2.5 rounded-(--radius-control) bg-ink px-4 py-3 text-[15px] leading-snug text-white shadow-lg',
              'animate-toast-in',
            )}
          >
            <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', dotColor[toast.tone])} aria-hidden="true" />
            {toast.message}
          </p>
        )}
      </div>
    </ToastContext.Provider>
  )
}
