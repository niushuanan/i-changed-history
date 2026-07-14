# Remove Post-1949 China History Nodes Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan.

**Goal:** Replace all China/CCP-related history nodes from 1949 onward with two famous world-history turning points while keeping the 100-card catalog, local assets, filters, and fixed openings consistent.

**Architecture:** This is a content-only migration across the canonical seed dataset and its generated local image manifest. Existing `HistorySeed` types, catalog filters, fixed-opening generation, and UI remain unchanged. Tests become the durable policy boundary so later content edits cannot reintroduce post-1949 China or CCP/PRC subjects.

**Tech Stack:** TypeScript, Vitest, Node image-fetch script, local WebP assets, React/Vite verification.

---

### Task 1: Add the policy regression tests

**Files:**
- Modify: `src/data/historySeeds.test.ts`

**Step 1: Write the failing test**

Update the count assertion to 58 China / 42 world; assert no China seed has `year >= 1949`; assert all seed text excludes `中国共产党|中共|中华人民共和国|新中国|改革开放`; assert the two old IDs are absent and the two new IDs are present.

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/historySeeds.test.ts`
Expected: FAIL against the old 60/40 dataset and old IDs.

### Task 2: Replace data and local image assets

**Files:**
- Modify: `src/data/historySeeds.ts`
- Modify: `scripts/fetch-history-images.mjs`
- Modify: `public/assets/history/manifest.json`
- Modify: `public/assets/history/CREDITS.md`
- Delete: `public/assets/history/prc-founded-1949.webp`
- Delete: `public/assets/history/reform-opening-1978.webp`
- Create: `public/assets/history/suez-nationalization-1956.webp`
- Create: `public/assets/history/web-public-domain-1993.webp`

**Step 1: Replace the two seeds**

Implement the approved factual content from the design spec. Keep both seeds `perspective: "world"`, with complete facts and balanced topic tags.

**Step 2: Map and fetch images**

Replace the old Wikipedia mappings with `Suez Crisis` and `World Wide Web`; use a directly relevant event/computer image override if the lead image is not event-accurate. Run the repository image-fetch script and remove obsolete binaries.

**Step 3: Run focused policy and asset tests**

Run: `npx vitest run src/data/historySeeds.test.ts src/data/historyImageManifest.test.ts src/data/visualAssets.test.ts src/data/fixedOpenings.test.ts`
Expected: PASS.

### Task 3: Update durable product documentation

**Files:**
- Modify: `AGENTS.md`
- Modify: `README.md`
- Modify: `PROJECT_CONTEXT.md`

**Step 1: Update product rules**

Replace the obsolete 60/40 rule with 58/42 and add the explicit permanent exclusion of China events from 1949 onward and CCP/PRC political subjects, while preserving Soviet history.

**Step 2: Update public and project context**

Update README counts and add a complete `PROJECT_CONTEXT.md` recent-change entry listing files, rationale, affected modules, and verification evidence.

### Task 4: Verify the release and integrate it

**Step 1: Run automated checks**

Run: `npm test -- --run && npm run typecheck && npm run build && npm run check:portability && git diff --check`

**Step 2: Run one browser content QA pass**

At 390×844, verify 100 total cards, 58 China results, 42 world results, both new cards searchable with images, both removed cards absent, and zero console errors. Do not start a DeepSeek game run.

**Step 3: Review, commit, merge and push**

Review the complete branch diff, commit on `codex/remove-post-1949-china`, fast-forward `main`, re-run release checks if integration changed, push `main`, and verify the remote SHA.
