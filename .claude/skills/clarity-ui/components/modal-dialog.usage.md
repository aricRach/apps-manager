# Modal & Dialog

Modal patterns for confirmations, forms, and detail views.

## When to use

- **Confirmation dialog (sm):** Destructive/important actions. "Delete user?"
- **Form dialog (default):** Quick create/edit without leaving the page. 1-4 fields.
- **Detail dialog (lg):** Complex forms or detail views. 5+ fields.

## Sizing

| Size | Max width | Use case |
|------|-----------|----------|
| sm | 448px | Confirmations, simple prompts |
| default | 512px | Forms (1-4 fields) |
| lg | 672px | Complex forms, detail views |

## Rules

- Always include a Cancel button
- Primary action on the right
- Use `destructive` variant for delete confirmations
- Max 6 form fields in a modal — use a full page for more
- Don't nest modals
