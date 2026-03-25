import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { FoodListItem } from '../types/usda'
import { formatNutrientValue } from '../utils/formatters'
import {
  exportFoodsToCsv,
  getAvailableNutrientOptions,
  getNutrientForColumn,
  getSelectedNutrientColumns,
} from '../utils/export'
import { EmptyState } from './EmptyState'
import { ErrorState } from './ErrorState'
import { LoadingSkeleton } from './LoadingSkeleton'
import { NutrientColumnPicker } from './NutrientColumnPicker'
import { Badge } from './ui/badge'
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

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 5l10 10M15 5 5 15" strokeLinecap="round" />
    </svg>
  )
}

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

function sanitizeNumericFilter(value: string) {
  const sanitized = value.replace(/[^0-9.\-]/g, '')
  const hasNegative = sanitized.startsWith('-')
  const body = hasNegative ? sanitized.slice(1) : sanitized
  const [integerPart, ...decimalParts] = body.split('.')
  const decimalPart = decimalParts.join('')
  const rebuilt = `${hasNegative ? '-' : ''}${integerPart}${decimalPart ? `.${decimalPart}` : ''}`

  return rebuilt
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
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
  const [selectedCustomKeys, setSelectedCustomKeys] = useState<string[]>([])
  const tableScrollRef = useRef<HTMLDivElement | null>(null)
  const tableInnerRef = useRef<HTMLTableElement | null>(null)
  const topTrackRef = useRef<HTMLDivElement | null>(null)
  const [scrollContentWidth, setScrollContentWidth] = useState(0)
  const [scrollViewportWidth, setScrollViewportWidth] = useState(0)
  const [topScrollLeft, setTopScrollLeft] = useState(0)
  const [showTopScrollbar, setShowTopScrollbar] = useState(false)

  const availableOptions = useMemo(() => getAvailableNutrientOptions(foods), [foods])
  const nutrientColumns = useMemo(
    () => getSelectedNutrientColumns(foods, selectedCustomKeys),
    [foods, selectedCustomKeys],
  )

  const rows = useMemo(() => {
    return foods.map((food) => ({
      food,
      nutrientMap: new Map(
        nutrientColumns.map((column) => [column.key, getNutrientForColumn(food, column)] as const),
      ),
    }))
  }, [foods, nutrientColumns])

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

  useEffect(() => {
    const bottom = tableScrollRef.current
    const table = tableInnerRef.current
    if (!bottom || !table) {
      return
    }

    const update = () => {
      setScrollContentWidth(table.scrollWidth)
      setScrollViewportWidth(bottom.clientWidth)
      setTopScrollLeft(bottom.scrollLeft)
      setShowTopScrollbar(bottom.scrollWidth > bottom.clientWidth + 4)
    }

    update()
    bottom.addEventListener('scroll', update)
    window.addEventListener('resize', update)

    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null
    resizeObserver?.observe(bottom)
    resizeObserver?.observe(table)

    return () => {
      bottom.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      resizeObserver?.disconnect()
    }
  }, [nutrientColumns.length, filteredRows.length])

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
  const maxScrollLeft = Math.max(scrollContentWidth - scrollViewportWidth, 0)

  const addCustomNutrient = (key: string) => {
    setSelectedCustomKeys((current) => (current.includes(key) ? current : [...current, key]))
  }

  const removeCustomNutrient = (key: string) => {
    setSelectedCustomKeys((current) => current.filter((item) => item !== key))
    setFilters((current) => {
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  const handleTopScrollbarPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bottom = tableScrollRef.current
    const track = topTrackRef.current
    if (!bottom || !track || maxScrollLeft <= 0) {
      return
    }

    const trackRect = track.getBoundingClientRect()
    const trackWidth = trackRect.width
    const thumbWidth = Math.max((scrollViewportWidth / scrollContentWidth) * trackWidth, 56)
    const maxThumbOffset = Math.max(trackWidth - thumbWidth, 0)
    const currentThumbOffset = maxScrollLeft > 0 ? (topScrollLeft / maxScrollLeft) * maxThumbOffset : 0
    const pointerX = event.clientX - trackRect.left
    const isOnThumb = pointerX >= currentThumbOffset && pointerX <= currentThumbOffset + thumbWidth
    const dragOffset = isOnThumb ? pointerX - currentThumbOffset : thumbWidth / 2

    const updateFromPointer = (clientX: number) => {
      const nextPointerX = clientX - trackRect.left
      const nextOffset = clamp(nextPointerX - dragOffset, 0, maxThumbOffset)
      const ratio = maxThumbOffset > 0 ? nextOffset / maxThumbOffset : 0
      bottom.scrollLeft = ratio * maxScrollLeft
    }

    updateFromPointer(event.clientX)

    const handlePointerMove = (moveEvent: PointerEvent) => {
      updateFromPointer(moveEvent.clientX)
    }

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  const thumbWidth =
    scrollContentWidth > 0 && scrollViewportWidth > 0
      ? Math.max((scrollViewportWidth / scrollContentWidth) * 100, 18)
      : 100
  const maxThumbTravel = Math.max(100 - thumbWidth, 0)
  const thumbOffset = maxScrollLeft > 0 ? (topScrollLeft / maxScrollLeft) * maxThumbTravel : 0

  return (
    <Card className="overflow-hidden bg-[linear-gradient(180deg,rgba(25,24,37,0.96),rgba(134,93,255,0.22))]">
      <div className="flex flex-col gap-3 border-b border-[var(--color-border)] bg-[rgba(25,24,37,0.72)] px-4 py-4">
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
              onClick={() => exportFoodsToCsv(filteredRows.map((row) => row.food), nutrientColumns)}
            >
              Export filtered rows
            </Button>
          </div>
        </div>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Every available nutrient from the loaded foods is shown as its own column. Use the food filter and nutrient minimum filters to narrow the table.
        </p>
      </div>

      <div className="border-b border-[var(--color-border)] bg-[rgba(25,24,37,0.62)] px-4 py-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#FFA3FD]">
              Table fields
            </h3>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              The default nutrients stay pinned. Add more nutrients from the full loaded list to expand the table and its filter controls.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <label className="flex flex-1 flex-col gap-2 text-sm">
              <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#FFA3FD]">
                Add nutrient column
              </span>
              <NutrientColumnPicker
                options={availableOptions}
                selectedKeys={selectedCustomKeys}
                onSelect={addCustomNutrient}
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            {nutrientColumns.map((column) => {
              const isLocked = column.type === 'default'

              return (
                <div
                  key={column.key}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[rgba(134,93,255,0.12)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-foreground)]"
                >
                  <span>{column.label}</span>
                  {isLocked ? (
                    <Badge variant="secondary" className="px-2 py-0.5 text-[9px] tracking-[0.12em]">
                      Locked
                    </Badge>
                  ) : (
                    <button
                      type="button"
                      onClick={() => removeCustomNutrient(column.key)}
                      className="inline-flex size-5 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white/72 transition hover:border-white/20 hover:bg-white/14 hover:text-white"
                      aria-label={`Remove ${column.label}`}
                    >
                      <CloseIcon />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="border-b border-[var(--color-border)] bg-[rgba(25,24,37,0.58)] px-3 py-3">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#FFA3FD]">
                Filters
              </h3>
              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                Filter by food name and minimum nutrient values across the columns you selected above.
              </p>
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
            <label className="space-y-1.5">
              <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#FFA3FD]">
                Food
              </span>
              <Input
                value={filters.food ?? ''}
                onChange={(event) => setFilters((current) => ({ ...current, food: event.target.value }))}
                placeholder="Food"
                className="h-8 bg-[rgba(25,24,37,0.9)] px-2 text-[11px]"
              />
            </label>

            {nutrientColumns.map((column) => (
              <label key={column.key} className="space-y-1.5">
                <span className="block truncate text-[10px] font-bold uppercase tracking-[0.08em] text-[#FFA3FD]" title={column.label}>
                  {column.shortLabel}
                </span>
                <div className="relative">
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={filters[column.key] ?? ''}
                    onChange={(event) =>
                      setFilters((current) => ({
                        ...current,
                        [column.key]: sanitizeNumericFilter(event.target.value),
                      }))
                    }
                    placeholder="Min"
                    className="h-8 bg-[rgba(25,24,37,0.9)] px-2 pr-12 text-[11px]"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 inline-flex items-center text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--color-muted-foreground)]">
                    {column.label.match(/\(([^)]+)\)$/)?.[1] ?? column.unitName ?? ''}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {showTopScrollbar ? (
        <div className="border-b border-[var(--color-border)] bg-[rgba(25,24,37,0.82)] px-3 py-2">
          <div
            ref={topTrackRef}
            className="relative h-3 cursor-pointer rounded-full bg-white/8 ring-1 ring-inset ring-white/8"
            onPointerDown={handleTopScrollbarPointerDown}
            aria-hidden="true"
          >
            <div
              className="absolute inset-y-0 rounded-full bg-[linear-gradient(90deg,#865dff,#e384ff)] shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
              style={{
                width: `${thumbWidth}%`,
                left: `${thumbOffset}%`,
              }}
            />
          </div>
        </div>
      ) : null}

      <div ref={tableScrollRef} className="overflow-x-auto table-scrollbar">
        <table ref={tableInnerRef} className="min-w-max border-collapse">
          <thead className="bg-[rgba(25,24,37,0.88)]">
            <tr className="border-b border-[var(--color-border)]">
              <th className="sticky left-0 z-10 min-w-64 bg-[#191825] px-2 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-[#FFA3FD]">
                Food
              </th>
              {nutrientColumns.map((column) => (
                <th
                  key={column.key}
                  className="min-w-24 max-w-28 px-2 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-[#FFA3FD]"
                  title={column.label}
                >
                  <span className="block whitespace-normal break-words">{column.shortLabel}</span>
                </th>
              ))}
              <th className="sticky right-0 z-10 min-w-20 bg-[#191825] px-2 py-3 text-center text-[10px] font-bold uppercase tracking-[0.06em] text-[#FFA3FD]">
                View
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#191825]">
            {filteredRows.map(({ food, nutrientMap }) => (
              <tr
                key={food.fdcId}
                className="border-b border-[var(--color-border)] align-top bg-[#191825] transition hover:bg-[rgba(134,93,255,0.12)]"
              >
                <td className={`sticky left-0 z-10 min-w-64 bg-[#191825] px-2 ${rowPadding}`}>
                  <div className="min-w-0 max-w-64">
                    <button
                      type="button"
                      onClick={() => onOpenFood(food)}
                      className="line-clamp-2 text-left text-[11px] font-bold leading-4 text-[var(--color-foreground)] transition hover:text-[#E384FF]"
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
                      className={`min-w-24 max-w-28 px-2 ${rowPadding} text-[11px] font-medium leading-4 text-[var(--color-foreground)]`}
                    >
                      <span className="block whitespace-normal break-words">
                        {nutrient ? formatNutrientValue(nutrient.amount, nutrient.unitName) : '-'}
                      </span>
                    </td>
                  )
                })}
                <td className={`sticky right-0 z-10 min-w-20 bg-[#191825] px-2 ${rowPadding} text-center`}>
                  <button
                    type="button"
                    aria-label={`Inspect ${food.description}`}
                    onClick={() => onOpenFood(food)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--color-border)] bg-[rgba(134,93,255,0.16)] text-[10px] text-[var(--color-foreground)] transition hover:bg-[rgba(227,132,255,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
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
