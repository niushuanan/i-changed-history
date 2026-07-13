# Project Context

## 1. 这个项目是干什么的

《I！我改变了历史》是一款可玩的移动端 AI 穿越历史游戏。玩家先通过四次、每次四选一的历史困境得到一个 I/E、S/N、T/F、J/P 时空人格，再沿按年份排列的 50 个公元后著名真实历史瞬间选择入口；玩家进入一个有固定姓名和身体的历史主角，在其一生中完成 12 次 AI 即兴叙事与重大决策。第 12 次选择后主角死亡，游戏再独立推演其遗产如何穿过后世并抵达 2026。每局还可使用三次“直接改写”，玩家写下的完成结果立即成为正史，AI 只负责推演其传播路径、受益者和隐藏代价。

当前版本是本地纯前端应用：在浏览器直接调用 DeepSeek `deepseek-v4-flash`，用 Zod 校验结构化输出，用前端公式计算历史偏离度，用本地音频构建史诗氛围，并可将结局头版导出为高清 PNG。密钥只放在被 Git 忽略的 `.env.local`。

## 2. 代码结构是什么

- `src/data/`：50 张公元后著名历史瞬间、画像推荐算法和按年份/阶段选取的视觉资产映射。
- `src/game/`：游戏领域层，包含四维时空人格与能力、单一主角一生 12 决策时间计划、不可撤销世界正史、重大节点编排、结构化 schema、DeepSeek prompts、生成引擎、确定性偏离度和纯 reducer。
- `src/hooks/`：`useGame.ts` 负责请求取消、预生成、即时回响、存储、音频和重试编排。
- `src/services/`：DeepSeek 传输、版本化本地存储、史诗配乐和 PNG 分享/下载。
- `src/screens/` 和 `src/components/`：从历史档案选择、同一主角一生决策到死亡与 2026 身后历史报告的完整界面。
- `src/styles/`：煤黑、新闻纸、朱砂红、青绿和黄色构成的移动端视觉系统。
- `src/test/`：Vitest 初始化和可复用的幕次/结局夹具。
- `design/`：三套 ImageGen 首屏方向、选定的 `redaction-room.png` 和真实浏览器截图。
- `public/assets/` 与 `public/audio/`：历史场景图、CC0 史诗配乐及授权记录。
- `docs/superpowers/`：Superpowers 收敛的产品规格和实施计划。

实际数据流是：四次四选一历史困境 -> 四维人格与时空能力 -> 选择真实历史卡 -> DeepSeek 生成固定姓名的历史主角 -> 玩家选择 AI 行动或直接写入正史 -> 客户端把姓名、年龄、人生阶段和全部决定固化为权威人生表与不可撤销 `WorldCanon` -> `PivotalBrief` 从仍在生效的权力、科技、制度、战争、贸易、知识和民生因果中编排同一主角下一次重大冲突 -> DeepSeek 只负责把约束写成具体历史现场和三个行动 -> 格式归一、Zod、人物连续性与因果账本校验/本地重大节点兜底 -> 前端展示“决定、已改变、重大节点、史实分歧” -> 第 12 次决定 -> 主角死亡 -> 四段身后历史与 2026 世界报告 -> PNG 报告。

## 3. 关键入口在哪里

- `index.html`：Vite 页面入口。
- `src/main.tsx`：React 挂载入口。
- `src/App.tsx`：根组件，负责穿越者档案、画像匹配、游戏 phase 切换和结局导出。
- `src/hooks/useGame.ts`：运行时编排入口。
- `src/game/engine.ts`：结构化幕次与结局生成入口。
- `src/game/worldCanon.ts`：把玩家决定固化为世界正史，并生成下一幕的重大节点编排约束。
- `src/data/historySeeds.ts`：历史卡牌数据入口。
- `vite.config.mjs`：开发服务器和 Vitest jsdom 配置。
- `package.json`：`npm run dev`、`npm test`、`npm run typecheck`、`npm run build` 命令入口。
- `design/selected-visual.md`：image-to-code 的目标稿和尺寸约束。
- `.env.example`：DeepSeek 模型和本地密钥变量模板，不包含真实密钥。

## 4. 最近改了什么

### 2026-07-13 17:40 - 把循环假进度改为单向历史书写

- 本次任务：解决等待页三项状态完成后又退回第一项、让玩家误以为即将翻页却重新开始的问题，并去掉生硬的“因果推演”命名。
- 改了哪些文件：`src/screens/GeneratingScreen.tsx`、`src/screens/GeneratingScreen.test.tsx`、`src/styles/game.css`、`AGENTS.md` 与 `PROJECT_CONTEXT.md`。
- 改了什么：把 `% 3` 循环计时器改成只执行一次的两段定时推进，前两项完成后永久锁定，第三项持续显示正在书写直到 DeepSeek 返回；顶部循环扫描条改为与三项同步的单向分段轨道；未开始、已完成、进行中的图标和颜色明确区分；页面文案统一为“历史正在发生”“新历史正在成形”，自由改写则显示“你的决定正在生效”。
- 为什么这样改：模型没有可读取的真实百分比，循环步骤属于虚假进度，会破坏玩家对系统状态的判断；单向准备阶段加一个持续写作阶段能够诚实表达“前置工作完成，但模型仍在生成”。
- 影响了哪些模块：开场生成、续幕生成、自由改写、身后报告的等待体验，等待页动效、移动端布局和回归测试。

### 2026-07-13 15:55 - 重构为单一主角一生十二次决策与身后历史

- 本次任务：把原来的跨代意识接力和“第 12 节点直接到 2026”改成同一个主角的一生；十二次决策后主角死亡，再独立输出延伸到 2026 的小说式历史报告。
- 改了哪些文件：`src/game/{timelinePlan,schema,prompts,engine,fallbackTurn,reducer,deviation}.ts`、`src/components/{TimelineProgress,ResultFrontPage}.tsx`、`src/screens/{TimelineEventScreen,GeneratingScreen,AlternatePresentScreen}.tsx`、`src/services/storage.ts`、`src/App.tsx`、`src/styles/game.css`、相关测试与夹具、`AGENTS.md`、`docs/superpowers/`。
- 改了什么：12 个节点全部改为可决策节点；客户端计算命运当日、三日后、六周后到生命终章的年龄表，古代入口通常从 24 岁到 70 岁，现代入口自动压缩并在 2026 前死亡；幕次新增固定 `protagonistName`、权威 `protagonistAge` 和 `lifeStage`，续幕即使模型换人也会被客户端纠正；第 4 幕起禁止继续沿用开场职位或把开场事件当当前剧情；第 12 幕选择后才触发死亡与身后报告；报告新增死亡现场、十二项人生年表、四段身后历史、2026 普通生活和小说式尾声；存档升级 v9，旧 v8 跨代进行局保留人格后安全返回历史选择。
- 为什么这样改：玩家需要依恋一个真实会衰老和死亡的主角，同时又要看到自己的选择带他进入不断升级但因果相连的历史冲突；只有在主角死亡后继续推演世界，才能真正回答“我改变了历史以后，2026 变成了什么”。
- 影响了哪些模块：权威时间表、人物连续性、DeepSeek 契约、重大剧情校验、离线保底、状态机、存档迁移、移动端事件页、生成等待页、结局导出和完整游玩测试。
- 验证：25 个 Vitest 文件共 158 项通过，TypeScript、生产构建和 `git diff --check` 通过；390 x 844 真实浏览器中 DeepSeek 首幕生成“程骁，24 岁”，第二幕三日后仍为程骁且职位从火船调度副尉推进为火攻令使；事件页内容与全部操作同屏。注入合法第 12 幕完成态后，死亡、四段身后历史、2026 生活切片、尾声和保存操作均可滚动查看，控制台无错误。

### 2026-07-13 14:05 - 建立不可撤销世界正史与重大节点编排器

- 本次任务：解决剧情为了跳跃而随机换题、后续节点降级为普通事务，以及玩家“称帝、发展科技”等直接改写没有持续改变世界的问题。
- 改了哪些文件：新增 `src/game/worldCanon.ts` 与测试；修改 `src/game/{customCanon,engine,fallbackTurn,prompts,reducer,schema}.ts`、`src/services/{deepseek,storage}.ts`、`src/screens/TimelineEventScreen.tsx`、`src/styles/game.css`、相关夹具与测试、`AGENTS.md`、`PROJECT_CONTEXT.md`。
- 改了什么：所有决定先进入客户端拥有的不可撤销世界正史；直接改写保留原文并在后三幕持续成为强制因果，一个输入中的称帝与科技可并行生效；重大节点编排器按现场、政权、国家、文明、世界逐步扩大影响，并在权力、科技、制度等真实因果间交织；DeepSeek 输出新增重大 stakes、世界状态变化和史实分歧证明，缺少关键因果账本时自动修复、重生或进入重大节点本地兜底；存档升级 v8 并迁移 v7；事件页改为“你的决定 -> 已经改变 -> 重大节点”。
- 为什么这样改：惊喜应该来自同一决定穿过不同历史矛盾后形成出乎意料但可解释的后果，而不是随机换地点或换职业；同时玩家写下的结果必须从下一幕起立即成为 AI 无权推翻的世界事实。
- 影响了哪些模块：剧情连续性、自由改写、多因果交织、DeepSeek 契约、结构校验、离线保底、存档恢复、移动端因果回执和 2026 总结。
- 验证：25 个 Vitest 文件共 156 项通过，TypeScript、生产构建与 `git diff --check` 通过；390 x 844 真实浏览器从玄武门之变连续推到第 10 节点，先写入“我成为新皇帝，并设立国家科学院大力发展科技”，第四节点由 DeepSeek 生成“科学院能否绕过六部重划国家执行权”；再写入“全球通用纸币 + 阿拉伯贸易联盟”，第十节点由 DeepSeek 生成 1376 年跨洲纸币信用危机。完整因果文字、三个选择和改写入口保持同屏，全部合法长度同时拉满时因果回执 `scrollHeight === clientHeight`、操作入口底边为 840px，控制台无错误。

### 2026-07-13 13:12 - 缩小历史卡并强化可滑动暗示

- 本次任务：解决历史选择卡比例过大、右侧下一张露出不足，导致玩家第一眼不知道可以横向滑动的问题。
- 改了哪些文件：`src/screens/SeedPickerScreen.tsx`、`src/screens/SeedPickerScreen.test.tsx`、`src/styles/game.css` 与 `AGENTS.md`。
- 改了什么：390px 宽视口下卡片由 332 x 626 缩为 300 x 560，场景图高度由 344px 缩为 286px，标题、身份、决定文字与间距按比例收紧；窄屏卡宽降至 270px；时间读数旁加入“（滑动可切换不同的历史瞬间）”；同步将无布局测量时的卡片步长从 344 调整为 312。
- 为什么这样改：横向轮播必须通过视觉露头自然传达可滑动性，不能要求用户猜测手势，也不应依赖额外弹窗教学。
- 影响了哪些模块：历史选择页布局、时间轴与卡片同步、移动端信息密度、滑动发现性和组件回归测试。

### 2026-07-13 13:05 - 重构为中国玩家优先的 30/20 历史牌库

- 本次任务：解决 50 个开局节点中过多西方冷门史、普通中国玩家难以理解，以及中国史反事实想象空间不足的问题。
- 改了哪些文件：`src/data/historySeeds.ts`、`src/data/historySeeds.test.ts`、`scripts/fetch-history-images.mjs`、`public/assets/history/`、`AGENTS.md` 与 `docs/superpowers/`。
- 改了什么：把牌库固定为 30 个 1840 年前中国节点和 20 个高辨识度世界节点；新增董卓与吕布、官渡乌巢、夷陵、街亭、高平陵、武则天、马嵬驿、王安石、襄阳、靖难、宁远和康熙擒鳌拜；世界史换入牛顿、林肯、十月革命、罗斯福、希特勒、斯大林、诺曼底与阿波罗 11 号；修正“澧渊”为“澶渊”；为全部活跃卡建立 50 张同名本地图，并把抓图脚本改成缓存复用、GIF 安全降级与原子目录替换。
- 为什么这样改：历史卡首先是游戏入口而不是知识测验；玩家需要在三秒内认出人物和事件，同时每张卡必须拥有能传播到后世的具体因果杠杆。原子图片构建则避免网络限流或格式异常时清空稳定资产。
- 影响了哪些模块：历史卡牌数据、时间轴内容、开局提示、图片资产与来源、图片构建稳定性、牌库回归测试和移动端真实游玩。
- 验证：24 个 Vitest 文件共 128 项通过，TypeScript 与生产构建通过；在 390 x 844 真实浏览器中滑动并点入董卓 190 与阿波罗 1969，两次均由 DeepSeek 实时生成完整首幕，控制台无错误。

### 2026-07-13 12:20 - 玩家写正史与多载体蝴蝶推演

- 本次任务：解决自由输入被 AI 否决、后续长期围绕单一事件线、人格选择过少和回响页退出键越界的问题。
- 改了哪些文件：`src/game/{profile,rippleRouter,schema,prompts,engine,fallbackTurn,reducer}.ts`、`src/services/storage.ts`、`src/screens/{TravelerProfileScreen,TimelineEventScreen,GeneratingScreen,ButterflyEchoScreen}.tsx`、`src/styles/game.css`、相关测试、`AGENTS.md` 与 `docs/superpowers/`。
- 改了什么：四道人格困境各扩为四个选项；三次自定义改成玩家直接声明完成结果，客户端从原文构造权威回执且不信任任何模型结果文本，DeepSeek 只判定偏离级别并在下一幕推演世界；新增确定性涟漪路由，连续幕次避开最近两个社会载体，场景必须命中两个载体证据词，并展示“你的选择 -> 世界变化 -> 蝴蝶转向”；存档升级 v7 并迁移 v4-v6 活跃局；修复回响页退出键负边距越界与错误的“进入下一年”按钮。
- 为什么这样改：玩家的决定必须真正拥有历史权威，而惊喜应来自同一原因穿过不同人群、制度和生活领域，而不是 AI 反复复述开场事件。
- 影响了哪些模块：人格校准、自由输入、DeepSeek 契约、后续幕次生成、因果可视化、本地保底、存档恢复、移动端布局与完整游玩体验。

### 2026-07-13 11:30 - 把穿越者档案重构为四维时空人格

- 本次任务：解决旧档案字段无趣、用途不清、入口被裁切和配乐启动过晚的问题，并基于高 Star 互动叙事与 Agent 项目重做核心机制。
- 改了哪些文件：`src/game/{types,profile,prompts,fallbackTurn}.ts`、`src/screens/{TravelerProfileScreen,TimelineEventScreen,SeedPickerScreen}.tsx`、`src/components/ChoiceList.tsx`、`src/hooks/useGame.ts`、`src/services/storage.ts`、`src/App.tsx`、`src/styles/game.css`、配套测试、`AGENTS.md` 与 `docs/research/2026-07-13-time-traveler-profile.md`。
- 改了什么：删除名字、职业、能力清单和风险偏好长表单；改为四次单屏历史困境，生成 I/E、S/N、T/F、J/P 时空人格；人格固定影响每幕专属 AI 行动、因果预判字段和三次自由改命裁决，裁决必须返回包含本局四位代码的 `personalityLeverage`，否则结构修复或进入人格化本地保底；配乐由产品内第一次指针或键盘交互解锁并跨退出/选卡连续播放；存档升级到 v6，并验证 v4 正在生成与 v5 正在裁决的活跃档案迁移；560px 以下入口允许内部滚动兜底。
- 为什么这样改：档案只有成为可反复感知的游戏规则才有价值；入口必须在任何手机高度都能完成，玩家也必须在进入历史前就理解自己获得了什么不同玩法。
- 影响了哪些模块：开场体验、DeepSeek 上下文、行动生成、预判交互、自由输入、配乐、存档兼容、历史选择页、真实 API 验证和移动端布局。

### 2026-07-13 11:00 - 加入三次自由改命并重排决策页

- 本次任务：解决事件正文和因果证据被固定高度截断的问题，并加入每局三次、由 DeepSeek 约束裁决的自由输入。
- 改了哪些文件：`src/game/{schema,prompts,engine,reducer,fallbackTurn}.ts`、`src/hooks/useGame.ts`、`src/services/storage.ts`、`src/screens/{TimelineEventScreen,GeneratingScreen,ButterflyEchoScreen}.tsx`、`src/App.tsx`、`src/styles/game.css`、相关测试、`AGENTS.md` 与 `docs/superpowers/`。
- 改了什么：场景图从 324px 压缩到 220px；完整显示现场叙事；因果回执改为“上一选择 -> 世界变化 -> 未结历史债”；增加三次第四条路输入、可恢复 AI 裁决、受限执行说明、本地结构保底和存档 v5，并自动迁移 v4 进行中会话；普通与自由行动统一保存权威回响并进入后续幕次和 2026 结局。
- 为什么这样改：玩家必须在一屏内读懂自己改变了什么，同时自由输入应凸显模型推理能力，但不能让玩家凭空获得超时代能力或破坏游戏稳定性。
- 影响了哪些模块：移动端事件布局、DeepSeek 输出契约、状态机、存档恢复、偏离度、下一幕因果、世界回响、结局与自动化测试。

### 2026-07-13 04:00 - 重做为连续历史胶片与单场景裁决

- 本次任务：彻底移除推荐五张和展开五十张的双重入口，把选择页改为连续年代轴，并重做过度面板化的游戏页。
- 改了哪些文件：`src/screens/{SeedPickerScreen,TimelineEventScreen,ButterflyEchoScreen}.tsx`、`src/components/{HistoryCard,ChoiceList}.tsx`、`src/App.tsx`、`src/styles/game.css`、相关测试、`AGENTS.md`、`docs/research/`、`docs/superpowers/`、`design-qa.md` 与浏览器截图。
- 改了什么：50 张卡始终按公元年份升序横滑；卡片和年代轨道双向同步；卡片改为大图、身份、决策和单一进入动作；首幕继承所选事件图片；游戏页压缩为场景、因果回执与微调/改制/断裂三个行动；回响页改成一屏世界裁决。
- 为什么这样改：玩家不应理解推荐、档案和展开模式，只需沿历史向前滑并做决定；AI 技术含量应通过稳定因果、跨代身份和世界裁决体现，而不是通过大量文字和 UI 模块说明。
- 影响了哪些模块：历史选择、图片继承、事件呈现、行动语义、回响反馈、画像预判、真实 API 验证、移动端视觉、研究和产品规则。

### 2026-07-15 03:20 - 让每一幕清楚证明历史被改变

- 本次任务：降低游戏页信息密度，修复退出遮挡与历史跳转迷惑，把穿越者画像变成可操作能力，并扩充历史档案图片。
- 改了哪些文件：`src/{App,components,screens,styles,data,game}/` 的事件页、选择器、画像、来源标记与测试；`public/assets/history/`、`scripts/fetch-history-images.mjs`、`docs/research/`、`docs/superpowers/`、`design/captures/`、`AGENTS.md` 和 `design-qa.md`。
- 改了什么：事件页只保留现场、改变证据、当代身份和三个行动；退出键进入时间线正常布局；第二节点起固定展示上一选择、直接结果和新代价；画像每幕可预判一个专属行动；五张与全部五十张共用横滑轮播；UI 明示 DeepSeek 或本地兜底来源；为 50 个节点缓存独立本地图。
- 为什么这样改：玩家需要在三秒内看懂自己在哪里、上一步改变了什么、下一步能做什么，同时评委需要直接看到真实 AI、结构化推理与稳定降级机制。
- 影响了哪些模块：DeepSeek 输出契约、事件呈现、画像机制、档案选择、图片管线、移动端布局、测试、研究与验收文档。

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
