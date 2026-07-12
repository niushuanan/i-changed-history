# Task 4 Report: Fifty-Card History Deck and Custom Input Boundary

## Implementation

- Added a typed, globally distributed deck of 50 real historical turning points: 10 each for `ancient`, `medieval`, `early-modern`, `industrial`, and `modern`.
- Every seed includes a stable ID, year, location, China-policy flag, exactly three restrained baseline facts, a concise `如果……` prompt, domain, and visual tone.
- Chinese history is limited to pre-1840 cards. No seed is China-related at or after 1840, and no Library of Alexandria single-fire myth is included.
- Implemented `dealHistorySeeds(previousIds, random)`: it selects one seed per era, avoids the immediately preceding IDs whenever an alternative exists, shuffles the five selected records with the supplied random source, and does not mutate `HISTORY_SEEDS`.
- Added the shared `HistorySeed`, `HistoryEra`, `VisualTone`, and custom-input result contracts.
- Implemented custom premise normalization: whitespace is collapsed, values retain their normalized user text, length is bounded to 4-140 characters, premises need at least four Han characters, and explicit China-related 1840+ or unambiguously modern China combinations are rejected.

## Files

- `src/data/historySeeds.ts`
- `src/data/historySeeds.test.ts`
- `src/game/types.ts`
- `src/game/input.ts`
- `src/game/input.test.ts`

## Tests

- Focused: `npm test -- src/data/historySeeds.test.ts src/game/input.test.ts`
  - Passed: 2 test files, 10 tests.
- Full suite: `npm test`
  - Passed: 2 test files, 10 tests.
- Hygiene: `git diff --check`
  - Passed with no whitespace errors.

## RED/GREEN Evidence

### RED

- Initial supplied tests: 7 tests ran; 5 expected assertions failed because the deck was empty and input normalization was stubbed.
- After adding focused edge coverage: 9 tests ran; 6 expected assertions failed before implementation.
- During self-review, the added three-character premise test failed as expected: it received `not_chinese` before the implementation was reordered to return `too_short`.

### GREEN

- After implementation and the minimum-length correction, the focused suite passed 10/10.
- The full suite also passed 10/10.

## Self-Review

- Confirmed the deck has exactly 50 unique IDs and ten records in every era.
- Confirmed every seed has exactly three baseline facts.
- Confirmed all China-related curated records are before 1840.
- Confirmed dealing uses copies produced by `filter`, preserving the source deck.
- Confirmed the injected random source drives both selection and shuffle.
- Confirmed failure results retain normalized input rather than discarding the premise.

## Concerns

- The current repository has no TypeScript configuration or type-check script, so Vitest is the available automated verification for these TypeScript modules.
- `PROJECT_CONTEXT.md` is absent, but creating it would violate the explicitly assigned exclusive write scope; this task therefore leaves project-context creation to its owning task.

## Review Remediation - 2026-07-12

### Changes

- Broadened the modern-China reference gate to recognize `北京`, `上海`, and Qing-era references alongside the existing China terms, while retaining `清末`. The year threshold remains 1840, so `如果1433年北京继续支持远航` is allowed.
- Replaced the generic 1973 Vienna oil-crisis card with the OAPEC Kuwait City meeting, using the October 1973 production-cut decision and supply-restriction context as its three factual anchors.
- Replaced the vague 1660 west-African-gold card with the 1701 Kumasi Asante confederacy consolidation after the defeat of Denkyira.

### Commands And Results

- RED: `npm test -- src/data/historySeeds.test.ts src/game/input.test.ts`
  - Expected failures observed: the 1840 Beijing premise was accepted, and the two corrected seed IDs were absent.
  - Result: 3 failed, 10 passed.
- GREEN: `npm test -- src/data/historySeeds.test.ts src/game/input.test.ts`
  - Result: 2 files passed, 13 tests passed.
- RED regression protection: `npm test -- src/game/input.test.ts`
  - Expected failure observed: `如果1911年清末发生另一种变化` was accepted after the broader-gate refactor omitted `清末`.
  - Result: 1 failed, 6 passed.
- Final GREEN: `npm test -- src/data/historySeeds.test.ts src/game/input.test.ts`
  - Result: 2 files passed, 13 tests passed.
- Full suite, run once as requested: `npm test`
  - Result: 2 files passed and 3 files failed; 13 tests passed and 14 tests failed.
  - The failures are in untracked, out-of-scope `src/game/prompts.test.ts`, `src/game/schema.test.ts`, and `src/services/deepseek.test.ts`, which exercise incomplete modules outside this task's exclusive write scope.
- Hygiene: `git diff --check`
  - Result: passed with no whitespace errors.

### Review Concerns

- The assigned Task 4 tests pass. The repository-wide suite remains blocked by the unrelated untracked test modules above; `npm test` was not rerun after the final `清末` preservation adjustment, to honor the requested single full-suite execution.

## Critical Re-Review Remediation - 2026-07-12

### Changes

- Replaced the narrow modern-China regex branches with `MODERN_CHINA_ENTITY_LEXICON`, grouped into date-gated China names, all province-level regions, major cities, historical terms, modern context markers, and always-modern political entities, movements, and figures.
- Date-gated entities now reject post-1840 Guangzhou, Hong Kong, and Taiwan premises while preserving pre-1840 Beijing and Guangzhou premises.
- Explicitly modern political references, including `毛泽东`, are rejected even when a year is omitted.

### Commands And Results

- RED: `npm test -- src/game/input.test.ts`
  - Expected failure observed: `如果1949年广州发生另一种变化` was accepted, proving the previous lexicon did not cover Guangzhou or the other new entity cases.
  - Result: 1 failed, 6 passed.
- GREEN: `npm test -- src/data/historySeeds.test.ts src/game/input.test.ts`
  - Result: 2 files passed, 13 tests passed. Coverage includes 1949 Guangzhou, 1997 Hong Kong, 1949 Taiwan, `毛泽东`, explicit modern Guangzhou, and the allowed 1839 Guangzhou and 1433 Beijing cases.
- Full suite, run once as requested: `npm test`
  - Result: 2 files passed and 3 files failed; 13 tests passed and 14 tests failed.
  - Expected unrelated Task 5 RED failures remain confined to untracked `src/game/prompts.test.ts`, `src/game/schema.test.ts`, and `src/services/deepseek.test.ts`; they were not changed.
- Hygiene: `git diff --check`
  - Result: passed with no whitespace errors.
