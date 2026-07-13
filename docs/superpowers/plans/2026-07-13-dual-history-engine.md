# Dual History Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace seven generic fallback templates with model-owned open historical inference and run a real personality-driven parallel timeline that ends in a second pageable 2026 report.

**Architecture:** Keep identity, time, player decisions, and validation client-owned. Generate the player and instinct branches with independent histories through concurrent DeepSeek calls; store both branches in the reducer and v10 snapshot. Render only the player branch during play and reveal the instinct branch through a second result page.

**Tech Stack:** React 19, TypeScript, Vitest, Zod, DeepSeek chat completions, localStorage v10.

## Global Constraints

- Exactly twelve playable decisions per branch and one posthumous 2026 report per branch.
- No predefined plot categories or generic local playable scenes.
- Every visible choice is an executable historical action, not an abstract strategy label.
- Do not display MBTI letter codes during play.
- Preserve refresh recovery, direct-write canon, music, and 390 x 844 event usability.

---

### Task 1: Concrete Historical Output Contract

**Files:** `src/game/schema.ts`, `src/game/schema.test.ts`, `src/game/prompts.ts`, `src/game/prompts.test.ts`, `src/game/engine.ts`, `src/game/engine.test.ts`

- [ ] Add `historicalAnchors` to every turn and reject abstract choice labels.
- [ ] Replace pivotal-category instructions with open historical inference instructions.
- [ ] Validate era anchors, causal continuity, concrete choices, and player canon without prescribing the next topic.
- [ ] Remove silent generic fallback from opening, continuation, and ending generation.
- [ ] Run focused schema, prompt, and engine tests.

### Task 2: Deterministic Instinct Selection and Dual State

**Files:** `src/game/instinctTimeline.ts`, `src/game/instinctTimeline.test.ts`, `src/game/reducer.ts`, `src/game/reducer.test.ts`, `src/test/fixtures.ts`

- [ ] Select exactly the branch choice marked `usesTravelerStrength`, with a deterministic concrete fallback.
- [ ] Extend state with instinct current turn, played turns, deviation, pending turn, and result.
- [ ] Commit player and instinct choices atomically for ordinary and direct-write actions.
- [ ] Resolve next-turn and ending pairs atomically and preserve retry semantics.
- [ ] Run reducer and instinct tests.

### Task 3: Concurrent Model Orchestration and Storage

**Files:** `src/game/engine.ts`, `src/hooks/useGame.ts`, `src/hooks/useGame.test.tsx`, `src/services/storage.ts`, `src/services/storage.test.ts`

- [ ] Add `generateNextTurnPair` and `generateEndingPair` using concurrent independent model calls.
- [ ] Pass separate player and instinct histories to the two requests.
- [ ] Upgrade snapshot storage to v10 and migrate v9 sessions safely to profile plus picker.
- [ ] Verify retry and refresh issue one pair request and never save a half-resolved pair.
- [ ] Run hook and storage tests.

### Task 4: Event Page Reduction and Personality Removal

**Files:** `src/screens/TimelineEventScreen.tsx`, `src/components/ChoiceList.tsx`, `src/styles/game.css`, corresponding tests, `src/App.tsx`

- [ ] Remove fixed event-copy/change-proof heights and compress the scene.
- [ ] Replace the multi-row proof panel with one concise causal receipt.
- [ ] Remove visible type code, archetype label, and nudge/reform/rupture labels.
- [ ] Keep three concrete action rows and direct write within 390 x 844.
- [ ] Verify actual layout and controls in Playwright.

### Task 5: Two Pageable Reports

**Files:** `src/screens/AlternatePresentScreen.tsx`, `src/components/ResultFrontPage.tsx`, `src/styles/game.css`, corresponding tests, `src/App.tsx`

- [ ] Render player and instinct reports as two pages with explicit previous/next controls.
- [ ] Label pages “你亲手选择的世界” and “如果你始终听从第一反应”.
- [ ] Export whichever report page is currently visible.
- [ ] Verify report paging and both deviations.

### Task 6: Documentation, Full Verification, Commit, and Push

**Files:** `AGENTS.md`, `PROJECT_CONTEXT.md`

- [ ] Record the open-inference and dual-timeline durable product rules.
- [ ] Run typecheck, full Vitest suite, production build, diff check, and secret scan.
- [ ] Execute a real Dong Zhuo flow and confirm DeepSeek provenance, Three Kingdoms anchors, concrete actions, no blank band, and no console errors.
- [ ] Commit and push `main`; verify local and remote SHA match.

