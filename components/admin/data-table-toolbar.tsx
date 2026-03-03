"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface DataTableToolbarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  startDate?: string
  endDate?: string
  onDateChange?: (start: string, end: string) => void
  actions?: React.ReactNode
}

export function DataTableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Cari...",
  startDate = "",
  endDate = "",
  onDateChange,
  actions,
}: DataTableToolbarProps) {
  const [localSearch, setLocalSearch] = React.useState(searchValue)
  const [localStartDate, setLocalStartDate] = React.useState(startDate)
  const [localEndDate, setLocalEndDate] = React.useState(endDate)

  // Debounce search
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchChange(localSearch)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [localSearch, onSearchChange])

  // Sync with external changes
  React.useEffect(() => {
    setLocalSearch(searchValue)
  }, [searchValue])

  React.useEffect(() => {
    setLocalStartDate(startDate)
  }, [startDate])

  React.useEffect(() => {
    setLocalEndDate(endDate)
  }, [endDate])

  const handleDateFilter = () => {
    if (onDateChange) {
      onDateChange(localStartDate, localEndDate)
    }
  }

  const handleClearDates = () => {
    setLocalStartDate("")
    setLocalEndDate("")
    if (onDateChange) {
      onDateChange("", "")
    }
  }

  const hasDateFilter = localStartDate || localEndDate

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Search - Left */}
      <div className="relative w-full md:max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Date Range - Center */}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          type="date"
          value={localStartDate}
          onChange={(e) => setLocalStartDate(e.target.value)}
          className="w-auto"
        />
        <span className="text-muted-foreground">-</span>
        <Input
          type="date"
          value={localEndDate}
          onChange={(e) => setLocalEndDate(e.target.value)}
          className="w-auto"
        />
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handleDateFilter}>
            Filter
          </Button>
          {hasDateFilter && (
            <Button variant="ghost" size="sm" onClick={handleClearDates}>
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Actions - Right */}
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
