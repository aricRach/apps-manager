# Top Bar

Fixed top bar with breadcrumbs, search trigger, notifications, and user menu.

## When to use

Every page inside the app shell. The top bar is always present above the content area.

## Responsive behavior

| Breakpoint | Menu button | Breadcrumbs | Search | Notifications | User |
|------------|------------|-------------|--------|---------------|------|
| Desktop | Hidden | Full path | Visible with ⌘K shortcut | Visible | Visible |
| Tablet | Hidden | Truncated (last 2) | Icon only | Visible | Visible |
| Mobile | Visible (hamburger) | Current page only | Hidden | Visible | Visible |

## Rules

- Height: always h-14 (56px), sticky top-0, z-30
- Ghost/icon buttons for all right-side actions
- Don't put tabs or filters in the top bar — those go in page content
- Don't add a global search input — use ⌘K command palette trigger
- Don't put the app logo here — it's in the sidebar
