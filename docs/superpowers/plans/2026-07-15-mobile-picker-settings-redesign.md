# Mobile Picker Settings Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recreate the selected mobile-game history picker direction while preserving the synchronized timeline and consolidating filmstrip, grid, and audio controls into one settings menu.

**Architecture:** Keep `PickerContext` as the single source of truth for browsing mode, filters, and current seed. Move the selecting-phase audio control into `SeedPickerScreen` via explicit props, add a local accessible popover for display/audio preferences, and restyle the existing `HistoryCard` and grid without changing catalog data or gameplay transitions.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, Phosphor Icons, CSS.

## Global Constraints

- Target viewport is 390 × 844.
- Preserve the exact accessible product title `哎！我改变了历史？` and `/assets/brand/history-wordmark.png`.
- Preserve the current synchronized timeline, current seed, filters, and all 100 chronological cards.
- Keep coal, newsprint, vermilion, teal, and yellow visual tokens.
- Do not change history data, game rules, AI generation, persistence, or report screens.
- One final commit only, as requested.

---

### Task 1: Accessible settings menu and shared audio state

**Files:**
- Modify: `src/screens/SeedPickerScreen.tsx`
- Modify: `src/screens/SeedPickerScreen.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.integration.test.tsx`

**Interfaces:**
- `SeedPickerScreen` consumes `muted: boolean` and `onToggleMute: () => void`.
- The settings trigger exposes `aria-expanded`; the menu exposes filmstrip, grid, and audio actions.
- Mode changes continue to update the existing `PickerContext` without replacing `activeSeedId` or filters.

- [ ] **Step 1: Write failing tests**

Add tests proving the old three-button toolbar is absent, the settings trigger opens the secondary menu, filmstrip/grid selection preserves the active seed, Escape closes the menu, and the audio menu action calls the existing audio controller.

- [ ] **Step 2: Run tests and confirm RED**

Run: `npm test -- src/screens/SeedPickerScreen.test.tsx src/App.integration.test.tsx`

Expected: failures because the settings trigger and menu do not exist and audio is still a separate floating control.

- [ ] **Step 3: Implement the minimal behavior**

Add local `settingsOpen` state, an accessible settings button/menu, outside-click and Escape dismissal, and selecting-phase audio props. Keep the existing global sound button for active gameplay only.

- [ ] **Step 4: Run targeted tests and confirm GREEN**

Run: `npm test -- src/screens/SeedPickerScreen.test.tsx src/App.integration.test.tsx`

Expected: all targeted tests pass.

### Task 2: Selected mobile-game visual direction

**Files:**
- Modify: `src/components/HistoryCard.tsx`
- Modify: `src/styles/game.css`

**Interfaces:**
- `HistoryCard` continues to consume the same `HistorySeed` and `onSelect` callback.
- Existing local history images and the project wordmark remain the only visible raster assets.

- [ ] **Step 1: Add structural assertions before markup changes**

Extend the picker test to require a vertical year rail, a newsprint information sheet, complete role/decision/urgency rows, and the existing exact `闯入这一刻：<event>` action.

- [ ] **Step 2: Run the structural test and confirm RED**

Run: `npm test -- src/screens/SeedPickerScreen.test.tsx`

Expected: failure because the new mobile-game card anatomy is not present.

- [ ] **Step 3: Implement card anatomy and responsive CSS**

Recompose the card as an image-led scene with vertical date rail, overlapping newsprint sheet, three readable information rows, a high-emphasis bottom action, neighboring-card preview, and a denser two-column grid. Keep the timeline visible between header and content.

- [ ] **Step 4: Run targeted tests and confirm GREEN**

Run: `npm test -- src/screens/SeedPickerScreen.test.tsx src/App.integration.test.tsx`

Expected: all targeted tests pass.

### Task 3: Verification, design QA, project context, and commit

**Files:**
- Create: `design-qa.md`
- Modify: `PROJECT_CONTEXT.md`

**Interfaces:**
- The development server remains available at `http://127.0.0.1:4173/` for the user.

- [ ] **Step 1: Run full automated verification**

Run: `npm test && npm run typecheck && npm run build && npm run check:portability`

Expected: all commands exit 0.

- [ ] **Step 2: Run one real mobile experience check**

At 390 × 844, verify the filmstrip, timeline selection, settings menu, grid switch, search/filter controls, audio action, and entry into one historical moment. Check console errors once.

- [ ] **Step 3: Record design QA**

Compare the selected Image Gen reference with the rendered picker and save the evidence and disposition in `design-qa.md`. Any remaining differences must be intentional constraints or P3 polish before `final result: passed`.

- [ ] **Step 4: Update project context**

Record the task, changed files, rationale, and affected modules in `PROJECT_CONTEXT.md`.

- [ ] **Step 5: Commit**

Run: `git add src/screens/SeedPickerScreen.tsx src/screens/SeedPickerScreen.test.tsx src/components/HistoryCard.tsx src/styles/game.css src/App.tsx src/App.integration.test.tsx design-qa.md PROJECT_CONTEXT.md docs/superpowers/plans/2026-07-15-mobile-picker-settings-redesign.md && git commit -m "feat: redesign mobile history picker"`

Expected: one new local commit with no push.
