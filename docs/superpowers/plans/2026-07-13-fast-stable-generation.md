# Fast Stable Generation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce avoidable DeepSeek latency and structural failures while making every 390 x 844 event page fit variable generated copy without overlap or dead space.

**Architecture:** Compile all prior play into one compact `NarrativeContext` that preserves every decision but includes detail only for the latest three consequences. Keep one coherent model request per playable turn, move deterministic timeline fields to the client, normalize harmless drift before repair, and split the two independent ending reports into concurrent validated requests. Render event content with bounded copy plus density-aware grid allocation.

**Tech Stack:** React 19, TypeScript, Zod, Vitest, DeepSeek JSON mode, CSS Grid, Playwright CLI.

## Global Constraints

- The product remains a pure frontend and keeps `deepseek-v4-flash` with an 8192-token transport ceiling.
- Player-authored canon is exact, irreversible, and included in every later turn and both endings.
- A playable turn uses one coherent scene/cause/choice generation, never three independently invented scenes.
- The biography and 2026 report are generated concurrently and merged only after separate validation.
- The 390 x 844 event page has no document scroll, overlap, clipped visible copy, or hidden action.
- Every completed project change is committed and pushed to `origin/main`.

---

### Task 1: Compact authoritative narrative context

**Files:**
- Create: `src/game/narrativeContext.ts`
- Create: `src/game/narrativeContext.test.ts`
- Modify: `src/game/prompts.ts`
- Modify: `src/game/prompts.test.ts`

**Interfaces:**
- Produces: `buildNarrativeContext(playedTurns: readonly PlayedTurn[]): NarrativeContext`
- Consumes: `PlayedTurn`, the last turn causal ledger, and exact player-authored decisions.

- [ ] **Step 1: Write failing context tests**

```ts
it("keeps all decisions but details only the latest three consequences", () => {
  const context = buildNarrativeContext(twelvePlayedTurns);
  expect(context.lifeIndex).toHaveLength(12);
  expect(context.activeConsequences).toHaveLength(3);
  expect(JSON.stringify(context)).not.toContain(twelvePlayedTurns[0].turn.narrative);
});

it("preserves every direct rewrite verbatim", () => {
  expect(context.playerCanon[0].sourceText).toBe("我成为新皇帝");
});
```

- [ ] **Step 2: Run `npm test -- --run src/game/narrativeContext.test.ts` and verify the missing-module failure.**
- [ ] **Step 3: Implement `NarrativeContext` with `lifeIndex`, `latestDecision`, `activeConsequences`, `playerCanon`, `persistentLedger`, and `recentScenes`.**
- [ ] **Step 4: Replace duplicate `selectedHistory + WorldCanon` continuation payloads with the compact context and update prompt assertions.**
- [ ] **Step 5: Run the context and prompt tests until green.**

### Task 2: Client-owned turn assembly and tolerant normalization

**Files:**
- Modify: `src/game/schema.ts`
- Modify: `src/game/schema.test.ts`
- Modify: `src/game/engine.ts`
- Modify: `src/services/deepseek.test.ts`
- Modify: `src/game/prompts.ts`

**Interfaces:**
- Produces: `parseTimelineTurn` that repairs positional A/B/C classes, exactly one modern-knowledge flag, bounded complete short copy, and client-authoritative timeline fields before Zod rejection.
- Produces: `requestValidated` with one initial request and at most one compact repair.

- [ ] **Step 1: Add failing tests for duplicate modern flags, overlong nested action copy, and a one-repair maximum.**

```ts
const drifted = {
  ...turnFixture,
  choices: turnFixture.choices.map((choice) => ({ ...choice, usesModernKnowledge: true })),
};
expect(parseTimelineTurn(JSON.stringify(drifted)).choices.filter((choice) => choice.usesModernKnowledge)).toHaveLength(1);
```

- [ ] **Step 2: Run the narrow schema and transport tests and confirm the expected failures.**
- [ ] **Step 3: Normalize choice IDs/classes/flags by tuple position and trim nested display fields to their UI budgets.**
- [ ] **Step 4: Remove client-owned fields from the model contract where possible and inject chapter, age, life stage, year, previous echo, metrics, and source during parsing.**
- [ ] **Step 5: Replace the third full regeneration with one compact contextual repair and a structured retryable error.**
- [ ] **Step 6: Run schema, prompt, and DeepSeek tests until green.**

### Task 3: Concurrent final reports

**Files:**
- Modify: `src/game/schema.ts`
- Modify: `src/game/prompts.ts`
- Modify: `src/game/engine.ts`
- Modify: `src/services/deepseek.test.ts`

**Interfaces:**
- Produces: `buildBiographyMessages`, `buildWorldReportMessages`, `parseBiographyReport`, and `parseWorldReport`.
- `generateEnding` starts both requests before awaiting either, merges their values, then validates the complete `AlternatePresent`.

- [ ] **Step 1: Add a failing deferred-promise test proving both ending fetches start before either resolves.**

```ts
const pending: Array<() => void> = [];
const fetcher = vi.fn(() => new Promise<Response>((resolve) => pending.push(() => resolve(completion()))));
const endingPromise = generateEnding(scenario, endingPlayedTurns);
await vi.waitFor(() => expect(fetcher).toHaveBeenCalledTimes(2));
```

- [ ] **Step 2: Add failing tests that each prompt contains only its owned report fields.**
- [ ] **Step 3: Define strict biography/world slice schemas and parsing helpers.**
- [ ] **Step 4: Build a shared compact ending context, run both validated requests with `Promise.all`, and parse the merged result.**
- [ ] **Step 5: Run ending transport, schema, and screen tests until green.**

### Task 4: Density-aware event layout and end-to-end verification

**Files:**
- Modify: `src/screens/TimelineEventScreen.tsx`
- Modify: `src/screens/TimelineEventScreen.test.tsx`
- Modify: `src/styles/game.css`
- Modify: `AGENTS.md`
- Modify: `PROJECT_CONTEXT.md`

**Interfaces:**
- Produces: `data-density="normal|dense"` from the total visible character budget.
- Consumes: already bounded turn display fields.

- [ ] **Step 1: Add a failing component test that max-length valid copy selects dense mode and still renders all four action controls.**
- [ ] **Step 2: Run the component test and verify the missing density attribute failure.**
- [ ] **Step 3: Replace fixed copy/proof heights with content-sized rows; use 146px normal and 132px dense scene art; let three action rows divide all remaining height.**
- [ ] **Step 4: Run `npm run typecheck && npm test -- --run && npm run build && git diff --check`.**
- [ ] **Step 5: Use real DeepSeek in Playwright at 390 x 844, record request count/duration, inspect opening and continuation screenshots, and assert event/body/action `scrollHeight <= clientHeight`.**
- [ ] **Step 6: Update durable product decisions and project context with the new context contract, concurrency boundary, latency baseline, and verification evidence.**
- [ ] **Step 7: Stage, secret-scan, commit, push `main`, and verify the remote SHA.**
