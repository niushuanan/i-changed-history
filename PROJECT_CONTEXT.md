# Project Context

## 1. 这个项目是干什么的

《哎！我改变了历史？》是一款可玩的移动端 AI 穿越历史游戏。玩家直接从按年份排列的 50 个公元后著名真实历史瞬间选择入口，进入一个有固定姓名和身体的历史主角，并在其一生中完成 12 次 AI 即兴叙事与重大决策。第 12 次选择后主角死亡，游戏生成两份互补结局：贯穿十二节点的《史记》式人物列传（白话与文言），以及一页内读完的、延伸至 2026 的小说式蝴蝶效应报告。每个节点都可不限次数打开“直接改写”，最终提交的一次完成结果立即成为该节点正史。产品没有人格测试、MBTI 标签或隐藏的自动选择时间线。

当前版本是本地纯前端应用：在浏览器直接调用 DeepSeek `deepseek-v4-flash`，用 Zod 校验结构化输出，用前端公式计算历史偏离度，用本地音频构建史诗氛围，并可将结局头版导出为高清 PNG。密钥只放在被 Git 忽略的 `.env.local`。

## 2. 代码结构是什么

- `src/data/`：50 张公元后著名历史瞬间和按年份/阶段选取的视觉资产映射。
- `src/game/`：游戏领域层，包含单一主角一生 12 决策时间计划、不可撤销世界正史、重大节点编排、结构化 schema、DeepSeek prompts、生成引擎、确定性偏离度和纯 reducer。
- `src/hooks/`：`useGame.ts` 负责请求取消、预生成、即时回响、存储、音频和重试编排。
- `src/services/`：DeepSeek 传输、版本化本地存储、史诗配乐和 PNG 分享/下载。
- `src/screens/` 和 `src/components/`：从历史档案选择、同一主角一生决策到死亡与 2026 身后历史报告的完整界面。
- `src/styles/`：煤黑、新闻纸、朱砂红、青绿和黄色构成的移动端视觉系统。
- `src/test/`：Vitest 初始化和可复用的幕次/结局夹具。
- `design/`：三套 ImageGen 首屏方向、选定的 `redaction-room.png` 和真实浏览器截图。
- `public/assets/` 与 `public/audio/`：历史场景图、CC0 史诗配乐及授权记录。
- `docs/superpowers/`：Superpowers 收敛的产品规格和实施计划。

实际数据流是：选择真实历史卡 -> DeepSeek 以 SSE 流式生成固定姓名的历史主角 -> 玩家选择 AI 行动或直接写入正史 -> 客户端把姓名、年龄、人生阶段和全部决定固化为不可撤销 `WorldCanon` -> 客户端把全部决定压成分层叙事上下文，DeepSeek 开放推演同一主角下一次重大冲突 -> 本地只注入客户端权威字段并归一无害格式漂移，Zod 校验人物连续性与因果账本；缺失可见文案时仅让 AI 补回失败字段 -> 前端展示“决定、已改变、重大节点、史实分歧” -> 第 12 次决定 -> 主角死亡 -> 并发生成《史记》式白话/文言列传与一页 2026 蝴蝶效应报告 -> 客户端合并 -> PNG 报告。

## 3. 关键入口在哪里

- `index.html`：Vite 页面入口。
- `src/main.tsx`：React 挂载入口。
- `src/App.tsx`：根组件，负责历史胶片入口、游戏 phase 切换和结局导出。
- `src/hooks/useGame.ts`：运行时编排入口。
- `src/game/engine.ts`：结构化幕次与结局生成入口。
- `src/game/worldCanon.ts`：把玩家决定固化为世界正史，并生成下一幕的重大节点编排约束。
- `src/data/historySeeds.ts`：历史卡牌数据入口。
- `vite.config.mjs`：开发服务器和 Vitest jsdom 配置。
- `package.json`：`npm run dev`、`npm test`、`npm run typecheck`、`npm run build` 命令入口。
- `design/selected-visual.md`：image-to-code 的目标稿和尺寸约束。
- `.env.example`：DeepSeek 模型和本地密钥变量模板，不包含真实密钥。

## 4. 最近改了什么

### 2026-07-13 22:20 - 把行动回响改成白话结果确认页

- 本次任务：解决选择后的过渡页充斥看不清的小灰字，以及“因果回响、世界已回应、偏离 +3”等中二或系统化术语的问题。
- 改了哪些文件：`src/screens/ButterflyEchoScreen.tsx`、新增组件测试、`src/App.integration.test.tsx`、`src/styles/game.css`、`AGENTS.md`、`PROJECT_CONTEXT.md` 与 `design-qa.md`。
- 改了什么：删除因果回响、偏离分数和泛化大标题；把 AI 生成的具体落地结果直接作为页面标题；只保留“你刚才选择了、代价是、受益者、承担者”；自定义结果用“你写下的结果已经发生”和“它会这样传开”解释；按钮改为“看看接下来发生什么/查看最终历史”；所有正文进入高对比度深色底板并提高字号与颜色对比。
- 为什么这样改：玩家选择后只需要确认四件事：发生了什么、我的决定是什么、付出了什么、影响了谁。模型评分和内部因果术语不应占据玩家注意力，也不应让核心结果压在复杂图片上难以辨认。
- 影响了哪些模块：行动结果确认、直接改写结果确认、十二节点集成流程、移动端可读性和产品文案规范。
- 验证：25 个 Vitest 文件共 155 项通过，TypeScript、生产构建、跨平台路径扫描与 `git diff --check` 通过；真实点击董卓第二节点“向吕布告发王允密令”后，页面直接显示“吕布大怒，立即包围王允宅邸”；390 x 844 下页面无滚动，结果底板高 364px、按钮底边 818px，所有核心文字完整可读，控制台 0 错误、0 警告。

### 2026-07-13 22:05 - 压缩事件决策页并开放无限结果改写

- 本次任务：按实机截图解决历史改变术语难懂、古代地点称谓违和、因果回执占位过大、三个选项过高且灰字重复，以及结果改写被三次上限锁死的问题。
- 改了哪些文件：`src/components/{TimelineProgress,ChoiceList}.tsx`、`src/screens/TimelineEventScreen.tsx`、`src/game/{deviation,prompts,schema,reducer,rippleRouter}.ts`、`src/services/storage.ts`、`src/App.tsx`、`src/styles/game.css`、相关测试、`AGENTS.md`、`PROJECT_CONTEXT.md` 与本次 Superpowers 规格/计划。
- 改了什么：顶部改为“历史改变 + 白话阶段”；三个行动压成固定短行并隐藏重复的行动者/期限小字；决策整体上移，底部只保留“历史已经改变 + 落地结果 + 因果句 + 史实差异”；直接结果改写不再限次；1900 年前模型若返回“议事厅、会议室、办公室、指挥中心”等现代空间名，schema 会把 `location` 标成时代错误并只修复该 AI 字段。
- 为什么这样改：玩家首先需要看清当前局面并迅速做决定，因果证明应在决策之后作为可信依据，而不是用解释性方块与重复标签争夺首屏；无限改写让玩家拥有真正的历史解释权，但每个节点仍只能提交一次最终决定。
- 影响了哪些模块：事件页信息层级、偏离度语言、直接改写状态机与存档、DeepSeek 地点契约和字段修复、移动端布局与回归测试。
- 验证：24 个 Vitest 文件共 153 项通过，TypeScript、生产构建、跨平台路径扫描与 `git diff --check` 通过；390 x 844 真实浏览器中首幕和续幕均为 `scrollHeight === clientHeight === 844`，三个行动分别为 57px/53px，续幕底部因果区 `scrollHeight === clientHeight === 150px`；实际点击董卓开场、无限改写弹层、AI 选择、回响与第二节点，DeepSeek 生成“洛阳宣阳门外”和“长安，王允旧宅内室”，控制台 0 错误、0 警告。

### 2026-07-13 21:45 - 修复公开仓库的跨用户、跨平台安装

- 本次任务：解决朋友从公开 GitHub 仓库拉取后，npm 仍尝试创建作者电脑路径并在 Windows 报 `EPERM`，同时建立防止类似绝对路径再次上传的自动门禁。
- 改了哪些文件：`.npmrc`、`package.json`、`package-lock.json`、`scripts/check-portability.mjs`、`.github/workflows/portable-build.yml`、`README.md`、`docs/superpowers/plans/2026-07-11-i-changed-history.md`、`AGENTS.md` 与 `PROJECT_CONTEXT.md`。
- 改了什么：删除 `.npmrc` 中指向原作者个人目录的 `.npm-cache` 绝对路径，保留与机器无关的 npm 设置；新增运行时文件绝对用户路径扫描和 Node 版本约束；新增 Windows、Linux 双平台的 GitHub Actions v5 安装、测试、类型检查与构建；补充 macOS/Linux 和 Windows PowerShell 的完整克隆、配置 Key 与启动说明；清除旧开发文档中的作者插件绝对路径。
- 为什么这样改：Windows 会把仓库中的 Unix 用户根路径映射到当前盘符，继而尝试操作不存在或无权限的原作者用户目录。缓存应归属运行者自己的 npm 用户目录，而不是项目作者；仅修当前一行仍会复发，因此需要本地扫描与真实 Windows CI 双重门禁。
- 影响了哪些模块：公开仓库克隆、npm 安装缓存、Windows/macOS/Linux 本地启动、GitHub 提交验证、运行环境文档；不改变游戏逻辑、界面或 DeepSeek 推演行为。
- 验证：修复前 `npm run check:portability` 精确失败在 `.npmrc:1`；修复后扫描 70 个运行时文件通过。将工作区复制到带中文和空格的全新目录，并把 `HOME` 改为陌生用户目录后，npm 缓存落在该用户自己的 `home/.npm`，随后从零 `npm ci` 安装 158 个包，24 个 Vitest 文件共 151 项测试、TypeScript 与生产构建全部通过；远端 GitHub Actions 的 Windows 与 Linux 作业也均完成完整门禁。

### 2026-07-13 20:40 - 流式真实进度、缓存前缀与 AI 字段级修复

- 本次任务：在不牺牲游玩连续性和生成质量的前提下，加快等待反馈、证明剧情由 AI 实时驱动，并降低结构漂移导致的整幕重写和失败率。
- 改了哪些文件：`src/services/deepseek.ts`、`src/game/{prompts,schema,engine}.ts`、`src/hooks/useGame.ts`、`src/screens/GeneratingScreen.tsx`、`src/App.tsx`、相关测试与夹具、`AGENTS.md`、`PROJECT_CONTEXT.md`，以及 `docs/superpowers/` 下的设计规格和执行计划。
- 改了什么：DeepSeek 幕次请求改为 UTF-8 安全的 SSE 流式解析，等待页直接接收连接、思考、书写、校验和修复的真实阶段，并用单调状态防止重试或并发请求让进度倒退；开场与续幕共享稳定的静态协议前缀，把变化的正史留在最后一条用户消息以利用上下文缓存；前端不再补写标题、现场、身份桥梁等可见历史文案；可解析 JSON 只向 AI 请求失败的根字段并与原始剧情合并，只有不可解析或跨字段语义失败才整体验证修复；保留单幕单导演请求，未把现场拆成三个互相冲突的并发文案调用。
- 为什么这样改：流式阶段改善感知速度但不削减推理预算；稳定前缀减少重复输入成本；字段级修复保住已经生成的优质剧情并缩短补救输出；单个场景仍由一次完整推理负责，确保人物、因果和三个行动相互一致。只把相互独立的结局列传与 2026 报告并发。
- 影响了哪些模块：DeepSeek 传输协议、上下文缓存命中、结构修复策略、AI 来源可信度、等待页状态、断线恢复兼容、幕次与结局生成测试。
- 验证：24 个 Vitest 文件共 151 项通过，TypeScript 与生产构建通过；真实 DeepSeek 从公元 64 年罗马大火首幕续到三日后第二幕，显示 `DeepSeek 实时生成`；第二幕漏失两个字段时仅发出字段补全请求，保留原始剧情；390 x 844 浏览器中事件页 `scrollHeight === clientHeight === 844`，三项行动与直接改写全部同屏，控制台 0 错误、0 警告。独立 SSE 验证观察到上下文缓存命中。

### 2026-07-13 20:00 - 稳定单轮生成、分层上下文与并发双结局

- 本次任务：解决主游玩页文字遮挡或留白失衡、DeepSeek 返回慢且因轻微格式漂移频繁整轮重试，并明确第五轮及最终报告需要的历史上下文。
- 改了哪些文件：新增 `src/game/narrativeContext.ts` 及测试；修改 `src/game/{prompts,schema,engine}.ts`、`src/services/deepseek.test.ts`、`src/screens/TimelineEventScreen.tsx`、`src/styles/game.css`、相关测试、`AGENTS.md`、`PROJECT_CONTEXT.md`；新增架构规格与执行计划到 `docs/superpowers/`。
- 改了什么：续幕只发送“全部选择索引 + 最新选择全量 + 最近三次后果 + 所有玩家钦定原文 + 最新持续账本 + 最近三幕防重复”的分层上下文，不再重复发送整段旧剧情；模型不再抄写幕次、年龄、年份、上一回响和指标，客户端权威注入；A/B/C 编号、偏离类型、现代知识标记和超长短句可本地归一，缺失标题或现场文案必须由 AI 修复；最终人物列传与 2026 世界报告拆成两个字段互斥的并发请求后确定性合并；事件页按文案密度自动压缩场景与字号，正文和因果回执使用自然高度，底部保留 8px 安全区。
- 为什么这样改：把同一幕拆成三个并行文案请求会产生三个互相冲突的现场，无法可靠合并；单次紧凑场景请求能保持因果一致性。人物列传和身后世界互不依赖，适合真正并发。历史上下文按“全局索引、近期细节、永久玩家正史”分层，既保留第五轮所需因果，也避免 token 随轮次无界增长。
- 影响了哪些模块：DeepSeek 请求体与重试策略、幕次结构归一、玩家正史连续性、结局生成时延、移动端事件布局、测试契约与项目文档。
- 验证：24 个 Vitest 文件共 145 项通过，TypeScript、生产构建与 `git diff --check` 通过；真实 DeepSeek 连续生成罗马大火第一幕与三日后第二幕，总计仅 2 个 API 请求，未触发修复；390 x 844 实机浏览器中 `scrollHeight === viewport === 844`，完整现场、因果回执、三个动作和自由改写同屏，底部操作距视口 8px，控制台 0 错误。

### 2026-07-13 19:00 - 删除人格系统并重做满屏事件与双页结局

- 本次任务：解决事件页顶部文字压图、下半屏大面积空白，并按最终产品定义删除所有性格内容，将结局改为同一人生的两份正式文本。
- 改了哪些文件：`src/game/{reducer,schema,prompts,engine,customCanon,types}.ts`、`src/hooks/useGame.ts`、`src/services/{storage,share}.ts`、`src/screens/`、`src/components/`、`src/styles/game.css`、`src/App.tsx`、`index.html`、相关测试、`AGENTS.md` 与 `PROJECT_CONTEXT.md`；删除人格入口、人格逻辑和隐藏时间线文件。
- 改了什么：产品从 50 卡胶片直接开局；状态机、存档和模型调用只保留玩家时间线；自由改写回执不再包含人格裁决；事件页改为 52px 页头、164px 场景与弹性正文的单一纵向网格，三个行动平分剩余高度；结局 schema 新增白话列传与文言列传，界面固定为“穿越者列传”和“被改变的 2026”两页，后者限制在一个手机页面内；品牌统一为 `哎！我改变了历史？`，存档升级 v11。
- 为什么这样改：玩家的决定必须是唯一叙事权威，性格自动线会稀释控制感并增加一倍等待与失败面；移动端页面必须利用整屏而不是用互相覆盖的固定高度制造遮挡和空洞；结局要回答“这个人一生做了什么”和“世界最终变成什么”两个清晰问题。
- 影响了哪些模块：开局路径、AI prompt、请求数量、状态机、存档迁移、自由改写、事件页布局、结局数据契约、报告导出和自动化测试。
- 验证：23 个 Vitest 文件共 137 项通过，TypeScript、生产构建与 `git diff --check` 通过；390 x 844 真实浏览器中续幕事件页的页头、场景、完整因果证明、三个行动与自由改写同屏且无空白；2026 报告页 `scrollHeight === clientHeight === 844`，四段身后历史、三个生活细节和小说式尾声一屏完整；从结局点击“再改一次历史”直接返回 50 张时间胶片，控制台 0 错误、0 警告。

### 2026-07-13 18:35 - 删除七类剧情模板并建立双时间线开放推演

- 本次任务：根治董卓线路被本地“国运会战”等七类模板接管、选项抽象、MBTI 只作标签、事件页空白过大，以及人格没有实际玩法的问题。
- 改了哪些文件：`src/game/{worldCanon,fallbackTurn,prompts,schema,engine,reducer,instinctTimeline}.ts`、`src/hooks/useGame.ts`、`src/services/{deepseek,storage}.ts`、`src/screens/{TravelerProfileScreen,SeedPickerScreen,TimelineEventScreen,ButterflyEchoScreen,AlternatePresentScreen}.tsx`、`src/components/{ChoiceList,ResultFrontPage}.tsx`、`src/App.tsx`、`src/styles/game.css`、相关测试与夹具、`AGENTS.md`、`docs/superpowers/`。
- 改了什么：物理删除七类 `PIVOT_SCENES`、固定剧情分类器、通用 A/B/C 和本地历史/结局生成器；DeepSeek 直接接收不可撤销正史、最近三幕、年龄与时代约束，自行做一至三阶因果推理；新增 2-4 个时代锚点和行动者/动作/对象/期限结构校验；结构连续失败改为保留进度并显式重试；人格从可见 ENFP 标签改为隐藏的第二条人生，每幕自动选择人格行动，分岔后两条历史并行调用 DeepSeek，结局可翻页比较两份 2026 报告；存档升级 v10；事件图压到 184px，正文与因果回执改为自然紧凑布局。
- 为什么这样改：惊奇必须由模型从玩家真实决定中推导，而不是由客户端轮换题材；人格只有真的替玩家走完另一种人生并在结局形成对照才有游戏价值；失败也不能用看似可玩的套话掩盖真实模型状态。
- 影响了哪些模块：AI 推演协议、历史连续性、玩家正史、人格机制、双分支状态机、请求并发、存档恢复、事件页、回响页、结局报告与完整回归测试。
- 验证：Vitest、TypeScript 和生产构建通过；390 x 844 真实浏览器中完成四问人格、50 卡时间轴、董卓首幕、行动回响与第二幕。DeepSeek 生成同一主角赵谦从“宣阳门伏：吕布生死一线”进入三日后的“李傕搜营：三日惊变”，选项包含张济、搜捕队、亲兵、具体期限；场景、因果回执、三项动作和自由改写在一屏内完整可操作。

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

- 本次任务：把难以理解的泛化反事实游戏重构成 `哎！我改变了历史？` 的现代人穿越体验，并通过真实 DeepSeek 续幕验证。
- 改了哪些文件：`AGENTS.md`、`PROJECT_CONTEXT.md`、`index.html`、`vite.config.mjs`、`src/App.tsx`、`src/data/historySeeds.ts`、`src/game/{profile,reducer,prompts,engine,schema,types}.ts`、`src/hooks/useGame.ts`、`src/services/{storage,share}.ts`、`src/screens/*`、`src/components/HistoryCard.tsx`、`src/styles/game.css` 及配套测试。
- 改了什么：加入画像首屏和本地推荐；重写 50 个公元后具体历史瞬间，其中 18 个为 1840 年前中国史；将场景绑定为“画像 + 卡片”；AI 幕次强制输出身份、现场目标、倒计时和三个具体动作；删除自定义开局与自由干预；存档升级为 v2；品牌统一为 `哎！我改变了历史？`；测试范围限定在主项目 `src/`，避免 `.worktrees` 被重复执行。
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
