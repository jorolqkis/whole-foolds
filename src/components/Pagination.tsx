import { Button } from './ui/button'
import { Card } from './ui/card'

type PaginationProps = {
  currentPage: number
  pageSize: number
  totalCount: number | null
  hasNextPage: boolean
  disabled?: boolean
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  pageSize,
  totalCount,
  hasNextPage,
  disabled = false,
  onPageChange,
}: PaginationProps) {
  if (currentPage === 1 && !hasNextPage && (totalCount === null || totalCount <= pageSize)) {
    return null
  }

  const totalPages = totalCount === null ? null : Math.max(1, Math.ceil(totalCount / pageSize))
  const maxVisiblePage = totalPages ?? (hasNextPage ? currentPage + 1 : currentPage)
  const start = Math.max(1, Math.min(currentPage - 2, maxVisiblePage - 4))
  const pages = Array.from({ length: Math.min(maxVisiblePage, 5) }, (_, index) => start + index).filter(
    (page) => page <= maxVisiblePage,
  )

  return (
    <nav aria-label="Pagination">
      <Card className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--color-muted-foreground)]">
          {totalPages
            ? `Page ${currentPage} of ${totalPages} • ${totalCount?.toLocaleString()} foods`
            : `Page ${currentPage} • ${pageSize} foods per page while browsing`}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            disabled={disabled || currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            variant="outline"
            size="sm"
            className="rounded-xl"
          >
            Previous
          </Button>
          {pages.map((page) => (
            <Button
              key={page}
              disabled={disabled}
              aria-current={page === currentPage ? 'page' : undefined}
              onClick={() => onPageChange(page)}
              variant={page === currentPage ? 'default' : 'outline'}
              size="sm"
              className="rounded-xl"
            >
              {page}
            </Button>
          ))}
          <Button
            disabled={disabled || (!hasNextPage && (!totalPages || currentPage >= totalPages))}
            onClick={() => onPageChange(currentPage + 1)}
            variant="outline"
            size="sm"
            className="rounded-xl"
          >
            Next
          </Button>
        </div>
      </Card>
    </nav>
  )
}
