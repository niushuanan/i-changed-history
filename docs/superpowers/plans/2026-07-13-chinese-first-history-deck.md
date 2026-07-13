# Chinese-First History Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 18-China/32-world opening deck with exactly 30 pre-1840 Chinese moments and 20 world moments recognizable to ordinary Chinese players.

**Architecture:** Keep the existing `HistorySeed` contract, one chronological carousel, and local-asset resolver unchanged. Rewrite only the seed catalogue, strengthen catalogue tests, extend the Wikipedia image manifest, regenerate local WebP files, and validate the unchanged UI against the new content.

**Tech Stack:** React 19, TypeScript, Vitest, Vite, Node.js image fetch script, Wikipedia pageimages API, WebP assets, Playwright browser verification.

## Global Constraints

- The product title remains exactly `I！我改变了历史`.
- The deck contains exactly 50 AD moments: 30 Chinese moments before 1840 and 20 world moments.
- World cards use broadly recognizable people or events for Chinese players.
- Public-memory fiction can inspire hooks, but all card facts and outcomes remain historically anchored.
- The UI remains one chronological horizontal filmstrip with no filters, modal archive, recommended subset, or alternate browsing mode.
- Every runtime history image is a local `/assets/history/<seed-id>.webp` file.

---

### Task 1: Lock the Catalogue Contract

**Files:**
- Modify: `src/data/historySeeds.test.ts`

**Interfaces:**
- Consumes: `HISTORY_SEEDS: readonly HistorySeed[]`
- Produces: regression assertions for exact regional counts, required familiar IDs, excluded specialist IDs, and local asset paths

- [ ] **Step 1: Write the failing count and anchor tests**

```ts
expect(HISTORY_SEEDS.filter((seed) => seed.perspective === "china")).toHaveLength(30);
expect(HISTORY_SEEDS.filter((seed) => seed.perspective === "world")).toHaveLength(20);
expect(HISTORY_SEEDS.map((seed) => seed.id)).toEqual(expect.arrayContaining([
  "dong-zhuo-lu-bu-190", "guandu-wuchao-200", "jieting-228",
  "newton-principia-1687", "roosevelt-bank-holiday-1933", "apollo-11-1969",
]));
```

- [ ] **Step 2: Run the focused test and verify red**

Run: `npm test -- --run src/data/historySeeds.test.ts`

Expected: FAIL because China has 18 cards and the new IDs do not exist.

- [ ] **Step 3: Add a filesystem-independent local path contract**

```ts
for (const seed of HISTORY_SEEDS) {
  expect(historyAssetForSeed(seed)).toBe(`/assets/history/${seed.id}.webp`);
}
```

- [ ] **Step 4: Keep the test red until catalogue implementation**

Run: `npm test -- --run src/data/historySeeds.test.ts`

Expected: FAIL only on count and missing anchor assertions.

### Task 2: Rewrite the Fifty Moments

**Files:**
- Modify: `src/data/historySeeds.ts`
- Test: `src/data/historySeeds.test.ts`

**Interfaces:**
- Consumes: existing `moment(...)` helper and `HistorySeed` type
- Produces: `HISTORY_SEEDS` with 30 Chinese and 20 world entries

- [ ] **Step 1: Add the twelve Chinese moments**

Add real historical anchors for Dong Zhuo/Lu Bu, Guandu, Yiling, Jieting, Gaoping Tombs, Wu Zetian, Mawei, Wang Anshi, Xiangyang, Jingnan, Ningyuan, and Kangxi/Aobai. Each uses one concrete role, one immediate decision, three facts, and one actual outcome.

- [ ] **Step 2: Replace twenty specialist world moments with eight familiar anchors**

Keep twelve existing famous world cards and add Newton, Lincoln, the October Revolution, Roosevelt, Hitler/Poland, Stalin/Moscow, Normandy, and Apollo 11. Remove Teutoburg, Milan, Tours, Charlemagne, Hastings, Clermont, the Fourth Crusade, Magna Carta, Mongol Japan, Tenochtitlan, Spanish Armada, Sekigahara, Vienna, Boston Tea Party, US Declaration, Trafalgar, Gettysburg, Meiji, Wall Street, and Dunkirk.

- [ ] **Step 3: Correct Chanyuan copy**

Replace `澧渊/澧州` with `澶渊/澶州` in title, place, outcome, and baseline facts.

- [ ] **Step 4: Run the catalogue test and verify green**

Run: `npm test -- --run src/data/historySeeds.test.ts`

Expected: all catalogue tests pass with 50 unique IDs, exact 30/20 counts, and no post-1840 Chinese card.

### Task 3: Build Local Images for Every New Card

**Files:**
- Modify: `scripts/fetch-history-images.mjs`
- Create: `public/assets/history/<20-new-id>.webp`
- Modify: `public/assets/history/CREDITS.md`
- Modify: `public/assets/history/fallbacks.json`

**Interfaces:**
- Consumes: seed IDs parsed from `src/data/historySeeds.ts`
- Produces: one local WebP per active seed and auditable source/fallback metadata

- [ ] **Step 1: Add exact Wikipedia page titles**

Extend `pageTitles` with all 20 new IDs, using event pages when available and recognizable person pages otherwise.

- [ ] **Step 2: Regenerate the active image set**

Run: `node scripts/fetch-history-images.mjs`

Expected: JSON reports `requested: 50`; every active seed has an output file even when a local period fallback is required.

- [ ] **Step 3: Verify asset completeness**

Run:

```bash
node -e 'const fs=require("fs");const s=fs.readFileSync("src/data/historySeeds.ts","utf8");const ids=[...s.matchAll(/moment\("([^"]+)"/g)].map(x=>x[1]);const missing=ids.filter(id=>!fs.existsSync(`public/assets/history/${id}.webp`));if(missing.length)throw Error(missing.join(","));console.log(ids.length)'
```

Expected: `50`.

### Task 4: Verify Product Behavior and Documentation

**Files:**
- Modify: `PROJECT_CONTEXT.md`
- Modify: `design-qa.md` only if a new visual issue or capture is recorded

**Interfaces:**
- Consumes: final deck and generated assets
- Produces: verified build, browser evidence, and current project context

- [ ] **Step 1: Run automated checks**

Run: `npm test -- --run && npm run typecheck && npm run build`

Expected: all tests pass, TypeScript exits 0, Vite production build exits 0.

- [ ] **Step 2: Verify the real carousel at 390 x 844**

Open `http://127.0.0.1:5174/`, complete the four profile choices, confirm the time axis reports `1 / 50`, swipe through early China and late world cards, and verify images, role text, decision text, and the enter button render without clipping.

- [ ] **Step 3: Enter one new Chinese card and one new world card**

Confirm both start a real game scene, use the selected event title and local image, and preserve the existing exit control.

- [ ] **Step 4: Update project context**

Add one dated entry describing the 30/20 catalogue, familiar world anchors, historically grounded Chinese counterfactuals, corrected Chanyuan copy, regenerated images, and affected modules.

- [ ] **Step 5: Review, commit, and push**

Run: `git diff --check`, inspect the final diff, commit with `feat: rebuild history deck for Chinese players`, and push `main` to `origin`.

