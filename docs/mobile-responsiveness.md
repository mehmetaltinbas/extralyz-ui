# Mobile Responsiveness

## Overview

The app supports mobile (320px+), tablet (768px–1024px), and desktop (>1024px) viewports. The approach is minimal — the mobile experience is identical to desktop, just fitting smaller screens. No separate mobile paradigm.

## Breakpoints

Defined in `src/shared/hooks/use-breakpoint.hook.ts`:

| Name    | Range         | Tailwind prefix |
| ------- | ------------- | --------------- |
| mobile  | < 768px       | (default)       |
| tablet  | 768px–1024px  | `md:`           |
| desktop | > 1024px      | `lg:`           |

The `useBreakpoint()` hook uses `window.matchMedia` (no resize listeners). Returns `{ breakpoint, isMobile, isTablet, isDesktop }`.

## Key architectural changes

### No more Redux pixel widths

Previously, layout widths were calculated in Redux (`layout-dimensions.slice.ts`) and applied as `w-[${px}px]`. This blocked CSS responsiveness.

**Removed:** `updateWidthsBySidebarWidth` reducer, `exerciseSetsContainer` from state, and the `useEffect` in `WorkspacePage.tsx` that dispatched width updates on sidebar resize.

**Replaced with:** `w-full` on `WorkspaceTabsBar`, `WorkspaceBody`, `ExerciseSetsPageContent`, and `SidebarNavSection`. The parent flex container handles width distribution naturally.

> `layoutDimensionsActions.updateDimension` is still used for height tracking (e.g. `mainColumn.height` via `ResizeObserver` in `WorkspaceBody`).

### Sidebar drawer on mobile/tablet

On desktop, the sidebar works exactly as before (resizable, collapsible).

On mobile/tablet, it becomes a **fixed overlay drawer**:
- Renders as `fixed inset-0 z-40` with a semi-transparent backdrop
- Opens via a hamburger button (top-left, next to tabs bar)
- Auto-closes when a nav item is clicked (via `sidebarActions.close()` in `SidebarNavSection`)
- No resize handle on mobile
- Mouse drag listeners are skipped on mobile

The sidebar slice has a `mode: 'sidebar' | 'drawer'` field. The `Sidebar` component calls `sidebarActions.setMode()` based on `useBreakpoint()`. The `resize` reducer is a no-op when `mode === 'drawer'`.

### Responsive cards and grids

Cards use `w-full max-w-[Xpx]` instead of fixed `w-[Xpx]`, allowing them to shrink on smaller screens. Cards inside horizontal scroll containers keep `flex-shrink-0`.

The exercise card grid uses `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` instead of a fixed `grid-cols-3`.

### Tabs bar

- `touch-pan-x` class on the tab bar container enables swipe scrolling on mobile
- `draggable={false}` on individual tabs when `isMobile` is true (no drag reorder on touch)
- Tab max-width is `max-w-[120px] md:max-w-[200px]`

### Modals

No behavior changes. `max-w-[90vw]` added to the `Modal` component so it doesn't exceed viewport width.

## Running on a mobile device

### Setup

1. Run `npm run dev:mobile` — this starts Vite with `--host`, exposing the dev server on your local network.
2. The terminal will print a **Network** URL (e.g. `http://192.168.x.x:4010`). Open that on your phone.

### How API routing works

The axios instance (`src/shared/api/axiosInstance.ts`) resolves the API base URL at runtime using `window.location.hostname`:

```
${window.location.protocol}//${window.location.hostname}:${VITE_API_PORT}
```

This means:
- Desktop browser at `localhost:4010` hits `localhost:4000`
- Phone browser at `192.168.x.x:4010` hits `192.168.x.x:4000`

No separate `.env` file needed. The `VITE_API_PORT` env var (in `.env`) controls the port.

### Backend CORS

The backend must allow both origins. In the backend's `.dev.local.env`:

```
CLIENT_URL=http://localhost:4010
LOCAL_MOBILE_CLIENT_URL=http://192.168.1.46:4010
```

Both are passed as an array to NestJS `enableCors({ origin: [...] })`.

> If your Mac's IP changes, update `LOCAL_MOBILE_CLIENT_URL`. Find your IP with `ipconfig getifaddr en0`.

### Backend host binding

NestJS `app.listen(port)` binds to `0.0.0.0` by default, so the backend is already accessible from other devices on the network.

## Testing checklist

Test at three widths using browser DevTools responsive mode:

| Width  | Device    | Expected behavior                                                    |
| ------ | --------- | -------------------------------------------------------------------- |
| 320px  | iPhone SE | Single-column grids, drawer sidebar, no horizontal overflow          |
| 768px  | iPad      | Drawer sidebar, 2-column grids, buttons wrap                         |
| 1440px | Desktop   | Everything unchanged from pre-mobile behavior                        |
