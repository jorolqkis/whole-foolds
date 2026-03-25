import * as PopoverPrimitive from '@radix-ui/react-popover'

export const Popover = PopoverPrimitive.Root
export const PopoverTrigger = PopoverPrimitive.Trigger
export const PopoverAnchor = PopoverPrimitive.Anchor

export function PopoverContent({
  className = '',
  align = 'center',
  sideOffset = 4,
  ...props
}: PopoverPrimitive.PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={[
          'z-50 w-72 rounded-2xl border border-[var(--color-border)] bg-[#191825] p-1 text-[var(--color-foreground)] shadow-[0_24px_80px_-32px_rgba(0,0,0,0.85)] outline-none',
          className,
        ].join(' ')}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}
