import { useToast } from "@/hooks/use-toast"
import { Toast } from "./Toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] flex flex-col items-center space-y-2 pointer-events-none">
      {toasts.map(({ id, ...props }) => (
        <Toast key={id} {...props} />
      ))}
    </div>
  )
} 