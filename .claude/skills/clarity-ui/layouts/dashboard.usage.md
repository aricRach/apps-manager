# Dashboard Layout

Overview page with KPI stat cards, charts, and a recent activity table.

## Structure

1. KPI Cards row: `grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4`
2. Charts row: `grid grid-cols-1 gap-4 lg:grid-cols-3` (area chart col-span-2 + donut)
3. Activity table: full width with "View All" link

## Responsive

| Breakpoint | KPI cards | Charts | Activity table |
|------------|-----------|--------|----------------|
| Desktop | 4 columns | 2:1 ratio | Full table |
| Tablet | 2 columns | Stacked | Full table |
| Mobile | 1 column | Stacked | Horizontal scroll |

## Rules

- Most important KPIs first (left to right)
- Max 3 vertical sections (KPIs → charts → table)
- Activity table: 5-7 rows with "View All" link
- Max 4-6 stat cards, max 2 chart rows
