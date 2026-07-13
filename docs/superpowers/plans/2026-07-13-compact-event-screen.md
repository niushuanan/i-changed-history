# Compact Event Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplify the event screen, make all visible language natural to Chinese players, and remove the direct-rewrite limit.

**Architecture:** Keep DeepSeek's structured action detail and causal memory intact while reducing what the event component renders. Make the reducer/storage contract unlimited, make era-language validation part of the AI schema repair path, and use CSS grid to place causal evidence after compact choices.

**Tech Stack:** React 19, TypeScript, Zod, Vitest, CSS, Playwright.

## Global Constraints

- Exactly 12 playable nodes and one protagonist lifetime.
- Three DeepSeek-generated choices plus one direct player rewrite path.
- Visible narrative prose remains AI-authored.
- The complete event remains usable without page scrolling at 390 x 844.

---

### Task 1: Plain Language and Unlimited Rewrite

**Files:** `src/game/deviation.ts`, `src/components/TimelineProgress.tsx`, `src/game/reducer.ts`, `src/services/storage.ts`, `src/App.tsx`, and their tests.

- [x] Write tests for `历史改变`, the five plain-language stages, a fourth custom rewrite, and unbounded stored usage.
- [x] Run the focused tests and confirm failures describe the old wording and three-use cap.
- [x] Remove the cap while retaining the internal usage counter and change the header copy.
- [x] Run focused tests until green.

### Task 2: Era-Appropriate Locations

**Files:** `src/game/prompts.ts`, `src/game/schema.ts`, `src/game/engine.ts`, and their tests.

- [x] Write tests proving a pre-1900 `议事厅` location is rejected and the static protocol instructs era-appropriate naming.
- [x] Run the focused tests and confirm the current candidate passes incorrectly.
- [x] Add the location rule to the prompt and contextual schema validation so DeepSeek repairs only `location`.
- [x] Run focused tests until green.

### Task 3: Compact Decision-First Layout

**Files:** `src/screens/TimelineEventScreen.tsx`, `src/components/ChoiceList.tsx`, `src/styles/game.css`, and component tests.

- [x] Write tests for hidden actor/deadline copy, unlimited rewrite command, no `因果回执`, and causal evidence after decisions.
- [x] Run focused tests and confirm they fail against the old component hierarchy.
- [x] Reorder the screen, reduce choice rows, and render one bottom causal strip.
- [x] Run focused tests until green.

### Task 4: Documentation and Visual Verification

**Files:** `AGENTS.md`, `PROJECT_CONTEXT.md`, `design-qa.md`.

- [x] Update durable product decisions and current project history.
- [x] Run all tests, typecheck, build, portability check, and `git diff --check`.
- [x] Capture and inspect matching event states at 390 x 844 and desktop scale; verify controls and console.
- [x] Record `final result: passed` only after no P0/P1/P2 layout issues remain.
- [x] Commit, push `main`, and verify local/remote SHA plus GitHub Actions.
