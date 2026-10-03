# Sidebar Navigation

Collapsible sidebar with grouped navigation items, icons, and optional badges.

## When to use

Every page inside the app shell. The sidebar is the primary navigation.

## Rules

- Width: 240px full, 64px collapsed (tablet), hidden with drawer (mobile)
- Use Lucide icons (consistent 24x24 grid, 1.5px stroke)
- Truncate long labels, don't wrap
- Max 3-5 nav groups, 12-15 items total
- Settings and Profile go in the footer area
- No nested/collapsible items — one level of hierarchy only
- Active state: `bg-accent-subtle text-accent`
- Hover state: `bg-bg-hover text-fg-primary`
