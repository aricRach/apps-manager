import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* Single-column form section */
interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function FormSection({ title, description, children, actions }: FormSectionProps) {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-fg-primary">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-fg-muted">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
      {actions && (
        <div className="flex justify-end gap-2 border-t border-border pt-4">
          {actions}
        </div>
      )}
    </div>
  );
}

/* Two-column form row (label left, input right) */
interface FormRowProps {
  label: string;
  description?: string;
  htmlFor?: string;
  children: React.ReactNode;
}

export function FormRow({ label, description, htmlFor, children }: FormRowProps) {
  return (
    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3 sm:gap-4">
      <div className="sm:pt-1.5">
        <label htmlFor={htmlFor} className="text-sm font-medium text-fg-primary">
          {label}
        </label>
        {description && (
          <p className="mt-0.5 text-xs text-fg-muted">{description}</p>
        )}
      </div>
      <div className="sm:col-span-2">{children}</div>
    </div>
  );
}

/* Danger zone section */
interface DangerZoneProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

export function DangerZone({ title, description, actionLabel, onAction }: DangerZoneProps) {
  return (
    <div className="rounded-md border border-status-error/30 bg-status-error-bg p-4">
      <h3 className="text-sm font-semibold text-status-error">{title}</h3>
      <p className="mt-1 text-sm text-fg-secondary">{description}</p>
      <Button
        variant="destructive"
        size="sm"
        className="mt-3"
        onClick={onAction}
      >
        {actionLabel}
      </Button>
    </div>
  );
}
