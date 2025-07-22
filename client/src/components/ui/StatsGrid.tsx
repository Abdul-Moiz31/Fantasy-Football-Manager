import React from "react"
import { StatCard } from "./Card"

interface Stat {
  title: string
  value: string | number
  description?: string
  color?: string
}

interface StatsGridProps {
  stats: Stat[]
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function StatsGrid({ 
  stats, 
  columns = 3, 
  className = "" 
}: StatsGridProps) {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2", 
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
  }

  return (
    <div className={`grid ${gridClasses[columns]} gap-3 sm:gap-4 lg:gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          description={stat.description}
        />
      ))}
    </div>
  )
} 