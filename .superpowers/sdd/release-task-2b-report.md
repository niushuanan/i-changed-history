# Release Task 2B Report

## Scope

- Base: `aac6571 feat: add searchable history catalog`.
- Implemented only `SeedPickerScreen` / `App` integration, their tests, and `game.css`.
- Did not modify report, save, prompt, storage, or project documentation code.

## TDD evidence

### RED

- Initial focused run: 2 test files failed, 7 tests failed, 39 passed. Failures were the expected missing controlled picker context, stable `activeSeedId`, grid mode, filters, and App browse-context restoration.
- Browser-found overlap regression: the new `role="group"` assertion failed before the segmented control fix, proving the control was not exposed as a grouped UI.
- Filmstrip selection regression: direct card click kept the prior `activeSeedId` before the explicit context update was implemented.

### GREEN

- Focused: 4 files passed, 47 tests passed.
- Full: 30 files passed, 241 tests passed.
- `npm run typecheck`: passed.
- `npm run build`: passed; 4,696 modules transformed.
- `git diff --check`: passed.

## Implementation summary

- Exported `PickerContext` and `DEFAULT_PICKER_CONTEXT`; removed local active-index state and derive the index from stable `activeSeedId`.
- Added controlled filmstrip/grid switching with 44px segmented controls and mutually exclusive rendering.
- Preserved the complete chronological 100-card filmstrip, year/card synchronization, next-card preview, and parenthetical swipe hint; replaced the fixed-width timeline line with per-node connector segments.
- Added grid search, time/region/theme filters, AND-combined results, result count, clear/empty states, two-column compact cards, and current-item restoration after filters clear.
- `App` owns picker-only state in `useState`; starting and exiting a run preserves mode, filters, and current seed without adding it to game state or model/storage inputs.
- Both filmstrip and grid card selection commit the exact seed to picker context before `onSelect`; fixed first turn remains synchronous and makes no opening model request.

## Browser verification

- Opened the local app in a real browser at 390 x 844.
- Verified both segmented buttons are fully visible and clickable, grid is exactly two columns, images remain inside cards, and vertical scrolling works.
- Verified 0 console errors and 0 console warnings.
- Temporary Playwright artifacts were removed before commit.

## Self-review / concerns

- Picker context is deliberately session-memory UI state: it survives game entry/exit but not a full page reload, matching the brief and avoiding storage contamination.
- The inherited `.superpowers/sdd/progress.md` worktree change was left untouched and excluded from this commit.
