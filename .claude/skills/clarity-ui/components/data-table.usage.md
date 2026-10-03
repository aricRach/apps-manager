# Data Table

Sortable, filterable, paginated table. The workhorse of any B2B SaaS app.

## When to use

Any page that displays a list of entities (users, orders, invoices, events). Use with FilterBar above and bulk action bar when rows are selected.

## Column formatting

| Column type | Classes | Alignment |
|-------------|---------|-----------|
| ID / Code | `font-mono text-xs` | Left |
| Name / Title | `font-medium` | Left |
| Email / URL | `text-fg-secondary truncate` | Left |
| Amount / Number | `font-mono tabular-nums` | Right |
| Date | `text-fg-secondary` | Left |
| Status | Use StatusBadge component | Left |
| Actions | Row action dropdown | Right |

## Rules

- Always compact density: `py-2` on cells, `text-sm` body, `text-xs uppercase tracking-wide` headers
- Right-align numeric columns
- Truncate long text with `truncate` class
- Default 25 rows per page
- No zebra striping — borders between rows are sufficient
- Max 7-8 columns visible — hide low-priority columns behind a "Columns" dropdown
- Don't inline-edit cells — use a modal or detail panel

## Type-safe columns

`DataTable` accepts any type `T` — no `Record<string, unknown>` constraint:

```tsx
interface Order {
  id: string;
  customer: string;
  status: "pending" | "completed" | "cancelled";
  total: number;
}

const columns: Column<Order>[] = [
  { key: "customer", label: "Customer" },
  { key: "status", label: "Status", render: (_, row) => <StatusBadge status={row.status} /> },
  { key: "total", label: "Total", align: "right", accessorFn: (row) => `$${row.total}` },
];

<DataTable columns={columns} data={orders} getRowId={(o) => o.id} />
```

Use `accessorFn` when you need to transform the value or access nested properties. If omitted, the component falls back to `row[key]`.
