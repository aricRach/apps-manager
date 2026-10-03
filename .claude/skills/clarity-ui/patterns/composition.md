# Composition Patterns

When building custom UI that isn't covered by an existing component, use these token-based Tailwind class recipes. They ensure visual consistency with the design system.

## Card patterns

### Base card
```
rounded-md border border-border bg-bg-primary p-5
```
Use for: content containers, info cards, grouped sections.

### Elevated card
```
rounded-lg border border-border bg-bg-elevated shadow-md p-6
```
Use for: modals, popovers, command palette, floating panels.

### Interactive card
```
rounded-md border border-border bg-bg-primary p-4 hover:bg-bg-hover hover:border-border-strong cursor-pointer transition-colors duration-75
```
Use for: clickable list items, selectable cards, search results.

## Layout patterns

### Section bar
```
bg-bg-secondary border-b border-border px-6 py-4
```
Use for: filter bars, tab bars, secondary headers.

### Detail row
```
flex items-center justify-between py-3 border-b border-border
```
Use for: key-value pairs, settings rows, metadata lines.

### Action footer
```
flex justify-end gap-2 border-t border-border pt-4 mt-6
```
Use for: form submit areas, modal footers, card actions.

### Sticky sidebar
```
sticky top-20 w-80 shrink-0
```
Use for: side panels, price summaries, contextual info.

## Typography patterns

### Section heading
```
text-xs font-medium uppercase tracking-wide text-fg-muted mb-2
```
Use for: group labels, sidebar section titles, form section dividers.

### Page subtitle
```
text-sm text-fg-secondary
```
Use for: descriptions below page titles, helper text.

## Grid patterns

### Responsive 2-column
```
grid grid-cols-1 md:grid-cols-2 gap-4
```

### Responsive 3-column
```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
```

### Responsive 4-column (KPI cards)
```
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4
```

### Dashboard chart row (2:1 ratio)
```
grid grid-cols-1 lg:grid-cols-3 gap-4
```
First child: `lg:col-span-2`. Second child: default.

## State patterns

### Empty state container
```
flex flex-col items-center justify-center py-16 text-center
```

### Loading placeholder
```
animate-pulse rounded-md bg-bg-tertiary
```
Set explicit `h-` and `w-` for skeleton dimensions.

### Error state
```
rounded-md border border-status-error bg-status-error-bg p-4 text-sm text-status-error
```

## Form validation patterns

### Input with error
```tsx
<div>
  <Input error placeholder="Email" />
  <InputError>Please enter a valid email address</InputError>
</div>
```

Import `Input` and `InputError` from the input component. The `error` prop adds red border and red focus ring. `InputError` renders the error message below.

### Inline form field with error
```tsx
<FormRow label="Email" htmlFor="email">
  <Input id="email" error={!!errors.email} />
  {errors.email && <InputError>{errors.email}</InputError>}
</FormRow>
```

### Toast error (for submission failures)
```tsx
toast.error("Failed to save changes. Please try again.");
```

**When to use which:**
- **Inline errors (InputError):** Field-level validation — empty required fields, invalid format, too short/long
- **Toast errors:** Form submission failures — network errors, server errors, auth failures
- **Banner errors:** Page-level issues — permission denied, resource not found

## Combining patterns

To build a custom component (e.g., an order summary card):

```tsx
<div className="rounded-md border border-border bg-bg-primary p-5 hover:bg-bg-hover cursor-pointer transition-colors duration-75">
  {/* Section heading */}
  <p className="text-xs font-medium uppercase tracking-wide text-fg-muted mb-2">
    Order details
  </p>

  {/* Detail rows */}
  <div className="flex items-center justify-between py-2 border-b border-border">
    <span className="text-sm text-fg-secondary">Created</span>
    <span className="text-sm font-medium text-fg-primary">Feb 14, 2026</span>
  </div>

  {/* Action footer */}
  <div className="flex justify-end gap-2 border-t border-border pt-4 mt-4">
    <Button variant="outline" size="sm">Details</Button>
    <Button size="sm">Approve</Button>
  </div>
</div>
```

Every class in this example comes from the design token vocabulary. The result will be consistent with all other components in the system.
