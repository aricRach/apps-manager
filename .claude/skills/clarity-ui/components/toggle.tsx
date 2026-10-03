"use client";

import * as Switch from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

/* ------------------------------------------------------------------ */
/*  Toggle / Switch                                                    */
/* ------------------------------------------------------------------ */

export interface ToggleProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
  /** Optional label displayed next to the toggle */
  label?: string;
  /** Optional description below the label */
  description?: string;
}

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    { checked, defaultChecked, onCheckedChange, disabled, name, id, className, label, description },
    ref
  ) => {
    const toggle = (
      <Switch.Root
        ref={ref}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        name={name}
        id={id}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-75",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-[state=checked]:bg-accent data-[state=unchecked]:bg-border-strong",
          className
        )}
      >
        <Switch.Thumb
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-75",
            "data-[state=checked]:translate-x-[18px] data-[state=unchecked]:translate-x-[2px]"
          )}
        />
      </Switch.Root>
    );

    if (!label) return toggle;

    return (
      <div className="flex items-start gap-3">
        {toggle}
        <div className="flex flex-col">
          <label
            htmlFor={id}
            className="text-sm font-medium text-fg-primary cursor-pointer"
          >
            {label}
          </label>
          {description && (
            <span className="text-sm text-fg-muted">{description}</span>
          )}
        </div>
      </div>
    );
  }
);
Toggle.displayName = "Toggle";

export { Toggle };
