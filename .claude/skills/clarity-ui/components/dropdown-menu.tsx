"use client";

import * as Popover from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

/* ------------------------------------------------------------------ */
/*  Dropdown Menu (built on Radix Popover)                             */
/* ------------------------------------------------------------------ */

/* Root — re-export Popover.Root as DropdownMenu */
export const DropdownMenu = Popover.Root;
export const DropdownMenuTrigger = Popover.Trigger;

/* Content panel */
export interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

export const DropdownMenuContent = forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(({ children, className, align = "end", sideOffset = 4, ...props }, ref) => (
  <Popover.Portal>
    <Popover.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-20 min-w-[8rem] rounded-md border border-border bg-bg-elevated p-1 shadow-md",
        "animate-in fade-in-0 slide-in-from-top-1 duration-150",
        className
      )}
      {...props}
    >
      {children}
    </Popover.Content>
  </Popover.Portal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

/* Menu item */
export interface DropdownMenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  destructive?: boolean;
}

export const DropdownMenuItem = forwardRef<
  HTMLButtonElement,
  DropdownMenuItemProps
>(({ className, destructive = false, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "flex w-full items-center gap-2 rounded-sm px-2 py-2 text-sm transition-colors duration-75 cursor-pointer",
      "hover:bg-bg-hover focus-visible:bg-bg-hover focus-visible:outline-none",
      destructive ? "text-status-error" : "text-fg-primary",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

/* Separator */
export function DropdownMenuSeparator({ className }: { className?: string }) {
  return (
    <div className={cn("my-1 border-t border-border", className)} />
  );
}

/* Group label */
export function DropdownMenuLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "px-2 py-2 text-xs font-medium text-fg-muted",
        className
      )}
    >
      {children}
    </div>
  );
}
