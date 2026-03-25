import { BrandMark } from './BrandMark'

export function SiteFooter() {
  return (
    <footer
      id="about"
      className="mt-12 rounded-[32px] border border-white/12 bg-black/38 px-6 py-8 text-white shadow-[0_24px_80px_-32px_rgba(0,0,0,0.85)] backdrop-blur-xl"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl space-y-4">
          <BrandMark inverted />
          <p className="text-sm leading-7 text-white/64">
            NourishBase is a focused USDA Foundation Foods explorer designed for ingredient research,
            nutrition review, and cleaner food comparisons.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/64">
              Navigation
            </p>
            <div className="mt-3 space-y-2 text-sm text-white">
              <a href="#overview" className="block transition hover:text-white/64">
                Overview
              </a>
              <a href="#explorer" className="block transition hover:text-white/64">
                Explorer
              </a>
              <a href="#workspace" className="block transition hover:text-white/64">
                Workspace
              </a>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/64">
              Data source
            </p>
            <div className="mt-3 space-y-2 text-sm text-white">
              <a
                href="https://fdc.nal.usda.gov/"
                target="_blank"
                rel="noreferrer"
                className="block transition hover:text-white/64"
              >
                FoodData Central
              </a>
              <a
                href="https://fdc.nal.usda.gov/api-guide"
                target="_blank"
                rel="noreferrer"
                className="block transition hover:text-white/64"
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
