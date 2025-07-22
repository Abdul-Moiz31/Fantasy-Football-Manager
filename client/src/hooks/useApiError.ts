"use client"

import { toast } from "@/hooks/use-toast"

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
  message?: string
}

export function useApiError() {
  const handleError = (
    error: ApiError | any, 
    fallbackMessage = "An error occurred",
    title = "Error"
  ) => {
    const errorMessage = error?.response?.data?.message || error?.message || fallbackMessage
    
    console.error(`${title}:`, error)
    
    toast({
      title,
      description: errorMessage,
      variant: "destructive"
    })
    
    return errorMessage
  }

  const handleSuccess = (
    title: string,
    description: string,
    duration = 3000
  ) => {
    toast({
      title,
      description,
      variant: "success",
      duration
    })
  }

  return {
    handleError,
    handleSuccess
  }
} 