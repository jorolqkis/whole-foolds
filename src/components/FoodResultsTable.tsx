import { useMemo, useState } from 'react'
import type { FoodListItem } from '../types/usda'
import { formatNutrientValue } from '../utils/formatters'
import {
  exportFoodsToCsv,
  TABLE_NUTRIENT_DEFINITIONS,
  type NutrientColumn,
} from '../utils/export'
import { normalizeNutrients } from '../utils/nutrients'
import { EmptyState } from './EmptyState'
import { ErrorState } from './ErrorState'
import { LoadingSkeleton } from './LoadingSkeleton'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Input } from './ui/input'

type FoodResultsTableProps = {
  foods: FoodListItem[]
  isLoading: boolean
  isError: boolean
  errorMessage: string | null
  hasQuery: boolean
  density: 'comfortable' | 'compact'
  onOpenFood: (food: FoodListItem) => void
  onRetry: () => void
}

type ColumnFilters = Record<string, string>

function matchesText(value: string | undefined, filter: string) {
  if (!filter.trim()) {
    return true
  }

  return (value ?? '').toLowerCase().includes(filter.trim().toLowerCase())
}

function matchesMinValue(value: number | undefined, filter: string) {
  if (!filter.trim()) {
    return true
  }

  const min = Number(filter)
  if (!Number.isFinite(min)) {
    return true
  }

  return (value ?? Number.NEGATIVE_INFINITY) >= min
}

export function FoodResultsTable({
  foods,
  isLoading,
  isError,
  errorMessage,
  hasQuery,
  density,
  onOpenFood,
  onRetry,
}: FoodResultsTableProps) {
  const [filters, setFilters] = useState<ColumnFilters>({ food: '' })

  const nutrientColumns = useMemo<NutrientColumn[]>(() => {
    return TABLE_NUTRIENT_DEFINITIONS.map((definition) => ({
      key: definition.label,
      label: definition.shortLabel,
    }))
  }, [])

  const rows = useMemo(() => {
    return foods.map((food) => {
      const nutrients = normalizeNutrients(food.foodNutrients)
      const nutrientMap = new Map(
        TABLE_NUTRIENT_DEFINITIONS.map((definition) => {
          const nutrient = nutrients.find((candidate) =>
            definition.matches.some((match) => candidate.name.toLowerCase().includes(match)),
          )

          return [definition.label, nutrient] as const
        }),
      )

      return {
        food,
        nutrientMap,
      }
    })
  }, [foods])

  const filteredRows = useMemo(() => {
    return rows.filter(({ food, nutrientMap }) => {
      if (!matchesText(food.description, filters.food ?? '')) {
        return false
      }

      return nutrientColumns.every((column) => {
        const filter = filters[column.key] ?? ''
        if (!filter.trim()) {
          return true
        }

        return matchesMinValue(nutrientMap.get(column.key)?.amount, filter)
      })
    })
  }, [filters, nutrientColumns, rows])

  if (isLoading) {
    return <LoadingSkeleton variant="grid" />
  }

  if (isError && errorMessage) {
    return <ErrorState message={errorMessage} onRetry={onRetry} />
  }

  if (foods.length === 0) {
    return <EmptyState hasQuery={hasQuery} />
  }

  const rowPadding = density === 'compact' ? 'py-1.5' : 'py-2'

  return (
    <Card className="overflow-hidden bg-white/82">
      <div className="flex flex-col gap-3 border-b border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(240,193,225,0.18))] px-4 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-sm text-[var(--color-muted-foreground)]">
            {filteredRows.length.toLocaleString()} matching rows with {nutrientColumns.length.toLocaleString()} nutrient columns
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() => setFilters({ food: '' })}
            >
              Reset column filters
            </Button>
            <Button
              size="sm"
              className="rounded-xl"
              onClick={() =>
                exportFoodsToCsv(
                  filteredRows.map((row) => row.food),
                  TABLE_NUTRIENT_DEFINITIONS.map((definition) => ({
                    key: definition.label,
                    label: definition.label,
                  })),
                )
              }
            >
              Export filtered rows
            </Button>
          </div>
        </div>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Every available nutrient from the loaded foods is shown as its own column. Use the food filter and nutrient minimum filters to narrow the table.
        </p>
      </div>

      <div className="border-b border-[var(--color-border)] bg-white/70 px-3 py-3">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-muted-foreground)]">
                Filters
              </h3>
              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                Filter by food name and minimum nutrient values across all available nutrient columns.
              </p>
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
            <label className="space-y-1.5">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted-foreground)]">
                Food
              </span>
              <Input
                value={filters.food ?? ''}
                onChange={(event) => setFilters((current) => ({ ...current, food: event.target.value }))}
                placeholder="Food"
                className="h-8 bg-white px-2 text-[11px]"
              />
            </label>

            {nutrientColumns.map((column) => (
              <label key={column.key} className="space-y-1.5">
                <span
                  className="block truncate text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted-foreground)]"
                  title={TABLE_NUTRIENT_DEFINITIONS.find((definition) => definition.label === column.key)?.label ?? column.label}
                >
                  {column.label}
                </span>
                <Input
                  type="number"
                  value={filters[column.key] ?? ''}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, [column.key]: event.target.value }))
                  }
                  placeholder="Min"
                  className="h-8 bg-white px-2 text-[11px]"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-hidden">
        <table className="w-full table-fixed border-collapse">
          <thead className="bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(240,193,225,0.28))]">
            <tr className="border-b border-[var(--color-border)]">
              <th className="sticky left-0 z-10 w-[23%] bg-[rgba(255,255,255,0.96)] px-2 py-1.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted-foreground)]">
                Food
              </th>
              {nutrientColumns.map((column) => (
                <th
                  key={column.key}
                  className="w-[8%] px-1.5 py-1.5 text-left text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--color-muted-foreground)]"
                  title={TABLE_NUTRIENT_DEFINITIONS.find((definition) => definition.label === column.key)?.label ?? column.label}
                >
                  {column.label}
                </th>
              ))}
              <th className="sticky right-0 z-10 w-[5%] bg-[rgba(255,255,255,0.96)] px-1.5 py-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--color-muted-foreground)]">
                View
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/70">
            {filteredRows.map(({ food, nutrientMap }, index) => (
              <tr
                key={food.fdcId}
                className={`border-b border-[var(--color-border)] align-top transition hover:bg-[rgba(255,249,191,0.18)] ${
                  index % 2 === 0 ? 'bg-white/66' : 'bg-[rgba(255,255,255,0.4)]'
                }`}
              >
                <td className={`sticky left-0 z-10 bg-[rgba(255,255,255,0.96)] px-2 ${rowPadding}`}>
                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => onOpenFood(food)}
                      className="line-clamp-2 text-left text-[11px] font-semibold leading-4 text-[var(--color-foreground)] transition hover:text-[var(--color-muted-foreground)]"
                    >
                      {food.description}
                    </button>
                  </div>
                </td>
                {nutrientColumns.map((column) => {
                  const nutrient = nutrientMap.get(column.key)
                  return (
                    <td
                      key={column.key}
                      className={`px-1.5 ${rowPadding} text-[11px] font-semibold leading-4 text-[var(--color-foreground)]`}
                    >
                      {nutrient ? formatNutrientValue(nutrient.amount, nutrient.unitName) : '-'}
                    </td>
                  )
                })}
                <td className={`sticky right-0 z-10 bg-[rgba(255,255,255,0.96)] px-1.5 ${rowPadding} text-center`}>
                  <button
                    type="button"
                    aria-label={`Inspect ${food.description}`}
                    onClick={() => onOpenFood(food)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--color-border)] bg-white/80 text-[10px] text-[var(--color-foreground)] transition hover:bg-[var(--color-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
                    title="Inspect food details"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
