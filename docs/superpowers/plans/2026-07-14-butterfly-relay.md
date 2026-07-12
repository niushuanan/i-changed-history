# Butterfly Relay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the twelve-node simulation into a surprising cross-generation butterfly relay while keeping all fifty history moments available to every profile.

**Architecture:** Preserve the current reducer and request lifecycle. Extend the structured turn contract with identity continuity and profile-use metadata, strengthen prompt constraints, and make the deterministic fallback produce cross-domain successor identities. Add an archive layer to the existing picker rather than replacing its fast five-card entry.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Zod, DeepSeek V4 Flash.

## Global Constraints

- All 50 moments are available to every profile.
- The traveler profile affects actions and costs, not content access.
- No immortal protagonist; later eras use new local identities.
- Later nodes must shift domain or geography while preserving a visible causal link.
- Active gameplay always exposes an exit control.

---

### Task 1: Encode the new contract

- [x] Add failing tests for profile-independent access, prompt anti-repetition rules, identity metadata, and one profile-powered choice.
- [x] Run focused tests and verify they fail for the intended missing behavior.
- [x] Extend schema normalization and prompt payloads.
- [x] Run focused tests to green.

### Task 2: Make fallback narration jump

- [x] Add a failing test asserting a late fallback changes identity, place, and topic.
- [x] Implement deterministic generational relay stages.
- [x] Run fallback and engine tests to green.

### Task 3: Expose the full archive and profile meaning

- [x] Add failing integration assertions for the 50-moment archive and profile explanation.
- [x] Implement searchable China/world archive and remove opaque era labels.
- [x] Surface identity bridge and profile advantage in the event screen.

### Task 4: Add exit and verify the full journey

- [x] Add an integration assertion for the active-run exit control.
- [x] Implement a global exit action for generation, event, and echo phases.
- [x] Run the full suite, typecheck, build, diff check, and mobile browser QA.
- [x] Commit and push `main`.
