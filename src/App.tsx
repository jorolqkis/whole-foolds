import { startTransition, useEffect, useMemo, useState } from 'react'
import { FoodDetailModal } from './components/FoodDetailModal'
import { FoodResultsTable } from './components/FoodResultsTable'
import { HeroSection } from './components/HeroSection'
import { SearchBar } from './components/SearchBar'
import { SetupNotice } from './components/SetupNotice'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { useFoundationFoods } from './hooks/useFoundationFoods'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { FoodListItem } from './types/usda'

const PAGE_SIZE = 200

function getInitialQueryFromUrl() {
  const params = new URLSearchParams(window.location.search)
  return params.get('q') ?? ''
}

function App() {
  const apiKey = import.meta.env.VITE_USDA_API_KEY?.trim() ?? ''
  const [initialQuery] = useState(getInitialQueryFromUrl)
  const [searchInput, setSearchInput] = useState(initialQuery)
  const [query, setQuery] = useState(initialQuery)
  const [selectedFood, setSelectedFood] = useState<FoodListItem | null>(null)
  const [favorites, setFavorites] = useLocalStorage<number[]>('foundation-foods:favorites', [])
  const [, setRecentlyViewed] = useLocalStorage<FoodListItem[]>(
    'foundation-foods:recently-viewed',
    [],
  )

  const foundationFoods = useFoundationFoods({
    apiKey,
    pageSize: PAGE_SIZE,
    query,
  })

  useEffect(() => {
    const params = new URLSearchParams()

    if (query) {
      params.set('q', query)
    }

    const next = params.toString()
    const url = next ? `${window.location.pathname}?${next}` : window.location.pathname
    window.history.replaceState(null, '', url)
  }, [query])

  const favoriteSet = useMemo(() => new Set(favorites), [favorites])

  const visibleFoods = useMemo(() => {
    return [...foundationFoods.foods].sort((a, b) => {
      const aDate = a.publicationDate ? new Date(a.publicationDate).getTime() : 0
      const bDate = b.publicationDate ? new Date(b.publicationDate).getTime() : 0
      return bDate - aDate
    })
  }, [foundationFoods.foods])

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
  }

  const handleSearchSubmit = (value: string) => {
    startTransition(() => {
      setQuery(value.trim())
    })
  }

  const handleOpenFood = (food: FoodListItem) => {
    setSelectedFood(food)
    setRecentlyViewed((current) => {
      const next = [food, ...current.filter((item) => item.fdcId !== food.fdcId)]
      return next.slice(0, 6)
    })
  }

  const handleToggleFavorite = (fdcId: number) => {
    setFavorites((current) =>
      current.includes(fdcId) ? current.filter((id) => id !== fdcId) : [fdcId, ...current],
    )
  }

  if (!apiKey) {
    return <SetupNotice />
  }

  return (
    <div className="min-h-screen text-[var(--color-foreground)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to content
      </a>

      <main id="main-content" className="flex min-h-screen flex-col">
        <div className="relative">
          <div className="absolute inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <SiteHeader />
            </div>
          </div>

          <HeroSection activeQuery={query} />
        </div>

        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 pb-12 pt-8 sm:px-6 lg:px-8">
          <section id="explorer" className="animate-float-in">
            <div className="flex flex-col gap-5">
              <SearchBar
                value={searchInput}
                onChange={handleSearchChange}
                onSubmit={handleSearchSubmit}
              />

              <FoodResultsTable
                foods={visibleFoods}
                isLoading={foundationFoods.isLoading}
                isError={Boolean(foundationFoods.error)}
                errorMessage={foundationFoods.error}
                hasQuery={Boolean(query)}
                density="comfortable"
                onOpenFood={handleOpenFood}
                onRetry={foundationFoods.retry}
              />
            </div>
          </section>

          <SiteFooter />
        </div>
      </main>

      <FoodDetailModal
        apiKey={apiKey}
        food={selectedFood}
        isFavorite={selectedFood ? favoriteSet.has(selectedFood.fdcId) : false}
        onClose={() => setSelectedFood(null)}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  )
}

export default App
