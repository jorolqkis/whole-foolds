import type { AppNutrient } from '../types/usda'
import { formatNutrientValue } from '../utils/formatters'

type NutrientSectionProps = {
  label: string
  nutrients: AppNutrient[]
}

export function NutrientSection({ label, nutrients }: NutrientSectionProps) {
  return (
    <section>
      <h4 className="font-serif text-2xl text-[var(--color-foreground)]">{label}</h4>
      <div className="mt-4 overflow-hidden rounded-[24px] border border-[var(--color-border)]">
        <table className="min-w-full divide-y divide-[var(--color-border)]">
          <thead className="bg-[var(--color-muted)]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted-foreground)]">
                Nutrient
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted-foreground)]">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)] bg-white/85">
            {nutrients.map((nutrient) => (
              <tr key={nutrient.id ?? nutrient.name}>
                <td className="px-4 py-3 text-sm text-[var(--color-foreground)]/82">{nutrient.name}</td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-[var(--color-foreground)]">
                  {formatNutrientValue(nutrient.amount, nutrient.unitName)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
