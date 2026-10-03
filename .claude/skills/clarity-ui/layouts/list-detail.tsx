/*
List-Detail layout: Master list (w-96) + detail panel.
For entity management: users, orders, tickets, conversations, etc.

Reference implementation — adapt the entity type, list rendering, and detail panel to your app.
*/

"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------- Types ---------- */

interface Entity {
  id: string;
  name: string;
  subtitle: string;
  meta: string;
  status: {
    label: string;
    variant: "success" | "warning" | "error" | "info" | "neutral";
  };
}

interface ListDetailProps {
  title: string;
  headerActions?: React.ReactNode;
  items: Entity[];
  renderDetail: (item: Entity) => React.ReactNode;
  emptyDetailMessage?: string;
  searchPlaceholder?: string;
}

/* ---------- Status badge (inline to avoid import dependencies) ---------- */

const statusStyles: Record<string, string> = {
  success: "bg-status-success-bg text-status-success",
  warning: "bg-status-warning-bg text-status-warning",
  error: "bg-status-error-bg text-status-error",
  info: "bg-status-info-bg text-status-info",
  neutral: "bg-bg-tertiary text-fg-secondary",
};

const dotStyles: Record<string, string> = {
  success: "bg-status-success",
  warning: "bg-status-warning",
  error: "bg-status-error",
  info: "bg-status-info",
  neutral: "bg-fg-muted",
};

/* ---------- Layout ---------- */

export function ListDetailLayout({
  title,
  headerActions,
  items,
  renderDetail,
  emptyDetailMessage = "Select an item to view details",
  searchPlaceholder = "Search...",
}: ListDetailProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const selectedItem = items.find((item) => item.id === selectedId);

  const filteredItems = search
    ? items.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(search.toLowerCase())
      )
    : items;

  return (
    <>
      {/* Page header */}
      <div className="flex items-start justify-between px-6 py-6">
        <h1 className="text-3xl font-semibold tracking-tight text-fg-primary">
          {title}
        </h1>
        {headerActions && (
          <div className="flex items-center gap-2">{headerActions}</div>
        )}
      </div>

      <div className="px-6 pb-6">
        <div className="flex rounded-md border border-border overflow-hidden" style={{ height: "calc(100vh - 180px)" }}>
          {/* Master list */}
          <div className="w-96 flex-shrink-0 flex flex-col border-r border-border bg-bg-primary">
            {/* Search */}
            <div className="border-b border-border p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex h-9 w-full rounded-sm border border-border bg-bg-primary pl-9 pr-3 py-1 text-sm text-fg-primary placeholder:text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-fg-muted">
                  No items found
                </div>
              ) : (
                filteredItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={cn(
                      "flex w-full flex-col gap-1 border-b border-border px-4 py-3 text-left transition-colors duration-75",
                      selectedId === item.id
                        ? "bg-accent-subtle"
                        : "hover:bg-bg-hover"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-fg-primary">
                        {item.name}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
                          statusStyles[item.status.variant]
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            dotStyles[item.status.variant]
                          )}
                        />
                        {item.status.label}
                      </span>
                    </div>
                    <span className="text-xs text-fg-secondary truncate">
                      {item.subtitle}
                    </span>
                    <span className="text-xs text-fg-muted">{item.meta}</span>
                  </button>
                ))
              )}
            </div>

            {/* List footer */}
            <div className="border-t border-border px-4 py-2">
              <span className="text-xs text-fg-muted">
                {filteredItems.length} of {items.length} items
              </span>
            </div>
          </div>

          {/* Detail panel */}
          <div className="flex-1 overflow-y-auto bg-bg-primary">
            {selectedItem ? (
              renderDetail(selectedItem)
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-fg-muted">
                {emptyDetailMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
