# Adaptive Density

Three density modes applied automatically based on content type.

## Modes

| Mode | Line height | Vertical padding | Row height | Gap | Use case |
|------|------------|-----------------|------------|-----|----------|
| **Compact** | 1.3 | py-2 to py-3 | 36–40px | gap-1 to gap-2 | Data tables, list views, activity feeds, dropdowns |
| **Default** | 1.5 | py-2 to py-4 | 40px | gap-2 to gap-4 | Dashboard cards, forms, modal content, general content |
| **Spacious** | 1.6 | py-4 to py-6 | 48px | gap-4 to gap-6 | Settings pages, onboarding, auth pages, empty states |

## Auto-selection rules

Claude selects density automatically. Never ask the user.

| Content type | Density | Rationale |
|-------------|---------|-----------|
| Data table rows | Compact | Maximum data visibility |
| Dropdown/select menus | Compact | Fit more options in view |
| Activity/event feeds | Compact | Scannable timeline |
| Sidebar navigation | Compact | Fit all nav items |
| Dashboard KPI cards | Default | Comfortable reading |
| Form fields | Default | Comfortable interaction |
| Modal content | Default | Focused task |
| Page headers | Default | Clear hierarchy |
| Settings forms | Spacious | Infrequent, exploratory |
| Auth pages | Spacious | Single-focus task |
| Onboarding flows | Spacious | Guided, unhurried |
| Empty states | Spacious | Breathing room |

## Tailwind implementation

```tsx
// Compact: data table
<TableRow className="h-9">  {/* 36px */}
  <TableCell className="py-3 px-4 text-sm">{/* ... */}</TableCell>
</TableRow>

// Default: dashboard card
<div className="rounded-md border p-5 space-y-2">{/* ... */}</div>

// Spacious: settings section
<div className="space-y-6 py-6">{/* ... */}</div>
```

## Mobile override

On mobile (< 768px), never use compact density. Upgrade compact → default to ensure touch-friendly spacing.

## Rules

1. **Don't mix densities within a component.** A data table is all compact. A form is all default.
2. **Density applies to padding and spacing, not font size.** The type scale is constant.
3. **Adjacent components can have different densities.** A compact table below default stat cards is correct.
