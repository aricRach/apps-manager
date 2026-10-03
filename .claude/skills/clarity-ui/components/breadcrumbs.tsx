import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-fg-muted" />
            )}
            {isLast || !item.href ? (
              <span className={cn(
                "truncate",
                isLast ? "font-medium text-fg-primary" : "text-fg-muted"
              )}>
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="truncate text-fg-muted transition-colors duration-75 hover:text-fg-primary"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
