import type { FoodListItem } from '../types/usda'
import { EmptyState } from './EmptyState'
import { ErrorState } from './ErrorState'
import { FoodCard } from './FoodCard'
import { LoadingSkeleton } from './LoadingSkeleton'

type FoodGridProps = {
  foods: FoodListItem[]
  isLoading: boolean
  isError: boolean
  errorMessage: string | null
  hasQuery: boolean
  favorites: Set<number>
  viewMode: 'grid' | 'compact'
  onOpenFood: (food: FoodListItem) => void
  onRetry: () => void
  onToggleFavorite: (fdcId: number) => void
}

export function FoodGrid({
  foods,
  isLoading,
  isError,
  errorMessage,
  hasQuery,
  favorites,
  viewMode,
  onOpenFood,
  onRetry,
  onToggleFavorite,
}: FoodGridProps) {
  if (isLoading) {
    return <LoadingSkeleton variant="grid" />
  }

  if (isError && errorMessage) {
    return <ErrorState message={errorMessage} onRetry={onRetry} />
  }

  if (foods.length === 0) {
    return <EmptyState hasQuery={hasQuery} />
  }

  return (
    <div className={viewMode === 'grid' ? 'grid gap-4 md:grid-cols-2 2xl:grid-cols-3' : 'grid gap-4'}>
      {foods.map((food) => (
        <FoodCard
          key={food.fdcId}
          food={food}
          isFavorite={favorites.has(food.fdcId)}
          variant={viewMode}
          onOpenFood={onOpenFood}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  )
}
