import type { ApiNutrient, AppNutrient } from '../types/usda'

const HIGHLIGHT_PRIORITY = [
  'Protein',
  'Total lipid (fat)',
  'Carbohydrate, by difference',
  'Fiber, total dietary',
  'Potassium, K',
  'Calcium, Ca',
  'Iron, Fe',
  'Vitamin C, total ascorbic acid',
]

const GROUP_RULES = [
  {
    label: 'Macronutrients',
    matches: ['protein', 'fat', 'lipid', 'carbohydrate', 'fiber', 'sugar', 'energy'],
  },
  {
    label: 'Minerals',
    matches: [
      'calcium',
      'iron',
      'magnesium',
      'phosphorus',
      'potassium',
      'sodium',
      'zinc',
      'selenium',
      'copper',
      'manganese',
    ],
  },
  {
    label: 'Vitamins',
    matches: [
      'vitamin',
      'folate',
      'thiamin',
      'riboflavin',
      'niacin',
      'choline',
      'tocopherol',
      'phylloquinone',
    ],
  },
]

const NUTRIENT_LOOKUP: Record<
  string,
  {
    ids: number[]
    numbers: string[]
    aliases: string[]
  }
> = {
  Protein: {
    ids: [1003],
    numbers: ['203'],
    aliases: ['protein'],
  },
  'Total lipid (fat)': {
    ids: [1004],
    numbers: ['204'],
    aliases: ['total lipid (fat)', 'fat', 'lipid'],
  },
  'Carbohydrate, by difference': {
    ids: [1005],
    numbers: ['205'],
    aliases: ['carbohydrate, by difference', 'carbohydrate'],
  },
  'Fiber, total dietary': {
    ids: [1079],
    numbers: ['291'],
    aliases: ['fiber, total dietary', 'dietary fiber', 'fiber'],
  },
}

export function normalizeNutrients(nutrients?: ApiNutrient[]): AppNutrient[] {
  const seen = new Set<string>()

  return (nutrients ?? [])
    .map((nutrient) => ({
      id: nutrient.nutrient?.id ?? nutrient.nutrientId,
      number: nutrient.nutrient?.number ?? nutrient.nutrientNumber ?? nutrient.number,
      name: nutrient.nutrient?.name ?? nutrient.nutrientName ?? nutrient.name ?? 'Unnamed nutrient',
      rank: nutrient.nutrient?.rank ?? nutrient.rank,
      unitName: nutrient.nutrient?.unitName ?? nutrient.unitName,
      amount: nutrient.amount ?? nutrient.value ?? Number.NaN,
    }))
    .filter((nutrient) => {
      if (!nutrient.name || typeof nutrient.amount !== 'number' || Number.isNaN(nutrient.amount)) {
        return false
      }

      const key = nutrient.id ? String(nutrient.id) : nutrient.name.toLowerCase()
      if (seen.has(key)) {
        return false
      }

      seen.add(key)
      return true
    })
    .sort((left, right) => (left.rank ?? Number.MAX_SAFE_INTEGER) - (right.rank ?? Number.MAX_SAFE_INTEGER))
}

export function getHighlightNutrients(nutrients?: ApiNutrient[]) {
  const normalized = normalizeNutrients(nutrients)

  const selected = HIGHLIGHT_PRIORITY.map((name) =>
    normalized.find((nutrient) => nutrient.name.toLowerCase() === name.toLowerCase()),
  ).filter(Boolean) as AppNutrient[]

  if (selected.length >= 4) {
    return selected.slice(0, 6)
  }

  return normalized.slice(0, 6)
}

export function getNutrientByName(nutrients: ApiNutrient[] | undefined, name: string) {
  const normalized = normalizeNutrients(nutrients)
  const lookup = NUTRIENT_LOOKUP[name]
  const normalizedName = name.toLowerCase()

  return normalized.find((nutrient) => {
    const nutrientName = nutrient.name.toLowerCase()
    const nutrientNumber = nutrient.number?.toLowerCase()

    if (lookup) {
      return (
        (nutrient.id !== undefined && lookup.ids.includes(nutrient.id)) ||
        (nutrientNumber !== undefined && lookup.numbers.includes(nutrientNumber)) ||
        lookup.aliases.some((alias) => nutrientName.includes(alias))
      )
    }

    return nutrientName === normalizedName
  })
}

export function groupNutrients(nutrients?: ApiNutrient[]) {
  const normalized = normalizeNutrients(nutrients)
  const groups = GROUP_RULES.map((rule) => ({
    label: rule.label,
    nutrients: normalized.filter((nutrient) =>
      rule.matches.some((match) => nutrient.name.toLowerCase().includes(match)),
    ),
  })).filter((group) => group.nutrients.length > 0)

  const groupedKeys = new Set(
    groups.flatMap((group) =>
      group.nutrients.map((nutrient) => (nutrient.id ? String(nutrient.id) : nutrient.name.toLowerCase())),
    ),
  )

  const otherNutrients = normalized.filter((nutrient) => {
    const key = nutrient.id ? String(nutrient.id) : nutrient.name.toLowerCase()
    return !groupedKeys.has(key)
  })

  if (otherNutrients.length > 0) {
    groups.push({
      label: 'Other nutrients',
      nutrients: otherNutrients,
    })
  }

  return groups
}
