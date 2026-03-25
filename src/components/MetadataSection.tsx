import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

type MetadataItem = {
  label: string
  value: string
}

type MetadataSectionProps = {
  title: string
  items: MetadataItem[]
}

export function MetadataSection({ title, items }: MetadataSectionProps) {
  return (
    <Card className="rounded-[24px] bg-[linear-gradient(180deg,rgba(25,24,37,0.9),rgba(134,93,255,0.14))]">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <dl className="space-y-3">
          {items.map((item) => (
            <div
              key={`${title}-${item.label}`}
              className="rounded-2xl border border-[var(--color-border)] bg-[rgba(25,24,37,0.78)] px-4 py-3"
            >
              <dt className="text-xs uppercase tracking-[0.18em] text-[#FFA3FD]">
                {item.label}
              </dt>
              <dd className="mt-2 text-sm leading-6 text-[var(--color-foreground)]/82">{item.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
