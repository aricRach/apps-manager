import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/* ------------------------------------------------------------------ */
/*  Avatar                                                             */
/* ------------------------------------------------------------------ */

const avatarVariants = cva("relative inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden", {
  variants: {
    size: {
      sm: "h-6 w-6 text-xs",
      default: "h-8 w-8 text-sm",
      lg: "h-10 w-10 text-base",
      xl: "h-12 w-12 text-lg",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  /** Image URL */
  src?: string | null;
  /** Full name (used for alt text and initials fallback) */
  name?: string;
  className?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function Avatar({ src, name, size, className }: AvatarProps) {
  if (src) {
    return (
      <span className={cn(avatarVariants({ size }), className)}>
        <img
          src={src}
          alt={name ?? ""}
          className="h-full w-full object-cover"
        />
      </span>
    );
  }

  // Fallback: initials
  return (
    <span
      className={cn(
        avatarVariants({ size }),
        "bg-accent-subtle text-accent font-medium",
        className
      )}
    >
      {name ? getInitials(name) : "?"}
    </span>
  );
}

/* Avatar Group — overlapping avatars */
export interface AvatarGroupProps {
  children: React.ReactNode;
  /** Max avatars to show before "+N" indicator */
  max?: number;
  className?: string;
}

export function AvatarGroup({
  children,
  max,
  className,
}: AvatarGroupProps) {
  const items = Array.isArray(children) ? children : [children];
  const visible = max ? items.slice(0, max) : items;
  const remaining = max ? items.length - max : 0;

  return (
    <div className={cn("flex -space-x-2", className)}>
      {visible.map((child, i) => (
        <div key={i} className="ring-2 ring-bg-primary rounded-full">
          {child}
        </div>
      ))}
      {remaining > 0 && (
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-bg-tertiary text-xs font-medium text-fg-secondary ring-2 ring-bg-primary">
          +{remaining}
        </span>
      )}
    </div>
  );
}
