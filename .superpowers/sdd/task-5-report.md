# Task 5 Report: Structured Timeline Generation

## Implementation

- Added a quote-aware JSON object scanner and strict Zod contracts for timeline turns and alternate-present endings.
- Enforced ordered `A/B/C` choices, exactly one each of `nudge/reform/rupture`, complete instant echoes, chapter/name consistency, first-turn null echo, clamped integer world metrics, five ending timeline entries, three causal chains, and three ordinary-life details.
- Added one immutable Chinese system prompt. Curated anchors, compressed played-turn history, selected choices, metrics, and causal facts are serialized as JSON; player text and invalid model output remain isolated under `untrusted*` fields.
- Added fixed chapter functions and time horizons, plus ending constraints that require ordinary-life details and prohibit a decisive new invention, war, or person.
- Added the DeepSeek V4 Flash transport with turn/ending request profiles, JSON object mode, non-streaming responses, 28-second abort, one 650 ms retry for 429/5xx/network errors, and no authentication retry.
- Added `generateOpening`, `generateNextTurn`, and `generateEnding`. A schema failure triggers exactly one JSON-only repair request; a second invalid result raises the Chinese `invalid_structure` error without fallback narrative.

## Files

- `src/game/schema.ts`
- `src/game/schema.test.ts`
- `src/game/prompts.ts`
- `src/game/prompts.test.ts`
- `src/services/deepseek.ts`
- `src/services/deepseek.test.ts`
- `src/game/engine.ts`
- `src/test/fixtures.ts`
- `.superpowers/sdd/task-5-report.md`

## RED/GREEN Evidence

### RED

- Initial supplied contract: `npm test -- src/game/schema.test.ts src/game/prompts.test.ts src/services/deepseek.test.ts`
  - Result: 3 files failed, 14 tests failed exactly as expected.
- Expanded schema contract: `npm test -- src/game/schema.test.ts`
  - Result before implementation: 6 tests failed, covering extraction, metric normalization, choice identity/class, echo completeness, chapter bounds, and ending cardinality.
- Expanded transport contract: `npm test -- src/services/deepseek.test.ts`
  - Result before implementation: 7 tests failed, including 429/5xx/network retry and 28-second abort.
- Engine contract: `npm test -- src/services/deepseek.test.ts`
  - Result before `engine.ts`: suite failed on the expected missing module.
- Timeout-body regression: `npm test -- src/services/deepseek.test.ts -t "preserves the timeout error"`
  - Result before correction: expected `timeout`, received `invalid_response`.

### GREEN

- Focused layers passed independently: schema 6/6, prompts 5/5, transport and engine 12/12.
- Full suite: `npm test`
  - Result: 5 files passed, 36 tests passed.
- TypeScript: `npm run typecheck`
  - Result: passed with no errors.
- Production build: `npm run build`
  - Result: passed; Vite transformed 29 modules and emitted the production bundle.
- Hygiene: `git diff --check`
  - Result: passed with no whitespace errors.

## Self-Review

- Confirmed custom premise, in-game intervention, and model repair text never enter the system prompt.
- Confirmed ordinary turns disable thinking at 1,100 tokens, while only endings enable high-effort thinking at 1,800 tokens.
- Confirmed timeout covers both the initial fetch and response-body consumption.
- Confirmed automatic retries stop after one retry and never apply to 401, external cancellation, timeout, or schema repair failure.
- Confirmed no DeepSeek API key or fallback story content was added.
- Confirmed `src/game/types.ts`, `src/game/input*`, and `src/data/*` were not changed.

## Scope Notes

- No live DeepSeek request was made because this task must not add or expose an API key; transport behavior is verified with complete HTTP response fixtures.
- `PROJECT_CONTEXT.md` already exists but is outside Task 5 exclusive ownership, so it is left for the integrating owner to update after this commit is incorporated.

## Review Remediation - 2026-07-12

### Changes

- Widened continuation and ending APIs to accept `HistorySeed | string`. A custom premise now remains under `untrustedPlayerPremise` in every later request and never becomes a synthetic `historySeed`.
- Extended `PlayedTurn` with custom-intervention source data. Persisted player text is serialized only as `untrustedPlayerIntervention`; the trusted choice object uses a fixed label.
- Added post-Zod ending validation that compares all five `historyTimeline.playerChoice` values with played turns in order. A mismatch triggers the single repair request with `untrustedExpectedPlayerChoices`.
- Added all eight valid `visualTone` values to the shared turn output contract used by ordinary and repair prompts.
- Preserved response-body `TypeError`/`AbortError` semantics: network interruptions retry once, external aborts stop immediately, and timeouts retain the timeout code.
- Added `expectedChapter` to opening and continuation repair requests, including chapter-name repair guidance.
- Enforced the 150-character narrative limit in Zod.

### RED Evidence

- Custom scenario continuation/ending: 3 expected failures showed strings were expanded as seeds and crashed on `baselineFacts`; a separate repair regression showed `untrustedPlayerPremise` was omitted from the repair request.
- Persisted intervention isolation: the regression received no `untrustedPlayerIntervention` and exposed the player text as a trusted label.
- Ending choice consistency: a shape-valid ending with five incorrect choices was accepted without repair.
- Visual tone contract: ordinary and repair output contracts returned no visual-tone enumeration.
- Response-body errors: both body-stream network failure and external abort surfaced as `invalid_response`.
- Wrong-chapter repair: the repair payload omitted `expectedChapter`.
- Narrative length: a 151-character narrative passed schema validation.

### GREEN Evidence

- Focused: `npm test -- src/game/schema.test.ts src/game/prompts.test.ts src/services/deepseek.test.ts`
  - Result: 3 files passed, 34 tests passed.
- TypeScript: `npm run typecheck`
  - Result: passed with no errors.
- Full suite: `npm test`
  - Result: 5 files passed, 47 tests passed.
- Production build: `npm run build`
  - Result: passed; Vite transformed 29 modules and emitted the production bundle.
- Hygiene: `git diff --check`
  - Result: passed with no whitespace errors.

## Final Review Remediation - 2026-07-12

### Changes

- Added `baselineAnchor` to the played-turn prompt contract and every serialized history item, preserving the model-extracted historical anchor through custom-premise continuation and ending requests.
- Derived `expectedChapterName` from the shared `CHAPTERS` mapping and included it in turn repair payloads; chapter 2 now explicitly repairs to `余震`.

### RED Evidence

- Baseline-anchor regression: continuation and ending payloads returned `undefined` for the first played turn's `baselineAnchor`.
- Wrong-chapter repair regression: the repair payload contained `expectedChapter: 2` but returned `undefined` for `expectedChapterName`.

### GREEN Evidence

- Focused: `npm test -- src/game/schema.test.ts src/game/prompts.test.ts src/services/deepseek.test.ts`
  - Result: 3 files passed, 35 tests passed.
- TypeScript: `npm run typecheck`
  - Result: passed with no errors.
- Full suite: `npm test`
  - Result: 5 files passed, 48 tests passed.
- Production build: `npm run build`
  - Result: passed; Vite transformed 29 modules and emitted the production bundle.
- Hygiene: `git diff --check`
  - Result: passed with no whitespace errors.
