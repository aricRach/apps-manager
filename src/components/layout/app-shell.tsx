"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AppWindow, Bot, LayoutGrid, X } from "lucide-react";
import { apps } from "@/config/apps";
import { Sidebar } from "@/components/layout/sidebar-nav";
import { TopBar } from "@/components/layout/top-bar";

const appIcon = (
  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent">
    <Bot className="h-5 w-5 text-fg-on-accent" />
  </div>
);

const HiddenAppIdsContext = createContext<ReadonlySet<string>>(new Set());

/** Ids of the apps hidden from the menu in this page load */
export function useHiddenAppIds() {
  return useContext(HiddenAppIdsContext);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  /* In memory only, so hidden apps come back on a page refresh */
  const [hiddenIds, setHiddenIds] = useState<ReadonlySet<string>>(new Set());

  const navGroups = [
    { items: [{ label: "All apps", href: "/apps", icon: LayoutGrid, exact: true }] },
    {
      label: "Apps",
      items: apps
        .filter((app) => !hiddenIds.has(app.id))
        .map((app) => ({
          label: app.name,
          href: `/apps/${app.id}`,
          icon: AppWindow,
          onHide: () => setHiddenIds((prev) => new Set(prev).add(app.id)),
        })),
    },
  ];

  /* Close drawer on route change or Escape */
  useEffect(() => setMobileOpen(false), [pathname]);
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const current = apps.find((app) => pathname === `/apps/${app.id}`);
  const breadcrumbs = current
    ? [{ label: "Apps", href: "/apps" }, { label: current.name }]
    : [{ label: "Apps" }];

  return (
    <div className="flex h-dvh overflow-hidden bg-bg-primary">
      {/* Desktop sidebar — full width */}
      <div className="hidden lg:block">
        <Sidebar appName="Apps Manager" appIcon={appIcon} navGroups={navGroups} />
      </div>

      {/* Tablet sidebar — collapsed */}
      <div className="hidden md:block lg:hidden">
        <Sidebar appName="Apps Manager" appIcon={appIcon} navGroups={navGroups} collapsed />
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64">
            <Sidebar appName="Apps Manager" appIcon={appIcon} navGroups={navGroups} />
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
              className="absolute right-2 top-3 rounded-md p-2 text-fg-muted transition-colors duration-75 hover:text-fg-primary"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar breadcrumbs={breadcrumbs} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <HiddenAppIdsContext.Provider value={hiddenIds}>{children}</HiddenAppIdsContext.Provider>
        </main>
      </div>
    </div>
  );
}
