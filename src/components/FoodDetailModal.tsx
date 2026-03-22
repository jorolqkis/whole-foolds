import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useFoodDetails } from '../hooks/useFoodDetails'
import type { FoodListItem } from '../types/usda'
import { extractFoundationMetadata } from '../utils/foundation'
import { formatDate, formatFallback, formatNutrientValue } from '../utils/formatters'
import { getHighlightNutrients, groupNutrients } from '../utils/nutrients'
import { ErrorState } from './ErrorState'
import { LoadingSkeleton } from './LoadingSkeleton'
import { MetadataSection } from './MetadataSection'
import { NutrientHighlights } from './NutrientHighlights'
import { NutrientSection } from './NutrientSection'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Separator } from './ui/separator'

type FoodDetailModalProps = {
  apiKey: string
  food: FoodListItem | null
  isFavorite: boolean
  onClose: () => void
  onToggleFavorite: (fdcId: number) => void
}

export function FoodDetailModal({
  apiKey,
  food,
  isFavorite,
  onClose,
  onToggleFavorite,
}: FoodDetailModalProps) {
  const titleId = useId()
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const detail = useFoodDetails({
    apiKey,
    fdcId: food?.fdcId ?? null,
  })

  useEffect(() => {
    if (!food) {
      return
    }

    const previousActive = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }

      if (event.key === 'Tab') {
        const focusableElements = Array.from(
          document.querySelectorAll<HTMLElement>(
            '[data-detail-modal] button, [data-detail-modal] a, [data-detail-modal] input, [data-detail-modal] select, [data-detail-modal] textarea, [data-detail-modal] [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((element) => !element.hasAttribute('disabled'))

        if (focusableElements.length === 0) {
          return
        }

        const first = focusableElements[0]
        const last = focusableElements[focusableElements.length - 1]

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.setTimeout(() => closeButtonRef.current?.focus(), 0)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
      previousActive?.focus()
    }
  }, [food, onClose])

  if (!food) {
    return null
  }

  const content = detail.food
  const metadata = content ? extractFoundationMetadata(content) : []
  const highlightNutrients = content ? getHighlightNutrients(content.foodNutrients) : []
  const nutrientGroups = content ? groupNutrients(content.foodNutrients) : []

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end bg-[rgba(44,24,63,0.36)] p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <section
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[92vh] w-full overflow-hidden rounded-t-[32px] border border-white/50 bg-[linear-gradient(180deg,#fffdf8,#fff7ea)] shadow-2xl sm:max-w-5xl sm:rounded-[32px]"
        role="dialog"
        data-detail-modal
      >
        <div className="border-b border-[var(--color-border)] px-5 py-4 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Badge className="w-fit">Foundation Food detail</Badge>
              <h2 id={titleId} className="mt-3 font-serif text-2xl text-[var(--color-foreground)] sm:text-3xl">
                {food.description}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => onToggleFavorite(food.fdcId)}
                variant={isFavorite ? 'secondary' : 'outline'}
                className="rounded-2xl"
              >
                {isFavorite ? 'Saved' : 'Save'}
              </Button>
              <Button ref={closeButtonRef} onClick={onClose} className="rounded-2xl">
                Close
              </Button>
            </div>
          </div>
        </div>

        <div className="max-h-[calc(92vh-84px)] overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
          {detail.isLoading ? <LoadingSkeleton variant="detail" /> : null}

          {detail.error ? <ErrorState message={detail.error} onRetry={detail.retry} /> : null}

          {content ? (
            <div className="space-y-8">
              <section className="grid gap-4 rounded-[28px] sm:grid-cols-2 xl:grid-cols-4">
                <Card className="bg-[var(--color-card-strong)]">
                  <CardContent className="p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">FDC ID</p>
                    <p className="mt-2 text-lg font-semibold text-[var(--color-foreground)]">{content.fdcId}</p>
                  </CardContent>
                </Card>
                <Card className="bg-[var(--color-card-strong)]">
                  <CardContent className="p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">Category</p>
                    <p className="mt-2 text-lg font-semibold text-[var(--color-foreground)]">
                      {formatFallback(
                        content.foodCategory ||
                          content.wweiaFoodCategory?.wweiaFoodCategoryDescription,
                      )}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-[var(--color-card-strong)]">
                  <CardContent className="p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">Published</p>
                    <p className="mt-2 text-lg font-semibold text-[var(--color-foreground)]">
                      {formatDate(content.publicationDate)}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-[var(--color-card-strong)]">
                  <CardContent className="p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">Scientific name</p>
                    <p className="mt-2 text-lg font-semibold text-[var(--color-foreground)]">
                      {formatFallback(content.scientificName)}
                    </p>
                  </CardContent>
                </Card>
              </section>

              <section className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                <Card className="bg-[var(--color-card-strong)]">
                  <CardHeader className="pb-4">
                    <Badge className="w-fit">About this food</Badge>
                    <CardTitle className="mt-3 text-3xl">{content.description}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0 text-sm leading-7 text-[var(--color-foreground)]/82">
                    {content.commonNames ? (
                      <p>
                        <span className="font-semibold text-[var(--color-foreground)]">Common names:</span>{' '}
                        {content.commonNames}
                      </p>
                    ) : null}
                    {content.additionalDescriptions ? (
                      <p>
                        <span className="font-semibold text-[var(--color-foreground)]">Additional names:</span>{' '}
                        {content.additionalDescriptions}
                      </p>
                    ) : null}
                    {content.foodClass ? (
                      <p>
                        <span className="font-semibold text-[var(--color-foreground)]">Food class:</span>{' '}
                        {content.foodClass}
                      </p>
                    ) : null}
                    {content.foodPortions?.[0]?.gramWeight ? (
                      <p>
                        <span className="font-semibold text-[var(--color-foreground)]">Typical portion:</span>{' '}
                        {formatNutrientValue(content.foodPortions[0].gramWeight, 'g')}{' '}
                        {content.foodPortions[0].modifier ? `(${content.foodPortions[0].modifier})` : ''}
                      </p>
                    ) : null}
                  </CardContent>
                </Card>

                <NutrientHighlights nutrients={highlightNutrients} />
              </section>

              {nutrientGroups.length > 0 ? (
                <Card className="bg-[var(--color-card-strong)]">
                  <CardHeader className="pb-4">
                    <Badge className="w-fit">Full nutrition profile</Badge>
                    <CardTitle className="mt-3 text-3xl">Nutrients grouped for easier scanning</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Separator className="mb-6" />
                    <div className="space-y-6">
                      {nutrientGroups.map((group) => (
                        <NutrientSection
                          key={group.label}
                          label={group.label}
                          nutrients={group.nutrients}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {metadata.length > 0 ? (
                <Card className="bg-[var(--color-card-strong)]">
                  <CardHeader className="pb-4">
                    <Badge className="w-fit">About this food data</Badge>
                    <CardTitle className="mt-3 text-3xl">
                      Foundation Foods metadata in plain language
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid gap-5 lg:grid-cols-2">
                      {metadata.map((section) => (
                        <MetadataSection key={section.title} title={section.title} items={section.items} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
    </div>,
    document.body,
  )
}
