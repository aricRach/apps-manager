"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
  icon?: LucideIcon;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onValueChange,
  disabled = false,
  className,
  ...props
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={props["aria-label"]}
      className={cn(
        "inline-flex w-full rounded-md border border-border bg-bg-secondary p-0.5",
        disabled && "pointer-events-none cursor-not-allowed opacity-50",
        className
      )}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            disabled={disabled}
            onClick={() => onValueChange(option.value)}
            className={cn(
              "flex h-9 flex-1 items-center justify-center gap-2 rounded-sm px-3 text-sm font-medium transition-colors duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive
                ? "border border-border bg-bg-primary text-fg-primary"
                : "border border-transparent text-fg-muted hover:text-fg-secondary"
            )}
          >
            {option.icon && <option.icon className="h-5 w-5" />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
