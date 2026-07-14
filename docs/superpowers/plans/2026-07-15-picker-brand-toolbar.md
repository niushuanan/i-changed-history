# Picker Brand Toolbar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the picker header's weak text hierarchy with a transparent artistic wordmark and one consistently sized control cluster.

**Architecture:** Keep mode state in `SeedPickerScreen` and audio state in `App`; coordinate them visually through shared header sizing and existing absolute shell placement instead of coupling their behavior. Store the generated alpha PNG under `public/assets/brand/` and expose it through a semantic `h1 > img`.

**Tech Stack:** React, TypeScript, CSS, Vitest, Testing Library, ImageGen, PNG alpha post-processing.

## Global Constraints

- Change only the picker header visual design.
- Exact visible brand text is `哎！我改变了历史？`.
- Keep the coal, newsprint, vermilion, teal, and yellow visual system.
- Preserve mode, audio, filters, timeline, cards, and game behavior.
- Every interactive target is at least 44px high.

---

### Task 1: Produce the brand wordmark asset

**Files:**
- Create: `public/assets/brand/history-wordmark.png`

**Interfaces:**
- Produces: transparent PNG consumed at `/assets/brand/history-wordmark.png`.

- [ ] Generate the exact wordmark on a flat chroma-key background with the built-in ImageGen tool.
- [ ] Remove the chroma key with the installed `remove_chroma_key.py` helper.
- [ ] Verify alpha corners, visible subject coverage, absence of key-color fringe, and exact readable text.

### Task 2: Lock the semantic header behavior with tests

**Files:**
- Modify: `src/screens/SeedPickerScreen.test.tsx`
- Modify: `src/App.integration.test.tsx`

**Interfaces:**
- Consumes: existing `SeedPickerScreen` mode callbacks and `App` audio control.
- Produces: regression coverage for the image wordmark, removed subtitle, and shared control labels.

- [ ] Add a test expecting an `h1` named `哎！我改变了历史？` containing `/assets/brand/history-wordmark.png` and no subtitle.
- [ ] Add or tighten the shell test so the mode group and audio button remain independently operable.
- [ ] Run the focused tests and confirm failure because the old text heading/subtitle are still present.

### Task 3: Implement the header and unified toolbar styling

**Files:**
- Modify: `src/screens/SeedPickerScreen.tsx`
- Modify: `src/styles/game.css`

**Interfaces:**
- Consumes: `/assets/brand/history-wordmark.png`.
- Produces: `.seed-picker__wordmark` and aligned 44px mode/audio controls.

- [ ] Replace the text title and subtitle with `h1 > img` using exact alt text.
- [ ] Rebuild the header as a single-row grid with a constrained wordmark slot and right-side mode group.
- [ ] Align `.sound-toggle` to the same 44px top baseline, radius, border, background, hover, and focus-visible treatment.
- [ ] Add a narrow-screen rule that reduces wordmark width without wrapping controls.
- [ ] Run focused tests and confirm they pass.

### Task 4: Visual QA and release

**Files:**
- Modify: `design-qa.md`
- Modify: `AGENTS.md`
- Modify: `PROJECT_CONTEXT.md`

**Interfaces:**
- Consumes: source screenshot and browser-rendered implementation screenshot.
- Produces: a passed design QA record and durable project decision.

- [ ] Run the full test suite, typecheck, production build, portability check, and `git diff --check`.
- [ ] Open the local product, capture the same picker state, and test filmstrip/grid and audio once.
- [ ] Compare the source and implementation at the same header crop; fix every P0/P1/P2 mismatch.
- [ ] Record the final design decision and current task in `AGENTS.md` and `PROJECT_CONTEXT.md`.
- [ ] Commit and push `main`, then verify the remote SHA matches local HEAD.
