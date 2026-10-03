"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDef {
  key: string;
  label: string;
  options: FilterOption[];
}

interface ActiveFilter {
  key: string;
  value: string;
  label: string;
}

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterDef[];
  activeFilters?: ActiveFilter[];
  onFilterChange?: (key: string, value: string) => void;
  onRemoveFilter?: (key: string) => void;
  onClearAll?: () => void;
  resultCount?: number;
  totalCount?: number;
}

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  activeFilters = [],
  onFilterChange,
  onRemoveFilter,
  onClearAll,
  resultCount,
  totalCount,
}: FilterBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative w-full max-w-sm sm:flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-10 w-full rounded-md border border-border bg-bg-primary pl-9 pr-3 text-sm text-fg-primary placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Filter dropdowns — hidden on mobile, visible on sm+ */}
        {filters.map((filter) => (
          <Select
            key={filter.key}
            onValueChange={(value) => onFilterChange?.(filter.key, value)}
          >
            <SelectTrigger className="hidden w-[140px] sm:flex">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        {/* Clear all */}
        {activeFilters.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            Clear All
          </Button>
        )}
      </div>

      {/* Active filter chips + result count */}
      {(activeFilters.length > 0 || resultCount !== undefined) && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map((filter) => (
            <span
              key={filter.key}
              className="inline-flex items-center gap-1 rounded-full bg-accent-subtle px-2.5 py-1 text-xs font-medium text-accent"
            >
              {filter.label}
              <button
                onClick={() => onRemoveFilter?.(filter.key)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-accent/10"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {resultCount !== undefined && totalCount !== undefined && (
            <span className="ml-auto text-xs text-fg-muted">
              {resultCount} of {totalCount}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
