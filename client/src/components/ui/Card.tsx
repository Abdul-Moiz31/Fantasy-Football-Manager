import type React from "react"
import { cn } from "@/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({ className, ...props }: CardTitleProps) {
  return <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn("p-6 pt-0", className)} {...props} />
}

export function StatCard({
  title,
  value,
  subtitle,
  className = "",
}: {
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`bg-white border border-[#E0E0E0] shadow-lg rounded-xl ${className}`}>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-[#424242] mb-1">{title}</h3>
        <div className="text-2xl font-bold text-[#2E7D32]">{value}</div>
        {subtitle && <p className="text-xs text-[#424242]/70 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
