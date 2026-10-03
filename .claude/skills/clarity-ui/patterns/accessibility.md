# Accessibility

WCAG AA compliance. These are non-negotiable requirements.

## Color contrast

- **Text on backgrounds:** 4.5:1 minimum contrast ratio (AA)
- **Large text (18px+ or 14px+ bold):** 3:1 minimum
- **Interactive elements:** 3:1 minimum against adjacent colors
- **All palette tokens are pre-tested** for AA compliance in both light and dark modes

When in doubt, test with: https://webaim.org/resources/contrastchecker/

## Focus management

Every interactive element must have a visible focus indicator.

```tsx
// Focus ring pattern — applied via Tailwind
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

- Use `focus-visible` (not `focus`) to avoid showing rings on mouse click
- Ring color: `ring` token from the palette
- Ring offset: 2px
- Never remove focus outlines without providing an alternative

## Keyboard navigation

| Pattern | Keys | Behavior |
|---------|------|----------|
| Buttons | Enter, Space | Activate |
| Links | Enter | Navigate |
| Dropdown menus | Arrow keys, Enter, Escape | Navigate, select, close |
| Modals | Escape, Tab | Close, cycle focus within |
| Tabs | Arrow keys | Switch between tabs |
| Data table | Arrow keys | Navigate cells (optional) |
| Command palette | Arrow keys, Enter, Escape | Navigate, select, close |

## ARIA attributes

### Required for every page

```tsx
<html lang="en">          {/* Always set */}
<main>                     {/* Landmark for content */}
<nav>                      {/* For sidebar and breadcrumbs */}
<header>                   {/* For top bar */}
```

### Required for components

| Component | ARIA |
|-----------|------|
| Sidebar nav | `<nav aria-label="Main navigation">` |
| Breadcrumbs | `<nav aria-label="Breadcrumb">` |
| Data table | `<table>` semantics (not divs), `aria-sort` on sortable columns |
| Modal | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |
| Toast | `role="status"`, `aria-live="polite"` |
| Status badge | `aria-label` with status text |
| Loading spinner | `aria-label="Loading"` |
| Empty state | Descriptive text (not just an icon) |
| Icon buttons | `aria-label` describing the action |

## Screen reader considerations

1. **Don't rely on color alone.** Status badges use both color AND a text label. Trends use both color AND an arrow icon.
2. **Meaningful alt text.** Avatars: `alt=""` (decorative). Charts: provide a text summary.
3. **Announce dynamic content.** Use `aria-live="polite"` for toasts and filter result counts.
4. **Skip to content.** Add a skip link as the first focusable element:

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-bg-primary focus:p-2 focus:text-accent"
>
  Skip to main content
</a>
```

## Motion

- Wrap all animations in `@media (prefers-reduced-motion: no-preference)`
- Or use Tailwind: `motion-safe:animate-pulse`, `motion-safe:transition-all`
- Users who prefer reduced motion should see instant state changes, no animations

## Touch targets

- Minimum 44x44px for all interactive elements on mobile
- Buttons: at least h-9 (36px) on desktop, h-10 (40px) on mobile
- Table row actions: use padding to increase hit area

## Rules

1. **Test with keyboard only.** Every interaction must be possible without a mouse.
2. **Test with screen reader.** VoiceOver (Mac) or NVDA (Windows) for critical flows.
3. **Use semantic HTML.** `<button>` for actions, `<a>` for navigation, `<table>` for tabular data.
4. **Never use `div` with `onClick` as a button.** Use `<button>` or `<a>`.
