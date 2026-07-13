# Richer Context and History Comparison Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show complete causal prehistory and an explicit alternate-history versus real-history comparison without slowing or destabilizing generation.

**Architecture:** Reuse the existing coherent turn request and its `narrative`, `worldStateChange`, `divergenceProof`, and `causalBridge` fields. Expand their concise contracts, render the fields in a fixed comparison hierarchy, and remove legacy CSS truncation while reclaiming image height for dense turns.

**Tech Stack:** React 19, TypeScript, Zod, Vitest, DeepSeek V4 Flash, CSS Grid, Playwright.

## Tasks

- [ ] Add failing tests for the richer narrative contract, explicit history comparison labels, and complete legal-length copy.
- [ ] Expand the validated turn contract without adding a request or response field.
- [ ] Rebuild the bottom proof as changed history, real history, and causal source rows.
- [ ] Remove all event-copy truncation and tune the adaptive 390 x 844 layout.
- [ ] Update project decisions and context documentation.
- [ ] Run focused and full tests, type checking, build, real browser interaction, screenshot review, commit, push, and remote CI verification.
