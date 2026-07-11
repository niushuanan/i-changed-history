# 《我改变了历史》Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished mobile game where players choose one of fifty real historical turning points or enter their own premise, make five interventions, and receive a causally explained alternate 2026.

**Architecture:** A React/Vite frontend keeps card dealing, state transitions, validation, persistence, and sharing deterministic. DeepSeek V4 Flash invents each timeline turn through strict JSON contracts that include the verified seed, all player choices, world metrics, and a causal ledger.

**Tech Stack:** React, TypeScript, Vite, Zod, Phosphor Icons, html-to-image, Vitest, Testing Library, DeepSeek Chat Completions, built-in ImageGen, Codex in-app Browser.

## Global Constraints

- The product name is `我改变了历史` and must be the first-viewport brand signal.
- The first screen is the usable five-card history picker, not a marketing page.
- The curated dataset contains exactly 50 cards: 10 in each of five era buckets.
- No curated or custom scenario may concern China from 1840 onward.
- A run contains exactly five generated timeline turns and one generated alternate-2026 ending.
- Every turn offers exactly three choices and reports stability, prosperity, freedom, and cost on a 0-100 scale.
- No authored plot branches or fallback story text; only card baseline facts are curated.
- The current build is frontend-only and local-use-only; `.env.local` stays ignored.
- Reference viewport is 390 x 844 with no horizontal scroll or off-screen primary action.
- Generate exactly three visual options before scaffolding, select one exact image, then use it as the image-to-code target.
- Use generated raster art and Phosphor Icons; no handmade SVG, CSS art, gradients, emoji, or placeholder imagery.
- `design-qa.md` must end with `final result: passed` before handoff.

---

## File Map

- `design/visual-options/*.png`: three card-picker UI directions.
- `design/selected-visual.md`: exact chosen visual and measured layout locks.
- `design/screen-targets/*.png`: selected-direction event and result screens.
- `public/assets/tone-*.webp`: eight reusable era/tone scenes.
- `public/assets/archive-texture.webp`, `result-ornament.webp`: supporting raster assets.
- `src/data/historySeeds.ts`: fifty seeds and balanced deal algorithm.
- `src/data/historySeeds.test.ts`: dataset and dealing invariants.
- `src/game/input.ts`: custom prompt normalization and policy boundary.
- `src/game/types.ts`, `schema.ts`, `prompts.ts`, `reducer.ts`, `engine.ts`: game domain.
- `src/services/deepseek.ts`, `storage.ts`, `share.ts`: external boundaries.
- `src/screens/*.tsx`, `src/components/*.tsx`: complete player journey.
- `src/styles/*.css`: selected-target visual implementation.
- `design-qa.md`: source-versus-build review.
- `PROJECT_CONTEXT.md`: project orientation and recent changes.

---

### Task 1: Generate and select the card-picker target

**Files:**
- Create: `design/visual-options/archive-deck.png`
- Create: `design/visual-options/redaction-room.png`
- Create: `design/visual-options/timeline-editor.png`
- Create: `design/selected-visual.md`

**Interfaces:**
- Consumes: `docs/superpowers/specs/2026-07-11-i-changed-history-design.md`.
- Produces: `selected_target: design/visual-options/redaction-room.png`.

- [ ] **Step 1: Complete Product Design preflight**

Run the user-context preflight from `skills/user-context/scripts/user_context_preflight.py`. There is no saved context, so ground the work only in the approved spec and do not import unrelated references.

- [ ] **Step 2: Generate exactly three independent 390 x 844 images**

Use built-in ImageGen once per direction. Every prompt must request the actual mobile picker for `我改变了历史`, five horizontally browsable cards, visible year/location/counterfactual, a shuffle icon button, and a secondary custom-prompt command. Shared constraints: no device chrome, no gradient, no nested cards, no purple-blue dominance, no generic fantasy UI, no watermark, no clipped text.

Directions:

- `archive-deck`: restrained museum evidence table with tactile paper and editorial labels.
- `redaction-room`: selected direction; a contemporary history newsroom with red editorial marks, bold chronology, and strong share energy.
- `timeline-editor`: speculative timeline workstation with oxidized teal and signal yellow, but no sci-fi dashboard clutter.

- [ ] **Step 3: Inspect original outputs and regenerate only the selected direction if needed**

`redaction-room.png` must show the title, one complete current card, two partial neighboring cards, a visible custom-input entry, and all main actions within 844px. If it fails, regenerate `redaction-room` with one targeted correction.

- [ ] **Step 4: Save the exact target decision**

Create:

```markdown
# Selected Visual Target

selected_target: design/visual-options/redaction-room.png
viewport: 390 x 844

## Why This Wins

- The title and historical premise are understood within three seconds.
- The active card is dominant while neighboring cards make replayability visible.
- Red editorial marks create a recognizable identity without imitating old parchment fantasy.
- Repeated card and command rows can be implemented reliably at mobile size.

## Fidelity Locks

- Header height: 118px
- Card viewport: 392px
- Horizontal padding: 18px
- Active card width: 310px
- Card gap: 12px
- Main button height: 52px
- Palette: coal black, newsprint white, editorial red, oxidized teal, signal yellow
```

- [ ] **Step 5: Commit**

```bash
git add design/visual-options design/selected-visual.md
git commit -m "design: select historical card picker direction"
```

---

### Task 2: Generate supporting screen targets and the raster asset pack

**Files:**
- Create: `design/screen-targets/event-screen.png`
- Create: `design/screen-targets/result-screen.png`
- Create: `public/assets/tone-ancient.webp`
- Create: `public/assets/tone-exchange.webp`
- Create: `public/assets/tone-print.webp`
- Create: `public/assets/tone-revolution.webp`
- Create: `public/assets/tone-industry.webp`
- Create: `public/assets/tone-war.webp`
- Create: `public/assets/tone-space.webp`
- Create: `public/assets/tone-digital.webp`
- Create: `public/assets/archive-texture.webp`
- Create: `public/assets/result-ornament.webp`

**Interfaces:**
- Consumes: `design/visual-options/redaction-room.png` as an attached style and layout reference.
- Produces: two exact screen targets and `Record<VisualTone, string>` assets.

- [ ] **Step 1: Generate event and result screen targets**

Use two independent ImageGen calls with `redaction-room.png` attached as a reference image. Preserve its typography, palette, spacing, radius, and editorial marks.

Event screen content: five-step timeline, year/location, 38%-height scene, one 120-word-or-shorter event, four compact metrics, exactly three choices.  
Result screen content: alternate 2026 newspaper front page, world name, main headline, rewrite level, three causal summaries, one save/share action.

- [ ] **Step 2: Generate eight visual-tone scenes**

Use eight separate built-in ImageGen calls:

```text
Use case: stylized-concept
Asset type: 768 x 1024 portrait mobile game scene usable as both card crop and event background
Primary request: a historically grounded but counterfactual scene for the named era tone
Style/medium: tactile editorial illustration, archival photo texture, contemporary history magazine art direction
Composition/framing: focal subject above center, quieter lower third for readable UI overlap
Color palette: coal black, newsprint white, editorial red details, oxidized teal, signal yellow
Constraints: no text, no logo, no real modern political insignia, no known IP, no watermark, no gradient, no generic fantasy castle
```

Generate `ancient`, `exchange`, `print`, `revolution`, `industry`, `war`, `space`, and `digital` as distinct subjects without depicting graphic violence.

- [ ] **Step 3: Generate texture and result ornament**

Generate one seamless low-contrast newsprint/archive texture and one 2026 front-page ornament. Neither contains legible text.

- [ ] **Step 4: Copy, crop, and compress outputs**

Copy selected generated files from `$CODEX_HOME/generated_images` into the workspace, then convert to WebP. Scenes are 768 x 1024 at quality 72-78; texture is 512 x 512; ornament is 768 x 420.

Run:

```bash
identify public/assets/*.webp
du -ch public/assets/*.webp
```

Expected: all ten assets decode and total asset weight is below 6.5MB.

- [ ] **Step 5: Commit**

```bash
git add design/screen-targets public/assets
git commit -m "design: add alternate-history screen and scene art"
```

---

### Task 3: Bootstrap the tested application shell

**Files:**
- Create from Product Design starter: `package.json`, `index.html`, `vite.config.ts`, `tsconfig*.json`, `src/*`
- Create: `.env.example`
- Create: `PROJECT_CONTEXT.md`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: `/assets/tone-ancient.webp` and selected picker measurements.
- Produces: working `npm run dev`, `npm test`, and `npm run build` commands.

- [ ] **Step 1: Bootstrap from the required Product Design starter**

Run the bundled script into ignored `tmp/prototype-bootstrap`, then copy the generated starter files into the worktree root without overwriting `docs`, `design`, `public/assets`, or `.gitignore`:

```bash
node /Users/zhuanghongkai/.codex/plugins/cache/openai-curated-remote/product-design/0.1.50/scripts/bootstrap-prototype.mjs --dest "$PWD/tmp/prototype-bootstrap"
rsync -a --exclude public/assets "$PWD/tmp/prototype-bootstrap/" "$PWD/"
npm install
```

- [ ] **Step 2: Add project dependencies and scripts**

Install runtime packages `zod`, `@phosphor-icons/react`, and `html-to-image`; install dev packages `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, and `@testing-library/user-event`. Configure `test: vitest run` and jsdom setup.

- [ ] **Step 3: Write the failing first-screen test**

```tsx
it("opens on the usable history picker", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: "我改变了历史" })).toBeVisible();
  expect(screen.getAllByRole("button", { name: /如果/ })).toHaveLength(5);
  expect(screen.getByRole("button", { name: "自己写一条历史裂缝" })).toBeEnabled();
});
```

- [ ] **Step 4: Verify RED**

Run: `npm test -- src/App.test.tsx`  
Expected: FAIL because the starter does not render the history picker.

- [ ] **Step 5: Implement only the static shell needed by the test**

Render the title, five temporary semantic card buttons, shuffle icon button, and custom-prompt command using the selected target's stable dimensions. Use generated imagery, never a placeholder box.

- [ ] **Step 6: Verify GREEN and build**

Run: `npm test -- src/App.test.tsx && npm run build`  
Expected: test passes and Vite build succeeds.

- [ ] **Step 7: Create project context and commit**

Document purpose, structure, entry points, and scaffold under “最近改了什么”. Commit all scaffold files except `.env.local`.

---

### Task 4: Implement the fifty-card deck and custom input boundary

**Files:**
- Create: `src/data/historySeeds.ts`
- Create: `src/data/historySeeds.test.ts`
- Create: `src/game/input.ts`
- Create: `src/game/input.test.ts`
- Create: `src/game/types.ts`

**Interfaces:**
- Produces: `HISTORY_SEEDS`, `dealHistorySeeds(previousIds, random)`, `normalizeCustomSeed(input)`, `HistorySeed`, and `VisualTone`.

- [ ] **Step 1: Write failing dataset tests**

```ts
it("contains fifty balanced, policy-safe seeds", () => {
  expect(HISTORY_SEEDS).toHaveLength(50);
  for (const era of ["ancient", "medieval", "early-modern", "industrial", "modern"]) {
    expect(HISTORY_SEEDS.filter((seed) => seed.era === era)).toHaveLength(10);
  }
  expect(HISTORY_SEEDS.some((seed) => seed.year >= 1840 && seed.location.includes("中国"))).toBe(false);
  expect(HISTORY_SEEDS.every((seed) => seed.baselineFacts.length === 3)).toBe(true);
});

it("deals one card from every era without immediate repeats", () => {
  const first = dealHistorySeeds([], () => 0.25);
  const second = dealHistorySeeds(first.map((seed) => seed.id), () => 0.25);
  expect(new Set(first.map((seed) => seed.era)).size).toBe(5);
  expect(second.some((seed) => first.some((prior) => prior.id === seed.id))).toBe(false);
});
```

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/data/historySeeds.test.ts`  
Expected: FAIL because the seed module does not exist.

- [ ] **Step 3: Implement all fifty cards**

Create ten real, globally distributed seeds in each era. Every seed has three restrained baseline facts, one concise `如果……` prompt, one domain, and one visual key. Allow pre-1840 Chinese history; include no post-1840 China-related card. Avoid the disproven “single fire destroyed the entire Library of Alexandria” trope and other known historical myths.

- [ ] **Step 4: Implement balanced dealing**

Group by era, remove previous IDs when another card remains, select one per group using the injected random function, then shuffle the five results using the same source. The function never mutates `HISTORY_SEEDS`.

- [ ] **Step 5: Write failing custom-input tests**

```ts
expect(normalizeCustomSeed("   ").ok).toBe(false);
expect(normalizeCustomSeed("如果 1966 年的中国发生另一种变化").reason).toBe("modern_china");
expect(normalizeCustomSeed("如果古罗马在公元一世纪普及蒸汽动力").ok).toBe(true);
expect(normalizeCustomSeed("历".repeat(141)).reason).toBe("too_long");
```

- [ ] **Step 6: Implement input normalization and verify GREEN**

Normalize whitespace, enforce 4-140 Chinese characters, identify modern-China combinations conservatively, and return a discriminated union without deleting the user's input.

Run: `npm test -- src/data/historySeeds.test.ts src/game/input.test.ts`  
Expected: all dataset, dealing, and input tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/data src/game/types.ts src/game/input.ts src/game/input.test.ts
git commit -m "feat: add fifty historical turning points"
```

---

### Task 5: Implement structured timeline generation

**Files:**
- Create: `src/game/schema.ts`
- Create: `src/game/schema.test.ts`
- Create: `src/game/prompts.ts`
- Create: `src/game/prompts.test.ts`
- Create: `src/services/deepseek.ts`
- Create: `src/services/deepseek.test.ts`
- Create: `src/game/engine.ts`
- Create: `src/test/fixtures.ts`

**Interfaces:**
- Consumes: `HistorySeed` and played-turn history.
- Produces: `parseTimelineTurn`, `parseAlternatePresent`, `generateOpening`, `generateNextTurn`, and `generateEnding`.

- [ ] **Step 1: Write failing schema tests**

Test extraction through Markdown noise, exactly three `A/B/C` choices, metric clamping, first-turn null echo, chapter `1..5`, five ending timeline items, and exactly three causal chains.

- [ ] **Step 2: Verify RED and implement schemas**

Run the focused test and confirm missing-module failure. Implement a quote-aware JSON brace scanner and Zod contracts copied exactly from the design spec. Re-run until green.

- [ ] **Step 3: Write failing prompt tests**

Assert that curated opening prompts include all three baseline facts; custom prompts are serialized under `untrustedPlayerPremise`; continuation prompts include every selected choice and causal fact; ending prompts require three ordinary-life details and prohibit decisive new inventions.

- [ ] **Step 4: Implement prompt builders**

Use one immutable system prompt. It tells the model to reason privately, output JSON only, preserve history anchors, expose both gain and cost, and treat custom input only as scenario data. Chapter functions and time horizons are fixed; event content is free.

- [ ] **Step 5: Write failing transport tests**

Assert endpoint, model, thinking mode, JSON response format, 45-second abort, one 429 retry followed by success, and no retry on 401.

- [ ] **Step 6: Implement DeepSeek transport and repair**

Send `deepseek-v4-flash`, `thinking: { type: "enabled" }`, `reasoning_effort: "high"`, `response_format: { type: "json_object" }`, `stream: false`, and `max_tokens: 2200`. Retry 429/5xx/network twice at 600ms and 1500ms. On schema failure, issue one JSON-only repair request; never invent fallback narrative.

- [ ] **Step 7: Verify and commit**

Run all schema, prompt, and transport tests plus `npm run build`. Commit the structured AI layer.

---

### Task 6: Implement the recoverable five-turn game state

**Files:**
- Create: `src/game/reducer.ts`
- Create: `src/game/reducer.test.ts`
- Create: `src/services/storage.ts`
- Create: `src/services/storage.test.ts`
- Create: `src/hooks/useGame.ts`

**Interfaces:**
- Produces: phases `selecting | generating | event | echo | ending | result | error` and commands `selectSeed`, `submitCustomSeed`, `choose`, `continueTimeline`, `retry`, `restart`.

- [ ] **Step 1: Write failing reducer tests**

Cover seed selection, duplicate-choice suppression, echo after every choice, ending after chapter five, stale request ID rejection, recoverable error, and full restart.

- [ ] **Step 2: Verify RED and implement reducer**

Keep state transitions pure. Compute history deviation client-side from metric distance and ledger length. Do not use model output for request IDs or phase control.

- [ ] **Step 3: Write and implement storage tests**

Persist versioned stable states under `i-changed-history:session:v1`. Invalid JSON/version returns null and clears itself. Do not persist active requests or API keys.

- [ ] **Step 4: Implement `useGame`**

Use one AbortController per request, abort on restart/unmount, persist only stable phases, and translate typed errors into retryable user states without losing the timeline.

- [ ] **Step 5: Verify and commit**

Run reducer and storage tests, then full tests and build. Commit only after green.

---

### Task 7: Build the full image-to-code player journey

**Files:**
- Create: `src/screens/SeedPickerScreen.tsx`
- Create: `src/screens/CustomSeedSheet.tsx`
- Create: `src/screens/TimelineEventScreen.tsx`
- Create: `src/screens/ButterflyEchoScreen.tsx`
- Create: `src/screens/GeneratingScreen.tsx`
- Create: `src/screens/ErrorScreen.tsx`
- Create: `src/screens/AlternatePresentScreen.tsx`
- Create: `src/components/HistoryCard.tsx`
- Create: `src/components/TimelineProgress.tsx`
- Create: `src/components/WorldMetrics.tsx`
- Create: `src/components/ChoiceList.tsx`
- Create: `src/components/ResultFrontPage.tsx`
- Modify: `src/App.tsx`
- Create: `src/App.integration.test.tsx`
- Create: `src/styles/game.css`

**Interfaces:**
- Consumes: `useGame`, selected screen targets, tone assets.
- Produces: complete card and custom-prompt routes through alternate 2026.

- [ ] **Step 1: Write the failing card-route integration test**

Mock five generated turns and one ending. Select a card, make five choices, verify each butterfly echo, and assert the result includes world name, three ordinary-life details, rewrite level, save action, and restart action.

- [ ] **Step 2: Write the failing custom-route integration test**

Open the custom sheet, verify invalid modern-China input keeps its text and shows the neutral boundary message, then submit a valid Roman steam premise and complete the same five-turn route.

- [ ] **Step 3: Verify RED**

Run: `npm test -- src/App.integration.test.tsx`  
Expected: FAIL because the screens and controls do not exist.

- [ ] **Step 4: Implement picker and custom prompt**

Match `redaction-room.png` measurements. Use a horizontal snap carousel with one full card and neighboring hints, real tone images, a Phosphor shuffle icon with tooltip, and a bottom sheet for the 140-character prompt. No nested cards.

- [ ] **Step 5: Implement event, echo, and result screens**

Match the two supporting target images. Scene area has stable aspect ratio; choices have stable min-height; metrics never resize; result has a dedicated 1080 x 1440 capture node. Dynamic text clamps only where the schema already imposes a maximum; never hide a primary action.

- [ ] **Step 6: Verify GREEN and commit**

Run the focused integration tests, all unit tests, and production build. Inspect warnings and remove any React key, accessibility, or overflow warning before committing.

---

### Task 8: Add sharing, real AI verification, and visual QA

**Files:**
- Create: `src/services/share.ts`
- Create: `src/services/share.test.ts`
- Create untracked: `.env.local`
- Create: `design-qa.md`
- Modify: `PROJECT_CONTEXT.md`

**Interfaces:**
- Consumes: result capture node and the user-provided DeepSeek key.
- Produces: share/download behavior, three real completed runs, and passed QA.

- [ ] **Step 1: Test-first implement result export**

Use `html-to-image` at pixel ratio 2. Prefer Web Share with a PNG file; otherwise copy the generated share sentence and trigger a PNG download. Tests cover share, download, and image-generation failure.

- [ ] **Step 2: Configure the untracked local key**

Write the exact user-provided key and `VITE_DEEPSEEK_MODEL=deepseek-v4-flash` to `.env.local`. Run `git check-ignore .env.local`; it must print the file. Never print the key in logs or commit it.

- [ ] **Step 3: Run automated verification**

```bash
git diff --check
npm test
npm run build
du -sh dist
```

Expected: no whitespace failures, all tests green, build succeeds, and `dist` remains below 8MB.

- [ ] **Step 4: Start the local app and use the in-app Browser**

Run on the first free port. Inspect at 390 x 844, test card shuffle, custom prompt, five choices, retry state, refresh recovery, save/share fallback, and restart. Check browser console errors.

- [ ] **Step 5: Complete three real DeepSeek runs**

Complete two curated seeds and one custom premise. Record uniqueness, callbacks, gain/cost balance, three traceable causal chains, and ordinary-life 2026 details in `design-qa.md`.

- [ ] **Step 6: Compare sources and captures**

Open each reference mockup and same-state browser capture together. Record fidelity, hierarchy, crop, spacing, radius, contrast, text fitting, and interaction findings. Fix every P0, P1, and P2, recapture, and repeat.

- [ ] **Step 7: Finish QA and project context**

End `design-qa.md` with `final result: passed`. Update `PROJECT_CONTEXT.md` with purpose, complete structure, key entry points, commands, AI boundary, tests, and this task's changed files and impact.

- [ ] **Step 8: Final verification and commit**

Run the full verification block again. Confirm `.env.local` is absent from `git status`. Commit verified code, assets, QA, and context while keeping the dev server running.
