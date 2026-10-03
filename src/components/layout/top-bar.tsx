"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOut, Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  breadcrumbs?: { label: string; href?: string }[];
  onMenuClick?: () => void;
}

export function TopBar({ breadcrumbs = [], onMenuClick }: TopBarProps) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  async function signOut() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 items-center border-b border-border bg-bg-primary px-4">
      {/* Mobile menu toggle */}
      {onMenuClick && (
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 md:hidden"
          aria-label="Open navigation"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Breadcrumbs — current page only on mobile */}
      <div className="min-w-0 flex-1">
        <nav className="flex items-center gap-1 text-sm">
          {breadcrumbs.map((crumb, i) => {
            const isLast = i === breadcrumbs.length - 1;
            return (
              <span key={i} className={isLast ? "flex min-w-0 items-center gap-1" : "hidden items-center gap-1 sm:flex"}>
                {i > 0 && <span className="hidden text-fg-muted sm:inline">/</span>}
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="text-fg-muted transition-colors duration-75 hover:text-fg-primary"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="truncate font-medium text-fg-primary">{crumb.label}</span>
                )}
              </span>
            );
          })}
        </nav>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggleTheme}>
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon" aria-label="Sign out" title="Sign out" onClick={signOut}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
