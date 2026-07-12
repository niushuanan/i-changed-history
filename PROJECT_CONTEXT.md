# Project Context

## 1. 这个项目是干什么的

《I！我改变了历史》是一款可玩的移动端 AI 穿越历史游戏。玩家先建立现代穿越者档案，系统再从 50 个公元后的著名真实历史瞬间中匹配五张卡；玩家成为当时的具体参与者，通过 11 次 AI 即兴叙事与现场决策改变时间线，第 12 个节点生成另一个版本的 2026 年。

当前版本是本地纯前端应用：在浏览器直接调用 DeepSeek `deepseek-v4-flash`，用 Zod 校验结构化输出，用前端公式计算历史偏离度，用本地音频构建史诗氛围，并可将结局头版导出为高清 PNG。密钥只放在被 Git 忽略的 `.env.local`。

## 2. 代码结构是什么

- `src/data/`：50 张公元后著名历史瞬间、画像推荐算法和按年份/阶段选取的视觉资产映射。
- `src/game/`：游戏领域层，包含穿越者画像校验、12 节点时间计划、结构化 schema、DeepSeek prompts、生成引擎、确定性偏离度和纯 reducer。
- `src/hooks/`：`useGame.ts` 负责请求取消、预生成、即时回响、存储、音频和重试编排。
- `src/services/`：DeepSeek 传输、版本化本地存储、史诗配乐和 PNG 分享/下载。
- `src/screens/` 和 `src/components/`：从历史档案选择到平行 2026 头版的完整界面。
- `src/styles/`：煤黑、新闻纸、朱砂红、青绿和黄色构成的移动端视觉系统。
- `src/test/`：Vitest 初始化和可复用的幕次/结局夹具。
- `design/`：三套 ImageGen 首屏方向、选定的 `redaction-room.png` 和真实浏览器截图。
- `public/assets/` 与 `public/audio/`：历史场景图、CC0 史诗配乐及授权记录。
- `docs/superpowers/`：Superpowers 收敛的产品规格和实施计划。

实际数据流是：穿越者档案 -> 本地确定性画像推荐 -> 选择真实历史卡 -> 客户端生成 12 节点目标年份 -> DeepSeek 结构化 JSON -> 格式归一与 Zod 校验/本地兜底 -> 前端状态机 -> 即时蝴蝶效应与后台预生成 -> 确定性历史偏离度 -> 平行世界 2026 结局 -> PNG 头版。

## 3. 关键入口在哪里

- `index.html`：Vite 页面入口。
- `src/main.tsx`：React 挂载入口。
- `src/App.tsx`：根组件，负责穿越者档案、画像匹配、游戏 phase 切换和结局导出。
- `src/hooks/useGame.ts`：运行时编排入口。
- `src/game/engine.ts`：结构化幕次与结局生成入口。
- `src/data/historySeeds.ts`：历史卡牌数据入口。
- `vite.config.mjs`：开发服务器和 Vitest jsdom 配置。
- `package.json`：`npm run dev`、`npm test`、`npm run typecheck`、`npm run build` 命令入口。
- `design/selected-visual.md`：image-to-code 的目标稿和尺寸约束。
- `.env.example`：DeepSeek 模型和本地密钥变量模板，不包含真实密钥。

## 4. 最近改了什么

### 2026-07-13 01:40 - 扩展为可恢复的十二节点时间线

- 本次任务：解决中途推演中断、后半程偏离度归零、图片过少与时代错配，并把完整推演改为包含开场和 2026 总结在内的 12 个节点。
- 改了哪些文件：`AGENTS.md`、`PROJECT_CONTEXT.md`、`src/game/{timelinePlan,deviation,engine,schema,prompts,reducer,fallbackTurn}.ts`、`src/hooks/useGame.ts`、`src/services/storage.ts`、`src/data/visualAssets.ts`、`src/components/{TimelineProgress,ResultFrontPage}.tsx`、`src/screens/*`、`src/styles/game.css`、`public/assets/stage-*.webp`、`design-qa.md` 及配套测试和 Superpowers 文档。
- 改了什么：固定 11 次选择加第 12 节点 2026 总结；时间跨度从一天、一个月逐步放大并自适应收束到 2026；将偏离度倍率补齐至 11 次选择；增加结构修复、重生成和本地兜底；存档升级为可自动续跑请求的 v4；按模拟年份选景并加入近世与 2026 两张 ImageGen 场景；把事件页压缩到 390 x 844 一屏完整显示。
- 为什么这样改：确保长局真实可玩，任何模型格式漂移或页面重连都不会抹掉历史进度，同时让每个时代的视觉和时间跨度对玩家可见且可信。
- 影响了哪些模块：时间计划、AI 契约、状态机、偏离度、存储恢复、图片系统、终局头版、移动端布局、测试与项目文档。

### 2026-07-12 23:50 - 重构为现代穿越者与真实历史瞬间

- 本次任务：把难以理解的泛化反事实游戏重构成 `I！我改变了历史` 的现代人穿越体验，并通过真实 DeepSeek 续幕验证。
- 改了哪些文件：`AGENTS.md`、`PROJECT_CONTEXT.md`、`index.html`、`vite.config.mjs`、`src/App.tsx`、`src/data/historySeeds.ts`、`src/game/{profile,reducer,prompts,engine,schema,types}.ts`、`src/hooks/useGame.ts`、`src/services/{storage,share}.ts`、`src/screens/*`、`src/components/HistoryCard.tsx`、`src/styles/game.css` 及配套测试。
- 改了什么：加入画像首屏和本地推荐；重写 50 个公元后具体历史瞬间，其中 18 个为 1840 年前中国史；将场景绑定为“画像 + 卡片”；AI 幕次强制输出身份、现场目标、倒计时和三个具体动作；删除自定义开局与自由干预；存档升级为 v2；品牌统一为 `I！我改变了历史`；测试范围限定在主项目 `src/`，避免 `.worktrees` 被重复执行。
- 为什么这样改：让玩家一眼明白自己是谁、身处哪一个著名瞬间、现在必须决定什么，同时保留 AI 即兴因果推演而不把关键交互变成聊天框。
- 影响了哪些模块：首屏、卡牌推荐、全部游戏状态、DeepSeek 契约、续幕恢复、本地存档、分享品牌、移动端视觉和测试。

### 2026-07-12 14:34 - 完成可玩五幕游戏与头版导出

- 本次任务：完成《哎！我改变了历史》从历史选择到平行 2026 的全流程，并用真实 DeepSeek 调用验收。
- 改了哪些文件：`src/App.tsx`、`src/screens/*`、`src/components/*`、`src/styles/game.css`、`src/game/{engine,prompts,schema}.ts`、`src/services/{deepseek,audio,storage,share}.ts`、`design/captures/*`、`design-qa.md` 及配套测试。
- 改了什么：实现五张随机历史卡、自定义开局、五幕结构化叙事、每幕自由干预、即时回响与后台预生成、偏离度、史诗配乐、本地恢复、错误重试、平行世界头版和高清 PNG 分享/下载；同时针对真实 V4-flash 输出漂移补强了格式归一、修复上下文和玩家选择权威数据。
- 为什么这样改：让模型保留自由推演能力，但由前端保证可玩格式、及时反馈、历史选择不被改写和失败可恢复。
- 影响了哪些模块：全部玩家旅程、DeepSeek 调用协议、状态机、存储、音频、结局分享、视觉系统和测试。

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
