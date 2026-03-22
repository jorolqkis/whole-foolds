import type { FoodListItem } from '../types/usda'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

type HeaderProps = {
  favoritesCount: number
  recentlyViewed: FoodListItem[]
  onOpenFood: (food: FoodListItem) => void
}

const stats = (favoritesCount: number, recentlyViewedCount: number) => [
  { label: 'Dataset', value: 'USDA Foundation Foods' },
  { label: 'Saved items', value: String(favoritesCount).padStart(2, '0') },
  { label: 'Recent views', value: String(recentlyViewedCount).padStart(2, '0') },
]

export function Header({ favoritesCount, recentlyViewed, onOpenFood }: HeaderProps) {
  return (
    <section
      id="overview"
      className="relative overflow-hidden rounded-[36px] border border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.86),rgba(255,249,191,0.76))] px-6 py-8 shadow-[0_36px_90px_-46px_rgba(77,44,104,0.55)] backdrop-blur"
    >
      <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top_left,rgba(203,157,240,0.24),transparent_70%)]" />
      <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
        <div className="animate-float-in">
          <Badge variant="outline" className="border-white/60 bg-white/50">
            Production-ready USDA workspace
          </Badge>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-tight text-[var(--color-foreground)] sm:text-5xl">
            Nutrition research that feels like a real product, not a dataset demo.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-muted-foreground)]">
            Search, compare, and review USDA Foundation Foods inside a calmer workflow with strong
            information hierarchy, recent history, and saved items.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#explorer"
              className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--color-primary)] px-6 text-sm font-medium text-[var(--color-primary-foreground)] shadow-[0_14px_32px_-18px_rgba(88,38,126,0.65)] transition-colors hover:bg-[var(--color-primary-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
            >
              Start exploring
            </a>
            <a
              href="#workspace"
              className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-6 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
            >
              View workspace
            </a>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {stats(favoritesCount, recentlyViewed.length).map((stat) => (
              <div
                key={stat.label}
                className="rounded-[24px] border border-white/60 bg-white/55 px-4 py-4 shadow-[0_18px_38px_-30px_rgba(77,44,104,0.42)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted-foreground)]">
                  {stat.label}
                </p>
                <p className="mt-2 text-base font-semibold text-[var(--color-foreground)]">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="border-white/50 bg-white/72">
          <CardHeader className="pb-4">
            <Badge className="w-fit">Recent views</Badge>
            <CardTitle className="mt-3 text-xl">Continue where you left off</CardTitle>
          </CardHeader>
          <CardContent>
            {recentlyViewed.length > 0 ? (
              <ul className="space-y-3">
                {recentlyViewed.slice(0, 4).map((food) => (
                  <li key={food.fdcId}>
                    <Button
                      onClick={() => onOpenFood(food)}
                      variant="ghost"
                      className="h-auto w-full justify-between rounded-2xl border border-transparent bg-white/55 px-4 py-3 text-left text-sm leading-6 text-[var(--color-foreground)] hover:border-[var(--color-border)] hover:bg-white"
                    >
                      <span className="line-clamp-2">{food.description}</span>
                      <span className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted-foreground)]">
                        Open
                      </span>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-[24px] border border-dashed border-[var(--color-border)] bg-white/50 p-5">
                <p className="text-sm leading-6 text-[var(--color-muted-foreground)]">
                  Open a food card and your recent trail will appear here for faster comparisons.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
