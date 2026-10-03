"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}

interface SidebarProps {
  appName: string;
  appIcon?: React.ReactNode;
  navGroups: NavGroup[];
  footerItems?: NavItem[];
  collapsed?: boolean;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function Sidebar({
  appName,
  appIcon,
  navGroups,
  footerItems,
  collapsed = false,
  user,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-border bg-bg-secondary transition-[width] duration-200 ease-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn("flex h-16 items-center gap-2", collapsed ? "justify-center px-2" : "px-4")}>
        {appIcon && <div className="flex-shrink-0">{appIcon}</div>}
        {!collapsed && <span className="text-sm font-semibold text-fg-primary">{appName}</span>}
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 overflow-y-auto py-2", collapsed ? "px-2" : "px-3")}>
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className={cn(groupIdx > 0 && "mt-6")}>
            {group.label && !collapsed && (
              <p className="mb-1 px-2 text-xs font-medium uppercase tracking-wide text-fg-muted">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "flex items-center rounded-md text-sm font-medium transition-colors duration-75",
                        collapsed ? "justify-center p-2" : "gap-2 px-2 py-2",
                        isActive
                          ? "bg-accent-subtle text-accent"
                          : "text-fg-secondary hover:bg-bg-hover hover:text-fg-primary"
                      )}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                      {!collapsed && item.badge && (
                        <span className="flex-shrink-0 rounded-full bg-accent px-1.5 py-0.5 text-xs font-medium text-fg-on-accent">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={cn("border-t border-border py-2", collapsed ? "px-2" : "px-3")}>
        {footerItems?.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center rounded-md text-sm font-medium transition-colors duration-75",
                collapsed ? "justify-center p-2" : "gap-2 px-2 py-2",
                isActive
                  ? "bg-accent-subtle text-accent"
                  : "text-fg-secondary hover:bg-bg-hover hover:text-fg-primary"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
        {user && (
          <div className={cn("mt-2 flex items-center rounded-md", collapsed ? "justify-center p-2" : "gap-2 px-2 py-2")}>
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent text-xs font-medium text-fg-on-accent">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="h-full w-full rounded-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-fg-primary">{user.name}</p>
                <p className="truncate text-xs text-fg-muted">{user.email}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
