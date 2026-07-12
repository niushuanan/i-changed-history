# Clear Change Gameplay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every turn immediately understandable, make the profile mechanically useful, preserve the carousel, and prove live AI generation.

**Architecture:** Keep the reducer and twelve-node request flow. Add client-owned generation provenance to parsed turns, a pure profile-ability mapper, and a compact presentation layer over existing causal data. Expand the carousel in place and map every seed to a dedicated local historical image.

**Tech Stack:** React 19, TypeScript, Zod, Vitest, DeepSeek V4 Flash, local WebP history assets.

## Tasks

- [x] Add failing tests for provenance, profile ability preview, compact change proof, inline exit, and in-place 50-card carousel.
- [x] Implement provenance and profile ability primitives.
- [x] Rebuild the event screen and choice interaction around change proof.
- [x] Remove the archive modal and expand the horizontal carousel in place.
- [x] Acquire and verify dedicated card imagery for all fifty seeds.
- [x] Tighten model copy without reducing the 8192-token transport ceiling.
- [x] Run full tests, build, real API playthrough, image clicks, and mobile screenshots. Commit and push are completed as the final repository step.
