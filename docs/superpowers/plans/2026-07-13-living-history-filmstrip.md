# Living History Filmstrip Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the archive dashboard with one synchronized fifty-event filmstrip and reduce active play to one scene, one causal receipt, and three actions.

**Architecture:** `SeedPickerScreen` owns a single chronological data set and synchronizes two horizontal scrollers through one active index. `HistoryCard` becomes a visual poster. `TimelineEventScreen`, `ChoiceList`, `TimelineProgress`, and `ButterflyEchoScreen` retain the existing reducer/API contracts while replacing framed modules with a continuous cinematic layout.

**Tech Stack:** React 19, TypeScript, CSS scroll snap, IntersectionObserver/scroll geometry, Vitest, Testing Library, DeepSeek V4 Flash.

## Global Constraints

- All 50 events are always available in ascending year order.
- No recommended subset, shuffle action, expand action, modal, or secondary archive layout.
- Mobile viewport is 390 x 844.
- DeepSeek transport stays at `max_tokens: 8192`.
- Existing reducer, persistence, recovery, 12-node planner, and deterministic deviation logic remain authoritative.

## Tasks

- [x] Add tests for a 50-card chronological picker, removal of expand/shuffle controls, timeline click navigation, and card-scroll timeline synchronization.
- [x] Rebuild `SeedPickerScreen` around a single `browseHistorySeeds()` array and two synchronized scrollers.
- [x] Rebuild `HistoryCard` as an image-led poster with only decision-critical copy.
- [x] Add tests for the continuous event scene, compact causal receipt, action mode labels, profile foresight, and simple echo.
- [x] Rebuild `TimelineProgress`, `TimelineEventScreen`, `ChoiceList`, and `ButterflyEchoScreen` without dashboard cards.
- [x] Update research notes and durable product rules with the Game Master, causal memory, and institutional-emergence model.
- [x] Run all tests, typecheck, build, and browser verification at 390 x 844, including real DeepSeek opening and second node.
- [x] Update screenshots and QA. Commit and push are the final repository step.
