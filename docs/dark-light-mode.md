# Dark / Light Mode

## Overview

Extralyz uses CSS custom properties (variables) combined with Tailwind CSS v4's `@theme` directive and a `.dark` class on `<html>` to implement dark mode. The theme is toggled via a Redux slice and persisted to `localStorage`.

## Token table

| Token                         | Light value | Dark value  | Purpose                        |
| ----------------------------- | ----------- | ----------- | ------------------------------ |
| `--color-surface`             | `#FFFFFF`   | `#111111`   | Main background                |
| `--color-surface-alt`         | `#F5F5F5`   | `#1A1A1A`   | Alternate/secondary background |
| `--color-surface-hover`       | `#E5E5E5`   | `#2A2A2A`   | Hover state background         |
| `--color-surface-muted`       | `#F0F0F0`   | `#222222`   | Muted/subtle background        |
| `--color-border`              | `#D1D5DB`   | `#333333`   | Default border                 |
| `--color-border-strong`       | `#000000`   | `#FFFFFF`   | High-contrast border           |
| `--color-text-primary`        | `#000000`   | `#F5F5F5`   | Primary text                   |
| `--color-text-secondary`      | `#4B5563`   | `#A0A0A0`   | Secondary text                 |
| `--color-text-muted`          | `#9CA3AF`   | `#666666`   | Muted/disabled text            |
| `--color-text-inverted`       | `#FFFFFF`   | `#000000`   | Inverted text (on accent bg)   |
| `--color-text-correct`        | `#14532D`   | `#6EE7B7`   | Correct-answer green text      |
| `--color-accent`              | `#9B1B30`   | `#9B1B30`   | Brand accent (claret)          |
| `--color-accent-hover`        | `#FFFFFF`   | `#1A1A1A`   | Accent hover background        |
| `--color-btn-primary-bg`      | `#000000`   | `#FFFFFF`   | Primary button background      |
| `--color-btn-primary-text`    | `#FFFFFF`   | `#000000`   | Primary button text            |
| `--color-btn-primary-hover-bg`   | `#FFFFFF` | `#111111` | Primary button hover bg        |
| `--color-btn-primary-hover-text` | `#000000` | `#FFFFFF` | Primary button hover text      |
| `--color-scrollbar-track`     | `#F5F5F5`   | `#1A1A1A`   | Scrollbar track                |
| `--color-scrollbar-thumb`     | `#CCCCCC`   | `#444444`   | Scrollbar thumb                |
| `--color-scrollbar-thumb-hover` | `#999999` | `#666666`   | Scrollbar thumb hover          |

## How the toggle works

1. **Redux slice** (`src/store/theme.slice.ts`): Holds `mode: 'light' | 'dark'`, initialised from `localStorage.getItem('theme')`.
2. **Toggle action**: Flips `mode` between `'light'` and `'dark'`. The component dispatching the action is also responsible for updating `localStorage` and toggling the `.dark` class on `document.documentElement`.
3. **CSS cascade**: When `.dark` is present on `<html>`, the `.dark { ... }` block in `index.html` overrides the `:root` custom properties. Tailwind picks up the new values through `@theme`.

## Flash prevention

An inline `<script>` in the `<body>` of `index.html` runs **before** React mounts:

```js
(function() {
    var theme = localStorage.getItem('theme');
    if (theme === 'dark') document.documentElement.classList.add('dark');
})();
```

This ensures the `.dark` class is applied synchronously so users never see a light-mode flash when their preference is dark.

## How to add new theme tokens

1. Add the variable to `:root` (light value) and `.dark` (dark value) in `index.html`.
2. Register it in the `@theme` block: `--color-my-token: var(--color-my-token);`
3. Use it in components via Tailwind utilities: `bg-my-token`, `text-my-token`, `border-my-token`, etc.

## Score colors in dark mode

`getScoreColor(score, isDark?)` in `src/features/exercise/utils/get-score-color.util.ts` interpolates HSL between claret red (`#9B1B30`) and green (`#2D8B45`) based on the score (0-100). The resulting colours are naturally dark (low lightness).

When `isDark` is `true`, the function clamps lightness to a minimum of `0.55`, producing brighter, more readable score colours on dark backgrounds. `ScoreBadge` reads the current theme mode from Redux and passes it through.

## Practice card selection highlight

Selected choices in `MCQExercisePracticeCard` and `TrueFalseExercisePracticeCard` use `font-bold bg-surface-hover rounded px-2` — a visible pill/highlight that works in both light and dark themes, rather than relying solely on `font-bold` which is hard to distinguish on dark backgrounds.
