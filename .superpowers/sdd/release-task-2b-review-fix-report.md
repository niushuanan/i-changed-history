# Release Task 2B review fix

## Scope

- Preserve a timeline click target while the filmstrip performs a smooth programmatic scroll.
- Keep pointer, touch, wheel, and direct carousel scrolling authoritative for user-driven browsing.
- Raise each timeline year target from 42px to 44px minimum width.

## Root cause and RED evidence

At 390x844, clicking `定位到公元 1991 年` started a smooth scroll from the first card. Every intermediate `scroll` event was interpreted as user intent, changed `activeSeedId`, and triggered another smooth scroll toward that intermediate card. After two seconds the current marker and carousel had returned to the first card (`公元前 770 年`, `scrollLeft = 0`).

The regression test reproduced the event sequence before the fix. It expected `soviet-dissolution-1991` to remain active during intermediate positions, but received `gaoping-tombs-249` on the first sampled frame.

## Fix

- Track the active programmatic card target and ignore only its intermediate smooth-scroll frames.
- Release that target immediately when a pointer, touch, or wheel gesture begins.
- Mark active-index changes sourced from carousel scrolling so the synchronization effect does not start a competing programmatic scroll.
- Keep the timeline connector geometry aligned with the new 44px year targets.

## Verification

- Focused: `src/screens/SeedPickerScreen.test.tsx` — 8/8 passed.
- Real browser at 390x844:
  - direct 1991 positioning remained current after two seconds (`scrollLeft = 30846`);
  - 1991 filmstrip -> grid -> filmstrip remained on 1991;
  - grid retained the 1991 current card and two columns;
  - timeline target measured 44x54px;
  - console reported 0 errors and 0 warnings.
- `npm run typecheck` — passed.
- `npm run build` — passed.
- scoped `git diff --check` — passed.
- Full suite was executed: 240/245 passed. The five failures are from concurrent, uncommitted Task 3 tests in `prompts.test.ts`, `schema.test.ts`, `ResultFrontPage.test.tsx`, and `AlternatePresentScreen.test.tsx`; none touches this fix's three source/test files.
