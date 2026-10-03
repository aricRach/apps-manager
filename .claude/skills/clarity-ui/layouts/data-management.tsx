/*
Data Management layout: Full-width CRUD table with filters, bulk actions, row actions.
For entity listings: orders, invoices, products, users, etc.

Reference implementation — adapt the columns, filters, and actions to your entity type.
*/

"use client";

import { useState } from "react";
import { Plus, Download, Trash2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------- Types ---------- */

interface FilterConfig {
  key: string;
  label: string;
  options: { label: string; value: string }[];
}

interface DataManagementProps {
  title: string;
  description?: string;
  createLabel?: string;
  onCreate?: () => void;
  filters?: FilterConfig[];
  selectedCount?: number;
  onBulkDelete?: () => void;
  onBulkExport?: () => void;
  onExport?: () => void;
  children: React.ReactNode;
}

/* ---------- Layout ---------- */

export function DataManagementLayout({
  title,
  description,
  createLabel = "Create",
  onCreate,
  filters = [],
  selectedCount = 0,
  onBulkDelete,
  onBulkExport,
  onExport,
  children,
}: DataManagementProps) {
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <>
      {/* Page header */}
      <div className="flex items-start justify-between px-6 py-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-fg-primary">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-base text-fg-secondary">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onExport && (
            <button
              onClick={onExport}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-sm border border-border bg-bg-primary px-4 text-sm font-medium text-fg-primary hover:bg-bg-hover transition-colors duration-75"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          )}
          {onCreate && (
            <button
              onClick={onCreate}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-sm bg-accent px-4 text-sm font-medium text-fg-on-accent hover:bg-accent-hover transition-colors duration-75"
            >
              <Plus className="h-4 w-4" />
              {createLabel}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4 px-6 pb-6">
        {/* Filter bar */}
        <div className="flex items-center gap-3 rounded-md border border-border bg-bg-secondary px-4 py-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex h-9 w-full rounded-sm border border-border bg-bg-primary pl-3 pr-3 py-1 text-sm text-fg-primary placeholder:text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {/* Filter dropdowns */}
          {filters.map((filter) => (
            <select
              key={filter.key}
              value={activeFilters[filter.key] || ""}
              onChange={(e) =>
                setActiveFilters((prev) => ({
                  ...prev,
                  [filter.key]: e.target.value,
                }))
              }
              className="h-9 rounded-sm border border-border bg-bg-primary px-2 text-sm text-fg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">{filter.label}</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}

          {/* Active filter count */}
          {activeFilterCount > 0 && (
            <button
              onClick={() => setActiveFilters({})}
              className="text-xs text-accent hover:underline"
            >
              Clear {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
            </button>
          )}
        </div>

        {/* Bulk actions bar — shown when rows selected */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-2 rounded-md border border-accent bg-accent-subtle px-4 py-2">
            <span className="text-sm font-medium text-accent">
              {selectedCount} selected
            </span>
            <div className="ml-auto flex items-center gap-2">
              {onBulkExport && (
                <button
                  onClick={onBulkExport}
                  className="inline-flex h-9 items-center gap-2 rounded-sm border border-border bg-bg-primary px-3 text-sm font-medium text-fg-primary hover:bg-bg-hover transition-colors duration-75"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
              )}
              {onBulkDelete && (
                <button
                  onClick={onBulkDelete}
                  className="inline-flex h-9 items-center gap-2 rounded-sm border border-border bg-bg-primary px-3 text-sm font-medium text-status-error hover:bg-bg-hover transition-colors duration-75"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              )}
            </div>
          </div>
        )}

        {/* Data table area */}
        {children}
      </div>
    </>
  );
}
