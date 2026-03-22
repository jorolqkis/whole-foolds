import type { FoodListItem } from '../types/usda'
import { formatNutrientValue } from './formatters'
import { normalizeNutrients } from './nutrients'

export type NutrientColumn = {
  key: string
  label: string
}

export const TABLE_NUTRIENT_LABELS = [
  'Carbohydrate, by summation',
  'Cholesterol',
  'Energy',
  'Fatty acids, total monounsaturated',
  'Fatty acids, total polyunsaturated',
  'Fatty acids, total saturated',
  'High Molecular Weight Dietary Fiber (HMWDF)',
  'Low Molecular Weight Dietary Fiber',
  'Protein',
] as const

export const TABLE_NUTRIENT_DEFINITIONS: Array<{
  label: string
  shortLabel: string
  matches: string[]
}> = [
  {
    label: 'Carbohydrate, by summation (G)',
    shortLabel: 'Carb Sum',
    matches: ['carbohydrate, by summation'],
  },
  {
    label: 'Cholesterol (MG)',
    shortLabel: 'Chol',
    matches: ['cholesterol'],
  },
  {
    label: 'Energy (KCAL)',
    shortLabel: 'Energy',
    matches: ['energy'],
  },
  {
    label: 'Fatty acids, total monounsaturated (G)',
    shortLabel: 'Mono Fat',
    matches: ['fatty acids, total monounsaturated'],
  },
  {
    label: 'Fatty acids, total polyunsaturated (G)',
    shortLabel: 'Poly Fat',
    matches: ['fatty acids, total polyunsaturated'],
  },
  {
    label: 'Fatty acids, total saturated (G)',
    shortLabel: 'Sat Fat',
    matches: ['fatty acids, total saturated'],
  },
  {
    label: 'High Molecular Weight Dietary Fiber (HMWDF) (G)',
    shortLabel: 'HMWDF',
    matches: ['high molecular weight dietary fiber', 'hmwdf'],
  },
  {
    label: 'Low Molecular Weight Dietary Fiber (G)',
    shortLabel: 'LMWDF',
    matches: ['low molecular weight dietary fiber', 'lmwdf'],
  },
  {
    label: 'Protein (G)',
    shortLabel: 'Protein',
    matches: ['protein'],
  },
]

function escapeCsv(value: string) {
  return `"${value.replaceAll('"', '""')}"`
}

export function exportFoodsToCsv(foods: FoodListItem[], nutrientColumns: NutrientColumn[]) {
  const delimiter = ';'
  const headers = ['Food', ...nutrientColumns.map((column) => column.label)]

  const rows = foods.map((food) => {
    const nutrients = normalizeNutrients(food.foodNutrients)
    const nutrientMap = new Map(
      TABLE_NUTRIENT_DEFINITIONS.map((definition) => {
        const nutrient = nutrients.find((candidate) =>
          definition.matches.some((match) => candidate.name.toLowerCase().includes(match)),
        )

        return [
          definition.label,
          nutrient ? formatNutrientValue(nutrient.amount, nutrient.unitName) : '',
        ] as const
      }),
    )

    return [
      food.description,
      ...nutrientColumns.map((column) => nutrientMap.get(column.key) ?? ''),
    ]
      .map((value) => escapeCsv(value))
      .join(delimiter)
  })

  const csv = [`sep=${delimiter}`, headers.map(escapeCsv).join(delimiter), ...rows].join('\r\n')
  const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const timestamp = new Date().toISOString().slice(0, 10)

  link.href = url
  link.download = `foundation-foods-${timestamp}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
