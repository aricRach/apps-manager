"use client";

import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  breadcrumbs?: { label: string; href?: string }[];
  onMenuClick?: () => void;
  onSearchClick?: () => void;
  notificationCount?: number;
  user?: {
    name: string;
    avatar?: string;
  };
}

export function TopBar({
  breadcrumbs = [],
  onMenuClick,
  onSearchClick,
  notificationCount,
  user,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border bg-bg-primary px-4">
      {/* Mobile menu toggle */}
      {onMenuClick && (
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Breadcrumbs */}
      <div className="flex-1 min-w-0">
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <span className="text-fg-muted">/</span>}
                {crumb.href && i < breadcrumbs.length - 1 ? (
                  <a href={crumb.href} className="text-fg-muted hover:text-fg-primary">
                    {crumb.label}
                  </a>
                ) : (
                  <span className={i === breadcrumbs.length - 1 ? "font-medium text-fg-primary" : "text-fg-muted"}>
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {onSearchClick && (
          <Button
            variant="ghost"
            size="sm"
            className="hidden gap-2 text-fg-muted sm:flex"
            onClick={onSearchClick}
          >
            <Search className="h-5 w-5" />
            <span className="text-sm">Search...</span>
            <kbd className="pointer-events-none rounded border border-border bg-bg-secondary px-1.5 py-0.5 text-xs text-fg-muted">
              ⌘K
            </kbd>
          </Button>
        )}

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-fg-secondary" />
          {notificationCount && notificationCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-status-error text-[10px] font-medium text-white">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </Button>

        {user && (
          <Button variant="ghost" size="icon" className="ml-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-medium text-fg-on-accent">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="h-full w-full rounded-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
          </Button>
        )}
      </div>
    </header>
  );
}
