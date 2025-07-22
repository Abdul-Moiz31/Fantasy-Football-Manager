import React from "react";
import { FootballLoader } from "./FootballLoader";
import { cn } from "@/utils";
import { COLORS } from "@/constants";

interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: 24, md: 32, lg: 48 };

export function LoadingState({ 
  message = "Loading...", 
  className,
  size = "md" 
}: LoadingStateProps) {
  return (
    <div className={cn("flex items-center justify-center min-h-[400px]", className)}>
      <div className="text-center">
        <FootballLoader size={sizeMap[size]} />
        <div className="mt-4 text-[#424242]">{message}</div>
      </div>
    </div>
  );
} 