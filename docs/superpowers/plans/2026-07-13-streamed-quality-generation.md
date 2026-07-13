# Streamed Quality Generation Implementation Plan

> **Execution:** Follow superpowers TDD and verification workflows. Keep every playable scene coherent in one main model request.

**Goal:** Reduce perceived and repair latency while guaranteeing that all visible narrative remains DeepSeek-authored and schema-valid.

**Architecture:** Stream one coherent DeepSeek JSON response, expose only trustworthy transport stages, keep a stable prompt prefix for cache hits, and repair only invalid top-level fields before re-validating the merged AI response.

**Tech Stack:** React 19, TypeScript, Zod, Vitest, DeepSeek V4 Flash SSE/JSON mode, localStorage.

## Task 1: Streaming transport

- [x] Add failing tests for `stream: true`, SSE chunks split across byte boundaries, progress stages, `[DONE]`, empty content, and usage.
- [x] Implement a UTF-8 safe SSE parser and stage-deduplicated progress callbacks.
- [x] Preserve timeout, abort and retry semantics; retry only when no valid completion was committed.

## Task 2: Cache-friendly prompt protocol

- [x] Add failing prompt tests proving opening and continuation share an identical static protocol message.
- [x] Move turn schema/rules out of dynamic payloads into the shared protocol prefix.
- [x] Keep chapter-specific authoritative data and narrative context in the final user message.

## Task 3: AI-authored field repair

- [x] Add failing tests proving a parseable response with one invalid root field requests only that field.
- [x] Merge the AI patch into the original candidate and validate the complete result.
- [x] Keep one full repair only for unparseable output or semantic cross-field failures.
- [x] Ensure client normalization never invents visible history prose.

## Task 4: Real progress UI and persistence

- [x] Add reducer/hook/screen tests for connected, reasoning, writing, validating and repairing stages.
- [x] Replace timer-driven waiting steps with actual request progress while retaining motion and reduced-motion behavior.
- [x] Persist only stage-level changes, not token chunks.

## Task 5: Verification and delivery

- [x] Run narrow tests after each red-green cycle, then the full test suite, typecheck, build and `git diff --check`.
- [x] Run the local server and inspect a real 390 x 844 flow in the browser, including network request count and console errors.
- [x] Update `AGENTS.md` and `PROJECT_CONTEXT.md` with durable generation decisions and verification evidence.
- [ ] Commit and push `main`, then verify local and remote SHAs match.
