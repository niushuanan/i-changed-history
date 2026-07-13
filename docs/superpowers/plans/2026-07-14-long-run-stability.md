# Long-run Stability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development for every production behavior and superpowers:verification-before-completion before delivery.

**Goal:** Make at least nine of ten real DeepSeek runs reach the two-page ending when every run contains twelve decisions and four to five unique player-authored outcomes.

**Architecture:** Separate immutable lifetime history from the at-most-three active player mandates that must affect the current scene. Let the client inject continuity fields, retain one coherent DeepSeek scene request, add sanitized generation diagnostics, and use at most one final evidence-guided recovery after field repair.

**Tech Stack:** React 19, TypeScript, Zod, Vitest, DeepSeek V4 Flash SSE/JSON mode, Vite environment loading.

## Global Constraints

- Every playable continuation and both ending reports remain DeepSeek-authored.
- A player-authored outcome is irreversible and remains verbatim in the complete life history and ending inputs.
- Only outcomes from the preceding three chapters occupy the current active mandate ledger.
- No local generic scene or report may be fabricated to improve the measured pass rate.
- The real soak suite is opt-in and never runs as part of ordinary `npm test`.
- Every completed repository change is committed and pushed to `origin/main`.

---

### Task 1: Active player canon window

**Files:**
- Modify: `src/game/worldCanon.ts`
- Modify: `src/game/worldCanon.test.ts`
- Modify: `src/game/narrativeContext.ts`
- Modify: `src/game/narrativeContext.test.ts`

- [ ] Add failing tests proving five lifetime rewrites remain immutable while a requested chapter receives at most the previous three active rewrites.
- [ ] Add a chapter-aware `activePlayerCanon` context with exact source text, propagation mechanism and active-through chapter.
- [ ] Keep all earlier rewrites in `playerCanon` for anti-contradiction and endings.
- [ ] Run the four narrow tests and verify green.

### Task 2: Client-owned active ledger and prompt contract

**Files:**
- Modify: `src/game/prompts.ts`
- Modify: `src/game/prompts.test.ts`
- Modify: `src/game/schema.ts`
- Modify: `src/game/schema.test.ts`
- Modify: `src/game/engine.ts`
- Modify: `src/services/deepseek.test.ts`

- [ ] Add failing prompt tests that reject the old “all player canon in a three-item ledger” instruction and expose only active mandates as exact current obligations.
- [ ] Add failing parser tests proving active mandates replace stale model ledger entries without changing AI-authored scene prose.
- [ ] Inject active mandates through authoritative parse options and cap the merged ledger at three entries.
- [ ] Remove the all-history exact-ledger loop while retaining immutable history in the prompt.
- [ ] Relax only brittle formatting constraints that do not protect history quality; keep concrete actions, historical anchors and protagonist continuity strict.
- [ ] Run prompt, schema and transport tests and verify green.

### Task 3: Diagnostic and bounded recovery

**Files:**
- Modify: `src/game/engine.ts`
- Modify: `src/services/deepseek.test.ts`

- [ ] Add failing tests for sanitized primary-validation, field-repair and final-recovery diagnostics.
- [ ] Expose diagnostic events through `GenerationOptions` without persisting raw model output.
- [ ] After a failed field repair, make one compact full recovery request containing the latest precise errors and authoritative context.
- [ ] Prove three invalid model responses still throw a retryable `StructuredGenerationError` and never fabricate a scene.

### Task 4: Ending canon de-duplication

**Files:**
- Modify: `src/game/prompts.ts`
- Modify: `src/game/engine.ts`
- Modify: `src/services/deepseek.test.ts`

- [ ] Add a failing test with five long player-authored choices whose biography consequences do not repeat the choice verbatim.
- [ ] Keep exact choices client-owned in `historyTimeline.playerChoice` and require AI consequences to describe downstream effects without mechanically repeating them.
- [ ] Retain complete custom canon in the concurrent 2026 report input.

### Task 5: Real twelve-node soak runner

**Files:**
- Create: `src/soak/longRunSoak.real.test.ts`
- Create: `src/soak/soakCases.ts`
- Modify: `package.json`

- [ ] Define ten different seed IDs, deterministic A/B/C rotation and forty-five globally unique custom outcome builders.
- [ ] Drive the production `getFixedOpening`, custom adjudication, continuation generation and ending generation functions without mocks.
- [ ] Write only sanitized JSON results under ignored `tmp/soak/`; never write the API key or raw response payload.
- [ ] Add `npm run test:soak` gated by `RUN_DEEPSEEK_SOAK=1` so ordinary tests stay offline.
- [ ] Run one rewrite-heavy probe, inspect its diagnostics, and adjust only evidence-backed failures.

### Task 6: Final ten-run acceptance and delivery

**Files:**
- Modify: `AGENTS.md`
- Modify: `PROJECT_CONTEXT.md`
- Modify: `.gitignore` if the soak result directory is not already ignored.

- [ ] Run the final ten games from a clean result directory and verify at least nine complete both ending reports.
- [ ] Audit all successful runs for twelve decisions, four-to-five unique custom outcomes, protagonist continuity and DeepSeek generation source.
- [ ] Run `npm test`, `npm run typecheck`, `npm run build`, `npm run check:portability`, and `git diff --check`.
- [ ] Open the app at 390 x 844, complete a real continuation and custom-result transition, and verify no console errors or layout regression.
- [ ] Record measured results and changed contracts in `AGENTS.md` and `PROJECT_CONTEXT.md`.
- [ ] Secret-scan, commit, push `main`, and verify local HEAD equals `origin/main`.

