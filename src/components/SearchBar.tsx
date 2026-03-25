import { useDeferredValue, useEffect, useRef } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string) => void
}

export function SearchBar({ value, onChange, onSubmit }: SearchBarProps) {
  const deferredValue = useDeferredValue(value)
  const isInitialRender = useRef(true)

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false
      return
    }

    const timeout = window.setTimeout(() => {
      onSubmit(deferredValue)
    }, 450)

    return () => window.clearTimeout(timeout)
  }, [deferredValue, onSubmit])

  return (
    <Card className="bg-[linear-gradient(180deg,rgba(25,24,37,0.96),rgba(134,93,255,0.22))]">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge className="w-fit">Search Foundation Foods</Badge>
          <CardTitle className="mt-3 text-3xl">Find ingredients and basic foods</CardTitle>
        </div>
        <Badge variant="secondary" className="w-fit">
          Foundation Foods only
        </Badge>
      </CardHeader>

      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit(value)
        }}
      >
        <CardContent className="flex w-full flex-col gap-3 pt-0 sm:flex-row">
          <label className="sr-only" htmlFor="foundation-search">
            Search Foundation Foods
          </label>
          <Input
            id="foundation-search"
            type="search"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Search foods like salmon, oats, yogurt, or sweet potato"
            className="min-w-0 flex-1 rounded-2xl bg-[rgba(25,24,37,0.9)] px-5"
          />
          <Button type="submit" size="lg" className="rounded-2xl px-6">
            Search
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}
