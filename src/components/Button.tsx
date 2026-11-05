import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../lib/cn'
import { Spinner } from './Spinner'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'md' | 'lg'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  /** 요청이 끝날 때까지 버튼을 막고 진행 표시를 보여 준다 (중복 제출 방지) */
  pending?: boolean
  block?: boolean
}

const variants: Record<Variant, string> = {
  primary: 'bg-seat text-white hover:bg-seat-strong disabled:bg-line disabled:text-ink-soft',
  secondary: 'border border-line bg-surface text-ink hover:bg-paper disabled:text-ended',
  ghost: 'text-seat hover:bg-seat-tint disabled:text-ended disabled:hover:bg-transparent',
  danger: 'bg-danger text-white hover:bg-danger-strong disabled:bg-line disabled:text-ink-soft',
}

const sizes: Record<Size, string> = {
  md: 'h-11 px-4 text-[15px]',
  lg: 'h-14 px-5 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  pending = false,
  block = false,
  disabled,
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-(--radius-control) font-semibold transition-colors disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        block && 'w-full',
        className,
      )}
      {...rest}
    >
      {pending && <Spinner className="size-4" />}
      {children}
    </button>
  )
}
