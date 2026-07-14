# Release Task 2A Report

## Scope

- Added the pure `historyCatalog` module with browse/filter types, empty filters, deterministic five-theme mapping, and immutable chronological filtering.
- Added `HistoryGridCard` as one clickable button with local history art, formatted year, event, location, Chinese theme label, current-state semantics, exact-seed callback, and local tone fallback.
- Added focused unit/component coverage only. `App.tsx`, `SeedPickerScreen.tsx`, CSS, report/save features, and other product modules were not changed.

## RED

Command:

```text
npm test -- src/data/historyCatalog.test.ts src/components/HistoryGridCard.test.tsx
```

Expected failing output before production files existed:

```text
Test Files  2 failed (2)
Tests       no tests
Error: Failed to resolve import "./historyCatalog"
Error: Failed to resolve import "../data/historyCatalog"
exit code 1
```

The first GREEN attempt then exposed missing DOM cleanup in the new component test file (`1 failed | 1 passed`, `3 failed | 32 passed`); adding `afterEach(cleanup)` corrected test isolation without changing production behavior.

## GREEN

Focused command:

```text
npm test -- src/data/historyCatalog.test.ts src/components/HistoryGridCard.test.tsx
```

Output:

```text
Test Files  2 passed (2)
Tests       35 passed (35)
Duration    650ms
exit code 0
```

Full command required by the brief:

```text
npm test -- --run
```

Output:

```text
Test Files  30 passed (30)
Tests       234 passed (234)
Duration    5.85s
exit code 0
```

Additional verification:

```text
npm run typecheck
> tsc --noEmit
exit code 0

git diff --check
exit code 0
```

## Concerns

- None within Task 2A. Integration and styling intentionally remain for later release tasks.
