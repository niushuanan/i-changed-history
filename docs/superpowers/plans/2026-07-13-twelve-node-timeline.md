# Twelve-Node Timeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a stable twelve-node counterfactual timeline with eleven player decisions, progressive time jumps, richer scene imagery, and an iPhone 13 app layout.

**Architecture:** A new pure `timelinePlan` module owns authoritative node metadata and target years. The reducer, prompts, schema, storage, result UI, and tests consume that module instead of hard-coded five-chapter unions. Structured generation gains bounded automatic recovery plus a deterministic local fallback so gameplay never hard-stops on malformed model JSON.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Zod, DeepSeek V4 Flash, ImageGen raster assets.

## Global Constraints

- Exactly twelve nodes including opening and 2026 summary.
- Nodes 1-11 contain player decisions; node 12 is summary only.
- Time moves strictly forward and never exceeds 2026.
- The app surface is 390 × 844 and has no horizontal overflow.
- Every narrative node displays a raster scene image.
- Model structure failure must not route the player to a hard interruption screen.

---

### Task 1: Authoritative Twelve-Node Timeline

**Files:**
- Create: `src/game/timelinePlan.ts`
- Create: `src/game/timelinePlan.test.ts`
- Modify: `src/game/schema.ts`
- Modify: `src/test/fixtures.ts`

**Interfaces:**
- Produces: `DECISION_NODE_COUNT`, `TOTAL_NODE_COUNT`, `TimelineNode`, `getTimelinePlan(startYear)` and `getTimelineNode(chapter, startYear)`.

- [ ] Write failing tests asserting 12 nodes, 11 decision nodes, strict chronological order, 2026 ending, and adaptive compression for 1962/1989 starts.
- [ ] Run `npm test -- src/game/timelinePlan.test.ts` and verify RED.
- [ ] Implement timeline metadata and expand chapter schemas from 1-5 to 1-11.
- [ ] Run focused tests and typecheck.
- [ ] Commit `feat: add authoritative twelve-node timeline`.

### Task 2: Eleven-Decision State Machine and Storage

**Files:**
- Modify: `src/game/reducer.ts`
- Modify: `src/game/reducer.test.ts`
- Modify: `src/hooks/useGame.ts`
- Modify: `src/hooks/useGame.test.tsx`
- Modify: `src/services/storage.ts`
- Modify: `src/services/storage.test.ts`

**Interfaces:**
- Consumes: `DECISION_NODE_COUNT` and expanded chapter type.
- Produces: gameplay that requests chapters 1-11, then ending; v3 snapshots with up to 11 played turns.

- [ ] Update tests first for chapter 11 -> ending, 11 recorded choices, and v3 recovery.
- [ ] Run focused tests and verify RED.
- [ ] Replace hard-coded chapter unions and five-turn limits.
- [ ] Run focused tests and typecheck.
- [ ] Commit `feat: extend gameplay to eleven decisions`.

### Task 3: Stable Generation and Local Fallback

**Files:**
- Create: `src/game/fallbackTurn.ts`
- Create: `src/game/fallbackTurn.test.ts`
- Modify: `src/game/engine.ts`
- Modify: `src/game/prompts.ts`
- Modify: `src/game/prompts.test.ts`
- Modify: `src/services/deepseek.test.ts`
- Modify: `src/game/schema.ts`

**Interfaces:**
- Produces: three-stage validated generation and `createFallbackTurn(scenario, playedTurns, chapter)`.

- [ ] Write failing tests for a malformed initial response, malformed repair, successful regeneration, and all-invalid fallback.
- [ ] Run focused tests and verify RED.
- [ ] Add authoritative time-node payloads, tolerant unknown-field handling, bounded regeneration, and deterministic fallback.
- [ ] Verify the error screen is reserved for transport/authentication failures, not structure drift.
- [ ] Commit `fix: keep timeline playable through malformed AI output`.

### Task 4: Twelve-Node UI and Richer Scenes

**Files:**
- Modify: `src/components/TimelineProgress.tsx`
- Modify: `src/screens/TimelineEventScreen.tsx`
- Modify: `src/screens/ButterflyEchoScreen.tsx`
- Modify: `src/screens/AlternatePresentScreen.tsx`
- Modify: `src/components/ResultFrontPage.tsx`
- Modify: `src/data/visualAssets.ts`
- Modify: `src/styles/game.css`
- Add: `public/assets/stage-*.webp`
- Modify: `src/App.integration.test.tsx`

**Interfaces:**
- Consumes: timeline node metadata and stage images.
- Produces: compact 12-step rail, era-jump badges, chapter-specific imagery, and 12-node result archive.

- [ ] Generate and inspect four coherent stage images with ImageGen.
- [ ] Write failing integration assertions for 12 progress nodes, era-jump labeling, and no free text.
- [ ] Implement compact iPhone 13 layout and stage-aware image selection.
- [ ] Run integration tests and typecheck.
- [ ] Commit `feat: visualize twelve eras in an iPhone timeline`.

### Task 5: Real Gameplay QA and Delivery

**Files:**
- Modify: `AGENTS.md`
- Modify: `PROJECT_CONTEXT.md`
- Modify: `design-qa.md`
- Add: `design/captures/twelve-node-*.png`

**Interfaces:**
- Produces: verified local build, documented durable decisions, merged `main`, and pushed GitHub repository.

- [ ] Run full typecheck, test, build, and diff checks.
- [ ] Start the local server and test at 390 × 844.
- [ ] Create a profile, choose a card, and click through at least five real DeepSeek nodes.
- [ ] Verify each node advances time, carries previous echo, displays an image, and has three choices.
- [ ] Verify malformed-response recovery does not show a hard interruption screen.
- [ ] Update project docs and design QA, commit, merge to `main`, push, and keep the final app open.
