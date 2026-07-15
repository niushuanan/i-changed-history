# Mobile Picker Fidelity Repair Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the filmstrip picker so its 390 × 844 rendered hierarchy faithfully matches the selected third visual: a full-screen archival stage, dominant cinematic history poster, integrated year banner, separate readable dossier, separate vermilion action slab, and subdued neighboring-card previews.

**Architecture:** Keep the existing 100-card catalog, `PickerContext`, synchronized timeline, settings menu, and gameplay transition unchanged. Replace the failed visual shell with a responsive poster layout driven by CSS custom properties and three project-owned raster materials: an archival stage backdrop, neutral paper texture, and vermilion fabric texture. Existing event-accurate history images remain the per-card semantic source, but receive one consistent crop, sepia grade, vignette, and archival overlay so maps, paintings, and photographs belong to one visual system.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, CSS, Phosphor Icons, built-in ImageGen raster assets.

## Global Constraints

- The selected visual truth is `/var/folders/dt/4fn7m4f50ls_8jkk9vzhsxh80000gn/T/codex-clipboard-9828c765-592d-4124-b343-2fba75e81141.png`.
- Target viewport is 390 × 844, with a usable short-screen fallback down to 390 × 700.
- Preserve the exact accessible title `哎！我改变了历史？`, `/assets/brand/history-wordmark.png`, and the synchronized time axis above the filmstrip.
- Filmstrip, grid, and audio remain inside the existing settings secondary menu.
- Preserve all 100 chronological cards, current-node context, filters, search, gameplay entry, and local event assets.
- No information may be placed over a photographic texture; the dossier must remain readable at a minimum visible size of 12px.
- The primary action must remain visible without hiding card copy; short screens may scroll the picker in normal document flow.
- Do not change history data, gameplay rules, AI generation, persistence, or report screens.
- Run one complete real gameplay experience only, after visual QA.
- Commit and push the final verified state once.

---

### Task 1: Lock the repaired card contract with failing tests

**Files:**
- Modify: `src/screens/SeedPickerScreen.test.tsx`
- Modify: `src/components/HistoryCard.tsx`

**Interfaces:**
- `HistoryCard` continues to accept `{ seed: HistorySeed; onSelect: () => void }`.
- The card exposes `history-card-scene`, `history-card-year-rail`, `history-card-dossier`, and `history-card-action` test surfaces.
- The year rail exposes separate era, numeric year, and suffix elements so the number can carry the target hierarchy without mechanical whole-string vertical writing.

- [x] **Step 1: Write failing assertions**

Assert that the first card has a scene, a dossier independent from the action, separate year parts, four complete facts, and no use of `tone-print.webp` in the card surface.

- [x] **Step 2: Verify RED**

Run: `npm test -- src/screens/SeedPickerScreen.test.tsx`

Expected: FAIL because the current card has one combined brief/action block and one mechanically vertical date string.

- [x] **Step 3: Implement the semantic anatomy**

Split the year display into era/number/suffix, keep the event image and four fact rows, move the action outside the dossier, and retain the exact accessible action name.

- [x] **Step 4: Verify GREEN**

Run: `npm test -- src/screens/SeedPickerScreen.test.tsx`

Expected: PASS.

### Task 2: Produce the missing raster materials

**Files:**
- Create: `public/assets/picker/archive-stage-v2.webp`
- Create: `public/assets/picker/dossier-paper-v2.webp`
- Create: `public/assets/picker/vermilion-cloth-v2.webp`

**Interfaces:**
- The stage asset is a portrait, text-free black archival collage with faint maps, type, thread lines, and open central contrast.
- The dossier asset is a low-contrast warm paper field with no objects, letters, dark focal points, or baked UI.
- The vermilion asset is a low-contrast worn red textile/paper field with no letters or symbols.

- [x] **Step 1: Generate each asset with built-in ImageGen**

Use the selected screenshot only as an art-direction reference. Generate each asset separately at a composition appropriate to its consuming slot.

- [x] **Step 2: Inspect and reject polluted outputs**

Open every output and reject any asset with legible text, people, objects, UI controls, watermarks, or contrast that would compete with content.

- [x] **Step 3: Copy accepted assets into the project and optimize**

Use `sharp` to create project-owned WebP files and verify dimensions and file type.

### Task 3: Rebuild the filmstrip as a responsive poster stage

**Files:**
- Modify: `src/styles/game.css`
- Modify: `src/styles.css`
- Modify: `src/components/HistoryCard.tsx`

**Interfaces:**
- The filmstrip uses available block size rather than the former fixed 658px rail.
- At 390 × 844 the active poster dominates, while both adjacent cards remain subdued slivers.
- At short heights the page scrolls normally from wordmark through CTA; no persistent content is clipped.

- [x] **Step 1: Replace fixed-height arithmetic**

Use a three-row grid for header, timeline, and flexible filmstrip. Define poster sizes with `clamp()` and viewport-relative custom properties; remove the old `92 + 94 + 658` dependency.

- [x] **Step 2: Match the selected composition**

Implement the large hero scene, textured year banner, overlapping but independent paper dossier, detached vermilion action slab, dark neighboring previews, and archival screen backdrop.

- [x] **Step 3: Normalize event imagery**

Apply consistent sepia/saturation/contrast grading, vignette, and subtle archive overlay without hiding image meaning or introducing a second unrelated photograph.

- [x] **Step 4: Preserve interaction and accessibility**

Maintain 44px settings target, complete focus states, horizontal snap, time-axis synchronization, and readable text at 200% zoom.

### Task 4: Visual comparison and iterative repair

**Files:**
- Modify: `design-qa.md`
- Create: `design/captures/2026-07-15-picker-fidelity-390x844.png`
- Create: `design/captures/2026-07-15-picker-fidelity-short.png`
- Create: `design/captures/2026-07-15-picker-fidelity-comparison.png`

**Interfaces:**
- Full-view comparison combines the selected reference and rendered 390 × 844 implementation in one image.
- Focused comparison covers year banner, dossier typography, and CTA.

- [x] **Step 1: Start the local product and capture 390 × 844**

Open the current filmstrip, settings menu, and grid; capture the source-matched filmstrip state.

- [x] **Step 2: Capture short-height resilience**

Use 390 × 700 and confirm the title, time axis, facts, and action remain reachable without clipping.

- [x] **Step 3: Compare and iterate**

Fix every P0/P1/P2 mismatch in typography, spacing, color, imagery, responsive behavior, content, and icon treatment. Repeat captures until `design-qa.md` says exactly `final result: passed`.

### Task 5: Verification, documentation, commit, and push

**Files:**
- Modify: `PROJECT_CONTEXT.md`
- Modify: `AGENTS.md` only if a new durable product decision is discovered.

- [x] **Step 1: Run automated verification**

Run: `npm test && npm run typecheck && npm run build && npm run check:portability && git diff --check`

Expected: every command exits 0.

- [x] **Step 2: Run exactly one complete real experience**

At 390 × 844, exercise the filmstrip and time axis, open settings, switch to grid and back, select one historical moment, complete all 12 decisions, reach both ending reports, and check the browser console.

- [x] **Step 3: Update project context**

Record the changed files, visual repair, rationale, affected modules, generated asset provenance, visual QA evidence, and real-run result.

- [x] **Step 4: Commit and push**

Stage only task files, create one new commit, push the current branch to its configured GitHub remote, and verify the remote branch contains the new commit.
