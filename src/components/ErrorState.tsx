import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

type ErrorStateProps = {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Card className="border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(59,28,50,0.96),rgba(106,30,85,0.72))] px-6 py-10">
      <CardHeader className="pb-4">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#A64D79]">
          API error
        </p>
        <CardTitle className="mt-3 text-3xl">The USDA data could not be loaded.</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="max-w-2xl text-sm leading-6 text-[var(--color-foreground)]/82">{message}</p>
        <Button onClick={onRetry} className="mt-6 rounded-2xl">
          Try again
        </Button>
      </CardContent>
    </Card>
  )
}
