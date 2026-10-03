"use client";

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  accessorFn?: (row: T) => unknown;
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface SortState {
  key: string;
  direction: "asc" | "desc";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  selectable?: boolean;
  selectedRows?: Set<string>;
  onSelectionChange?: (selected: Set<string>) => void;
  getRowId?: (row: T) => string;
  sort?: SortState;
  onSortChange?: (sort: SortState) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  onRowClick?: (row: T) => void;
  rowActions?: (row: T) => React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  selectable = false,
  selectedRows = new Set(),
  onSelectionChange,
  getRowId = (row) => String((row as Record<string, unknown>).id),
  sort,
  onSortChange,
  pagination,
  onRowClick,
  rowActions,
}: DataTableProps<T>) {
  const allSelected = data.length > 0 && data.every((row) => selectedRows.has(getRowId(row)));
  const someSelected = data.some((row) => selectedRows.has(getRowId(row)));

  function toggleAll() {
    if (allSelected) {
      onSelectionChange?.(new Set());
    } else {
      onSelectionChange?.(new Set(data.map(getRowId)));
    }
  }

  function toggleRow(id: string) {
    const next = new Set(selectedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange?.(next);
  }

  function handleSort(key: string) {
    if (!onSortChange) return;
    if (sort?.key === key) {
      onSortChange({ key, direction: sort.direction === "asc" ? "desc" : "asc" });
    } else {
      onSortChange({ key, direction: "asc" });
    }
  }

  function getCellValue(row: T, col: Column<T>): unknown {
    if (col.accessorFn) return col.accessorFn(row);
    return (row as Record<string, unknown>)[col.key];
  }

  const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 1;

  return (
    <div className="rounded-md border border-border overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {selectable && (
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-border-strong accent-accent"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-fg-muted md:px-5",
                  col.align === "right" && "text-right",
                  col.align === "center" && "text-center",
                  col.sortable && "cursor-pointer select-none"
                )}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <div className={cn("flex items-center gap-1", col.align === "right" && "justify-end")}>
                  {col.label}
                  {col.sortable && (
                    <span className="text-fg-muted">
                      {sort?.key === col.key ? (
                        sort.direction === "asc" ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 opacity-40" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
            {rowActions && <th className="w-10" />}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)}
                className="h-32 text-center text-sm text-fg-muted"
              >
                No results found.
              </td>
            </tr>
          ) : (
            data.map((row) => {
              const id = getRowId(row);
              const isSelected = selectedRows.has(id);
              return (
                <tr
                  key={id}
                  className={cn(
                    "border-b border-border transition-colors duration-75 hover:bg-bg-hover",
                    isSelected && "bg-accent-subtle",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(id)}
                        className="h-4 w-4 rounded border-border-strong accent-accent"
                      />
                    </td>
                  )}
                  {columns.map((col) => {
                    const value = getCellValue(row, col);
                    return (
                      <td
                        key={col.key}
                        className={cn(
                          "px-4 py-3 text-sm md:px-5",
                          col.align === "right" && "text-right",
                          col.align === "center" && "text-center"
                        )}
                      >
                        {col.render ? col.render(value, row) : String(value ?? "")}
                      </td>
                    );
                  })}
                  {rowActions && (
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      {rowActions(row)}
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {pagination && (
        <div className="flex flex-col items-center gap-2 border-t border-border px-4 py-3 sm:flex-row sm:justify-between">
          <p className="text-xs text-fg-muted">
            Showing{" "}
            {Math.min((pagination.page - 1) * pagination.pageSize + 1, pagination.total)}–
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{" "}
            {pagination.total}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={pagination.page <= 1} onClick={() => pagination.onPageChange(1)}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={pagination.page <= 1} onClick={() => pagination.onPageChange(pagination.page - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 text-sm text-fg-secondary">
              Page {pagination.page} of {totalPages}
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={pagination.page >= totalPages} onClick={() => pagination.onPageChange(pagination.page + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={pagination.page >= totalPages} onClick={() => pagination.onPageChange(totalPages)}>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
