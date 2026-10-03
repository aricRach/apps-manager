# Responsive Design

Three breakpoints. Every layout and component must work at all three.

## Breakpoints

| Name | Width | Tailwind prefix | Sidebar state |
|------|-------|-----------------|---------------|
| Mobile | < 768px | (default) | Hidden, drawer |
| Tablet | 768–1279px | `md:` | Collapsed (64px) |
| Desktop | ≥ 1280px | `lg:` | Full (256px) |

## Layout behavior per breakpoint

### App shell

```
Desktop:  [Sidebar 256px] [Content]
Tablet:   [Sidebar 64px]  [Content]
Mobile:   [Content full width] + [Drawer overlay]
```

### Grid patterns

| Pattern | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| KPI cards | 4 cols | 2 cols | 1 col |
| Chart grid | 2:1 ratio | Stacked | Stacked |
| List-detail | Side-by-side | Narrower list | Full → detail |
| Settings | Nav + content | Nav + content | Tabs + content |

### Component adaptations

| Component | Desktop | Tablet | Mobile |
|-----------|---------|--------|--------|
| Data table | Full, all columns | Hide low-priority cols | Horizontal scroll or card view |
| Filter bar | Inline filters | Inline, may wrap | Search only, filters in sheet |
| Stat cards | 4 across | 2 across | 1 per row |
| Breadcrumbs | Full path | Last 2 segments | Current page only |
| Top bar search | Visible with ⌘K | Icon only | Hidden |
| Modal | Centered | Centered | Full-screen sheet |
| Page padding | px-6 (24px) | px-6 | px-4 (16px) |

## Tailwind patterns

### Mobile-first grid

```tsx
// KPI cards: 1 col → 2 cols → 4 cols
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

// Charts: stacked → side by side
<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
  <div className="lg:col-span-2">{/* Main chart */}</div>
  <div>{/* Secondary chart */}</div>
</div>
```

### Hide/show by breakpoint

```tsx
// Show on desktop only
<div className="hidden lg:block">{/* Full sidebar */}</div>

// Show on mobile only
<Button className="lg:hidden">{/* Hamburger */}</Button>

// Adjust padding by breakpoint
<div className="px-4 md:px-6">{/* Content */}</div>
```

## Rules

1. **Mobile-first CSS.** Base styles are mobile. Add `md:` and `lg:` for larger screens.
2. **No horizontal scroll on the page.** Tables can scroll horizontally, the page itself cannot.
3. **Touch targets on mobile.** Minimum 44x44px for all interactive elements.
4. **Never hide critical data.** If a table column is hidden on mobile, the data must be accessible (e.g., in an expanded row or detail view).
5. **Test at 320px, 768px, and 1280px.**
