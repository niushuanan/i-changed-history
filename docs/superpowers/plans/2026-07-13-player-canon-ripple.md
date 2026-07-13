# Player Canon and Ripple Routing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make free-text outcomes authoritative, force later chapters to fan out across different social carriers, and turn each personality dilemma into a four-choice game decision.

**Architecture:** Add a pure `rippleRouter` domain module that deterministically assigns each continuation a non-repeating social lens. Extend the structured turn contract with `rippleLens` and `causalBridge`, and replace custom-action adjudication with a player-canon result contract. Keep state orchestration and the three-use counter intact while upgrading saved sessions to v7.

**Tech Stack:** React 19, TypeScript, Vitest, Zod, DeepSeek JSON mode, Vite.

## Global Constraints

- A player-declared result is canon and can never be weakened, rejected, or rewritten as an attempt.
- A complete run remains 11 decisions plus the alternate 2026 summary.
- The three custom-result uses and all 50 chronological history cards remain available.
- A continuation must use the client-selected ripple lens and may remain in the same country.
- Every personality dilemma has exactly four choices and remains usable at 390 x 844.
- Existing v6 sessions migrate without losing active requests or completed decisions.

---

### Task 1: Four-choice personality calibration

**Files:**
- Modify: `src/game/profile.ts`
- Modify: `src/game/profile.test.ts`
- Modify: `src/screens/TravelerProfileScreen.tsx`
- Modify: `src/screens/TravelerProfileScreen.test.tsx`
- Modify: `src/styles/game.css`

**Interfaces:**
- Produces: `PERSONALITY_QUESTIONS`, where every `options` tuple contains four entries labelled A-D and each entry maps to one personality dimension value.
- Preserves: `buildTravelerProfile(dimensions)` and `getTravelerAbility(profile)`.

- [ ] Write tests asserting four questions, four options per question, and a complete INTP calibration using one option from each question.
- [ ] Run `npm test -- --run src/game/profile.test.ts src/screens/TravelerProfileScreen.test.tsx` and verify the old two-option contract fails.
- [ ] Expand the question data and render four compact choice rows without exposing I/E/S/N/T/F/J/P before the result.
- [ ] Run the targeted tests and verify they pass.

### Task 2: Deterministic ripple router

**Files:**
- Create: `src/game/rippleRouter.ts`
- Create: `src/game/rippleRouter.test.ts`
- Modify: `src/game/schema.ts`
- Modify: `src/game/schema.test.ts`
- Modify: `src/test/fixtures.ts`

**Interfaces:**
- Produces: `RippleLens`, `RIPPLE_LENSES`, and `selectRippleDirective(scenario, playedTurns, chapter)` returning `{ lens, label, instruction }`.
- Extends: `TimelineTurn` with `rippleLens` and `causalBridge`.

- [ ] Write tests proving chapters 2-11 never reuse either of the previous two lenses and the same history returns the same lens.
- [ ] Run `npm test -- --run src/game/rippleRouter.test.ts src/game/schema.test.ts` and verify missing router/fields fail.
- [ ] Implement stable hashing, recent-lens exclusion, Chinese labels, and schema fields bounded for the event page.
- [ ] Update the shared turn fixture and run the targeted tests to green.

### Task 3: Player-canon custom result contract

**Files:**
- Modify: `src/game/schema.ts`
- Modify: `src/game/schema.test.ts`
- Modify: `src/game/prompts.ts`
- Modify: `src/game/prompts.test.ts`
- Modify: `src/game/engine.ts`
- Modify: `src/game/fallbackTurn.ts`
- Modify: `src/services/deepseek.test.ts`

**Interfaces:**
- Replaces custom resolution fields with `declaredOutcome`, `canonStatus`, `personalityLens`, `causalMechanism`, `deviationClass`, and `instantEcho`.
- Guarantees `declaredOutcome` preserves the player's success claim and `canonStatus === "玩家钦定"`.

- [ ] Write parsing, prompt, real transport-mock, and fallback tests using `我暗杀了皇帝且成功`.
- [ ] Run the targeted tests and verify the old feasibility-adjudication behavior fails.
- [ ] Replace the prompt contract; validate exact declared outcome and personality code in the engine; make fallback preserve the input verbatim.
- [ ] Run the targeted tests to green.

### Task 4: Force routed continuation and expose the butterfly turn

**Files:**
- Modify: `src/game/prompts.ts`
- Modify: `src/game/prompts.test.ts`
- Modify: `src/game/engine.ts`
- Modify: `src/game/fallbackTurn.ts`
- Modify: `src/game/fallbackTurn.test.ts`
- Modify: `src/screens/TimelineEventScreen.tsx`
- Modify: `src/styles/game.css`

**Interfaces:**
- Continuation parser receives an expected `RippleLens` and rejects a model-selected different lens.
- Event UI displays `causalBridge` as `蝴蝶转向` in the causal receipt.

- [ ] Write tests asserting the continuation prompt contains the routed lens and the parser overwrites or rejects a mismatched lens.
- [ ] Run the targeted tests and verify failure.
- [ ] Thread `selectRippleDirective` through continuation prompt, parser, fallback turn, and event UI.
- [ ] Run targeted tests and verify three consecutive turns use different carriers.

### Task 5: Rename the fourth path and preserve state

**Files:**
- Modify: `src/game/reducer.ts`
- Modify: `src/game/reducer.test.ts`
- Modify: `src/hooks/useGame.test.tsx`
- Modify: `src/screens/TimelineEventScreen.tsx`
- Modify: `src/screens/TimelineEventScreen.test.tsx`
- Modify: `src/screens/ButterflyEchoScreen.tsx`
- Modify: `src/App.integration.test.tsx`

**Interfaces:**
- UI command becomes `直接改写结果` and preserves three uses.
- Echo state exposes `canonStatus`, `personalityLens`, and `causalMechanism`.

- [ ] Write reducer and screen tests asserting the declared result is the selected history text and the echo says `玩家钦定`.
- [ ] Run the tests and verify old `受限执行/第四条路` copy fails.
- [ ] Update reducer mappings and compact mobile copy.
- [ ] Run targeted tests to green.

### Task 6: v7 save migration and full verification

**Files:**
- Modify: `src/services/storage.ts`
- Modify: `src/services/storage.test.ts`
- Modify: `AGENTS.md`
- Modify: `PROJECT_CONTEXT.md`

**Interfaces:**
- `GAME_STORAGE_KEY` becomes `i-changed-history:session:v7`.
- v6 turns receive a deterministic legacy `rippleLens` and a concise legacy `causalBridge` during migration.

- [ ] Write v6 active-event and active-custom-request migration tests.
- [ ] Run storage tests and verify failure before migration exists.
- [ ] Implement v6 migration without changing profile, request IDs, custom usage, current turn, or played decisions.
- [ ] Run `npm test`, `npm run typecheck`, `npm run build`, and `git diff --check`.
- [ ] Use Playwright at 390 x 844 and 390 x 650 to click all four personality questions, submit a successful assassination result, and inspect the routed next chapter.
- [ ] Request independent code review, fix all Important findings, update project documentation, commit, and push `main`.
