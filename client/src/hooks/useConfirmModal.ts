"use client"

import { useState } from "react"
import { useApiCall } from "./useApiCall"

interface ConfirmModalOptions<T> {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: (item: T) => Promise<any>
  successMessage?: {
    title: string
    description: (item: T) => string
  }
  errorMessage?: string
}

export function useConfirmModal<T>() {
  const [isOpen, setIsOpen] = useState(false)
  const [item, setItem] = useState<T | null>(null)
  const { loading, execute } = useApiCall()

  const openModal = (itemToConfirm: T) => {
    setItem(itemToConfirm)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setItem(null)
  }

  const createConfirmAction = (options: ConfirmModalOptions<T>) => {
    const confirmAction = async () => {
      if (!item) return

      const result = await execute(
        () => options.onConfirm(item),
        {
          successMessage: options.successMessage ? {
            title: options.successMessage.title,
            description: options.successMessage.description(item)
          } : undefined,
          errorMessage: options.errorMessage,
          onSuccess: () => closeModal()
        }
      )

      return result
    }

    return {
      isOpen,
      item,
      loading,
      openModal,
      closeModal,
      confirmAction,
      title: options.title,
      message: options.message,
      confirmText: options.confirmText || "Confirm",
      cancelText: options.cancelText || "Cancel"
    }
  }

  return createConfirmAction
} 