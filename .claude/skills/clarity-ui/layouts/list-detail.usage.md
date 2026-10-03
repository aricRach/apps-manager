# List-Detail Layout

Master list on the left, detail panel on the right.

## When to use

Entity management pages: users, orders, tickets, customers. The list shows summary, the detail shows full info.

## Responsive

| Breakpoint | Layout |
|------------|--------|
| Desktop | Side-by-side: list (w-96) + detail (flex-1) |
| Tablet | List narrows to w-72, detail takes remaining |
| Mobile | List only → tap → full-screen detail with back button |

## Rules

- Selected item: `bg-accent-subtle`
- Placeholder when nothing selected
- Use tabs in the detail panel to organize info
- Keep list items scannable: name, subtitle, and status badge
- Don't put actions in list items — actions go in detail header
- List panel max w-96
