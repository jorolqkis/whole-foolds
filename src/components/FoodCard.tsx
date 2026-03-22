import type { FoodListItem } from '../types/usda'
import { formatNutrientValue } from '../utils/formatters'
import { getHighlightNutrients } from '../utils/nutrients'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'

type FoodCardProps = {
  food: FoodListItem
  isFavorite: boolean
  variant?: 'grid' | 'compact'
  onOpenFood: (food: FoodListItem) => void
  onToggleFavorite: (fdcId: number) => void
}

export function FoodCard({
  food,
  isFavorite,
  variant = 'grid',
  onOpenFood,
  onToggleFavorite,
}: FoodCardProps) {
  const highlights = getHighlightNutrients(food.foodNutrients).slice(0, variant === 'grid' ? 3 : 2)
  const isCompact = variant === 'compact'

  return (
    <Card
      className={`group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_64px_-34px_rgba(77,44,104,0.42)] ${
        isCompact ? 'flex flex-col md:flex-row md:items-stretch' : 'flex h-full flex-col'
      }`}
    >
      <div className={isCompact ? 'flex-1' : ''}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge className="w-fit">Foundation Food</Badge>
              <CardTitle className="mt-3 leading-tight">{food.description}</CardTitle>
            </div>

            <Button
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={isFavorite}
              onClick={() => onToggleFavorite(food.fdcId)}
              variant={isFavorite ? 'secondary' : 'outline'}
              size="sm"
              className="rounded-xl"
            >
              {isFavorite ? 'Saved' : 'Save'}
            </Button>
          </div>
        </CardHeader>

        <CardContent className={`flex flex-1 flex-col ${isCompact ? 'pb-5' : ''}`}>
          <div className="flex flex-wrap gap-2 text-sm text-[var(--color-muted-foreground)]">
            {food.foodCategory ? (
              <Badge variant="secondary" className="rounded-full text-[10px]">
                {food.foodCategory}
              </Badge>
            ) : null}
            {food.scientificName ? (
              <Badge
                variant="outline"
                className="rounded-full text-[10px] normal-case tracking-[0.08em]"
              >
                {food.scientificName}
              </Badge>
            ) : null}
          </div>

          <p className="mt-4 text-sm leading-6 text-[var(--color-muted-foreground)]">
            {food.commonNames ||
              food.additionalDescriptions ||
              'Expanded Foundation Foods data with nutrient values and sample-backed metadata.'}
          </p>

          <div className="mt-5 rounded-[24px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(253,219,187,0.45))] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">
              Key nutrition
            </p>
            {highlights.length > 0 ? (
              <dl className={`mt-3 grid gap-3 ${isCompact ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
                {highlights.map((nutrient) => (
                  <div
                    key={nutrient.id ?? nutrient.name}
                    className="rounded-2xl border border-white/70 bg-white/80 px-3 py-3"
                  >
                    <dt className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted-foreground)]">
                      {nutrient.name}
                    </dt>
                    <dd className="mt-2 text-lg font-semibold text-[var(--color-foreground)]">
                      {formatNutrientValue(nutrient.amount, nutrient.unitName)}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-3 text-sm text-[var(--color-muted-foreground)]">
                Nutrient preview not available for this record.
              </p>
            )}
          </div>
        </CardContent>
      </div>

      <CardFooter
        className={`justify-between ${isCompact ? 'min-w-[220px] flex-col items-stretch border-t border-[var(--color-border)] bg-white/35 md:border-l md:border-t-0' : 'mt-auto'}`}
      >
        <p className="text-sm text-[var(--color-muted-foreground)]">FDC ID {food.fdcId}</p>
        <Button onClick={() => onOpenFood(food)} className="rounded-2xl">
          View details
        </Button>
      </CardFooter>
    </Card>
  )
}
