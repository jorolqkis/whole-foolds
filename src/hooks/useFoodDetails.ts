import { useEffect, useReducer, useState } from 'react'
import { getFoundationFoodDetails } from '../services/usdaApi'
import type { FoodDetail } from '../types/usda'

type UseFoodDetailsOptions = {
  apiKey: string
  fdcId: number | null
}

type FoodDetailsState = {
  food: FoodDetail | null
  isLoading: boolean
  error: string | null
}

type FoodDetailsAction =
  | { type: 'reset' }
  | { type: 'loading'; fdcId: number }
  | { type: 'success'; food: FoodDetail }
  | { type: 'error'; message: string }

function reducer(state: FoodDetailsState, action: FoodDetailsAction): FoodDetailsState {
  switch (action.type) {
    case 'reset':
      return {
        food: null,
        isLoading: false,
        error: null,
      }
    case 'loading':
      return {
        food: state.food?.fdcId === action.fdcId ? state.food : null,
        isLoading: true,
        error: null,
      }
    case 'success':
      return {
        food: action.food,
        isLoading: false,
        error: null,
      }
    case 'error':
      return {
        food: null,
        isLoading: false,
        error: action.message,
      }
  }
}

export function useFoodDetails({ apiKey, fdcId }: UseFoodDetailsOptions) {
  const [refreshToken, setRefreshToken] = useState(0)
  const [state, dispatch] = useReducer(reducer, {
    food: null,
    isLoading: false,
    error: null,
  })

  useEffect(() => {
    if (!fdcId) {
      dispatch({ type: 'reset' })
      return
    }

    const controller = new AbortController()
    dispatch({ type: 'loading', fdcId })

    getFoundationFoodDetails({
      apiKey,
      fdcId,
      signal: controller.signal,
    })
      .then((food) => {
        dispatch({ type: 'success', food })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return
        }

        dispatch({
          type: 'error',
          message:
            error instanceof Error ? error.message : 'Unknown error while loading food details.',
        })
      })

    return () => controller.abort()
  }, [apiKey, fdcId, refreshToken])

  return {
    ...state,
    retry: () => setRefreshToken((current) => current + 1),
  }
}
