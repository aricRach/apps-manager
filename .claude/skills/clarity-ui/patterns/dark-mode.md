# Dark Mode

Class-based dark mode using CSS custom properties. Toggle via `class="dark"` on `<html>`.

## Implementation

### 1. Tailwind v4 theme + CSS custom properties in globals.css

```css
@import "tailwindcss";

/* Register tokens with Tailwind v4 via @theme */
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
}

:root {
  /* Light mode — populated from tokens/colors.json, chosen palette, light mode */
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fb;
  --bg-tertiary: #f1f3f5;
  --bg-elevated: #ffffff;
  --bg-hover: #f1f3f5;
  --bg-active: #e9ecf0;
  --fg-primary: #1c2024;
  --fg-secondary: #4b5563;
  --fg-muted: #9ca3af;
  --fg-on-accent: #ffffff;
  --accent: #4f46e5;
  --accent-hover: #4338ca;
  --accent-subtle: #eef2ff;
  --border: #e5e7eb;
  --border-strong: #d1d5db;
  --ring: #a5b4fc;

  /* Status colors — shared across modes */
  --status-success: #16a34a;
  --status-success-bg: #f0fdf4;
  --status-warning: #ca8a04;
  --status-warning-bg: #fefce8;
  --status-error: #dc2626;
  --status-error-bg: #fef2f2;
  --status-info: #2563eb;
  --status-info-bg: #eff6ff;
}

.dark {
  /* Dark mode — populated from tokens/colors.json, chosen palette, dark mode */
  --bg-primary: #09090b;
  --bg-secondary: #111113;
  --bg-tertiary: #19191d;
  --bg-elevated: #1e1e23;
  --bg-hover: #1e1e23;
  --bg-active: #27272e;
  --fg-primary: #f4f4f5;
  --fg-secondary: #a1a1aa;
  --fg-muted: #71717a;
  --fg-on-accent: #ffffff;
  --accent: #6366f1;
  --accent-hover: #818cf8;
  --accent-subtle: #1e1b4b;
  --border: #27272a;
  --border-strong: #3f3f46;
  --ring: #4f46e5;

  /* Status colors — dark mode backgrounds */
  --status-success-bg: #052e16;
  --status-warning-bg: #422006;
  --status-error-bg: #450a0a;
  --status-info-bg: #172554;
}
```

### 2. Toggle component

```tsx
"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle}>
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
```

### 3. Prevent flash on load

```tsx
// In <head> of layout.tsx or via a script tag
<script dangerouslySetInnerHTML={{
  __html: `
    (function() {
      var theme = localStorage.getItem('theme');
      if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
    })();
  `,
}} />
```

## Dark mode design rules

1. **Never invert colors.** Dark mode is NOT light mode with inverted colors. Use the dedicated dark palette tokens.
2. **Reduce shadow intensity.** In dark mode, shadows are near-invisible. Use border and subtle background shifts for elevation.
3. **Accent colors lighten slightly.** The accent should be slightly brighter in dark mode for readability.
4. **Status colors stay the same.** Success green, error red, etc. remain the same hue. Only their background tints change.
5. **Images and charts.** Consider reducing brightness/opacity of images. Chart colors stay the same.
6. **Borders become more important.** In dark mode, borders are the primary visual separator. Make sure they're visible but subtle.

## Do / Don't

- **Do** use CSS custom properties for ALL colors — never hardcode hex in components
- **Do** test both modes during development
- **Do** respect `prefers-color-scheme` as default
- **Don't** use `dark:` Tailwind prefix directly — use CSS variables instead (they auto-switch)
- **Don't** use pure white (#ffffff) text on dark backgrounds — use the fg-primary token
- **Don't** forget scrollbar styling in dark mode
