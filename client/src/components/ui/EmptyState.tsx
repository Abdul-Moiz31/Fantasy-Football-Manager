import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils";
import { COLORS } from "@/constants";

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  className?: string;
}

export function EmptyState({ 
  title, 
  description, 
  actionText, 
  actionLink, 
  className 
}: EmptyStateProps) {
  return (
    <div className={cn("col-span-full text-[#424242] text-center py-8", className)}>
      <div className="text-lg font-medium mb-2">{title}</div>
      <p className="text-sm text-[#424242]/70 mb-4">{description}</p>
      {actionText && actionLink && (
        <Link 
          to={actionLink} 
          className="inline-block px-4 py-2 bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] transition-colors"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
} 