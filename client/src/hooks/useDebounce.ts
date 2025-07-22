import { useState, useEffect } from 'react'

/**
 * Custom hook that debounces a value, delaying updates until the user stops changing the value
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (default: 500ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

      useEffect(() => {
      const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Clean up the timeout if the value changes before the delay
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Type-safe debounced search hook for form inputs
 * @param initialValue - Initial search value
 * @param delay - Debounce delay in milliseconds (default: 500ms)
 * @returns Object with current value, setter, and debounced value
 */
export function useDebouncedSearch(initialValue: string = "", delay: number = 500) {
  const [value, setValue] = useState(initialValue)
  const debouncedValue = useDebounce(value, delay)

  return {
    value,
    setValue,
    debouncedValue
  }
} 