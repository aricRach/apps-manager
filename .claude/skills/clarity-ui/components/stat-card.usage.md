# Stat Card

KPI card displaying a metric value, label, and trend indicator. Used in dashboard grids.

## When to use

Display a single key metric with optional trend direction. Place in a responsive grid: `grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4`.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| label | string | Yes | Short metric name (2-3 words) |
| value | string | Yes | Formatted value with separators ($48,234.00) |
| change | `{ value, trend, label? }` | No | Trend indicator: up (green), down (red), flat (muted) |
| icon | LucideIcon | No | Right-aligned icon for visual context |

## Rules

- Use `font-mono` for the value (automatic — built into the component)
- Keep labels concise: "Total Revenue", not "Total Revenue This Quarter"
- Max 4-6 cards in a row
- No colorful backgrounds — border + bg-primary only
