import { useState } from 'react'
import { BrandMark } from './BrandMark'
import { Card } from './ui/card'

const navItems = [
  { label: 'Overview', href: '#overview' },
  { label: 'Explorer', href: '#explorer' },
  { label: 'Data Notes', href: '#about' },
]

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header>
      <Card className="border-white/12 bg-black/38 px-4 py-3 text-white shadow-[0_24px_80px_-32px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:px-5">
        <div className="flex items-center justify-between gap-4">
          <BrandMark inverted />

          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls="site-nav"
            className="inline-flex h-10 min-w-20 items-center justify-center rounded-xl border border-white/12 bg-white/8 px-3 text-sm font-medium text-white lg:hidden"
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
                  className="rounded-full px-4 py-2 text-sm font-medium text-white/78 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/64">
                USDA synced
              </div>
              <a
                href="#explorer"
                className="inline-flex h-10 items-center justify-center rounded-full bg-white/14 px-5 text-sm font-medium text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                Open Explorer
              </a>
            </div>
          </div>
        </div>

        {isOpen ? (
          <div id="site-nav" className="mt-4 grid gap-4 border-t border-white/12 pt-4 lg:hidden">
            <nav aria-label="Mobile primary" className="grid gap-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl bg-white/8 px-4 py-3 text-sm font-medium text-white"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-3">
              <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/64">
                USDA synced
              </div>
              <a
                href="#explorer"
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-white/14 px-5 text-sm font-medium text-white"
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
