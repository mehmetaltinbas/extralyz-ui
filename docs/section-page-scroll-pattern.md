# Section Page Scroll Pattern

## Overview

All section pages (rendered inside WorkspaceBody tabs) follow a consistent layout pattern to ensure proper scrolling. **WorkspaceBody owns all Y-axis scrolling** — individual pages must never create their own scroll contexts.

## Why This Matters

- `html, body, #root` have `overflow: hidden` — the viewport itself never scrolls
- WorkspaceBody has `overflow-y-auto` — this is the single scroll container
- Pages use `absolute` positioning so their content overflow is caught by WorkspaceBody's scroll
- ActionMenus (also `absolute`) are siblings of the content inside the same `relative` container, so they scroll naturally with the page

## The Pattern

### Reference Implementation: `ExerciseSetsPage` + `ExerciseSetsPageContent`

### Page Component

Single wrapper div with `relative w-full h-full`, `containerRef`, and visibility toggle — all on ONE element. No extra nesting.

```tsx
export function MyPage({ isActiveComponent, ...props }) {
    const containerRef = React.useRef<HTMLDivElement>(null);

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full ${isActiveComponent ? 'block' : 'hidden'}`}
        >
            <MyPopupsProvider containerRef={containerRef}>
                <MyPageContent ... />
            </MyPopupsProvider>
        </div>
    );
}
```

If the page has a conditional (e.g., data loading), put the conditional OUTSIDE the wrapper:

```tsx
return data ? (
    <div
        ref={containerRef}
        className={`relative w-full h-full ${isActiveComponent ? 'block' : 'hidden'}`}
    >
        ...
    </div>
) : (
    <div className={`${isActiveComponent ? 'block' : 'hidden'}`}>Loading...</div>
);
```

### PageContent Component

Root div uses `absolute w-full h-full` — NO `overflow-auto`, NO `overflow-y-auto`.

```tsx
export function MyPageContent({ ... }) {
    return (
        <div className="absolute w-full h-full p-4 flex flex-col ...">
            {/* content */}
        </div>
    );
}
```

## Rules

1. **ONE wrapper div** per page — `relative`, `w-full h-full`, `containerRef`, and visibility toggle all on the same element
2. **PageContent root**: `absolute w-full h-full` — never `h-auto`, never `overflow-auto`
3. **No `overflow-y-auto`** on any page or page content — WorkspaceBody handles all Y-axis scrolling
4. **ActionMenus** use `absolute` positioning inside the `relative` page wrapper — they scroll with the page automatically
5. **Never nest** two `h-full` wrapper divs — flatten into one

## Checklist for New Section Pages

- [ ] Page has a single wrapper div with `relative w-full h-full`
- [ ] `containerRef` is on the wrapper div (if using PopupsProvider)
- [ ] Visibility toggle (`block`/`hidden`) is on the wrapper div
- [ ] PageContent root div uses `absolute w-full h-full`
- [ ] No `overflow-auto` or `overflow-y-auto` on any element
- [ ] No extra nesting divs between the page wrapper and PopupsProvider
