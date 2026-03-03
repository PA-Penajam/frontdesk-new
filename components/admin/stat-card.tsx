import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface StatCardProps {
  /** Stat title (e.g., "Total Tamu") */
  title: string
  /** Stat value to display */
  /** Stat value to display - accepts number, string, or ReactNode */
  value: React.ReactNode
  /** Optional Lucide icon */
  icon?: LucideIcon
  /** Optional description below value */
  description?: string
  /** Additional CSS classes */
  className?: string
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("flex flex-col gap-6", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row items-end justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-3xl font-bold tracking-tight">
            {value}
          </p>
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-2 rounded-lg bg-muted">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
