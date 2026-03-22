import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export function SetupNotice() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="max-w-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.85),rgba(240,193,225,0.55))] shadow-[0_36px_90px_-50px_rgba(77,44,104,0.5)]">
        <CardHeader>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--color-muted-foreground)]">
            Setup required
          </p>
          <CardTitle className="mt-3 text-4xl">
            Add your USDA API key before running the explorer.
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-7 text-[var(--color-foreground)]/80">
            Create a <code className="rounded bg-white/70 px-2 py-1">.env</code> file in the
            project root with{' '}
            <code className="rounded bg-white/70 px-2 py-1">VITE_USDA_API_KEY=...</code>. A
            starter example is included in{' '}
            <code className="rounded bg-white/70 px-2 py-1">.env.example</code>.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
