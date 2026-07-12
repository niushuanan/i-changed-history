# Task 7 Report: Full Playable Image-to-Code Journey

## Implementation

- Rebuilt the prototype as the complete `哎！我改变了历史` journey: five-card archive picker, custom historical premise, five generated chapters, immediate butterfly echoes, free interventions, deterministic deviation, alternate-2026 front page, restart, mute, and error recovery.
- Matched the selected ImageGen redaction-room direction with coal, newsprint, red, teal, and yellow accents; real public-domain historical scene assets; stable scene and control dimensions; Phosphor icons; and no decorative gradients or nested cards.
- Added high-resolution front-page PNG export with native file sharing where supported and a download fallback.
- Hardened the live DeepSeek path from real-browser evidence: exact turn and ending JSON examples, stable V4 formatting normalization, authoritative callback/history reconstruction, parser diagnostics in repair prompts, and repair requests that retain the original generation context.

## RED Evidence

- Picker and custom-route integration tests failed before the screens existed.
- Real DeepSeek runs exposed repeatable opening enum drift, partial continuation echoes, repair-fragment responses, and string-only ending timeline entries.
- Focused regression tests were added before each fix.
- Export service and export-state component tests failed before implementation.

## GREEN Evidence

- `npm test`: 13 files passed, 98 tests passed.
- `npm run typecheck`: passed.
- `npm run build`: passed; 4,686 modules transformed.
- Real in-app browser run: curated opening, five chapters, one free intervention, immediate echoes, alternate 2026, and PNG export all passed.
- Export artifact: 780 x 2686 PNG, visually inspected with no clipped content.
- Mobile layout audit: document 390 px client width and 390 px scroll width; no horizontal overflow.

## Files

- `src/App.tsx`, `src/main.tsx`
- `src/screens/*`, `src/components/*`
- `src/styles/game.css`, `src/data/visualAssets.ts`
- `src/services/share.ts`, `src/services/share.test.ts`
- `src/game/engine.ts`, `src/game/prompts.ts`, `src/game/schema.ts`
- `src/App.integration.test.tsx`
- `design/captures/*`, `design-qa.md`

## Review Remediation

- Replaced ambiguous field lists with complete chapter-aware JSON examples.
- Kept the original scenario and played-turn context in repair requests.
- Made prior AI-choice echoes and ending history labels deterministic client inputs, preventing the model from rewriting player history.
- Converted common shape drift locally to avoid a second network round trip.
- Added explicit progress, success, and retry states to the export action.
