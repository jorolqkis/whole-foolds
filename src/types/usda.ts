export type ApiNutrient = {
  nutrient?: {
    id?: number
    number?: string
    name?: string
    rank?: number
    unitName?: string
  }
  nutrientId?: number
  nutrientNumber?: string
  nutrientName?: string
  number?: string
  name?: string
  rank?: number
  unitName?: string
  amount?: number
  value?: number
}

export type AppNutrient = {
  id?: number
  number?: string
  name: string
  rank?: number
  unitName?: string
  amount: number
}

export type FoodSearchResult = {
  fdcId: number
  description: string
  dataType?: string
  foodCategory?: string
  publicationDate?: string
  scientificName?: string
  commonNames?: string
  additionalDescriptions?: string
  foodNutrients?: ApiNutrient[]
}

export type FoodSearchApiResponse = {
  totalHits?: number
  currentPage?: number
  totalPages?: number
  foods?: FoodSearchResult[]
}

export type FoodListResponseItem = {
  fdcId: number
  description: string
  dataType?: string
  foodCategory?: string
  publicationDate?: string
  scientificName?: string
  commonNames?: string
  additionalDescriptions?: string
  foodNutrients?: ApiNutrient[]
}

export type FoodListItem = {
  fdcId: number
  description: string
  dataType?: string
  foodCategory?: string
  publicationDate?: string
  scientificName?: string
  commonNames?: string
  additionalDescriptions?: string
  foodNutrients: ApiNutrient[]
}

export type InputFood = {
  value?: number
  unit?: string
  foodDescription?: string
  ingredientDescription?: string
  inputFood?: {
    foodDescription?: string
    samplingDescription?: string
    acquisitionDetails?: string
    foundationFoodsAcquisitionSampleNumber?: number
  }
}

export type FoodAttribute = {
  value?: string
  name?: string
}

export type FoodPortion = {
  gramWeight?: number
  modifier?: string
  amount?: number
  measureUnit?: {
    name?: string
  }
}

export type FoodDetail = {
  fdcId: number
  description: string
  dataType?: string
  foodClass?: string
  foodCategory?: string
  publicationDate?: string
  scientificName?: string
  commonNames?: string
  additionalDescriptions?: string
  foodNutrients?: ApiNutrient[]
  foodAttributes?: FoodAttribute[]
  foodPortions?: FoodPortion[]
  inputFoods?: InputFood[]
  ndbNumber?: number
  foodUpdateLog?: Array<{
    publishedDate?: string
  }>
  availableDate?: string
  subSamples?: Array<{
    sampleDescription?: string
  }>
  wweiaFoodCategory?: {
    wweiaFoodCategoryDescription?: string
  }
}
