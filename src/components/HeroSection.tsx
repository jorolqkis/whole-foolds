import { Badge } from './ui/badge'
import { Button } from './ui/button'

type HeroSectionProps = {
  activeQuery: string
}

function scrollToSection(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function HeroSection({ activeQuery }: HeroSectionProps) {
  const eyebrow = activeQuery ? `Active search: ${activeQuery}` : 'USDA Foundation Foods'

  return (
    <section
      id="overview"
      className="animate-float-in relative min-h-screen w-full overflow-hidden bg-[#0d0d17] text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(210,197,255,0.24),transparent_28%),radial-gradient(circle_at_78%_30%,rgba(255,255,255,0.18),transparent_18%),linear-gradient(135deg,#090912_0%,#141423_44%,#1d1d33_100%)]" />
      <div className="absolute inset-0 opacity-70" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '140px 140px' }} />
      <div className="absolute -right-24 top-24 size-[28rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.34),rgba(255,255,255,0.06)_38%,transparent_68%)] blur-3xl" />
      <div className="absolute bottom-[-12rem] left-[44%] h-[28rem] w-[46rem] -translate-x-1/2 rotate-[-18deg] bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.82)_14%,rgba(255,255,255,0.2)_52%,transparent_100%)] opacity-70 blur-sm" />
      <div className="absolute right-[8%] top-[22%] hidden h-[22rem] w-[18rem] rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.04))] shadow-[0_36px_80px_-36px_rgba(0,0,0,0.9)] lg:block" />
      <div className="absolute right-[20%] top-[52%] hidden h-[16rem] w-[14rem] rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.04))] shadow-[0_36px_80px_-36px_rgba(0,0,0,0.9)] lg:block" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 pb-12 pt-32 sm:px-6 sm:pt-36 lg:px-8 lg:pt-40">
        <div className="flex w-full max-w-3xl flex-col items-start gap-8 text-left">
          <Badge className="w-fit border border-white/12 bg-white/10 text-white">{eyebrow}</Badge>

          <div className="flex flex-col gap-5">
            <h1 className="max-w-2xl font-serif text-5xl leading-[0.94] text-white sm:text-6xl lg:text-7xl">
              Explore whole foods with less noise and better context.
            </h1>
            <p className="max-w-xl text-base leading-8 text-white/72 sm:text-lg">
              Search the USDA Foundation Foods dataset, compare ingredients quickly, and reopen what
              matters without fighting a crowded interface.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="rounded-2xl bg-[var(--color-accent)] px-6 text-[var(--color-foreground)] hover:bg-[var(--color-accent-strong)]"
              onClick={() => scrollToSection('explorer')}
            >
              Open Explorer
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-2xl border-white/14 bg-white/8 px-6 text-white hover:bg-white/12"
              onClick={() => scrollToSection('about')}
            >
              Data Notes
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
