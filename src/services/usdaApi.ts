import { FOUNDATION_DATA_TYPE, FOUNDATION_ONLY_ERROR } from '../lib/constants'
import type {
  FoodDetail,
  FoodListItem,
  FoodListResponseItem,
  FoodSearchApiResponse,
} from '../types/usda'
import { toFoodListItem } from '../utils/foundation'

const API_BASE_URL = 'https://api.nal.usda.gov/fdc/v1'

type RequestOptions = {
  apiKey: string
  path: string
  method?: 'GET' | 'POST'
  params?: Record<string, string | number | undefined>
  body?: unknown
  signal?: AbortSignal
}

type PagedFoodsResponse = {
  foods: FoodListItem[]
  totalCount: number | null
  hasNextPage: boolean
}

async function request<T>({
  apiKey,
  path,
  method = 'GET',
  params,
  body,
  signal,
}: RequestOptions): Promise<T> {
  const url = new URL(`${API_BASE_URL}${path}`)
  url.searchParams.set('api_key', apiKey)

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  })

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  })

  if (!response.ok) {
    let details = `${response.status} ${response.statusText}`

    try {
      const payload = (await response.json()) as { error?: { message?: string } }
      if (payload.error?.message) {
        details = payload.error.message
      }
    } catch {
      // Keep the HTTP fallback message.
    }

    throw new Error(`USDA FoodData Central request failed: ${details}.`)
  }

  return (await response.json()) as T
}

export async function browseFoundationFoods(options: {
  apiKey: string
  page: number
  pageSize: number
  signal?: AbortSignal
}): Promise<PagedFoodsResponse> {
  const foods = await request<FoodListResponseItem[]>({
    apiKey: options.apiKey,
    path: '/foods/list',
    method: 'POST',
    signal: options.signal,
    body: {
      dataType: [FOUNDATION_DATA_TYPE],
      pageNumber: options.page,
      pageSize: options.pageSize,
      sortBy: 'dataType.keyword',
      sortOrder: 'asc',
    },
  })

  const mappedFoods = foods.map(toFoodListItem).filter(Boolean) as FoodListItem[]

  return {
    foods: mappedFoods,
    totalCount: null,
    hasNextPage: mappedFoods.length === options.pageSize,
  }
}

export async function searchFoundationFoods(options: {
  apiKey: string
  page: number
  pageSize: number
  query: string
  signal?: AbortSignal
}): Promise<PagedFoodsResponse> {
  const response = await request<FoodSearchApiResponse>({
    apiKey: options.apiKey,
    path: '/foods/search',
    method: 'POST',
    signal: options.signal,
    body: {
      query: options.query,
      dataType: [FOUNDATION_DATA_TYPE],
      pageNumber: options.page,
      pageSize: options.pageSize,
      sortBy: 'dataType.keyword',
      sortOrder: 'asc',
    },
  })

  return {
    foods: (response.foods ?? []).map(toFoodListItem).filter(Boolean) as FoodListItem[],
    totalCount: response.totalHits ?? 0,
    hasNextPage: options.page * options.pageSize < (response.totalHits ?? 0),
  }
}

export async function getFoundationFoodDetails(options: {
  apiKey: string
  fdcId: number
  signal?: AbortSignal
}): Promise<FoodDetail> {
  const food = await request<FoodDetail>({
    apiKey: options.apiKey,
    path: `/food/${options.fdcId}`,
    params: {
      format: 'full',
    },
    signal: options.signal,
  })

  if (food.dataType && food.dataType !== FOUNDATION_DATA_TYPE) {
    throw new Error(FOUNDATION_ONLY_ERROR)
  }

  return food
}
