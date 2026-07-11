# 《不存在的时代》Implementation Plan

> Superseded before implementation by `2026-07-11-i-changed-history.md` after the product changed to real historical turning points and custom prompts.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, mobile-first, fully playable five-turn AI improvised life simulation powered directly by DeepSeek V4 Flash.

**Architecture:** A React/Vite single-page H5 owns a deterministic client state machine while DeepSeek invents every narrative event through strict JSON contracts. The UI reads a selected ImageGen mobile mockup and a generated six-tone visual asset pack; Zod validation, repair requests, retry logic, and local persistence keep the live AI experience recoverable.

**Tech Stack:** React 19, TypeScript 5, Vite 7, Zod, Phosphor Icons, html-to-image, Vitest, Testing Library, Playwright, DeepSeek OpenAI-compatible Chat Completions API.

## Global Constraints

- Do not use a prewritten world, question bank, plot branch, or player text prompt.
- Each run has exactly five event chapters and one ending request.
- Each event has exactly three choices and four 0-100 stats: `power`, `livelihood`, `bonds`, `freedom`.
- The model is `deepseek-v4-flash` at `https://api.deepseek.com/chat/completions`, with thinking enabled and JSON output.
- The current build is frontend-only and local-use-only; `.env.local` must remain untracked.
- The reference viewport is 390 x 844 with no horizontal scroll or off-screen primary action.
- The selected visual target must exist before application scaffolding starts.
- Use generated raster assets and Phosphor Icons; no handcrafted SVG, CSS illustration, gradient, emoji, or generic image placeholder.
- Generated asset bundle should keep the production package below 8MB.
- No implementation handoff until `design-qa.md` exists and ends with `final result: passed`.

---

## Planned File Map

- `design/visual-options/*.png`: three ImageGen mobile UI directions.
- `design/selected-visual.md`: exact chosen target and selection rationale.
- `public/assets/*.webp`: cover, six scene tones, texture, seal, and ending ornament.
- `src/game/types.ts`: narrative and session domain types.
- `src/game/schema.ts`: JSON extraction, Zod schemas, and parsers.
- `src/game/prompts.ts`: system, opening, continuation, ending, and repair prompts.
- `src/game/reducer.ts`: deterministic five-chapter state transitions.
- `src/game/engine.ts`: validated AI generation entry points.
- `src/services/deepseek.ts`: fetch, timeout, retry, and repair transport.
- `src/services/storage.ts`: versioned local session persistence.
- `src/hooks/useGame.ts`: orchestration and stale-request protection.
- `src/screens/*.tsx`: cover, event, echo, loading, chronicle, and recoverable error states.
- `src/components/*.tsx`: shared game controls and share card.
- `src/styles/*.css`: target-faithful responsive visual system.
- `e2e/game.spec.ts`: mocked full-run browser tests.
- `design-qa.md`: source-versus-build visual review and final gate.
- `PROJECT_CONTEXT.md`: project purpose, structure, entry points, and recent changes.

---

### Task 1: Resolve the exact visual target

**Files:**
- Create: `design/visual-options/archive-ritual.png`
- Create: `design/visual-options/vermilion-bureau.png`
- Create: `design/visual-options/celestial-ledger.png`
- Create: `design/selected-visual.md`

**Interfaces:**
- Consumes: the approved product design specification.
- Produces: one exact `selected_target` path used by every later visual task.

- [ ] **Step 1: Run Product Design preflight**

Read Product Design `user-context`, `get-context`, `ideate`, and ImageGen prompt guidance, then run the local user-context preflight script. Record only relevant saved design preferences; do not import unrelated references.

- [ ] **Step 2: Generate exactly three 390 x 844 mockups with built-in ImageGen**

Use one ImageGen call per option with this shared requirement and the named variation:

```text
Use case: ui-mockup
Asset type: 390 x 844 mobile AI narrative game event screen
Primary request: Design a production-quality event screen for a Chinese game named 不存在的时代. A fictional citizen faces one pivotal choice inside a civilization that never existed. Show chapter progress, age/time, a concise event narrative, four compact status indicators, and three clearly tappable choices.
Style/medium: premium mobile game UI, lost-civilization archive, editorial museum catalog, tactile raster artwork
Composition/framing: full mobile viewport, scene image in upper 42 percent, unframed narrative below, three choices reachable by thumb, no marketing layout
Color palette: ink black, bone white, vermilion red, oxidized teal, restrained old gold
Constraints: readable hierarchy, 8px-or-less card radius, no nested cards, no gradients, no glowing orbs, no emoji, no watermark, no phone hardware frame
```

Variation A: archaeological archive ritual, restrained and ceremonial.  
Variation B: vermilion imperial records bureau, sharper editorial typography and social-share energy.  
Variation C: celestial census ledger, more surreal and speculative while preserving readability.

- [ ] **Step 3: Inspect all three images at original detail**

Reject any option with illegible hierarchy, a hidden primary choice, generic fantasy styling, excessive monochrome, or more than one nested card level.

- [ ] **Step 4: Select one exact target without user consultation**

Select `vermilion-bureau.png`. If its first generation misses any rejection criterion, regenerate that same direction until it passes instead of silently choosing a different file. Create `design/selected-visual.md` with this complete content, then replace only measurement values when original-image inspection proves a different exact pixel value:

```markdown
# Selected Visual Target

selected_target: design/visual-options/vermilion-bureau.png
viewport: 390 x 844

## Why This Wins

- First-viewport comprehension: chapter, event, and first choice are visible without scrolling.
- Narrative readability: the scene and editorial text surface have separate contrast zones.
- Distinctiveness: vermilion records-office motifs are recognizable without resembling generic ancient-fantasy UI.
- Implementation reliability: the composition uses one stable scene crop and three repeated choice rows.

## Fidelity Locks

- Scene height: 354px
- Horizontal padding: 20px
- Choice height and gap: 64px and 10px
- Type hierarchy: 12px metadata, 18px chapter heading, 15px narrative, 16px choice label, 12px choice detail
- Palette roles: ink background, bone text surface, vermilion primary action, oxidized teal status accent, old-gold metadata
```

- [ ] **Step 5: Commit the visual decision**

```bash
git add design/visual-options design/selected-visual.md
git commit -m "design: select mobile game visual direction"
```

Expected: one commit containing all three options and an unambiguous selected target.

---

### Task 2: Generate and optimize the complete raster asset pack

**Files:**
- Create: `public/assets/cover.webp`
- Create: `public/assets/scene-maritime.webp`
- Create: `public/assets/scene-desert.webp`
- Create: `public/assets/scene-forest.webp`
- Create: `public/assets/scene-celestial.webp`
- Create: `public/assets/scene-industrial.webp`
- Create: `public/assets/scene-polar.webp`
- Create: `public/assets/archive-texture.webp`
- Create: `public/assets/chronicle-ornament.webp`
- Create: `public/assets/seal.webp`

**Interfaces:**
- Consumes: exact art direction and composition from `design/selected-visual.md`.
- Produces: `Record<VisualTone, string>` compatible background URLs and three fixed decorative asset URLs.

- [ ] **Step 1: Catalog the selected target's raster assets**

Measure the reference at original detail and record focal point, crop, contrast, and safe text zones for cover, event background, paper texture, seal, and ending ornament.

- [ ] **Step 2: Generate the cover and six scene images**

Use seven separate built-in ImageGen calls. Each scene prompt must include:

```text
Use case: stylized-concept
Asset type: mobile game full-bleed background, 768 x 1024 source
Primary request: an archaeological reconstruction of a wholly fictional civilization, matching the selected visual target
Composition/framing: portrait, focal subject in upper-middle, calm low-detail lower 35 percent for readable UI overlap
Style/medium: tactile editorial illustration, museum archive photography fused with speculative historical artifacts
Color palette: ink black, bone white, vermilion, oxidized teal, restrained old gold
Constraints: no text, no logo, no real historical insignia, no known IP, no watermark, no gradient, no generic medieval European castle
```

Change only the environmental subject for `maritime`, `desert`, `forest`, `celestial`, `industrial`, and `polar`. The cover combines traces of all six without becoming a collage.

- [ ] **Step 3: Generate texture, ending ornament, and seal**

Use three separate ImageGen calls. Keep all three raster-native and consistent with the selected mockup. The seal contains no legible text so UI copy remains editable and reliable.

- [ ] **Step 4: Copy outputs into the workspace and convert to WebP**

Run after copying the chosen PNG outputs to `tmp/imagegen/`:

```bash
magick tmp/imagegen/cover.png -resize 768x1024^ -gravity center -extent 768x1024 -quality 78 public/assets/cover.webp
magick tmp/imagegen/scene-maritime.png -resize 768x1024^ -gravity center -extent 768x1024 -quality 76 public/assets/scene-maritime.webp
```

Repeat the same command shape for the remaining named assets. Use dimensions appropriate to their consuming component: texture 512 x 512, ornament 768 x 420, seal 256 x 256.

- [ ] **Step 5: Verify dimensions and package weight**

Run:

```bash
identify public/assets/*.webp
du -ch public/assets/*.webp
```

Expected: all ten files decode, no single scene exceeds 700KB, combined assets remain below 6.5MB.

- [ ] **Step 6: Commit the asset pack**

```bash
git add public/assets
git commit -m "design: add generated archive art assets"
```

---

### Task 3: Scaffold the tested mobile application shell

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/App.test.tsx`
- Create: `src/test/setup.ts`
- Create: `src/styles/base.css`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `PROJECT_CONTEXT.md`

**Interfaces:**
- Consumes: `/assets/cover.webp`.
- Produces: `App` and a working `npm run dev`, `npm test`, and `npm run build` baseline.

- [ ] **Step 1: Create package configuration**

Use these scripts and dependency groups:

```json
{
  "name": "nonexistent-age",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@phosphor-icons/react": "^2.1.10",
    "html-to-image": "^1.11.13",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@playwright/test": "^1.54.1",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.6",
    "@vitejs/plugin-react": "^4.6.0",
    "jsdom": "^26.1.0",
    "typescript": "~5.8.3",
    "vite": "^7.0.4",
    "vitest": "^3.2.4"
  }
}
```

Install with `npm install` and commit the resulting lockfile.

- [ ] **Step 2: Write the failing shell test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("offers immediate entry into the game", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "不存在的时代" })).toBeVisible();
    expect(screen.getByRole("button", { name: "降生" })).toBeEnabled();
  });
});
```

- [ ] **Step 3: Run the test and verify failure**

Run: `npm test -- src/App.test.tsx`  
Expected: FAIL because `App` does not yet render the named heading and button.

- [ ] **Step 4: Implement the minimal cover shell**

```tsx
export default function App() {
  return (
    <main className="app-shell">
      <section className="cover-screen">
        <p className="cover-kicker">AI 即兴人生模拟</p>
        <h1>不存在的时代</h1>
        <p>一生五次选择，亲手篡改一个从未存在的时代。</p>
        <button type="button">降生</button>
      </section>
    </main>
  );
}
```

Implement a 390px reference-width shell using `min-height: 100dvh`, safe-area padding, zero horizontal overflow, and the generated cover image. Do not add decorative CSS shapes.

- [ ] **Step 5: Run unit and production builds**

Run: `npm test -- src/App.test.tsx && npm run build`  
Expected: one passing test and a successful Vite production build.

- [ ] **Step 6: Create project context and commit**

`PROJECT_CONTEXT.md` must document purpose, current structure, entry points, and this scaffold under “最近改了什么”. Then run:

```bash
git add package.json package-lock.json index.html vite.config.ts tsconfig.json src .gitignore .env.example PROJECT_CONTEXT.md
git commit -m "feat: scaffold mobile narrative game"
```

---

### Task 4: Implement strict narrative schemas and parsing

**Files:**
- Create: `src/game/types.ts`
- Create: `src/game/schema.ts`
- Create: `src/game/schema.test.ts`

**Interfaces:**
- Produces: `EventTurn`, `ChronicleEnding`, `Choice`, `Stats`, `parseEventTurn(raw)`, `parseEnding(raw)`, and `extractFirstJsonObject(raw)`.

- [ ] **Step 1: Write failing parser and schema tests**

```ts
import { describe, expect, it } from "vitest";
import { extractFirstJsonObject, parseEventTurn } from "./schema";

describe("AI response parsing", () => {
  it("extracts JSON through markdown noise", () => {
    expect(extractFirstJsonObject("答复如下```json\n{\"chapter\":1}\n```尾注"))
      .toBe('{"chapter":1}');
  });

  it("rejects an event without exactly three choices", () => {
    const invalid = JSON.stringify({
      sessionTitle: "盐历",
      eraName: "无钟纪",
      chapter: 1,
      chapterName: "降生",
      timeLabel: "盐历七年",
      character: { name: "缄", age: "12", identity: "潮税学徒" },
      scene: { location: "盐港", narrative: "潮水第一次拒绝退去。", visualTone: "maritime", worldPulse: "港口开始用梦纳税。" },
      choices: [{ id: "A", label: "服从", subtext: "交出梦", impulse: "秩序" }],
      stats: { power: 10, livelihood: 40, bonds: 50, freedom: 20 },
      immediateEcho: null,
      causalLedger: [],
      callbackUsed: null
    });
    expect(() => parseEventTurn(invalid)).toThrow(/choices/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- src/game/schema.test.ts`  
Expected: FAIL because the parser module does not exist.

- [ ] **Step 3: Implement types and schemas**

Define the exact contracts from the design spec, including `PlayedTurn = { event: EventTurn; selectedChoiceId: "A" | "B" | "C"; echo: string }`. Implement a brace scanner that respects quoted strings and escapes, then parse with Zod. Enforce `choices.length === 3`, IDs `A/B/C`, chapter `1..5`, visual tone enum, ending timeline length five, causal chains length three, and stat/rarity score clamping through Zod transforms:

```ts
const boundedScore = z.number().finite().transform((value) =>
  Math.max(0, Math.min(100, Math.round(value)))
);

export function parseEventTurn(raw: string): EventTurn {
  return eventTurnSchema.parse(JSON.parse(extractFirstJsonObject(raw)));
}
```

- [ ] **Step 4: Run tests**

Run: `npm test -- src/game/schema.test.ts`  
Expected: all parser and schema tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/game/types.ts src/game/schema.ts src/game/schema.test.ts
git commit -m "feat: validate improvised narrative contracts"
```

---

### Task 5: Build prompts and the DeepSeek transport

**Files:**
- Create: `src/game/prompts.ts`
- Create: `src/game/prompts.test.ts`
- Create: `src/services/deepseek.ts`
- Create: `src/services/deepseek.test.ts`
- Create: `src/game/engine.ts`
- Create: `src/test/fixtures.ts`

**Interfaces:**
- Consumes: `EventTurn`, `ChronicleEnding`, `parseEventTurn`, `parseEnding`.
- Produces: `generateOpening(signal)`, `generateNext(history, selectedChoice, signal)`, and `generateEnding(history, signal)`.

- [ ] **Step 1: Write failing prompt tests**

```ts
import { describe, expect, it } from "vitest";
import { buildContinuationMessages } from "./prompts";
import { eventFixture } from "../test/fixtures";

it("carries every prior choice and causal debt into the next request", () => {
  const messages = buildContinuationMessages([
    { event: eventFixture, selectedChoiceId: "B", echo: "你烧掉了潮税册。" }
  ], 2);
  const body = messages.map((message) => message.content).join("\n");
  expect(body).toContain("烧掉了潮税册");
  expect(body).toContain(eventFixture.causalLedger[0].debt);
  expect(body).toContain("exactly three choices");
});
```

- [ ] **Step 2: Run prompt tests to verify failure**

Run: `npm test -- src/game/prompts.test.ts`  
Expected: FAIL because prompt builders do not exist.

- [ ] **Step 3: Implement prompt builders**

Create one immutable system prompt that says the model is a historical simulation director, must invent everything, cannot contradict ledger facts, must not expose reasoning, and must output JSON only. Serialize history as data rather than interpolated instructions:

```ts
export type ChatMessage = { role: "system" | "user"; content: string };

export function buildContinuationMessages(
  history: PlayedTurn[],
  chapter: 2 | 3 | 4 | 5
): ChatMessage[] {
  return [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: JSON.stringify({
        task: "generate_next_event",
        chapter,
        chapterFunction: CHAPTER_FUNCTIONS[chapter],
        immutableHistory: history,
        requirements: EVENT_REQUIREMENTS
      })
    }
  ];
}
```

- [ ] **Step 4: Write failing transport tests**

Test that the request uses `deepseek-v4-flash`, `thinking: { type: "enabled" }`, `reasoning_effort: "high"`, and retries one 429 before returning the second response. Test AbortSignal forwarding and a 45-second timeout with fake timers.

- [ ] **Step 5: Implement the transport**

```ts
const API_URL = "https://api.deepseek.com/chat/completions";

export async function requestCompletion(
  messages: ChatMessage[],
  signal?: AbortSignal
): Promise<string> {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) throw new DeepSeekError("missing_key", "缺少 DeepSeek API Key");

  return retryableFetch({
    url: API_URL,
    signal,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: import.meta.env.VITE_DEEPSEEK_MODEL || "deepseek-v4-flash",
      messages,
      thinking: { type: "enabled" },
      reasoning_effort: "high",
      response_format: { type: "json_object" },
      stream: false,
      max_tokens: 1800
    })
  });
}
```

Retry only 429 and 5xx twice with 600ms then 1500ms delays. Do not retry 400/401/403. Extract `choices[0].message.content`; throw typed errors for missing content.

- [ ] **Step 6: Implement validated engine functions**

Each engine function requests completion and parses it. On schema failure, call `buildRepairMessages(raw, targetSchema)` exactly once and parse again. Never silently invent fallback story content.

- [ ] **Step 7: Run tests and commit**

Run: `npm test -- src/game/prompts.test.ts src/services/deepseek.test.ts`  
Expected: all prompt and transport tests pass.

```bash
git add src/game/prompts.ts src/game/prompts.test.ts src/services/deepseek.ts src/services/deepseek.test.ts src/game/engine.ts src/test/fixtures.ts
git commit -m "feat: connect structured DeepSeek storytelling"
```

---

### Task 6: Implement the game state machine and persistence

**Files:**
- Create: `src/game/reducer.ts`
- Create: `src/game/reducer.test.ts`
- Create: `src/services/storage.ts`
- Create: `src/services/storage.test.ts`
- Create: `src/hooks/useGame.ts`

**Interfaces:**
- Consumes: engine generation functions.
- Produces: `GameState`, `gameReducer`, `useGame()` with `start`, `choose`, `continueAfterEcho`, `retry`, and `reset` commands.

- [ ] **Step 1: Write failing reducer tests**

```ts
it("does not accept a second choice while a choice is committed", () => {
  const eventState = stateWithEvent(eventFixture);
  const selected = gameReducer(eventState, { type: "choice_committed", choiceId: "A" });
  const duplicate = gameReducer(selected, { type: "choice_committed", choiceId: "C" });
  expect(duplicate).toEqual(selected);
});

it("requests an ending after chapter five", () => {
  const state = stateWithEvent({ ...eventFixture, chapter: 5 });
  const next = gameReducer(state, { type: "choice_committed", choiceId: "B" });
  expect(next.phase).toBe("echo");
  expect(next.pendingAfterEcho).toBe("ending");
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- src/game/reducer.test.ts`  
Expected: FAIL because the reducer does not exist.

- [ ] **Step 3: Implement reducer transitions**

Use these phases exactly:

```ts
export type GamePhase =
  | "idle"
  | "generating"
  | "event"
  | "echo"
  | "ending"
  | "chronicle"
  | "error";
```

Keep `lastStablePhase`, `pendingRequest`, `history`, `currentEvent`, `selectedChoiceId`, `ending`, and typed `error`. Reducer actions must ignore responses whose `requestId` does not match the active request.

- [ ] **Step 4: Write and implement versioned storage tests**

Persist under `nonexistent-age:session:v1`. Validate restored data with a storage schema; invalid versions or malformed JSON return `null` and remove the bad value.

- [ ] **Step 5: Implement `useGame` orchestration**

Maintain one `AbortController` per request. `reset()` aborts the active request before dispatching reset. Persist only stable `event`, `echo`, and `chronicle` states. Restore once on mount.

- [ ] **Step 6: Run tests and commit**

Run: `npm test -- src/game/reducer.test.ts src/services/storage.test.ts`  
Expected: all state and persistence tests pass.

```bash
git add src/game/reducer.ts src/game/reducer.test.ts src/services/storage.ts src/services/storage.test.ts src/hooks/useGame.ts
git commit -m "feat: add recoverable five-chapter state machine"
```

---

### Task 7: Build the complete interactive game UI from the selected image

**Files:**
- Create: `src/screens/CoverScreen.tsx`
- Create: `src/screens/EventScreen.tsx`
- Create: `src/screens/EchoScreen.tsx`
- Create: `src/screens/LoadingScreen.tsx`
- Create: `src/screens/ErrorScreen.tsx`
- Create: `src/screens/ChronicleScreen.tsx`
- Create: `src/components/ChapterProgress.tsx`
- Create: `src/components/StatRail.tsx`
- Create: `src/components/ChoiceList.tsx`
- Create: `src/components/ChronicleCard.tsx`
- Create: `src/components/IconButton.tsx`
- Create: `src/App.integration.test.tsx`
- Modify: `src/App.tsx`
- Create: `src/styles/game.css`

**Interfaces:**
- Consumes: `useGame()` and asset URL mapping.
- Produces: a complete mocked start-to-ending journey and the `ChronicleCard` DOM capture target.

- [ ] **Step 1: Write the failing full-flow integration test**

Mock engine calls with five event fixtures and one ending fixture. Then assert:

```tsx
await user.click(screen.getByRole("button", { name: "降生" }));
expect(await screen.findByText("潮水第一次拒绝退去")).toBeVisible();
await user.click(screen.getByRole("button", { name: /烧掉潮税册/ }));
expect(screen.getByText(/历史回响/)).toBeVisible();
await user.click(screen.getByRole("button", { name: "继续活下去" }));
```

Repeat through chapter five and assert the final title, rarity label, “保存史册”, and “再活一次” controls.

- [ ] **Step 2: Run the test to verify failure**

Run: `npm test -- src/App.integration.test.tsx`  
Expected: FAIL because the screens do not exist.

- [ ] **Step 3: Implement screens and controls**

Use semantic buttons and headings. Choice buttons show `label`, then `subtext`; their accessible names include both. Icon-only controls use Phosphor icons and `aria-label` plus `title`. Do not use text glyphs as icons.

Map visual tones exactly:

```ts
export const sceneAssets: Record<VisualTone, string> = {
  maritime: "/assets/scene-maritime.webp",
  desert: "/assets/scene-desert.webp",
  forest: "/assets/scene-forest.webp",
  celestial: "/assets/scene-celestial.webp",
  industrial: "/assets/scene-industrial.webp",
  polar: "/assets/scene-polar.webp"
};
```

- [ ] **Step 4: Recreate target measurements in CSS**

Use measured values from `design/selected-visual.md`, CSS custom properties for palette and spacing, fixed choice min-heights, safe-area padding, and `font-size` breakpoints rather than viewport-based font scaling. The event image must have a stable aspect ratio so loading and text changes do not shift controls.

- [ ] **Step 5: Run interaction tests and build**

Run: `npm test -- src/App.integration.test.tsx && npm run build`  
Expected: full mocked journey passes and production build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/App.integration.test.tsx src/screens src/components src/styles
git commit -m "feat: build the five-act mobile game experience"
```

---

### Task 8: Add share-card export and resilient user feedback

**Files:**
- Create: `src/services/share.ts`
- Create: `src/services/share.test.ts`
- Modify: `src/components/ChronicleCard.tsx`
- Modify: `src/screens/ChronicleScreen.tsx`
- Modify: `src/screens/ErrorScreen.tsx`

**Interfaces:**
- Consumes: a chronicle DOM node and `ChronicleEnding.shareLine`.
- Produces: `exportChronicle(node, shareLine)` with Web Share, download, and clipboard behavior.

- [ ] **Step 1: Write failing share tests**

Test three branches: `navigator.share` with a generated PNG file; unsupported file sharing falls back to an object URL download; clipboard receives `shareLine` when image sharing is unavailable.

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- src/services/share.test.ts`  
Expected: FAIL because `exportChronicle` does not exist.

- [ ] **Step 3: Implement export and feedback**

```ts
import { toBlob } from "html-to-image";

export async function exportChronicle(node: HTMLElement, shareLine: string) {
  const blob = await toBlob(node, { pixelRatio: 2, cacheBust: true });
  if (!blob) throw new Error("史册生成失败");
  const file = new File([blob], "不存在的时代-人生史册.png", { type: "image/png" });
  if (navigator.canShare?.({ files: [file] }) && navigator.share) {
    await navigator.share({ files: [file], text: shareLine, title: "不存在的时代" });
    return "shared" as const;
  }
  await navigator.clipboard?.writeText(shareLine);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  link.click();
  URL.revokeObjectURL(url);
  return "downloaded" as const;
}
```

Show loading, success, and failure feedback in the existing command area without adding a nested card or layout shift.

- [ ] **Step 4: Run tests and commit**

Run: `npm test -- src/services/share.test.ts && npm run build`  
Expected: all share branches pass and build succeeds.

```bash
git add src/services/share.ts src/services/share.test.ts src/components/ChronicleCard.tsx src/screens/ChronicleScreen.tsx src/screens/ErrorScreen.tsx
git commit -m "feat: export and share generated life chronicles"
```

---

### Task 9: Connect the real key and verify the complete product

**Files:**
- Create untracked: `.env.local`
- Create: `playwright.config.ts`
- Create: `e2e/game.spec.ts`
- Create: `design-qa.md`
- Modify: `PROJECT_CONTEXT.md`

**Interfaces:**
- Consumes: the complete product, selected reference image, and user-provided DeepSeek key.
- Produces: passing unit/build/E2E evidence, three successful real runs, and passed visual QA.

- [ ] **Step 1: Configure the local secret**

Create untracked `.env.local` with the exact DeepSeek key already supplied by the user in this task and the exact second line `VITE_DEEPSEEK_MODEL=deepseek-v4-flash`. Never copy the key value into this tracked plan, `.env.example`, screenshots, test output, or commits.

Run `git check-ignore .env.local`.  
Expected: `.env.local` is printed, proving it cannot be committed accidentally.

- [ ] **Step 2: Write Playwright full-flow tests with API interception**

Configure `webServer.command` as `npm run dev -- --host 127.0.0.1 --port 4173` and viewport 390 x 844. Intercept `https://api.deepseek.com/chat/completions`, return fixture JSON in sequence, and verify all five choices, final chronicle, replay, refresh restore, and one 500 retry.

- [ ] **Step 3: Run automated verification**

Run:

```bash
npm test
npm run build
npx playwright test
du -sh dist
```

Expected: all unit tests pass, production build succeeds, all browser tests pass, and `dist` remains below 8MB.

- [ ] **Step 4: Start the local app and run three real DeepSeek sessions**

Start on the first free local port. Complete three runs without API interception. Record in `design-qa.md` whether each run had a unique world, distinct choices, at least three callbacks, a five-item timeline, and no decisive ending invention.

- [ ] **Step 5: Capture and compare the selected target**

Use the in-app Browser at 390 x 844. Capture cover, chapter-one event, echo, and chronicle. Inspect the selected ImageGen target and matching app state side by side. Record all fidelity, overflow, contrast, hierarchy, and interaction findings in `design-qa.md`.

- [ ] **Step 6: Fix all P0, P1, and P2 findings and repeat QA**

Repeat capture and comparison until the file ends exactly with:

```text
final result: passed
```

- [ ] **Step 7: Update project context and run final verification**

Document all created modules, runtime commands, DeepSeek configuration boundary, visual assets, tests, and recent changes in `PROJECT_CONTEXT.md`. Then run:

```bash
git diff --check
npm test
npm run build
npx playwright test
git status --short
```

Expected: no whitespace errors; all tests and build pass; only `.env.local` remains ignored and absent from status.

- [ ] **Step 8: Commit verified product state**

```bash
git add playwright.config.ts e2e design-qa.md PROJECT_CONTEXT.md src public package.json package-lock.json
git commit -m "test: verify complete AI history experience"
```

Expected: clean tracked worktree and a still-running local development server for handoff.
