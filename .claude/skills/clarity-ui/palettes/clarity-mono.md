# clarity-mono

Technical, precise, dark-mode-first. Pure monochrome with surgical use of color.

## When to use

- Infrastructure tools, monitoring dashboards, CI/CD platforms
- Developer-facing products with technical audiences
- Products where dark mode is the primary experience
- When the user wants a "Vercel-like" or "terminal-like" aesthetic

## Personality

Black and white with gray gradients. Color appears only in status indicators and data visualization — never in the UI chrome. The accent color IS the foreground (black in light, white in dark). Buttons are high-contrast rather than colorful.

## Accent usage

The accent is monochrome (black in light mode, white in dark mode). This means:
- Primary buttons: solid black/white with inverted text
- Links: use fg-primary with underline, not a color
- Active states: stronger foreground contrast, not color change
- Color is reserved EXCLUSIVELY for status (success/error/warning) and charts

## Dark mode notes

This palette is designed dark-mode-first. The dark version is the canonical experience. Light mode is a clean inversion. True black (#000000) background in dark mode.
