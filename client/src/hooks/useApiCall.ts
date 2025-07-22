"use client"

import { useState } from "react"
import { useApiError } from "./useApiError"

interface ApiCallOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: any) => void
  successMessage?: {
    title: string
    description: string
  }
  errorMessage?: string
}

export function useApiCall<T = any>() {
  const [loading, setLoading] = useState(false)
  const { handleError, handleSuccess } = useApiError()

  const execute = async <R = T>(
    apiCall: () => Promise<R>,
    options?: ApiCallOptions<R>
  ): Promise<{ success: boolean; data?: R; error?: string }> => {
    setLoading(true)
    
    try {
      const result = await apiCall()
      
      if (options?.successMessage) {
        handleSuccess(
          options.successMessage.title,
          options.successMessage.description
        )
      }
      
      options?.onSuccess?.(result)
      
      return { success: true, data: result }
    } catch (error: any) {
      const errorMessage = handleError(
        error,
        options?.errorMessage
      )
      
      options?.onError?.(error)
      
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    execute
  }
} 