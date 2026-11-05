import { useId, type InputHTMLAttributes, type Ref } from 'react'
import { cn } from '../lib/cn'

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  label: string
  /** 입력 규칙처럼 항상 보여 줄 안내 */
  hint?: string
  /** 검증·서버 오류. 있으면 칸을 빨갛게 표시한다 */
  error?: string | null
  /** maxLength와 함께 쓰면 글자 수를 보여 준다 */
  showCount?: boolean
  ref?: Ref<HTMLInputElement>
}

export function TextField({ label, hint, error, showCount, className, maxLength, ref, ...input }: TextFieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const length = typeof input.value === 'string' ? [...input.value].length : 0
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          'mt-1.5 h-12 w-full rounded-(--radius-control) border bg-surface px-3.5 text-base text-ink placeholder:text-ended',
          'focus:border-seat focus:ring-2 focus:ring-seat/20 focus:outline-none',
          error ? 'border-danger' : 'border-line',
        )}
        {...input}
      />
      {(hint || (showCount && maxLength)) && (
        <div className="mt-1.5 flex items-start justify-between gap-3 text-[13px] leading-snug text-ink-soft">
          {hint ? <p id={hintId}>{hint}</p> : <span />}
          {showCount && maxLength && (
            <span className="shrink-0 tabular-nums" aria-hidden="true">
              {length}/{maxLength}
            </span>
          )}
        </div>
      )}
      {error && (
        <p id={errorId} className="mt-1 text-[13px] leading-snug text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
