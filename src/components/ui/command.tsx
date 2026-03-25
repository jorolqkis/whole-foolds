import { Command as CommandPrimitive } from 'cmdk'
import type { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

export function Command({ className, ...props }: ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      className={cn('flex h-full w-full flex-col overflow-hidden rounded-xl bg-transparent text-[var(--color-foreground)]', className)}
      {...props}
    />
  )
}

export function CommandInput({ className, ...props }: ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div className="flex items-center border-b border-[var(--color-border)] px-3">
      <CommandPrimitive.Input
        className={cn(
          'flex h-11 w-full bg-transparent py-3 text-sm text-[var(--color-foreground)] outline-none placeholder:text-[var(--color-muted-foreground)]',
          className,
        )}
        {...props}
      />
    </div>
  )
}

export function CommandList({ className, ...props }: ComponentProps<typeof CommandPrimitive.List>) {
  return <CommandPrimitive.List className={cn('max-h-80 overflow-y-auto overflow-x-hidden', className)} {...props} />
}

export function CommandEmpty(props: ComponentProps<typeof CommandPrimitive.Empty>) {
  return <CommandPrimitive.Empty className="px-3 py-6 text-sm text-[var(--color-muted-foreground)]" {...props} />
}

export function CommandGroup({ className, ...props }: ComponentProps<typeof CommandPrimitive.Group>) {
  return <CommandPrimitive.Group className={cn('overflow-hidden p-1', className)} {...props} />
}

export function CommandItem({ className, ...props }: ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      className={cn(
        'relative flex cursor-default select-none items-center rounded-xl px-3 py-2 text-sm text-[var(--color-foreground)] outline-none data-[selected=true]:bg-[rgba(134,93,255,0.2)] data-[selected=true]:text-[var(--color-foreground)]',
        className,
      )}
      {...props}
    />
  )
}
