import { BrandMark } from './BrandMark'

export function SiteFooter() {
  return (
    <footer
      id="about"
      className="mt-12 rounded-[32px] border border-white/60 bg-white/70 px-6 py-8 shadow-[var(--shadow-card)]"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl space-y-4">
          <BrandMark />
          <p className="text-sm leading-7 text-[var(--color-muted-foreground)]">
            NourishBase is a focused USDA Foundation Foods explorer designed for ingredient research,
            nutrition review, and cleaner food comparisons.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
              Navigation
            </p>
            <div className="mt-3 space-y-2 text-sm text-[var(--color-foreground)]">
              <a href="#overview" className="block hover:text-[var(--color-muted-foreground)]">
                Overview
              </a>
              <a href="#explorer" className="block hover:text-[var(--color-muted-foreground)]">
                Explorer
              </a>
              <a href="#workspace" className="block hover:text-[var(--color-muted-foreground)]">
                Workspace
              </a>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
              Data source
            </p>
            <div className="mt-3 space-y-2 text-sm text-[var(--color-foreground)]">
              <a
                href="https://fdc.nal.usda.gov/"
                target="_blank"
                rel="noreferrer"
                className="block hover:text-[var(--color-muted-foreground)]"
              >
                FoodData Central
              </a>
              <a
                href="https://fdc.nal.usda.gov/api-guide"
                target="_blank"
                rel="noreferrer"
                className="block hover:text-[var(--color-muted-foreground)]"
              >
                API guide
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
