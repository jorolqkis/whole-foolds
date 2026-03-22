export function formatNutrientValue(amount?: number, unitName?: string) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    return 'Not available'
  }

  const maximumFractionDigits = amount >= 100 ? 0 : amount >= 10 ? 1 : 2
  const value = new Intl.NumberFormat('en-US', {
    maximumFractionDigits,
  }).format(amount)

  return unitName ? `${value} ${unitName}` : value
}

export function formatDate(value?: string) {
  if (!value) {
    return 'Not provided'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function formatFallback(value?: string | number | null) {
  if (value === null || value === undefined || value === '') {
    return 'Not provided'
  }

  return String(value)
}
