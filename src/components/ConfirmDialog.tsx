import { useEffect, useId, useRef, type ReactNode } from 'react'
import { Button } from './Button'

type ConfirmDialogProps = {
  open: boolean
  title: string
  description?: ReactNode
  /** 버튼 문구는 일어날 일 그대로 쓴다 (예: "신청 취소하기") */
  confirmLabel: string
  cancelLabel?: string
  tone?: 'primary' | 'danger'
  pending?: boolean
  onConfirm: () => void
  onClose: () => void
}

/** 되돌릴 수 없는 일을 하기 전에 묻는 창. 브라우저 기본 dialog라 포커스 가두기와 Esc 닫기가 들어 있다 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = '닫기',
  tone = 'primary',
  pending = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) {
      return
    }
    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={(event) => {
        // 요청 중에는 Esc로 닫지 않는다
        if (pending) {
          event.preventDefault()
        }
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-(--radius-sheet) bg-surface p-0 text-ink backdrop:bg-ink/45"
    >
      <div className="px-5 pt-5 pb-4">
        <h2 id={titleId} className="text-lg font-bold">
          {title}
        </h2>
        {description && <div className="mt-2 text-[15px] leading-relaxed text-ink-soft">{description}</div>}
      </div>
      <div className="flex gap-2 border-t border-line p-3">
        <Button variant="secondary" block onClick={onClose} disabled={pending}>
          {cancelLabel}
        </Button>
        <Button variant={tone} block pending={pending} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  )
}
