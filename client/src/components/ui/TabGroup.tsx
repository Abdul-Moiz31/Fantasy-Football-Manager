import React from "react";
import { Button } from "./Button";
import { cn } from "@/utils";
import { COLORS } from "@/constants";

interface Tab {
  id: string;
  label: string;
  shortLabel?: string;
  icon?: React.ReactNode;
}

interface TabGroupProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function TabGroup({ tabs, activeTab, onTabChange, className }: TabGroupProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-2", className)}>
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "outline"}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded-xl font-semibold shadow-sm border transition-colors text-sm sm:text-base",
            activeTab === tab.id
              ? `bg-[${COLORS.secondary}] hover:bg-[${COLORS.secondaryHover}] text-white border-[${COLORS.secondary}]`
              : `bg-white text-[${COLORS.text}] border-[${COLORS.border}] hover:bg-[#E8F5E9]`
          )}
        >
          {tab.icon}
          <span className="hidden sm:inline">{tab.label}</span>
          <span className="sm:hidden">{tab.shortLabel || tab.label}</span>
        </Button>
      ))}
    </div>
  );
} 