# Status Badge

Status indicator pill with colored dot.

## When to use

Display entity status in tables, list items, and detail headers.

## Common mappings

| Entity | Status | Variant |
|--------|--------|---------|
| User | Active / Invited / Inactive / Suspended | success / info / neutral / error |
| Order | Completed / Processing / Pending / Cancelled | success / info / warning / error |
| Task | Done / In Progress / To Do / Blocked | success / info / neutral / error |
| Deploy | Live / Building / Failed / Queued | success / info / error / neutral |

## Rules

- Keep labels to 1-2 words, sentence case ("In Progress" not "IN PROGRESS")
- Same status always maps to same variant across the entire app
- Max 4-5 distinct statuses per entity type
- Don't use accent color for statuses — reserve it for interactive elements
