type LoadingSkeletonProps = {
  variant: 'grid' | 'detail'
}

export function LoadingSkeleton({ variant }: LoadingSkeletonProps) {
  if (variant === 'detail') {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 rounded-[24px] bg-white/70" />
          ))}
        </div>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="h-72 rounded-[28px] bg-white/70" />
          <div className="h-72 rounded-[28px] bg-white/70" />
        </div>
        <div className="h-96 rounded-[28px] bg-white/70" />
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-[360px] animate-pulse rounded-[28px] bg-white/70 shadow-[var(--shadow-card)]"
        />
      ))}
    </div>
  )
}
