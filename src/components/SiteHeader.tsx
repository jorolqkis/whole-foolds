import { useState } from 'react'
import { BrandMark } from './BrandMark'
import { Card } from './ui/card'

const navItems = [
  { label: 'Overview', href: '#overview' },
  { label: 'Explorer', href: '#explorer' },
  { label: 'Workspace', href: '#workspace' },
  { label: 'Data Notes', href: '#about' },
]

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 pt-4">
      <Card className="border-white/60 bg-white/72 px-4 py-3 backdrop-blur-xl sm:px-5">
        <div className="flex items-center justify-between gap-4">
          <BrandMark />

          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls="site-nav"
            className="inline-flex h-10 min-w-20 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white/70 px-3 text-sm font-medium text-[var(--color-foreground)] lg:hidden"
            onClick={() => setIsOpen((current) => !current)}
          >
            {isOpen ? 'Close' : 'Menu'}
          </button>

          <div className="hidden lg:flex lg:flex-wrap lg:items-center lg:gap-6">
            <nav aria-label="Primary" className="flex flex-wrap items-center gap-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-[var(--color-muted-foreground)] transition hover:bg-white/70 hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-white/60 bg-white/60 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
                USDA synced
              </div>
              <a
                href="#explorer"
                className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--color-primary)] px-5 text-sm font-medium text-[var(--color-primary-foreground)] shadow-[0_14px_32px_-18px_rgba(88,38,126,0.65)] transition-colors hover:bg-[var(--color-primary-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
              >
                Open Explorer
              </a>
            </div>
          </div>
        </div>

        {isOpen ? (
          <div id="site-nav" className="mt-4 grid gap-4 border-t border-[var(--color-border)] pt-4 lg:hidden">
            <nav aria-label="Mobile primary" className="grid gap-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl bg-white/60 px-4 py-3 text-sm font-medium text-[var(--color-foreground)]"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-3">
              <div className="rounded-2xl border border-white/60 bg-white/60 px-4 py-3 text-xs uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
                USDA synced
              </div>
              <a
                href="#explorer"
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 text-sm font-medium text-[var(--color-primary-foreground)]"
                onClick={() => setIsOpen(false)}
              >
                Open Explorer
              </a>
            </div>
          </div>
        ) : null}
      </Card>
    </header>
  )
}
