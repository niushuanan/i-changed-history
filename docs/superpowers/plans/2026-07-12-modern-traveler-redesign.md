# Modern Traveler Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the opening of `I！我改变了历史` around a modern-traveler profile and fifty famous, concrete AD historical moments while preserving the real AI-driven five-turn game.

**Architecture:** Curated `HistorySeed` data owns historical truth and a deterministic recommender matches five moments to `TravelerProfile`. The reducer owns profile onboarding and choice-only game state; DeepSeek receives `{ profile, seed }` and owns only the live scene, actions, consequences, and alternate 2026. Existing visual tokens, audio, deviation, retry, persistence, and export remain in place.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, Zod, DeepSeek `deepseek-v4-flash`, html-to-image.

## Global Constraints

- Product title is exactly `I！我改变了历史` everywhere.
- All fifty cards use AD years; no BCE cards.
- At least eighteen cards are Chinese history from AD 208 through 1839; do not add modern Chinese political events.
- No custom opening, free intervention, D option, or player prompt exists after the profile screen.
- Every card includes exact date, place, role, immediate decision, three factual anchors, actual outcome, and matching tags.
- DeepSeek remains the sole generator of turn narrative, three choices, consequences, causal chains, and alternate 2026.
- Existing visual language is preserved; changes target hierarchy and comprehension, not a new aesthetic.

---

### Task 1: Traveler Profile and Famous-Moment Recommender

**Files:**
- Modify: `src/game/types.ts`
- Replace: `src/data/historySeeds.ts`
- Replace: `src/data/historySeeds.test.ts`
- Create: `src/game/profile.ts`
- Create: `src/game/profile.test.ts`

**Interfaces:**
- Produces: `TravelerProfile`, `HistorySeed`, `validateTravelerProfile(input)`, `recommendHistorySeeds(profile, previousIds?)`.
- Consumers: reducer, profile screen, picker, prompt serializer.

- [ ] **Step 1: Write failing data and profile tests**

```ts
expect(HISTORY_SEEDS).toHaveLength(50);
expect(HISTORY_SEEDS.every((seed) => seed.year > 0)).toBe(true);
expect(HISTORY_SEEDS.filter((seed) => seed.perspective === "china").length).toBeGreaterThanOrEqual(18);
for (const seed of HISTORY_SEEDS) {
  expect(seed).toMatchObject({ dateLabel: expect.any(String), eventName: expect.any(String), role: expect.any(String), decision: expect.any(String), historicalOutcome: expect.any(String) });
}
const recommended = recommendHistorySeeds(profile);
expect(recommended).toHaveLength(5);
expect(recommended.filter((seed) => seed.perspective === "china").length).toBeGreaterThanOrEqual(2);
expect(recommended.filter((seed) => seed.perspective === "world").length).toBeGreaterThanOrEqual(2);
```

- [ ] **Step 2: Run RED**

Run: `npm test -- src/data/historySeeds.test.ts src/game/profile.test.ts`
Expected: FAIL because the profile types and recommender do not exist and old data contains BCE years.

- [ ] **Step 3: Implement domain types and validator**

```ts
export type TravelerProfile = {
  name: string;
  occupation: "student" | "product" | "engineering" | "business" | "creative" | "public-service";
  strengths: readonly [TravelerStrength, TravelerStrength];
  riskStyle: "cautious" | "balanced" | "bold";
};

export type HistorySeed = {
  id: string;
  year: number;
  dateLabel: string;
  eventName: string;
  location: string;
  perspective: "china" | "world";
  role: string;
  decision: string;
  urgency: string;
  historicalOutcome: string;
  baselineFacts: readonly [string, string, string];
  occupationTags: readonly TravelerProfile["occupation"][];
  strengthTags: readonly TravelerStrength[];
  riskTags: readonly TravelerProfile["riskStyle"][];
  domain: string;
  visualTone: VisualTone;
};
```

- [ ] **Step 4: Replace the deck with fifty famous AD moments and implement stable scoring**

The deck must include the planned Chinese sequence from Red Cliffs (208) through Humen (1839) and globally familiar moments including Hastings (1066), Constantinople (1453), Reformation (1517), Bastille (1789), Waterloo (1815), Sarajevo (1914), Cuban Missile Crisis (1962), and Berlin Wall (1989). `recommendHistorySeeds` scores occupation `+3`, each matching strength `+4`, risk style `+2`, applies a stable profile/seed hash tie-break, then deals two China, two world, and the highest remaining card.

- [ ] **Step 5: Run GREEN and commit**

Run: `npm test -- src/data/historySeeds.test.ts src/game/profile.test.ts`
Expected: PASS.

Commit: `feat: add traveler profiles and famous history moments`

---

### Task 2: Profile-First Choice-Only State Machine

**Files:**
- Modify: `src/game/reducer.ts`
- Modify: `src/game/reducer.test.ts`
- Modify: `src/hooks/useGame.ts`
- Modify: `src/hooks/useGame.test.tsx`
- Modify: `src/services/storage.ts`
- Modify: `src/services/storage.test.ts`
- Delete: `src/game/input.ts`
- Delete: `src/game/input.test.ts`

**Interfaces:**
- Consumes: `TravelerProfile`, `HistorySeed`.
- Produces: `GameScenario = { profile: TravelerProfile; seed: HistorySeed }`, `SET_PROFILE`, `CHANGE_PROFILE`, choice-only `useGame` methods.

- [ ] **Step 1: Write failing reducer and storage tests**

```ts
const initial = createInitialGameState();
expect(initial.phase).toBe("profiling");
const profiled = gameReducer(initial, { type: "SET_PROFILE", profile });
expect(profiled).toMatchObject({ phase: "selecting", profile });
const started = gameReducer(profiled, { type: "START_SCENARIO", seed });
expect(started.scenario).toEqual({ profile, seed });
expect(gameReducer(resultState, { type: "RESTART" })).toMatchObject({ phase: "selecting", profile });
```

- [ ] **Step 2: Run RED**

Run: `npm test -- src/game/reducer.test.ts src/services/storage.test.ts src/hooks/useGame.test.tsx`
Expected: FAIL because the current initial phase is `selecting` and intervention actions still exist.

- [ ] **Step 3: Implement profile-first reducer and hook**

Add `profiling` to `GamePhase`, `profile` to `GameState`, `SET_PROFILE` and `CHANGE_PROFILE` actions, and make `START_SCENARIO` accept only `seed`. Remove `COMMIT_INTERVENTION`, `Intervention`, custom scenario strings, `submitCustomSeed`, and `intervene`. Preserve the profile in `RESTART`; clear it in `CHANGE_PROFILE`.

- [ ] **Step 4: Upgrade storage to v2**

Use `i-changed-history:session:v2`, validate profile and `{ profile, seed }` scenario, and recover stable `profiling`, `selecting`, `event`, `echo`, `result`, and `error` snapshots. Ignore v1 state.

- [ ] **Step 5: Run GREEN and commit**

Run: `npm test -- src/game/reducer.test.ts src/services/storage.test.ts src/hooks/useGame.test.tsx`
Expected: PASS.

Commit: `feat: make the game profile-first and choice-only`

---

### Task 3: Concrete Traveler AI Contract

**Files:**
- Modify: `src/game/schema.ts`
- Modify: `src/game/schema.test.ts`
- Modify: `src/game/prompts.ts`
- Modify: `src/game/prompts.test.ts`
- Modify: `src/game/engine.ts`
- Modify: `src/services/deepseek.test.ts`
- Modify: `src/test/fixtures.ts`

**Interfaces:**
- Consumes: `GameScenario` and `PlayedTurn[]`.
- Produces: `TimelineTurn` with `role`, `immediateObjective`, and `timePressure`; `generateOpening(scenario)`, `generateNextTurn(scenario, playedTurns, chapter)`.

- [ ] **Step 1: Write failing schema and prompt tests**

```ts
expect(parseTimelineTurn(raw)).toMatchObject({
  role: "塞尔维亚总理大臣的秘书",
  immediateObjective: "在车队再次进入拉丁桥前更改路线",
  timePressure: "还有 8 分钟",
});
const payload = JSON.parse(buildOpeningMessages({ profile, seed }).at(-1)!.content);
expect(payload).toMatchObject({ travelerProfile: profile, historySeed: expect.objectContaining({ eventName: "萨拉热窝刺杀" }) });
expect(payload.outputContract.narrative).toContain("第二人称");
```

- [ ] **Step 2: Run RED**

Run: `npm test -- src/game/schema.test.ts src/game/prompts.test.ts src/services/deepseek.test.ts`
Expected: FAIL because the three concrete scene fields and scenario profile do not exist.

- [ ] **Step 3: Extend strict schema and exact examples**

Add required non-empty string fields `role`, `immediateObjective`, and `timePressure` to the turn schema, storage schema, fixtures, required fields, and chapter-aware exact JSON example.

- [ ] **Step 4: Replace custom-premise serialization with traveler scenario serialization**

The system prompt must require second-person present tense, one real person, one real place, one visible object, and immediately executable choices. Serialize the profile under `travelerProfile` and the curated event under `historySeed`; both are data, never instructions. Remove every custom-premise and custom-intervention builder.

- [ ] **Step 5: Run GREEN and commit**

Run: `npm test -- src/game/schema.test.ts src/game/prompts.test.ts src/services/deepseek.test.ts`
Expected: PASS.

Commit: `feat: ground AI turns in concrete traveler moments`

---

### Task 4: Onboarding, Matched Cards, and Clear Event UI

**Files:**
- Create: `src/screens/TravelerProfileScreen.tsx`
- Create: `src/screens/TravelerProfileScreen.test.tsx`
- Modify: `src/screens/SeedPickerScreen.tsx`
- Modify: `src/components/HistoryCard.tsx`
- Modify: `src/screens/TimelineEventScreen.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.integration.test.tsx`
- Modify: `src/styles/game.css`
- Delete: `src/screens/CustomSeedSheet.tsx`
- Delete: `src/screens/CustomInterventionSheet.tsx`

**Interfaces:**
- Consumes: `game.state.profile`, `game.setProfile`, `game.changeProfile`, `recommendHistorySeeds(profile)`.
- Produces: complete profile -> matched cards -> choice-only event route.

- [ ] **Step 1: Rewrite integration tests for the new journey**

```ts
expect(screen.getByRole("heading", { name: "I！我改变了历史" })).toBeVisible();
await user.type(screen.getByLabelText("你的称呼"), "阿开");
await user.click(screen.getByRole("radio", { name: "产品与管理" }));
await user.click(screen.getByRole("checkbox", { name: "谈判" }));
await user.click(screen.getByRole("checkbox", { name: "组织" }));
await user.click(screen.getByRole("radio", { name: "均衡" }));
await user.click(screen.getByRole("button", { name: "匹配历史瞬间" }));
expect(screen.getAllByRole("button", { name: /穿越到/ })).toHaveLength(5);
expect(screen.queryByText("自己写一条历史裂缝")).not.toBeInTheDocument();
```

- [ ] **Step 2: Run RED**

Run: `npm test -- src/screens/TravelerProfileScreen.test.tsx src/App.integration.test.tsx`
Expected: FAIL because onboarding is absent and old custom controls remain.

- [ ] **Step 3: Implement the archive-profile screen**

Use a compact single-page form with radio cards for occupation and risk, exactly-two strength checkboxes, inline validation, and a fixed primary action. Preserve the current paper/archive palette, 4 px radii, type hierarchy, and Phosphor icons.

- [ ] **Step 4: Rebuild cards and event hierarchy**

Card order is event/date -> role -> decision -> actual outcome -> `穿越到这一分钟`. Event screens show `此刻身份`, `当前目标`, and `剩余时间` above narrative. Remove both custom sheets and every custom command.

- [ ] **Step 5: Run GREEN, full tests, typecheck, and build**

Run: `npm test && npm run typecheck && npm run build`
Expected: all commands exit 0.

Commit: `feat: rebuild the player journey around famous moments`

---

### Task 5: Real-AI Browser QA, Documentation, Merge, and GitHub Publish

**Files:**
- Modify: `PROJECT_CONTEXT.md`
- Modify: `design-qa.md`
- Modify: `.env.example` only if variable names change

**Interfaces:**
- Consumes: completed application and local `.env.local`.
- Produces: verified `main`, GitHub repository `niushuanan/i-changed-history`, configured `origin`.

- [ ] **Step 1: Run a real DeepSeek path**

Create a product/management profile, verify at least two Chinese and two world cards, choose Sarajevo or another globally famous event, and complete at least the first two generated turns. Confirm the opening names the exact role, objective, time pressure, place, and real historical participants.

- [ ] **Step 2: Browser layout QA**

At 390 x 844 inspect onboarding, matched cards, event, echo, and restored result. Verify document `clientWidth === scrollWidth`, no text overlap, all primary actions reachable, and no custom input controls.

- [ ] **Step 3: Fresh verification**

Run: `npm test`, `npm run typecheck`, `npm run build`, `git diff --check`.
Expected: 0 failures and 0 whitespace errors.

- [ ] **Step 4: Update project context**

Refresh project purpose, structure, key entry points, and add a timestamped recent-change entry covering profile onboarding, famous AD moments, choice-only flow, AI prompt grounding, and GitHub publication.

- [ ] **Step 5: Merge and publish**

Merge `codex/traveler-redesign` into `main`, run the full verification again from main, create the private GitHub repository with `gh repo create niushuanan/i-changed-history --private --source=. --remote=origin --push`, then verify `origin`, remote default branch, and pushed SHA.

Commit any final documentation as: `docs: record traveler redesign verification`.
