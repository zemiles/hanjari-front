import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  description?: ReactNode
  action?: ReactNode
}

/** 비어 있는 화면. 다음에 할 일을 알려 준다 */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <section className="px-5 py-12">
      <h2 className="text-lg font-bold">{title}</h2>
      {description && <div className="mt-2 max-w-[34ch] text-[15px] leading-relaxed text-ink-soft">{description}</div>}
      {action && <div className="mt-6">{action}</div>}
    </section>
  )
}
