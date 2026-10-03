---
name: clarity-ui
version: "1.5"
description: >
  B2B SaaS design system. Generates production-grade dashboard interfaces
  with consistent layout, typography, spacing, and color. Activates when
  building web apps, dashboards, admin panels, or any B2B SaaS interface.
  Stack: Next.js 15 + React 19 + Tailwind CSS v4.
---

# clarity-ui — B2B SaaS Design System

## How this skill works

This is a three-layer design system:

1. **This file (SKILL.md)** = Rulebook — design rules, style specs, behavioral specs
2. **`registry.json`** = Dictionary — what components exist and where to find them
3. **`.tsx` files** = Implementation reference — pinned code you read when building

### Component discovery

Before building any UI:

1. Read `registry.json` in this directory to find curated skill components
2. Read `src/components/ui/.clarity-catalog.json` in the project (if it exists) to find project-specific components
3. Merge both lists — **never improvise if a matching component already exists**
4. Copy `.tsx` files from this skill into the project, or read them as reference when building

All file paths in `registry.json` are relative to this directory.

### When to activate

Apply this design system when building: dashboards, admin panels, SaaS interfaces, data-heavy pages, settings/CRUD, auth pages, or any B2B web application.

Do NOT apply when building: marketing/landing pages, mobile-native apps, e-commerce storefronts.

---

## Design philosophy

Non-negotiable rules. Follow these for every component, every page.

1. **Information density over whitespace.** B2B users need data, not decoration. Compact table rows, tight spacing. Every pixel earns its place.
2. **Consistency over creativity.** Every page uses the same sidebar, topbar, spacing scale, and border radius. Predictability is a feature.
3. **Borders over shadows.** Use 1px borders for elevation. Shadows are subtle and rare — only for floating elements (modals, popovers, command palette).
4. **Neutral base, accent for action.** UI chrome is neutral gray. Color appears only in: accent (CTAs, active states), status (success/warning/error/info), and data visualization.
5. **Function over decoration.** No gradients. No background patterns. No decorative illustrations in the app chrome. Empty states may use simple illustrations.
6. **Consistent border radius.** Buttons 4px (`rounded-sm`), cards 6px (`rounded-md`), large containers 8px (`rounded-lg`). Avatars use full rounding.

---

## Tech stack

```
next@^15.2.0  react@^19.0.0  react-dom@^19.0.0
tailwindcss@^4.0.0  @tailwindcss/postcss@^4.0.0
lucide-react  class-variance-authority  clsx  tailwind-merge
@radix-ui/react-select  @radix-ui/react-slot  @radix-ui/react-dialog
@radix-ui/react-popover  @radix-ui/react-tooltip  @radix-ui/react-switch
sonner (toasts)  recharts (charts, if needed)
```

Use **Tailwind v4** with CSS-based `@theme` configuration. No `tailwind.config.ts`.

---

## Color system

Use the `clarity-indigo` palette by default. All colors are CSS custom properties, enabling dark mode via `.dark` class.

### Palette selection
- **Default:** `clarity-indigo` — confident, trustworthy (fintech, enterprise)
- User says "minimal" or "clean": `clarity-slate` — engineering-grade, subtle blue accent
- User says "dark" or "technical" or "developer": `clarity-mono` — pure monochrome, dark-first
- User says "warm" or "friendly": `clarity-warm` — amber/orange accent, inviting

### clarity-indigo (default)

**Light mode:**
```
--bg-primary: #ffffff      --bg-secondary: #f8f9fb     --bg-tertiary: #f1f3f5
--bg-elevated: #ffffff     --bg-hover: #f1f3f5         --bg-active: #e9ecf0
--fg-primary: #1c2024      --fg-secondary: #4b5563     --fg-muted: #9ca3af
--fg-on-accent: #ffffff
--accent: #4f46e5          --accent-hover: #4338ca     --accent-subtle: #eef2ff
--border-color: #e5e7eb    --border-strong: #d1d5db    --ring: #a5b4fc
```

**Dark mode:**
```
--bg-primary: #09090b      --bg-secondary: #111113     --bg-tertiary: #19191d
--bg-elevated: #1e1e23     --bg-hover: #1e1e23         --bg-active: #27272e
--fg-primary: #f4f4f5      --fg-secondary: #a1a1aa     --fg-muted: #71717a
--fg-on-accent: #ffffff
--accent: #6366f1          --accent-hover: #818cf8     --accent-subtle: #1e1b4b
--border-color: #27272a    --border-strong: #3f3f46    --ring: #4f46e5
```

### clarity-slate

**Light:** bg-primary `#ffffff`, bg-secondary `#f8fafc`, bg-tertiary `#f1f5f9`, fg-primary `#0f172a`, fg-secondary `#475569`, fg-muted `#94a3b8`, accent `#2563eb`, accent-hover `#1d4ed8`, accent-subtle `#eff6ff`, border `#e2e8f0`, border-strong `#cbd5e1`, ring `#93c5fd`
**Dark:** bg-primary `#020617`, bg-secondary `#0f172a`, bg-tertiary `#1e293b`, fg-primary `#f8fafc`, fg-secondary `#94a3b8`, fg-muted `#64748b`, accent `#3b82f6`, accent-hover `#60a5fa`, accent-subtle `#172554`, border `#1e293b`, border-strong `#334155`, ring `#2563eb`

### clarity-mono

**Light:** bg-primary `#ffffff`, bg-secondary `#fafafa`, bg-tertiary `#f4f4f5`, fg-primary `#09090b`, fg-secondary `#52525b`, fg-muted `#a1a1aa`, accent `#18181b`, accent-hover `#27272a`, accent-subtle `#f4f4f5`, border `#e4e4e7`, border-strong `#d4d4d8`, ring `#a1a1aa`
**Dark:** bg-primary `#000000`, bg-secondary `#0a0a0a`, bg-tertiary `#141414`, fg-primary `#ededed`, fg-secondary `#a0a0a0`, fg-muted `#666666`, accent `#ededed`, accent-hover `#ffffff`, fg-on-accent `#000000`, accent-subtle `#1a1a1a`, border `#262626`, border-strong `#404040`, ring `#525252`

### clarity-warm

**Light:** bg-primary `#ffffff`, bg-secondary `#faf9f7`, bg-tertiary `#f5f3f0`, fg-primary `#1c1917`, fg-secondary `#57534e`, fg-muted `#a8a29e`, accent `#d97706`, accent-hover `#b45309`, accent-subtle `#fffbeb`, border `#e7e5e4`, border-strong `#d6d3d1`, ring `#fbbf24`
**Dark:** bg-primary `#0c0a09`, bg-secondary `#1c1917`, bg-tertiary `#292524`, fg-primary `#fafaf9`, fg-secondary `#a8a29e`, fg-muted `#78716c`, accent `#f59e0b`, accent-hover `#fbbf24`, accent-subtle `#451a03`, border `#292524`, border-strong `#44403c`, ring `#d97706`

### Status colors (same across all palettes)

```
--status-success: #16a34a    --status-success-bg: #f0fdf4  (dark: #052e16)
--status-warning: #ca8a04    --status-warning-bg: #fefce8  (dark: #422006)
--status-error: #dc2626      --status-error-bg: #fef2f2    (dark: #450a0a)
--status-info: #2563eb       --status-info-bg: #eff6ff     (dark: #172554)
```

### Chart colors (colorblind-safe, use in order)
`#2563eb` `#d97706` `#0d9488` `#dc2626` `#7c3aed` `#0284c7` `#b45309` `#059669`

---

## Token → Tailwind class mapping

Every color above becomes a Tailwind class via the `@theme` directive:

| CSS variable | Tailwind class | Use for |
|---|---|---|
| `--bg-primary` | `bg-bg-primary` | Page background |
| `--bg-secondary` | `bg-bg-secondary` | Sidebar, section backgrounds |
| `--bg-tertiary` | `bg-bg-tertiary` | Nested sections |
| `--bg-elevated` | `bg-bg-elevated` | Cards, modals, popovers |
| `--bg-hover` | `hover:bg-bg-hover` | Hover states |
| `--bg-active` | `bg-bg-active` | Active/pressed states |
| `--fg-primary` | `text-fg-primary` | Body text, headings |
| `--fg-secondary` | `text-fg-secondary` | Secondary text, descriptions |
| `--fg-muted` | `text-fg-muted` | Placeholders, labels, icons |
| `--fg-on-accent` | `text-fg-on-accent` | Text on accent backgrounds |
| `--accent` | `bg-accent` / `text-accent` | CTA buttons, active nav, links |
| `--accent-hover` | `hover:bg-accent-hover` | CTA hover |
| `--accent-subtle` | `bg-accent-subtle` | Subtle accent backgrounds |
| `--border-color` | `border-border` | Card borders, dividers |
| `--border-strong` | `border-border-strong` | Emphasized borders |
| `--ring` | `ring-ring` | Focus rings |
| `--status-*` | `text-status-success`, `bg-status-error-bg`, etc. | Status states |

---

## Typography

Font: **Inter** (sans), **Geist Mono** (mono). Three weights: 400 (regular), 500 (medium), 600 (semibold).

| Role | Size | Class | Weight |
|------|------|-------|--------|
| Page title | 1.875rem (30px) | `text-3xl` | `font-semibold tracking-tight` |
| Section title | 1.125rem (18px) | `text-lg` | `font-semibold` |
| Card title | 1rem (16px) | `text-base` | `font-medium` |
| Body text | 1rem (16px) | `text-base` | `font-normal` |
| Labels / nav | 0.875rem (14px) | `text-sm` | `font-medium` |
| Captions / badges | 0.8125rem (13px) | `text-xs` | `font-normal` or `font-medium` |
| KPI values | 1.5rem (24px) | `text-2xl` | `font-semibold font-mono` |
| Table headers | 0.8125rem (13px) | `text-xs uppercase tracking-wide` | `font-medium` |
| Table cells | 0.875rem (14px) | `text-sm` | `font-normal` |

Override Tailwind's defaults via `@theme`:
```
--text-xs: 0.8125rem     --text-sm: 0.875rem      --text-base: 1rem
--text-lg: 1.125rem      --text-xl: 1.25rem       --text-2xl: 1.5rem
--text-3xl: 1.875rem
```

### Customizing the type scale

The type scale and component dimensions form a coherent system. If you change the type scale, adjust these dimensions proportionally:

| If you change... | Also adjust... |
|-----------------|----------------|
| `--text-base` (body) | Button heights, input heights, card padding |
| `--text-sm` (labels/nav) | Nav item padding, table cell padding, dropdown item padding |
| `--text-xs` (captions) | Badge padding, table header padding |

**Scaling guideline:** Interactive element height ≈ 2.5× the line-height of its text. When bumping the type scale by one step (e.g., base 14px → 16px), bump element heights by one Tailwind step (h-9 → h-10) and padding by 0.5 (py-2.5 → py-3).

Font sizes change in `globals.css @theme` — no component code needed. Component heights/padding require updating the .tsx files.

---

## App shell

Every page (except auth) lives inside the app shell:

```
┌─────────────┬────────────────────────────────┐
│  Sidebar    │  Top bar (h-16, sticky)        │
│  (w-64)     ├────────────────────────────────┤
│             │  PageHeader                     │
│  - Logo     │  ┌────────────────────────────┐│
│  - Nav      │  │  Page content (px-6 pb-6)  ││
│  - Footer   │  │                            ││
│  - User     │  └────────────────────────────┘│
└─────────────┴────────────────────────────────┘
```

**Sidebar:** w-64 (256px), `bg-bg-secondary`, `border-r border-border`. Collapsible to w-16 (64px, icons only). Contains: logo area (h-16), nav groups with `h-5 w-5` icons, footer links, user avatar with name/email. Nav items: `py-2 px-2`.

**Top bar:** h-16 (64px), `sticky top-0`, `bg-bg-primary`, `border-b border-border`. Contains: breadcrumbs (left), search trigger with ⌘K badge, notification bell, user avatar (right). Include a mobile hamburger button (`md:hidden`). Icons: `h-5 w-5`.

**Page header:** Title (`text-3xl font-semibold tracking-tight`) on the left, action buttons on the right. Always present on every page.

**Dark mode toggle:** Sun/Moon icon button. Toggle `.dark` on `<html>`, persist to `localStorage`. Include flash-prevention script in `<head>`:
```js
(function(){var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme:dark)").matches)){document.documentElement.classList.add("dark")}})();
```

---

## Page layout patterns

### Dashboard / Overview
Structure: stat cards (4-col grid) → charts (2:1 ratio: area chart + bar/donut chart) → recent data table.
```
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4     ← stat cards
grid grid-cols-1 lg:grid-cols-3 gap-4                     ← charts (first: lg:col-span-2)
```
Stat card: `rounded-md border border-border bg-bg-primary p-5`. Label (`text-sm text-fg-secondary`), value (`text-2xl font-semibold font-mono`), icon (`h-5 w-5 text-fg-muted`), trend indicator with colored arrow.

### Data management / Entity list
Structure: filter bar → data table → pagination.
Filter bar: search input + select dropdowns + active filter chips + result count. On mobile: search only, filters in a sheet/accordion.
Data table: `rounded-md border border-border`, compact density (`py-2` cells, `text-sm` body, `text-xs uppercase` headers). Sortable columns, checkbox selection, row actions. Pagination in footer.

### List-detail / Master-detail
Two-panel: left list (`w-96`, `border-r`) + right detail panel. List has search, scrollable items, active highlight. On mobile: full-width list → navigate to detail.

### Settings
Side nav (`w-48`, sticky) + form content (`max-w-2xl`). Use `FormSection` pattern: title + description + fields + save footer. Include a danger zone (red border, destructive action).

### Auth pages
No app shell. Centered card on `bg-bg-secondary`, max-w-md, rounded-lg, with logo above.

---

## Component specifications

### Button
Four variants: **default** (accent bg), **destructive** (red bg), **outline** (border, transparent bg), **ghost** (no border, no bg). Three sizes: **default** (`h-10 px-4`), **sm** (`h-9 px-3`), **icon** (`h-10 w-10`). Always `rounded-md`, `text-sm font-medium`, `transition-colors duration-75`, focus ring.

### Input
`h-10`. `rounded-md border border-border bg-bg-primary`. Focus: `ring-2 ring-ring`. Error state: `border-status-error ring-status-error`. Include an `InputError` message component: `text-sm text-status-error mt-1.5`.

### Select
Use `@radix-ui/react-select`. Match input height and border style. Trigger shows placeholder or selected value. Content panel: `rounded-md border border-border bg-bg-elevated shadow-md`.

### Data table
Generic `<T>` — no `Record<string, unknown>` constraint. Columns define `key`, `label`, `sortable`, `align`, optional `accessorFn` and `render`. Supports: row selection (checkboxes), sorting (arrow icons), pagination (first/prev/next/last), row actions, empty state. Horizontal scroll on mobile (`overflow-x-auto`). Pagination footer stacks vertically on mobile.

### Stat card
`rounded-md border border-border bg-bg-primary p-5`. Label (`text-sm text-fg-secondary`), value (`text-2xl font-semibold font-mono`), icon (`h-5 w-5 text-fg-muted`), optional trend indicator (TrendingUp/Down icon + colored change text).

### Status badge
Pill with colored dot. Variants: `success` (green), `warning` (yellow), `error` (red), `info` (blue), `neutral` (gray). `text-xs font-medium px-2.5 py-1 rounded-full`. Background uses the `-bg` variant of each status color.

### Filter bar
Search input (with Search icon) + select dropdowns + active filter chips (accent pill with X button) + result count. Wraps on mobile — search goes full-width, dropdowns hidden below `sm:`.

### Modal / Dialog
Use `@radix-ui/react-dialog`. Three sizes: sm (max-w-md), default (max-w-lg), lg (max-w-2xl). On mobile: bottom sheet (slides up from bottom, `rounded-t-lg`). On desktop: centered with zoom-in animation. Always has close X button, header, description, footer with actions.

### Toast
Use `sonner`. Position: bottom-right. Variants: success, error, info, promise.

### Command palette
Triggered by `⌘K` / `Ctrl+K`. Fixed overlay, centered panel (`max-w-lg`), search input at top, grouped results below. Keyboard navigation. On mobile: near full-width (`inset-x-3`).

### Breadcrumbs
Chevron-separated path. Last item is `font-medium text-fg-primary`, others are `text-fg-muted` with hover. On mobile: show current page only.

### Empty state
Centered: icon (muted), title, description, CTA button. `py-16 text-center`.

### Loading / Skeleton
`animate-pulse rounded-md bg-bg-tertiary`. Provide skeleton variants for: stat card, table rows, list items.

### Form layouts
**FormSection:** title + description + fields + action footer. **FormRow:** two-column on desktop (label left, input right: `grid-cols-3`), stacked on mobile. **DangerZone:** red-bordered section with destructive action.

### Tabs
Use `@radix-ui/react-tabs` or a simple controlled component. Tab list: `border-b border-border`. Active tab: `border-b-2 border-accent text-fg-primary font-medium`. Inactive tab: `text-fg-muted hover:text-fg-secondary transition-colors duration-75`. Tab padding: `px-4 py-2`. Content area: `pt-4`. On mobile: horizontally scrollable if many tabs (`overflow-x-auto`).

### Dropdown menu / Popover
Use `@radix-ui/react-popover`. Container: `rounded-md border border-border bg-bg-elevated shadow-md p-1 min-w-[8rem]`. Items: `py-2 px-2 text-sm rounded-sm hover:bg-bg-hover cursor-pointer transition-colors duration-75`. Separator: `my-1 border-t border-border`. Group label: `px-2 py-2 text-xs font-medium text-fg-muted`. Animate in: `duration-150 fade-in slide-in-from-top-1`.

### Progress bar
Track: `h-2 w-full rounded-full bg-bg-tertiary`. Fill: `h-full rounded-full bg-accent transition-all duration-200`. Warning state (>80% full): fill uses `bg-status-warning`. Critical state (>95% full): fill uses `bg-status-error`. Label above: value on left (`text-sm font-medium`), percentage on right (`text-sm text-fg-muted`).

### Toggle / Switch
Use `@radix-ui/react-switch`. Track: `h-5 w-9 rounded-full transition-colors duration-75`. Thumb: `h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-75`. Checked: track `bg-accent`. Unchecked: track `bg-border-strong`. Disabled: `opacity-50 cursor-not-allowed`.

### Tooltip
Use `@radix-ui/react-tooltip`. Container: `rounded-md bg-fg-primary text-fg-on-accent text-xs px-2 py-1 shadow-md`. Show after 200ms delay. Arrow: `fill-fg-primary`. Animate in: `fade-in duration-150`. Position: top by default, flip if no space.

### Avatar
`rounded-full overflow-hidden`. Sizes: sm `h-6 w-6`, default `h-8 w-8`, lg `h-10 w-10`, xl `h-12 w-12`. Image: `object-cover w-full h-full`. Fallback (no image): `bg-accent-subtle text-accent font-medium` with initials. AvatarGroup: overlapping with `-space-x-2`, ring `ring-2 ring-bg-primary`.

### Theme toggle
Sun/Moon icon button (ghost variant). Reads initial state from `document.documentElement.classList.contains("dark")`. Toggles `.dark` class on `<html>`, persists to `localStorage`.

---

## Composition recipes

When building custom UI not covered by a named component, use these token-based Tailwind class patterns:

| Pattern | Classes |
|---------|---------|
| Base card | `rounded-md border border-border bg-bg-primary p-5` |
| Elevated card | `rounded-lg border border-border bg-bg-elevated shadow-md p-6` |
| Interactive card | `rounded-md border border-border bg-bg-primary p-4 hover:bg-bg-hover hover:border-border-strong cursor-pointer transition-colors duration-75` |
| Section bar | `bg-bg-secondary border-b border-border px-6 py-4` |
| Detail row | `flex items-center justify-between py-3 border-b border-border` |
| Action footer | `flex justify-end gap-2 border-t border-border pt-4 mt-6` |
| Sticky sidebar | `sticky top-20 w-80 shrink-0` |
| Section heading | `text-xs font-medium uppercase tracking-wide text-fg-muted mb-2` |
| KPI grid | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4` |
| Chart row | `grid grid-cols-1 lg:grid-cols-3 gap-4` (first child: `lg:col-span-2`) |
| Empty state | `flex flex-col items-center justify-center py-16 text-center` |
| Loading skeleton | `animate-pulse rounded-md bg-bg-tertiary` (set h- and w-) |
| Error banner | `rounded-md border border-status-error bg-status-error-bg p-4 text-sm text-status-error` |

---

## Cross-cutting rules

### Icon sizes
| Context | Size | Color |
|---------|------|-------|
| Buttons, nav items, topbar, table cells | `h-5 w-5` | `text-fg-muted` (or inherits) |
| Empty states, hero sections | `h-8 w-8` or `h-10 w-10` | `text-fg-muted` |

Always use `lucide-react` icons. Never mix icon libraries.

### Z-index scale
| Layer | Value | Use for |
|-------|-------|---------|
| Sticky headers | `z-10` | Table headers, section bars |
| Dropdown menus | `z-20` | Popovers, dropdown menus, tooltips |
| Sidebar drawer | `z-30` | Mobile sidebar overlay |
| Modal backdrop | `z-40` | Modal/dialog backdrop |
| Modal content | `z-50` | Modal/dialog panel |
| Toast / Command palette | `z-[100]` | Always-on-top elements |

### Section spacing
| Context | Gap |
|---------|-----|
| Between major page sections | `gap-6` |
| Within a section (cards, rows) | `gap-4` |
| Between form fields | `gap-3` |
| Between label and input | `gap-1.5` |

### Disabled state
All disabled elements: `opacity-50 cursor-not-allowed pointer-events-none`

### Loading button
Replace button text with spinner (`animate-spin h-4 w-4`). Maintain button width with `min-w-` to prevent layout shift. Keep button disabled during loading.

---

## Responsive

Three breakpoints. Mobile-first CSS.

| Breakpoint | Width | Tailwind | Sidebar | Page padding |
|---|---|---|---|---|
| Mobile | < 768px | (default) | Hidden, drawer overlay | `px-4` |
| Tablet | 768–1279px | `md:` | Collapsed (w-16, icons only) | `px-6` |
| Desktop | >= 1280px | `lg:` | Full (w-64) | `px-6` |

**Grid adaptations:**
- KPI cards: 1 col → 2 cols (`sm:`) → 4 cols (`lg:`)
- Charts: stacked → side by side (`lg:`)
- List-detail: full-width list → side by side (`lg:`)
- Data table: horizontal scroll on mobile, hide low-priority columns
- Modals: bottom sheet on mobile, centered on desktop
- Filter bar: search-only on mobile, full bar on `sm:+`

**Touch targets:** minimum 44x44px on mobile. Buttons are h-10 across all breakpoints.

---

## Density

Automatic based on content type. Never ask the user.

| Mode | Padding | Font | Use for |
|------|---------|------|---------|
| Compact | `py-3 px-4` | `text-sm` | Tables, list views, dropdowns |
| Default | `py-3 px-4` | `text-base` | Cards, forms, modals, general content |
| Spacious | `py-4 px-6` | `text-base` | Settings, onboarding, auth, empty states |

On mobile (< 768px), never use compact density.

---

## Motion

| Duration | Class | Use for |
|---|---|---|
| 75ms | `duration-75` | Hover states, color transitions, active states |
| 150ms | `duration-150` | Expand/collapse, accordion, slide-in panels |
| 200ms | `duration-200` | Modal open/close, page transitions, drawer slide |

Default easing: `ease-out`.

**Rules:**
- Every `hover:` state must include `transition-colors duration-75`
- Expanding elements: `transition-all duration-150 ease-out`
- Modals and overlays: `duration-200` with fade + scale

---

## Dark mode

Strategy: `class` on `<html>` element. Light = no class, dark = `class="dark"`.

All colors must use CSS custom properties — never hardcode hex values in components. The `:root` block defines light values, `.dark` block defines dark values. Switching is automatic.

Include a ThemeToggle: Sun/Moon icon button that toggles `.dark` and persists to `localStorage`.

---

## Form validation

- **Input error:** `border-status-error` border + `ring-status-error` focus ring via `error` prop
- **Error message:** `text-sm text-status-error mt-1.5` below the input
- **Inline errors:** for field-level validation (required, format, length)
- **Toast errors:** for form submission failures (network, server, auth)
- **Banner errors:** for page-level issues (permission denied, not found)

---

## Self-expanding component library

This skill grows with the project. When you need a component that doesn't exist in the registry or catalog, create it following these rules. Future sessions will find it and reuse it instead of improvising.

### Decision: create new vs. compose existing

**Create a new component** when:
- The pattern will be reused across 2+ pages (e.g., Tabs, Avatar, DatePicker)
- No existing component covers this interaction pattern
- It represents a distinct UI primitive (not just a styled div)

**Compose from existing** when:
- The need is page-specific (e.g., a custom dashboard widget)
- Existing components + composition recipes can assemble it
- It is a one-off layout variation

When in doubt, compose first. Only create a new component if you find yourself wanting to copy-paste the same pattern across multiple files.

### How to create a new component

#### Step 1: Write the .tsx file

Place it in the project at `src/components/ui/{name}.tsx`. Follow these conventions exactly:

1. **Imports:** `import { cn } from "@/lib/utils"` for class merging. Icons from `lucide-react`. Radix primitives if needed.
2. **Interface:** Export a TypeScript interface named `{Component}Props`.
3. **Component:** Export as a named function. Use `forwardRef` if wrapping an HTML element.
4. **Styling:** Only design token classes (`bg-bg-primary`, `text-fg-secondary`, `border-border`, etc.). Never hardcode hex colors or arbitrary spacing values.
5. **Variants:** Use `class-variance-authority` (cva) for multiple visual variants.
6. **Dark mode:** All colors from CSS variables. No `dark:` overrides needed.
7. **Responsive:** Mobile-friendly defaults. Use `sm:` for desktop adjustments where needed.
8. **Transitions:** Every hover state includes `transition-colors duration-75`.

#### Step 2: Update the project catalog

Append an entry to `src/components/ui/.clarity-catalog.json`:

```json
{
  "name": "tabs",
  "description": "Tabbed content switcher with underline active indicator",
  "tags": ["tabs", "navigation", "switch", "content", "panel"],
  "file": "tabs.tsx",
  "createdAt": "2026-02-16",
  "dependencies": []
}
```

If the file doesn't exist yet, create it with this structure:
```json
{
  "$schema": "clarity-catalog/v1",
  "components": []
}
```

#### Step 3: Validate before saving

- [ ] Uses only design token Tailwind classes (no hardcoded colors, no arbitrary values)
- [ ] TypeScript interface is exported
- [ ] Component is exported as a named export (not default)
- [ ] Imports use `@/` path aliases
- [ ] Border radius follows the scale: 4px buttons, 6px cards, 8px containers
- [ ] Hover and focus states present on interactive elements
- [ ] `.clarity-catalog.json` remains valid JSON after edit
- [ ] No duplicate `name` in the catalog

### Do NOT modify during a session

- This SKILL.md file
- `registry.json`
- `tokens/`, `patterns/`, `palettes/` directories
- Any file inside `.claude/skills/`

The skill directory is the upstream design system. Project-specific components live in `src/components/ui/`.

---

## Where to place files

```
src/
├── components/
│   ├── ui/           ← All component .tsx files (button, input, data-table, etc.)
│   ├── layout/       ← sidebar-nav.tsx, top-bar.tsx, page-header.tsx
│   └── [app-specific] ← Your custom components
├── lib/
│   └── utils.ts      ← cn() helper (required by all components)
└── styles/
    └── globals.css   ← @theme tokens + palette CSS variables
```

Components import from `@/components/ui/button`, `@/components/ui/select`, and `@/lib/utils`. Placing files elsewhere breaks these imports.

---

## globals.css setup

```css
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-mono: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace;

  --color-bg-primary: var(--bg-primary);
  --color-bg-secondary: var(--bg-secondary);
  --color-bg-tertiary: var(--bg-tertiary);
  --color-bg-elevated: var(--bg-elevated);
  --color-bg-hover: var(--bg-hover);
  --color-bg-active: var(--bg-active);
  --color-fg-primary: var(--fg-primary);
  --color-fg-secondary: var(--fg-secondary);
  --color-fg-muted: var(--fg-muted);
  --color-fg-on-accent: var(--fg-on-accent);
  --color-accent: var(--accent);
  --color-accent-hover: var(--accent-hover);
  --color-accent-subtle: var(--accent-subtle);
  --color-border: var(--border-color);
  --color-border-strong: var(--border-strong);
  --color-ring: var(--ring);
  --color-status-success: var(--status-success);
  --color-status-success-bg: var(--status-success-bg);
  --color-status-warning: var(--status-warning);
  --color-status-warning-bg: var(--status-warning-bg);
  --color-status-error: var(--status-error);
  --color-status-error-bg: var(--status-error-bg);
  --color-status-info: var(--status-info);
  --color-status-info-bg: var(--status-info-bg);

  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;

  --text-xs: 0.8125rem;    --text-xs--line-height: 1.125rem;
  --text-sm: 0.875rem;     --text-sm--line-height: 1.25rem;
  --text-base: 1rem;       --text-base--line-height: 1.5rem;
  --text-lg: 1.125rem;     --text-lg--line-height: 1.75rem;
  --text-xl: 1.25rem;      --text-xl--line-height: 1.75rem;
  --text-2xl: 1.5rem;      --text-2xl--line-height: 2rem;
  --text-3xl: 1.875rem;    --text-3xl--line-height: 2.25rem;
}

/* Paste palette values here — swap this block to change brand */
:root {
  --bg-primary: #ffffff;    --bg-secondary: #f8f9fb;   --bg-tertiary: #f1f3f5;
  --bg-elevated: #ffffff;   --bg-hover: #f1f3f5;       --bg-active: #e9ecf0;
  --fg-primary: #1c2024;    --fg-secondary: #4b5563;   --fg-muted: #9ca3af;
  --fg-on-accent: #ffffff;
  --accent: #4f46e5;        --accent-hover: #4338ca;   --accent-subtle: #eef2ff;
  --border-color: #e5e7eb;  --border-strong: #d1d5db;  --ring: #a5b4fc;
  --status-success: #16a34a; --status-success-bg: #f0fdf4;
  --status-warning: #ca8a04; --status-warning-bg: #fefce8;
  --status-error: #dc2626;   --status-error-bg: #fef2f2;
  --status-info: #2563eb;    --status-info-bg: #eff6ff;
}

.dark {
  --bg-primary: #09090b;    --bg-secondary: #111113;   --bg-tertiary: #19191d;
  --bg-elevated: #1e1e23;   --bg-hover: #1e1e23;       --bg-active: #27272e;
  --fg-primary: #f4f4f5;    --fg-secondary: #a1a1aa;   --fg-muted: #71717a;
  --fg-on-accent: #ffffff;
  --accent: #6366f1;        --accent-hover: #818cf8;   --accent-subtle: #1e1b4b;
  --border-color: #27272a;  --border-strong: #3f3f46;  --ring: #4f46e5;
  --status-success: #16a34a; --status-success-bg: #052e16;
  --status-warning: #ca8a04; --status-warning-bg: #422006;
  --status-error: #dc2626;   --status-error-bg: #450a0a;
  --status-info: #2563eb;    --status-info-bg: #172554;
}
```

---

## Project scaffolding

Copy the starter template from the **repository root** at `starters/default/` (two levels above this skill directory). Or create these files manually:

1. `src/styles/globals.css` — use the globals.css setup above
2. `src/app/layout.tsx` — html with `suppressHydrationWarning`, Inter font, dark mode flash script, `font-sans antialiased`
3. `src/app/(app)/layout.tsx` — flex wrapper with Sidebar + content column
4. Each page: TopBar + main with PageHeader + content in `px-6 pb-6`

### Dependencies
```json
{
  "dependencies": {
    "next": "^15.2.0", "react": "^19.0.0", "react-dom": "^19.0.0",
    "lucide-react": "^0.474.0", "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0", "tailwind-merge": "^3.0.0",
    "@radix-ui/react-select": "^2.1.0", "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-dialog": "^1.1.0", "@radix-ui/react-popover": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.0", "@radix-ui/react-switch": "^1.1.0",
    "sonner": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0", "@types/react": "^19.0.0", "@types/react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0", "@tailwindcss/postcss": "^4.0.0"
  }
}
```

**Optional:** Add `"recharts": "^2.15.0"` if using chart components.

---

## Quality checklist

Before delivering any UI, verify:

- [ ] All colors use CSS custom properties (token classes), never hardcoded hex
- [ ] App shell present (sidebar + topbar) unless auth page
- [ ] Typography uses the type scale — no arbitrary font sizes
- [ ] Spacing uses Tailwind scale — no arbitrary padding/margin values
- [ ] Border radius: 4px buttons, 6px cards, 8px containers
- [ ] Every interactive element has hover and focus states with transitions
- [ ] Focus rings use `ring-ring`
- [ ] Dark mode works — toggle it, verify nothing breaks
- [ ] Responsive at 320px (mobile), 768px (tablet), 1280px (desktop)
- [ ] Status colors: green=success, yellow=warning, red=error, blue=info
- [ ] No gradients, patterns, or decorative images in app chrome
- [ ] Tables: compact density. Forms: default. Settings: spacious.
- [ ] Every page has a PageHeader with title and action buttons
- [ ] Sidebar collapses on tablet, becomes drawer on mobile
- [ ] Icons: h-5 w-5 in buttons/nav/headers, h-8+ in empty states
- [ ] Z-index: dropdowns z-20, modals z-40/z-50, toasts z-[100]
