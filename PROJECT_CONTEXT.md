# Project Context

## 1. 这个项目是干什么的

《哎！我改变了历史》是一款正在开发中的移动端 AI 反事实历史游戏。玩家从 50 个真实历史转折点中选择一个，或输入自己的历史假设；随后通过五幕选择改变时间线，最终生成另一个版本的 2026 年。

当前项目处于实现阶段：历史卡牌数据、输入边界、产品规格、视觉目标和基础前端已经存在；结构化 AI、完整游戏状态机和最终界面尚未全部完成。当前版本按用户要求为本地纯前端应用，将通过被 Git 忽略的 `.env.local` 调用 DeepSeek V4 Flash。

## 2. 代码结构是什么

- `src/data/`：历史种子数据。`historySeeds.ts` 包含 50 张卡牌和均衡发牌算法。
- `src/game/`：游戏领域层。`types.ts` 和 `input.ts` 已实现；`schema.ts`、`prompts.ts` 当前只有 TDD 桩实现，配套失败测试定义了下一步行为。
- `src/services/`：外部能力边界。`deepseek.ts` 当前为 TDD 桩，测试已锁定模型、JSON、重试和思考模式要求。
- `src/test/`：Vitest 初始化和结构化 AI 完整测试夹具。
- `design/`：三套 ImageGen 首屏方向和最终选定的 `redaction-room.png` 视觉目标。
- `public/audio/`：本地史诗配乐与 CC0 来源记录。
- `docs/superpowers/`：经 Superpowers 收敛的产品规格和逐任务实施计划。

数据流目标是：历史卡或自由 Prompt -> DeepSeek 结构化 JSON -> Zod 校验 -> 前端状态机 -> 即时蝴蝶效应 -> 确定性历史偏离度 -> 平行世界结局。尚未实现的模块不能视为当前可运行能力。

## 3. 关键入口在哪里

- `index.html`：Vite 页面入口。
- `src/main.jsx`：React 挂载入口，加载全局样式并渲染 `App`。
- `src/App.jsx`：当前应用根组件，仍是空壳，后续承载完整游戏状态切换。
- `src/data/historySeeds.ts`：当前最重要的已实现产品数据入口。
- `src/game/input.ts`：开局和局内自由 Prompt 的本地输入边界。
- `vite.config.mjs`：开发服务器和 Vitest jsdom 配置。
- `package.json`：`npm run dev`、`npm test`、`npm run build` 命令入口。
- `design/selected-visual.md`：image-to-code 实施时必须遵守的目标稿和尺寸约束。

## 4. 最近改了什么

### 2026-07-12 11:58 - 建立项目上下文

- 本次任务：在项目形成真实代码后创建 `PROJECT_CONTEXT.md`。
- 改了哪些文件：新增 `PROJECT_CONTEXT.md`。
- 改了什么：记录产品目的、真实目录、关键入口、当前完成度和最近变更。
- 为什么这样改：让后续协作者能区分已实现代码与规划内容，避免把 TDD 桩误认为完整功能。
- 影响了哪些模块：仅项目文档，不影响运行时。

### 2026-07-12 11:52 - 修正历史卡牌与输入边界

- 本次任务：根据任务审查修正现代中国历史过滤、1973 年石油危机卡和阿散蒂转折点。
- 改了哪些文件：`src/game/input.ts`、`src/game/input.test.ts`、`src/data/historySeeds.ts`、`src/data/historySeeds.test.ts`。
- 改了什么：扩展输入边界并修正两张卡的事实锚点，增加回归测试。
- 为什么这样改：避免政治敏感输入漏过，并确保卡牌来自具体、可靠的历史转折点。
- 影响了哪些模块：历史卡牌池、自定义 Prompt 校验。

### 2026-07-12 11:47 - 增加自由干预、偏离度与配乐设计

- 本次任务：吸收最新玩法要求并降低模型等待感。
- 改了哪些文件：`docs/superpowers/specs/2026-07-11-i-changed-history-design.md`、`docs/superpowers/plans/2026-07-11-i-changed-history.md`。
- 改了什么：确定每回合自由 Prompt、前端偏离度公式、即时回响、普通回合非思考模式和本地配乐。
- 为什么这样改：提高玩家主动性、游戏反馈速度和史诗氛围，同时避免让模型自行给偏离度打分。
- 影响了哪些模块：后续 AI 协议、状态机、界面、音频和测试。

### 2026-07-11 21:46 - 选定视觉方向

- 本次任务：使用 ImageGen 生成三套 390 x 844 首屏并自主选型。
- 改了哪些文件：`design/visual-options/*.png`、`design/selected-visual.md`。
- 改了什么：选定“朱砂新闻编辑室”方向，锁定卡牌、标题、配色和移动端尺寸。
- 为什么这样改：建立明确 image-to-code 目标，避免界面出现通用 AI 产品风格。
- 影响了哪些模块：后续全部页面和视觉资产。
