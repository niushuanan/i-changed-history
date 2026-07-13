# Fixed Opening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all 50 first turns fixed and instant while keeping turns 2-12 and both endings AI-generated.

**Architecture:** Add a schema-validated fixed-opening data boundary keyed by history seed ID. Start a scenario synchronously in the reducer and remove the obsolete opening request from orchestration, transport-facing engine exports, persistence, tests, and documentation.

**Tech Stack:** React 19, TypeScript, Vitest, Zod, Vite, DeepSeek SSE.

## Global Constraints

- Exactly 50 fixed first turns, one for every existing seed.
- No DeepSeek request before the first player decision.
- Turns 2-12 remain DeepSeek-generated.
- Public checkout must install and build from arbitrary Windows, Linux, and macOS directories.

---

### Task 1: Fixed first-turn contract

**Files:** `src/game/schema.ts`, `src/data/fixedOpenings.ts`, `src/data/fixedOpenings.test.ts`

- [ ] Add failing tests for all 50 openings and observe the expected failure.
- [ ] Add `fixed` as a validated generation source and implement `getFixedOpening(seed)`.
- [ ] Verify all fixed openings pass the strict timeline schema.

### Task 2: Remove the opening model request

**Files:** `src/game/reducer.ts`, `src/hooks/useGame.ts`, `src/game/engine.ts`, `src/game/prompts.ts`, `src/services/storage.ts`, related tests

- [ ] Add failing reducer and hook tests proving immediate entry and zero opening calls.
- [ ] Start the scenario synchronously with `getFixedOpening` and remove the opening request/action path.
- [ ] Verify the first choice still schedules `next-turn` chapter 2.

### Task 3: Honest source UI and public documentation

**Files:** `src/screens/TimelineEventScreen.tsx`, tests, `README.md`, `PROJECT_CONTEXT.md`, `AGENTS.md`

- [ ] Render `固定历史开场` for chapter-one static data and `DeepSeek 实时生成` for later turns.
- [ ] Document product flow, model boundaries, setup, security, portability, and verification.
- [ ] Update durable project context and product decisions.

### Task 4: Verification and delivery

- [ ] Run focused tests, full tests, typecheck, build, portability scan, and `git diff --check`.
- [ ] Start the development server and verify card entry and second-turn request in a real browser.
- [ ] Review diff, commit, and push `main` to `origin/main`.
