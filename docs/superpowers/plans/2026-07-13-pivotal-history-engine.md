# Pivotal History Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every generated chapter a consequential alternate-history turning point and make player-authored outcomes persist as irreversible world canon.

**Architecture:** Derive a deterministic `WorldCanon` and `PivotalBrief` from existing `PlayedTurn[]`, then include them as authoritative inputs to DeepSeek, parser validation, local fallback, and the compact event receipt. This avoids duplicate mutable state while keeping the model free to improvise within enforced causal boundaries.

**Tech Stack:** React 19, TypeScript, Vitest, Zod, DeepSeek structured JSON, existing reducer and prompt pipeline.

## Global Constraints

- Keep exactly 11 player decisions followed by the alternate 2026 summary.
- Player-authored completed outcomes are immutable facts and cannot be judged or reversed.
- Every decision chapter is a major turning point in the alternate timeline.
- Keep the active event screen within 390 x 844 without page scrolling.
- Preserve repair, regeneration, fallback, resume, provenance, profile ability, and three custom-action mechanics.

---

### Task 1: Deterministic World Canon

**Files:**
- Create: `src/game/worldCanon.ts`
- Create: `src/game/worldCanon.test.ts`
- Modify: `src/game/prompts.ts`
- Modify: `src/game/reducer.ts`

**Interfaces:**
- Produces: `buildWorldCanon(playedTurns): WorldCanon`
- Produces: `buildPivotalBrief(scenario, playedTurns, chapter): PivotalBrief`
- Extends: `PlayedTurn` with optional player-authored canon metadata.

- [ ] **Step 1: Write failing tests** proving emperor and technology declarations become immutable mandates and remain active for three subsequent chapters.
- [ ] **Step 2: Run** `npm test -- --run src/game/worldCanon.test.ts` and confirm missing-module failure.
- [ ] **Step 3: Implement** semantic mandate classification, immutable facts, active lifespan, scale progression, pivot-kind selection, and evidence words.
- [ ] **Step 4: Update reducer** so custom resolutions retain `playerAuthored`, `canonStatus`, and `causalMechanism` in `PlayedTurn`.
- [ ] **Step 5: Run** `npm test -- --run src/game/worldCanon.test.ts src/game/reducer.test.ts` and confirm green.

### Task 2: Pivotal Structured Contract

**Files:**
- Modify: `src/game/schema.ts`
- Modify: `src/game/schema.test.ts`
- Modify: `src/game/prompts.ts`
- Modify: `src/game/prompts.test.ts`
- Modify: `src/game/engine.ts`

**Interfaces:**
- Adds: `turningPointStakes`, `worldStateChange`, `divergenceProof` to `TimelineTurn`.
- Consumes: `WorldCanon` and `PivotalBrief` in continuation messages.

- [ ] **Step 1: Write failing tests** requiring the three significance fields and authoritative custom canon in continuation payloads.
- [ ] **Step 2: Run** the schema and prompt tests and confirm failures identify missing contract fields.
- [ ] **Step 3: Extend schema normalization and contracts** with concise field limits.
- [ ] **Step 4: Replace random-topic prompt instructions** with the pivotal brief, while retaining geographic freedom and generational identity relay.
- [ ] **Step 5: Validate** that generated causal ledger includes the previous chapter and active recent custom canon chapter.
- [ ] **Step 6: Run** schema, prompt, and engine tests.

### Task 3: Consequential Fallback

**Files:**
- Modify: `src/game/fallbackTurn.ts`
- Modify: `src/game/fallbackTurn.test.ts`

**Interfaces:**
- Consumes: `buildWorldCanon` and `buildPivotalBrief`.
- Produces: schema-valid consequential fallback turns.

- [ ] **Step 1: Write a failing test** proving a custom emperor outcome creates a regime-level succession turning point rather than a generic social-carrier scene.
- [ ] **Step 2: Run** the focused fallback test and confirm it fails against the generic templates.
- [ ] **Step 3: Replace generic relay scenes** with pivot-kind-specific decisive roles, places, stakes, and options.
- [ ] **Step 4: Preserve the exact latest decision** in `worldStateChange` and required causal ledger entries.
- [ ] **Step 5: Run** fallback and reducer tests.

### Task 4: Compact Divergence Receipt

**Files:**
- Modify: `src/screens/TimelineEventScreen.tsx`
- Modify: `src/screens/TimelineEventScreen.test.tsx`
- Modify: `src/styles/game.css`

**Interfaces:**
- Consumes: the three new `TimelineTurn` significance fields.

- [ ] **Step 1: Write a failing component test** for `你的决定`, `已经改变`, `重大节点`, and divergence proof.
- [ ] **Step 2: Run** the focused screen test and confirm the new receipt is absent.
- [ ] **Step 3: Implement** the compact three-step causal receipt without adding cards or page sections.
- [ ] **Step 4: Tighten CSS** so all three choices and custom action remain visible at 390 x 844.
- [ ] **Step 5: Run** the focused screen test.

### Task 5: Verification and Delivery

**Files:**
- Modify: `AGENTS.md`
- Modify: `PROJECT_CONTEXT.md`

**Interfaces:** None.

- [ ] **Step 1: Run** `npm test -- --run` and require all tests to pass.
- [ ] **Step 2: Run** `npm run typecheck` and `npm run build`.
- [ ] **Step 3: Use a real browser at 390 x 844** to play a custom emperor or technology path through at least two generated continuation nodes and inspect visible causality, scrolling, console errors, and DeepSeek provenance.
- [ ] **Step 4: Record durable product decisions** in `AGENTS.md` and implementation evidence in `PROJECT_CONTEXT.md`.
- [ ] **Step 5: Commit and push** the implementation to `origin/main`.

