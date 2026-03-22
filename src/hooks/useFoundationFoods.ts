import { useEffect, useReducer, useState } from 'react'
import { browseFoundationFoods, searchFoundationFoods } from '../services/usdaApi'
import type { FoodListItem } from '../types/usda'

type UseFoundationFoodsOptions = {
  apiKey: string
  pageSize: number
  query: string
}

type FoundationFoodsState = {
  foods: FoodListItem[]
  totalCount: number | null
  hasNextPage: boolean
  isLoading: boolean
  error: string | null
}

type FoundationFoodsAction =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'success'; foods: FoodListItem[]; totalCount: number | null }
  | { type: 'error'; message: string }

function reducer(state: FoundationFoodsState, action: FoundationFoodsAction): FoundationFoodsState {
  switch (action.type) {
    case 'idle':
      return {
        foods: [],
        totalCount: null,
        hasNextPage: false,
        isLoading: false,
        error: null,
      }
    case 'loading':
      return {
        ...state,
        foods: [],
        isLoading: true,
        error: null,
      }
    case 'success':
      return {
        foods: action.foods,
        totalCount: action.totalCount,
        hasNextPage: false,
        isLoading: false,
        error: null,
      }
    case 'error':
      return {
        foods: [],
        totalCount: null,
        hasNextPage: false,
        isLoading: false,
        error: action.message,
      }
  }
}

export function useFoundationFoods({
  apiKey,
  pageSize,
  query,
}: UseFoundationFoodsOptions) {
  const [refreshToken, setRefreshToken] = useState(0)
  const [state, dispatch] = useReducer(reducer, {
    foods: [],
    totalCount: null,
    hasNextPage: false,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    if (!apiKey) {
      dispatch({ type: 'idle' })
      return
    }

    const controller = new AbortController()

    async function loadAllFoods() {
      dispatch({ type: 'loading' })

      try {
        let currentPage = 1
        let foods: FoodListItem[] = []
        let hasNextPage = true
        let totalCount: number | null = null

        while (hasNextPage && !controller.signal.aborted) {
          const response = query
            ? await searchFoundationFoods({
                apiKey,
                page: currentPage,
                pageSize,
                query,
                signal: controller.signal,
              })
            : await browseFoundationFoods({
                apiKey,
                page: currentPage,
                pageSize,
                signal: controller.signal,
              })

          foods = [...foods, ...response.foods]
          totalCount = response.totalCount
          hasNextPage = response.hasNextPage
          currentPage += 1
        }

        if (!controller.signal.aborted) {
          dispatch({
            type: 'success',
            foods,
            totalCount,
          })
        }
      } catch (error: unknown) {
        if (controller.signal.aborted) {
          return
        }

        dispatch({
          type: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'Unknown error while loading Foundation Foods.',
        })
      }
    }

    void loadAllFoods()

    return () => controller.abort()
  }, [apiKey, pageSize, query, refreshToken])

  return {
    ...state,
    retry: () => setRefreshToken((current) => current + 1),
  }
}
