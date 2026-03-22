import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Select } from './ui/select'

type ExplorerToolbarProps = {
  query: string
  page: number
  resultCount: number
  totalCount: number | null
  categories: string[]
  selectedCategory: string
  favoritesOnly: boolean
  sortBy: 'default' | 'name' | 'recent'
  density: 'comfortable' | 'compact'
  onCategoryChange: (value: string) => void
  onFavoritesOnlyChange: (value: boolean) => void
  onSortChange: (value: 'default' | 'name' | 'recent') => void
  onDensityChange: (value: 'comfortable' | 'compact') => void
}

export function ExplorerToolbar({
  query,
  page,
  resultCount,
  totalCount,
  categories,
  selectedCategory,
  favoritesOnly,
  sortBy,
  density,
  onCategoryChange,
  onFavoritesOnlyChange,
  onSortChange,
  onDensityChange,
}: ExplorerToolbarProps) {
  return (
    <Card className="bg-white/76">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="w-fit">Table controls</Badge>
              {query ? (
                <Badge variant="outline" className="normal-case tracking-[0.08em]">
                  Query: {query}
                </Badge>
              ) : null}
            </div>
            <div>
              <p className="text-lg font-semibold text-[var(--color-foreground)]">
                {resultCount.toLocaleString()} rows before column filters
              </p>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                {totalCount
                  ? `Page ${page} of the USDA result set with ${totalCount.toLocaleString()} total records.`
                  : `Page ${page} with live Foundation Foods results.`}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <label className="space-y-2 text-sm font-medium text-[var(--color-foreground)]">
              <span className="block text-xs uppercase tracking-[0.18em] text-[var(--color-muted-foreground)]">
                Sort
              </span>
              <Select
                value={sortBy}
                onChange={(event) => onSortChange(event.target.value as 'default' | 'name' | 'recent')}
              >
                <option value="default">API order</option>
                <option value="name">Name A-Z</option>
                <option value="recent">Newest publication</option>
              </Select>
            </label>

            <label className="space-y-2 text-sm font-medium text-[var(--color-foreground)]">
              <span className="block text-xs uppercase tracking-[0.18em] text-[var(--color-muted-foreground)]">
                Category
              </span>
              <Select value={selectedCategory} onChange={(event) => onCategoryChange(event.target.value)}>
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </label>

            <label className="space-y-2 text-sm font-medium text-[var(--color-foreground)]">
              <span className="block text-xs uppercase tracking-[0.18em] text-[var(--color-muted-foreground)]">
                Table density
              </span>
              <Select
                value={density}
                onChange={(event) => onDensityChange(event.target.value as 'comfortable' | 'compact')}
              >
                <option value="comfortable">Comfortable</option>
                <option value="compact">Compact</option>
              </Select>
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={favoritesOnly ? 'secondary' : 'outline'}
            size="sm"
            className="rounded-full"
            onClick={() => onFavoritesOnlyChange(!favoritesOnly)}
          >
            {favoritesOnly ? 'Showing saved only' : 'Filter saved only'}
          </Button>
          {categories.slice(0, 5).map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'secondary' : 'ghost'}
              size="sm"
              className="rounded-full border border-transparent"
              onClick={() => onCategoryChange(selectedCategory === category ? '' : category)}
            >
              {category}
            </Button>
          ))}
          {(favoritesOnly || selectedCategory) && (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={() => {
                onFavoritesOnlyChange(false)
                onCategoryChange('')
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
