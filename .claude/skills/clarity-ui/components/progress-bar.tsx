import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Progress Bar                                                       */
/* ------------------------------------------------------------------ */

export interface ProgressBarProps {
  /** Current value (0–100) */
  value: number;
  /** Maximum value (default 100) */
  max?: number;
  /** Label shown above the bar (left side) */
  label?: string;
  /** Show percentage text on the right */
  showPercentage?: boolean;
  /** Warning threshold (default 80). Fill turns yellow above this. */
  warningAt?: number;
  /** Critical threshold (default 95). Fill turns red above this. */
  criticalAt?: number;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  warningAt = 80,
  criticalAt = 95,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const fillColor =
    percentage >= criticalAt
      ? "bg-status-error"
      : percentage >= warningAt
        ? "bg-status-warning"
        : "bg-accent";

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercentage) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && (
            <span className="text-sm font-medium text-fg-primary">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm text-fg-muted">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-bg-tertiary">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-200",
            fillColor
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
