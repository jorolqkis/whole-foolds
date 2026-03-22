import type {
  FoodDetail,
  FoodListItem,
  FoodListResponseItem,
  FoodSearchResult,
} from '../types/usda'
import { formatDate, formatFallback } from './formatters'

type MetadataSection = {
  title: string
  items: Array<{
    label: string
    value: string
  }>
}

type MetadataEntry = [label: string, value: string]

function isMetadataEntry(value: MetadataEntry | null): value is MetadataEntry {
  return Array.isArray(value)
}

function toMetadataEntry(label: string, value?: string): MetadataEntry | null {
  return value ? [label, value] : null
}

export function toFoodListItem(food: FoodListResponseItem | FoodSearchResult): FoodListItem | null {
  if (!food.fdcId || !food.description) {
    return null
  }

  return {
    fdcId: food.fdcId,
    description: food.description,
    dataType: food.dataType,
    foodCategory: food.foodCategory,
    publicationDate: food.publicationDate,
    scientificName: food.scientificName,
    commonNames: food.commonNames,
    additionalDescriptions: food.additionalDescriptions,
    foodNutrients: food.foodNutrients ?? [],
  }
}

export function extractFoundationMetadata(food: FoodDetail): MetadataSection[] {
  const attributeMap = new Map(
    (food.foodAttributes ?? [])
      .filter((attribute) => attribute.name && attribute.value)
      .map((attribute) => [attribute.name?.toLowerCase() ?? '', attribute.value ?? '']),
  )

  const inputFoods = food.inputFoods ?? []
  const sampleCount =
    inputFoods
      .map((item) => item.inputFood?.foundationFoodsAcquisitionSampleNumber)
      .find((value) => typeof value === 'number') ?? inputFoods.length

  const acquisitionDetails = inputFoods
    .map((item) => item.inputFood?.acquisitionDetails || item.inputFood?.samplingDescription)
    .filter(Boolean)
    .slice(0, 3)
    .join('; ')

  const sections: MetadataSection[] = []

  const productionItems = (
    [
      toMetadataEntry('Cultivar / variety', attributeMap.get('cultivar') || attributeMap.get('variety')),
      toMetadataEntry(
        'Production method',
        attributeMap.get('production method') || attributeMap.get('production practices'),
      ),
      toMetadataEntry('Post-harvest notes', attributeMap.get('post harvest treatment')),
    ] satisfies Array<MetadataEntry | null>
  )
    .filter(isMetadataEntry)
    .map(([label, value]) => ({
      label,
      value,
    }))

  if (productionItems.length > 0) {
    sections.push({
      title: 'Agriculture and production',
      items: productionItems,
    })
  }

  const samplingItems = (
    [
      sampleCount ? ['Sample count', String(sampleCount)] : null,
      acquisitionDetails ? ['Acquisition details', acquisitionDetails] : null,
      food.availableDate ? ['Available in FoodData Central', formatDate(food.availableDate)] : null,
      food.foodUpdateLog?.[0]?.publishedDate
        ? ['Last update noted', formatDate(food.foodUpdateLog[0].publishedDate)]
        : null,
    ] satisfies Array<MetadataEntry | null>
  )
    .filter(isMetadataEntry)
    .map(([label, value]) => ({
      label,
      value,
    }))

  if (samplingItems.length > 0) {
    sections.push({
      title: 'Sampling and publication',
      items: samplingItems,
    })
  }

  const methodItems = (
    [
      toMetadataEntry('Analytical methods', attributeMap.get('analytical method')),
      toMetadataEntry(
        'Ingredient source notes',
        inputFoods[0]?.ingredientDescription || inputFoods[0]?.foodDescription,
      ),
      toMetadataEntry('Legacy NDB number', food.ndbNumber ? String(food.ndbNumber) : undefined),
    ] satisfies Array<MetadataEntry | null>
  )
    .filter(isMetadataEntry)
    .map(([label, value]) => ({
      label,
      value: formatFallback(value),
    }))

  if (methodItems.length > 0) {
    sections.push({
      title: 'Methods and source notes',
      items: methodItems,
    })
  }

  return sections
}
