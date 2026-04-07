# Codex Sidebar Plan

## Goal

Add two constrained sidebars to Debugdle without changing puzzle, auth, or scoring logic.

- The existing `?` help panel should stop covering the full page and instead slide in from the right over only the last `1/4` to `1/3` of the viewport.
- A new left sidebar should open from a hamburger trigger and occupy the first `1/4` to `1/3` of the viewport.
- The main puzzle should remain visible and feel primary at all times.

## Product Framing

This is a focused daily puzzle experience with a terminal-editorial tone. The sidebars should feel like attached rails to the main interface, not modal takeovers. They should support orientation and utility while keeping the game board visually dominant.

## Aesthetic Direction

**Split-console editorial rails**

The sidebars should feel like two disciplined utility panels attached to the central puzzle surface. Use border, typography, and spacing to create hierarchy rather than blur-heavy or app-like drawer styling.

## Design System Rules

- Preserve the existing dark/light themes and overall typography.
- Keep the puzzle column visually dominant even when either sidebar is open.
- Use a small set of structural cues: border lines, muted labels, mono metadata, restrained accent usage.
- Motion should be brief and lateral: `180ms` to `240ms`, no bounce, no dramatic fades.
- Avoid heavy page dimming. If separation is needed, rely on the panel edge, a thin shadow, or a subtle surface shift on the rail itself.

## UX Targets

### Right Sidebar: How To Play

- Replace the current full-screen help overlay with a fixed right rail.
- Keep the existing help content and behavior conceptually unchanged.
- Width should target `25%` to `33%` of the viewport on desktop.
- The main page should remain fully visible behind or beside it, without becoming visually irrelevant.
- Keep an explicit close button and keyboard-accessible behavior.

### Left Sidebar: Main Utility Rail

- Add a hamburger trigger with 3 horizontal lines.
- Open a left rail that mirrors the right rail's sizing and motion language.
- Include:
  - `Changelog`
  - `About`
  - signed-in username anchored near the bottom
- If signed out, the bottom area should gracefully show a guest or sign-in state without changing auth behavior.

### Shared Sidebar Behavior

- Only one sidebar should be open at a time.
- Opening one closes the other.
- `Escape` closes the active sidebar.
- The main board remains mounted, visible, and unchanged.
- No puzzle-state reset or auth-flow change should happen when toggling sidebars.

## Implementation Plan

### 1. Consolidate Header Sidebar State

File:
- `components/Header.tsx`

Changes:
- Replace the single help-open boolean with a shared sidebar state:
  - `null`
  - `"left"`
  - `"help"`
- Add helpers to open the left rail, open the right rail, and close the active rail.
- Keep theme toggle and streak logic unchanged.

Why:
- This keeps sidebar control explicit and prevents both rails from being open simultaneously.

### 2. Add a Left-Side Trigger

File:
- `components/Header.tsx`

Changes:
- Add a hamburger button to the header.
- Style it as a peer to the existing theme/help controls.
- Place it so the header feels balanced and deliberate, not crowded.

Why:
- The left rail needs a clear, lightweight access point that matches the existing shell language.

### 3. Extract a Shared Sidebar Shell

Suggested files:
- `components/SidebarShell.tsx`
- `components/LeftSidebar.tsx`

Changes:
- Move repeated rail structure into a shared shell:
  - header row
  - close action
  - body
  - optional footer
- Render two variants from the shell:
  - left utility rail
  - right help rail

Why:
- Both panels should feel related and use the same motion, spacing rhythm, and structural rules.

### 4. Convert the Existing Help Overlay Into a Right Rail

Files:
- `components/Header.tsx`
- `app/globals.css`

Changes:
- Replace the full-screen `#how-to-play` overlay treatment with a right-anchored rail.
- Keep the instructional steps and copy logically unchanged.
- Retain accessible labeling and close affordances.

Why:
- This is the core UI change requested: help should stop taking over the entire page.

### 5. Build the Left Utility Rail

Suggested file:
- `components/LeftSidebar.tsx`

Changes:
- Add a top label such as `menu`.
- Add utility items for:
  - changelog
  - about
- Add a bottom user area:
  - signed-in display name if available
  - guest/sign-in text if not

Why:
- This establishes a durable app-shell pattern for lightweight product information and account context.

### 6. Reuse Existing Auth Display Logic Without Changing Auth Behavior

File:
- `components/AuthMenu.tsx`

Changes:
- Keep sign-in/sign-out logic as-is.
- If needed, extract or duplicate only the display-name derivation for the left rail.

Why:
- The user explicitly asked to keep logic unchanged. The left sidebar should read from existing auth state, not introduce new flows.

### 7. Add Shared Rail Styling

File:
- `app/globals.css`

Changes:
- Add rail tokens such as:
  - `--rail-w`
  - `--rail-bg`
  - `--rail-border`
- Create shared sidebar classes for:
  - rail container
  - left/right positioning
  - open/closed states
  - header/body/footer layout
  - rail close button
- Keep the current visual system: sharp borders, editorial spacing, restrained accent usage.

Why:
- The current CSS is already cohesive. The new rails should extend that system rather than introduce a second one.

### 8. Preserve Main-Content Dominance

Files:
- `app/page.tsx`
- `app/globals.css`

Changes:
- Keep the main app column and game board structure intact.
- Do not resize or remount the puzzle when a rail opens.
- If needed, slightly increase shell width logic later, but only if the current layout makes the sidebars feel cramped.

Why:
- The request is explicit that the main page should never go out of focus.

## Responsive Behavior

- Desktop:
  - rail width should be around `25%` to `33%` of the viewport
  - central puzzle remains visually dominant
- Tablet:
  - rail can expand modestly if necessary, such as `36vw` to `40vw`
- Mobile:
  - avoid full-screen takeover if possible
  - target a partial-width rail such as `82vw` to `88vw`, while preserving usability
- Focus styles and keyboard access must remain intact across breakpoints

## Interaction Details

- Hover:
  - rail triggers should shift border/text toward the accent color
- Focus:
  - preserve visible focus outlines consistent with the existing header controls
- Open:
  - rail slides laterally into place
- Close:
  - rail exits laterally with matching timing
- Content:
  - menu items should feel navigational and quiet, not card-heavy

## Constraint Check

Avoid the following:

- full-screen modal behavior
- strong backdrop dimming
- moving or shrinking the puzzle board on open
- changing puzzle logic, auth logic, or state persistence
- introducing generic SaaS drawer styling that breaks the current Debugdle tone

## Primary Files Likely Involved

- `components/Header.tsx`
- `components/AuthMenu.tsx`
- `app/globals.css`
- `app/page.tsx`
- `components/SidebarShell.tsx`
- `components/LeftSidebar.tsx`

## Acceptance Criteria

- Clicking `?` opens a right rail instead of a full-screen overlay.
- Clicking the hamburger opens a left rail.
- Only one rail can be open at once.
- The puzzle remains visible and visually primary at all times.
- Existing puzzle behavior, auth behavior, and theme behavior are unchanged.
