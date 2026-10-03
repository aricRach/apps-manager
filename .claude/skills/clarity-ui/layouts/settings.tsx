/*
Settings layout: Side nav (w-48) + form content (max-w-2xl).
Uses spacious density. Save per-section.

Reference implementation — adapt the nav items, form sections, and footer to your app.
*/

"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* ---------- Types ---------- */

interface SettingsNavItem {
  label: string;
  href: string;
}

interface SettingsLayoutProps {
  title?: string;
  navItems: SettingsNavItem[];
  children: React.ReactNode;
}

/* ---------- Default nav items (replace with your own) ---------- */

const defaultNavItems: SettingsNavItem[] = [
  { label: "General", href: "/settings" },
  { label: "Notifications", href: "/settings/notifications" },
  { label: "Security", href: "/settings/security" },
  { label: "Billing", href: "/settings/billing" },
  { label: "Danger Zone", href: "/settings/danger-zone" },
];

/* ---------- Layout ---------- */

export function SettingsLayout({
  title = "Settings",
  navItems = defaultNavItems,
  children,
}: SettingsLayoutProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Page header */}
      <div className="flex items-start justify-between px-6 py-6">
        <h1 className="text-3xl font-semibold tracking-tight text-fg-primary">
          {title}
        </h1>
      </div>

      <div className="flex gap-8 px-6 pb-6">
        {/* Settings nav — sticky on desktop */}
        <nav className="hidden md:block w-48 flex-shrink-0">
          <div className="sticky top-20">
            <ul className="space-y-0.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "block rounded-md px-3 py-2 text-sm font-medium transition-colors duration-75",
                        isActive
                          ? "bg-accent-subtle text-accent"
                          : "text-fg-secondary hover:bg-bg-hover hover:text-fg-primary"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Settings content — form sections */}
        <div className="flex-1 max-w-2xl space-y-8">
          {children}

          {/* Save footer — sticky at bottom */}
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <button className="inline-flex h-10 items-center justify-center rounded-sm border border-border bg-bg-primary px-4 text-sm font-medium text-fg-primary hover:bg-bg-hover transition-colors duration-75">
              Cancel
            </button>
            <button className="inline-flex h-10 items-center justify-center rounded-sm bg-accent px-4 text-sm font-medium text-fg-on-accent hover:bg-accent-hover transition-colors duration-75">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Form section helper (use inside SettingsLayout) ---------- */

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SettingsFormSection({ title, description, children }: FormSectionProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-fg-primary">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-fg-secondary">{description}</p>
        )}
      </div>
      <div className="rounded-md border border-border bg-bg-primary p-5 space-y-4">
        {children}
      </div>
    </section>
  );
}

/* ---------- Danger zone helper ---------- */

interface DangerZoneProps {
  title?: string;
  description: string;
  actionLabel: string;
  onAction?: () => void;
}

export function DangerZone({
  title = "Danger Zone",
  description,
  actionLabel,
  onAction,
}: DangerZoneProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-status-error">{title}</h2>
      <div className="rounded-md border border-status-error bg-status-error-bg p-5">
        <p className="text-sm text-fg-primary">{description}</p>
        <div className="mt-4">
          <button
            onClick={onAction}
            className="inline-flex h-10 items-center justify-center rounded-sm bg-status-error px-4 text-sm font-medium text-white hover:bg-status-error/90 transition-colors duration-75"
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
