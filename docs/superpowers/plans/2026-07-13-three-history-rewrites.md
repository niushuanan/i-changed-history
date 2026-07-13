# Three History Rewrites Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 完整显示决策页核心文字，并增加每局三次、可恢复且受历史约束的 AI 自由改命。

**Architecture:** 新增独立的自由行动裁决 schema、prompt 和 engine API；reducer 以持久化 request 管理提交、成功扣次、失败重试和后续预生成。所有已选择行动保存真实 resolved echo，使普通选项与自由输入通过同一因果接口进入下一幕与结局。

**Tech Stack:** React 19、TypeScript、Vitest、Zod、DeepSeek V4 Flash、Playwright CLI。

## Global Constraints

- 产品名保持 `I！我改变了历史`。
- 完整推演仍是 11 次决策加第 12 节点 2026。
- 决策页目标视口为 390 x 844，完整显示全部行动且页面不滚动。
- 自由改命每局恰好三次，失败与重试不扣次数。
- DeepSeek 输出上限保持 8192；简洁度由 prompt 与 schema 控制。

---

### Task 1: 自由裁决领域契约

**Files:**
- Modify: `src/game/schema.ts`
- Modify: `src/game/prompts.ts`
- Modify: `src/game/engine.ts`
- Test: `src/game/schema.test.ts`
- Test: `src/game/prompts.test.ts`

**Interfaces:**
- Produces: `CustomActionResolution`、`parseCustomActionResolution()`、`buildCustomActionMessages()`、`adjudicateCustomAction()`。

- [x] 先写 schema 与 prompt 失败测试，断言 56 字限制、历史约束字段和自定义行动进入已选历史。
- [x] 运行 `npm test -- src/game/schema.test.ts src/game/prompts.test.ts`，确认因缺少接口失败。
- [x] 实现严格裁决 schema、prompt、结构修复和确定性保底。
- [x] 重跑窄测试并确认通过。

### Task 2: 三次机会与可恢复状态

**Files:**
- Modify: `src/game/reducer.ts`
- Modify: `src/hooks/useGame.ts`
- Modify: `src/services/storage.ts`
- Modify: `src/game/fallbackTurn.ts`
- Test: `src/game/reducer.test.ts`
- Test: `src/hooks/useGame.test.tsx`
- Test: `src/services/storage.test.ts`

**Interfaces:**
- Produces: `SUBMIT_CUSTOM_ACTION`、`CUSTOM_ACTION_RESOLVED`、`customActionsUsed`、`submitCustomAction()`。

- [x] 写失败测试：成功扣一次、第四次被拒绝、失败重试不扣、刷新恢复请求。
- [x] 运行 reducer、hook、storage 窄测试，确认失败原因正确。
- [x] 实现 request 编排、统一 resolved echo 和存档 v5。
- [x] 重跑窄测试并修复所有回归。

### Task 3: 决策页与因果接力

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/screens/TimelineEventScreen.tsx`
- Modify: `src/screens/GeneratingScreen.tsx`
- Modify: `src/screens/ButterflyEchoScreen.tsx`
- Modify: `src/styles/game.css`
- Test: `src/screens/TimelineEventScreen.test.tsx`
- Test: `src/screens/GeneratingScreen.test.tsx`

**Interfaces:**
- Consumes: `submitCustomAction(action)`、`customActionsUsed`、`CustomActionResolution`。

- [x] 写失败测试：显示三次剩余、输入校验、用尽禁用、因果链完整文案和自由裁决等待文案。
- [x] 运行界面窄测试并确认失败。
- [x] 实现 220px 场景、完整正文、三段因果接力、输入层和三次计数。
- [x] 重跑界面测试并确认通过。

### Task 4: 全量验证与项目记录

**Files:**
- Modify: `PROJECT_CONTEXT.md`
- Modify: `AGENTS.md`

- [x] 运行 `npm test`、`npm run typecheck`、`npm run build`。
- [x] 在 390 x 844 真实浏览器中验证开场、普通选择、自由输入、裁决等待、回响和下一节点。
- [x] 检查控制台、截图、文字溢出和按钮可达性。
- [x] 更新项目上下文和持久产品决策。
- [x] 审查 `git diff` 后创建本地 commit。
