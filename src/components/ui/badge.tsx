import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type BadgeVariant = 'default' | 'secondary' | 'outline'

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[var(--color-primary-soft)] text-[var(--color-foreground)]',
  secondary: 'bg-[var(--color-secondary)] text-[var(--color-foreground)]',
  outline: 'border border-[var(--color-border)] bg-transparent text-[var(--color-foreground)]',
}

type BadgeProps = HTMLAttributes<HTMLDivElement> & {
  variant?: BadgeVariant
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}
