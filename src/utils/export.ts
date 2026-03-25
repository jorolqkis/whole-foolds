import type { FoodListItem } from '../types/usda'
import { formatNutrientValue } from './formatters'
import { normalizeNutrients } from './nutrients'

export type NutrientColumn = {
  key: string
  label: string
  shortLabel: string
  type: 'default' | 'custom'
  nutrientName?: string
  unitName?: string
}

export type NutrientOption = {
  key: string
  label: string
  nutrientName: string
  shortLabel: string
  unitName?: string
}

export const DEFAULT_TABLE_NUTRIENT_DEFINITIONS: Array<{
  key: string
  label: string
  shortLabel: string
  matches: string[]
}> = [
  {
    key: 'Carbohydrate, by summation (G)',
    label: 'Carbohydrate, by summation (G)',
    shortLabel: 'Carb Sum',
    matches: ['carbohydrate, by summation'],
  },
  {
    key: 'Cholesterol (MG)',
    label: 'Cholesterol (MG)',
    shortLabel: 'Chol',
    matches: ['cholesterol'],
  },
  {
    key: 'Energy (KCAL)',
    label: 'Energy (KCAL)',
    shortLabel: 'Energy',
    matches: ['energy'],
  },
  {
    key: 'Fatty acids, total monounsaturated (G)',
    label: 'Fatty acids, total monounsaturated (G)',
    shortLabel: 'Mono Fat',
    matches: ['fatty acids, total monounsaturated'],
  },
  {
    key: 'Fatty acids, total polyunsaturated (G)',
    label: 'Fatty acids, total polyunsaturated (G)',
    shortLabel: 'Poly Fat',
    matches: ['fatty acids, total polyunsaturated'],
  },
  {
    key: 'Fatty acids, total saturated (G)',
    label: 'Fatty acids, total saturated (G)',
    shortLabel: 'Sat Fat',
    matches: ['fatty acids, total saturated'],
  },
  {
    key: 'High Molecular Weight Dietary Fiber (HMWDF) (G)',
    label: 'High Molecular Weight Dietary Fiber (HMWDF) (G)',
    shortLabel: 'HMWDF',
    matches: ['high molecular weight dietary fiber', 'hmwdf'],
  },
  {
    key: 'Low Molecular Weight Dietary Fiber (G)',
    label: 'Low Molecular Weight Dietary Fiber (G)',
    shortLabel: 'LMWDF',
    matches: ['low molecular weight dietary fiber', 'lmwdf'],
  },
  {
    key: 'Protein (G)',
    label: 'Protein (G)',
    shortLabel: 'Protein',
    matches: ['protein'],
  },
]

function escapeCsv(value: string) {
  return `"${value.replaceAll('"', '""')}"`
}

function toOptionLabel(name: string, unitName?: string) {
  return unitName ? `${name} (${unitName})` : name
}

function toOptionKey(name: string, unitName?: string) {
  return `${name}__${unitName ?? ''}`
}

function toShortLabel(name: string) {
  return name
    .split(/[,(]/)[0]
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .join(' ')
}

export function getAvailableNutrientOptions(foods: FoodListItem[]): NutrientOption[] {
  const seen = new Map<string, NutrientOption>()

  for (const food of foods) {
    for (const nutrient of normalizeNutrients(food.foodNutrients)) {
      const key = toOptionKey(nutrient.name, nutrient.unitName)

      if (seen.has(key)) {
        continue
      }

      seen.set(key, {
        key,
        label: toOptionLabel(nutrient.name, nutrient.unitName),
        nutrientName: nutrient.name,
        shortLabel: toShortLabel(nutrient.name),
        unitName: nutrient.unitName,
      })
    }
  }

  const defaultNames = new Set(
    DEFAULT_TABLE_NUTRIENT_DEFINITIONS.flatMap((definition) => definition.matches),
  )

  return [...seen.values()]
    .filter((option) => {
      const normalized = option.nutrientName.toLowerCase()
      return ![...defaultNames].some((match) => normalized.includes(match))
    })
    .sort((left, right) => left.label.localeCompare(right.label))
}

export function getSelectedNutrientColumns(
  foods: FoodListItem[],
  selectedCustomKeys: string[],
): NutrientColumn[] {
  const defaultColumns: NutrientColumn[] = DEFAULT_TABLE_NUTRIENT_DEFINITIONS.map((definition) => ({
    key: definition.key,
    label: definition.label,
    shortLabel: definition.shortLabel,
    type: 'default',
  }))

  const options = getAvailableNutrientOptions(foods)
  const selectedCustomColumns: NutrientColumn[] = []

  for (const key of selectedCustomKeys) {
    const option = options.find((item) => item.key === key)
    if (!option) {
      continue
    }

    selectedCustomColumns.push({
      key: option.key,
      label: option.label,
      shortLabel: option.shortLabel,
      type: 'custom',
      nutrientName: option.nutrientName,
      unitName: option.unitName,
    })
  }

  return [...defaultColumns, ...selectedCustomColumns]
}

export function getNutrientDisplayValue(food: FoodListItem, column: NutrientColumn) {
  const nutrient = getNutrientForColumn(food, column)
  return nutrient ? formatNutrientValue(nutrient.amount, nutrient.unitName) : ''
}

export function getNutrientForColumn(food: FoodListItem, column: NutrientColumn) {
  const nutrients = normalizeNutrients(food.foodNutrients)

  if (column.type === 'default') {
    const definition = DEFAULT_TABLE_NUTRIENT_DEFINITIONS.find((item) => item.key === column.key)
    if (!definition) {
      return undefined
    }

    return nutrients.find((candidate) =>
      definition.matches.some((match) => candidate.name.toLowerCase().includes(match)),
    )
  }

  return nutrients.find(
    (candidate) =>
      candidate.name === column.nutrientName && (candidate.unitName ?? '') === (column.unitName ?? ''),
  )
}

export function exportFoodsToCsv(foods: FoodListItem[], nutrientColumns: NutrientColumn[]) {
  const delimiter = ';'
  const headers = ['Food', ...nutrientColumns.map((column) => column.label)]

  const rows = foods.map((food) => {
    return [food.description, ...nutrientColumns.map((column) => getNutrientDisplayValue(food, column))]
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
