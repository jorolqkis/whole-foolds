type BrandMarkProps = {
  inverted?: boolean
}

export function BrandMark({ inverted = false }: BrandMarkProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        aria-hidden="true"
        className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/60 bg-[linear-gradient(135deg,rgba(203,157,240,0.95),rgba(253,219,187,0.92))] shadow-[0_16px_30px_-20px_rgba(77,44,104,0.55)]"
      >
        <div className="absolute h-4 w-4 -translate-x-[6px] -translate-y-[4px] rounded-full bg-white/80" />
        <div className="absolute h-5 w-5 translate-x-[5px] translate-y-[4px] rounded-full bg-[rgba(255,249,191,0.92)]" />
        <div className="h-6 w-6 rounded-full border border-white/70 bg-[rgba(255,255,255,0.45)]" />
      </div>
      <div>
        <p className={inverted ? 'font-serif text-lg leading-none text-white' : 'font-serif text-lg leading-none text-[var(--color-foreground)]'}>
          NourishBase
        </p>
        <p className={inverted ? 'text-xs uppercase tracking-[0.22em] text-white/64' : 'text-xs uppercase tracking-[0.22em] text-[var(--color-muted-foreground)]'}>
          Foundation Foods Explorer
        </p>
      </div>
    </div>
  )
}
