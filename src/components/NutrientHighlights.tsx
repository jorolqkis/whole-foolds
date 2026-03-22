import type { AppNutrient } from '../types/usda'
import { formatNutrientValue } from '../utils/formatters'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

type NutrientHighlightsProps = {
  nutrients: AppNutrient[]
}

export function NutrientHighlights({ nutrients }: NutrientHighlightsProps) {
  return (
    <Card className="bg-[linear-gradient(180deg,rgba(203,157,240,0.85),rgba(240,193,225,0.88))] text-[var(--color-foreground)]">
      <CardHeader className="pb-4">
        <Badge variant="outline" className="w-fit border-white/50 bg-white/25">
          Key nutrition
        </Badge>
        <CardTitle className="mt-3 text-3xl">Quick nutrient highlights</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {nutrients.length > 0 ? (
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            {nutrients.map((nutrient) => (
              <div
                key={nutrient.id ?? nutrient.name}
                className="rounded-[24px] border border-white/50 bg-white/45 p-4"
              >
                <dt className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted-foreground)]">
                  {nutrient.name}
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-[var(--color-foreground)]">
                  {formatNutrientValue(nutrient.amount, nutrient.unitName)}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-6 text-sm leading-6 text-[var(--color-foreground)]/76">
            This record does not expose enough nutrient fields for a highlight summary.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
