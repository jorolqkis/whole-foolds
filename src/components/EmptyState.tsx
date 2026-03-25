import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

type EmptyStateProps = {
  hasQuery: boolean
}

export function EmptyState({ hasQuery }: EmptyStateProps) {
  return (
    <Card className="border-dashed bg-[linear-gradient(180deg,rgba(59,28,50,0.96),rgba(106,30,85,0.58))] px-6 py-16 text-center">
      <CardHeader className="items-center pb-4">
        <Badge>No results</Badge>
        <CardTitle className="mt-3 text-3xl">
          {hasQuery ? 'No Foundation Foods matched your search.' : 'No Foundation Foods available.'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mx-auto max-w-xl text-sm leading-6 text-[var(--color-muted-foreground)]">
          {hasQuery
            ? 'Try a broader food term such as apple, oat, salmon, or spinach.'
            : 'Check your API key and try refreshing the page.'}
        </p>
      </CardContent>
    </Card>
  )
}
