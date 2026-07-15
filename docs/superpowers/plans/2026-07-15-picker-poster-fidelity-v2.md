# Picker Poster Fidelity V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the mobile filmstrip timeline and history card so the rendered 390 × 844 picker matches the selected archival-poster reference instead of reading as two stacked rectangles.

**Architecture:** Preserve `SeedPickerScreen`, `PickerContext`, 100 seeds, grid mode, and selection behavior. Change only the filmstrip DOM hooks and CSS geometry, plus two ImageGen-backed raster surfaces for the ragged dossier and action slab.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, CSS, Phosphor Icons, built-in ImageGen, Sharp.

## Global Constraints

- Source visual truth: `/var/folders/dt/4fn7m4f50ls_8jkk9vzhsxh80000gn/T/codex-clipboard-d895be3b-33c6-4890-bbcb-2dd026d1ac4a.png`.
- Target viewport: 390 × 844; resilience widths: 320/350/360px at 700px height.
- Keep the exact wordmark, one 44px settings button, 100-card catalog, search/filter grid, current-node context, and gameplay entry behavior.
- Do not modify history data, AI generation, persistence, active gameplay, or final reports.
- No visible picker copy below 11px.
- Commit the final verified version; do not push unless separately requested.

---

### Task 1: Generate the missing physical surfaces

**Files:**
- Create: `public/assets/picker/dossier-ragged-v3.png`
- Create: `public/assets/picker/action-slab-v3.png`

**Interfaces:**
- The dossier PNG supplies only a warm paper texture and irregular alpha edge.
- The action PNG supplies only a vermilion distressed slab and irregular alpha edge.

- [x] Generate each flat asset with built-in ImageGen on a solid chroma-key background.
- [x] Remove the key using the installed ImageGen helper with soft matte and despill.
- [x] Inspect alpha corners, edge halos, embedded text, objects, shadows, and contrast.

### Task 2: Lock the timeline and poster contract with TDD

**Files:**
- Modify: `src/screens/SeedPickerScreen.test.tsx`
- Modify: `src/screens/SeedPickerScreen.tsx`
- Modify: `src/components/HistoryCard.tsx`

**Interfaces:**
- `.history-time__axis` is a dedicated decorative line behind the timeline nodes.
- `.history-card__poster-stack` groups the scene and overlapping dossier into one visual object.

- [x] Add tests asserting one dedicated timeline axis, poster stack containment, full-width dossier inside the stack, and action as the stack's following sibling.
- [x] Run `npm test -- src/screens/SeedPickerScreen.test.tsx` and observe RED because those hooks do not exist.
- [x] Add the minimal semantic wrappers without changing selection behavior.
- [x] Re-run the targeted test and observe GREEN.

### Task 3: Match the reference proportions

**Files:**
- Modify: `src/styles/game.css`

**Interfaces:**
- Filmstrip exposes `--history-card-width: clamp(252px, 75.4vw, 294px)`.
- At 390px, scene height is approximately 378px, year rail 50px, dossier overlaps 24px, and action is 68px.

- [x] Center a long fixed visual axis and place node centers exactly on it with labels below.
- [x] Convert the card to a continuous poster stack: tall scene, same-width dossier, ragged paper, compact natural content height.
- [x] Apply the generated action slab to the slightly inset primary action.
- [x] Preserve short-screen page scrolling and all neighboring previews.

### Task 4: Design QA and responsive repair

**Files:**
- Create: `design/captures/2026-07-15-picker-poster-v2-390x844.png`
- Create: `design/captures/2026-07-15-picker-poster-v2-comparison.png`
- Create: `design/captures/2026-07-15-picker-poster-v2-focus.png`
- Modify: `design-qa.md`

**Interfaces:**
- The comparison image places normalized source and implementation side by side.

- [x] Capture the same first-card state at 390 × 844 in the in-app browser.
- [x] Compare full view and focused poster regions; fix every P0/P1/P2 mismatch.
- [x] Audit 320/350/360 × 700 for horizontal overflow, clipped facts, and CTA reachability.
- [x] Record the passed evidence in `design-qa.md`.

### Task 5: Documentation, verification, and commit

**Files:**
- Modify: `AGENTS.md`
- Modify: `PROJECT_CONTEXT.md`

- [x] Record the durable long-axis and same-width poster/dossier decision in `AGENTS.md`.
- [x] Record changed files, rationale, affected modules, asset prompts, and QA evidence in `PROJECT_CONTEXT.md`.
- [x] Run `npm test && npm run typecheck && npm run build && npm run check:portability && git diff --check`.
- [x] Stage task files and commit with `fix: match archival picker poster reference`.
