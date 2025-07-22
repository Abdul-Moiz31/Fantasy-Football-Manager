import React from "react";
import { Button } from "./Button";
import { cn } from "@/utils";
import { COLORS } from "@/constants";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className,
  showCloseButton = true 
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className={cn(
        "bg-white border border-[#E0E0E0] rounded-xl shadow-xl p-4 sm:p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto",
        className
      )}>
        {showCloseButton && (
          <Button
            className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-lg p-1.5 sm:p-2"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
        
        <div className="pr-8">
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[#424242]">
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>
  );
} 