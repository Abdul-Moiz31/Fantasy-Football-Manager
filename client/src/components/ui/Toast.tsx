import * as React from "react"
import { CheckCircle, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/utils"

export interface ToastProps {
  id?: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactElement
  variant?: "default" | "destructive" | "success"
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export interface ToastActionElement {
  altText: string
  element: React.ReactElement
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ id, title, description, action, variant = "default", open = true, onOpenChange, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(open)

    React.useEffect(() => {
      setIsVisible(open)
    }, [open])

    if (!isVisible) return null

    const getIcon = () => {
      switch (variant) {
        case "success":
          return <CheckCircle className="h-4 w-4 text-white flex-shrink-0" />
        case "destructive":
          return <AlertTriangle className="h-4 w-4 text-white flex-shrink-0" />
        default:
          return <Info className="h-4 w-4 text-white flex-shrink-0" />
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "pointer-events-auto relative flex items-center space-x-3 w-full max-w-sm px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ease-in-out",
          "animate-in slide-in-from-top-2 fade-in-0 duration-300",
          variant === "default" && "bg-gray-800 text-white",
          variant === "success" && "bg-green-500 text-white",
          variant === "destructive" && "bg-red-500 text-white"
        )}
        {...props}
      >
        {/* Icon */}
        <div>
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1">
          {title && (
            <div className="text-sm font-medium">
              {title}
            </div>
          )}
          {description && (
            <div className="text-sm opacity-90 mt-1">
              {description}
            </div>
          )}
        </div>
      </div>
    )
  }
)

Toast.displayName = "Toast"

export { Toast } 