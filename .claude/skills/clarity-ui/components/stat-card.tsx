import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change?: {
    value: string;
    trend: "up" | "down" | "flat";
    label?: string;
  };
  icon?: LucideIcon;
}

export function StatCard({ label, value, change, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-md border border-border bg-bg-primary p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-fg-secondary">{label}</p>
        {Icon && <Icon className="h-5 w-5 text-fg-muted" />}
      </div>
      <p className="mt-2 text-xl font-semibold tracking-tight text-fg-primary font-mono sm:text-2xl">
        {value}
      </p>
      {change && (
        <div className="mt-2 flex items-center gap-1.5">
          {change.trend === "up" && (
            <TrendingUp className="h-3.5 w-3.5 text-status-success" />
          )}
          {change.trend === "down" && (
            <TrendingDown className="h-3.5 w-3.5 text-status-error" />
          )}
          {change.trend === "flat" && (
            <Minus className="h-3.5 w-3.5 text-fg-muted" />
          )}
          <span
            className={cn(
              "text-sm font-medium sm:text-xs",
              change.trend === "up" && "text-status-success",
              change.trend === "down" && "text-status-error",
              change.trend === "flat" && "text-fg-muted"
            )}
          >
            {change.value}
          </span>
          {change.label && (
            <span className="text-sm text-fg-muted sm:text-xs">{change.label}</span>
          )}
        </div>
      )}
    </div>
  );
}
