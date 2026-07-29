# Project Context

## 1. 这个项目是干什么的

《哎！我改变了历史？》是一款移动端 AI 穿越历史肉鸽卡牌游戏。100 个著名真实历史转折点（中国 58、世界 42，覆盖公元前到现代）不再作为自由选择目录直接压给玩家：首页先显示未显影命运牌，玩家按下抽取后，完整档案海报卡在有纵深的 3D 轮盘里以固定节奏从右后方旋入、从左后方退场，随后随机揭晓一个历史现场；系统优先命中尚未通关的节点。抽取时不显示任何闯入或重抽按钮，停稳后才揭晓完整海报卡、主行动与紧邻其下的次级重抽，最后一张旋转卡与停稳卡保持完全一致的可见几何。玩家进入后立即装载该节点固定且经过 schema 校验的第一幕。每幕先展示循史、破局、天外三张牌并允许 Roll 三次：第一次经过约 1.2 秒实体洗牌仪式换成预生成第二组，第二和第三次在保持现场不变的前提下由 DeepSeek 实时生成新三张。循史不再等同于温和或少改变，而是让当前掌权者、命令方向与既有结果按时落地；它即使执行战争、政变或拒绝也属于循史，并且不会新增偏离度。100 个固定第一幕的两组 A/B 都在开发期由 DeepSeek V4 Flash 编写，A 逐条对照真实结局审校，B 才负责改变控制关系、命令或结果。天外牌不再由抽象奇想模板临场乱编，而是由客户端从 50 项彼此不同的超能力中整局无放回抽取，再要求 AI 把唯一指定能力深度用在本幕的真实人物、器物、命令、地点与期限上；固定第一幕再从该历史快照专属的六张 AI 天外候选里随机取两张，因此不增加任何首屏等待。牌面以 4-7 字为生成目标（schema 兼容上限 16），长按显示完整决定、行动规格、结果与代价，向上划出一张后把完整决定写入时间线；产品不提供自由输入或第四路径。所有面向玩家的生成文案必须使用自然中文：`powerId`、`deadline`、`actionSpec` 和 `reverse-cause` 一类协议字段或能力 ID 只能存在于结构化数据中，新输出一旦泄漏就进入字段修复，旧存档只把这些确定的机器词迁移成权威中文能力名；NASA、CERN、U-2 等真实历史专名缩写仍可保留。同一位固定姓名和身体的主角只经历命运当日、三日后、人生转折、最后抉择四次重大决定。第四次决定成为客户端正史时，该开局立即写入独立的永久“已解锁档案”，不等待自然普通话的《一生纪事》和延伸至 2026 的蝴蝶效应报告成功；已解锁档案可反复点击并从固定第一幕开始全新一局。产品没有人格测试、MBTI 标签或隐藏的自动选择时间线。

当前版本保留完整的浏览器端游戏，同时已经具备可公开分享的 Sites / Cloudflare Worker 托管架构：浏览器只向同源 `/api/deepseek/completions` 发送固定游戏协议，Worker 从运行时 secret 读取 DeepSeek `deepseek-v4-flash` 密钥，并通过官方 `/v1/chat/completions` 原样流式转发 SSE；浏览器产物不再包含 API Key。localhost 和 Sites 都不设置产品侧访客、IP、全站、分钟或每日请求限额，也不再创建 D1 用量桶；通过版本、同源、系统协议、阶段、请求类型和 JSON 结构校验的游戏请求会立即转发。Worker 不再检查具体中文 `task` 文案，因此 prompt 演进不会再次触发产品侧 400；DeepSeek 上游仍可能按供应商容量或账户状态返回 429。互动空间完全绕过该 Worker，只通过 `tt.callAIChatCompletion` 使用平台托管的火山凭据。本地与 Node 长测优先读取项目 `.env.local` 的当前 Key，避免失效的系统环境 Key 覆盖用户刚配置的凭据；发布长测必须通过本地 Worker 代理运行，直连官方接口的 Node 长测只用于拆分上游故障，不能证明浏览器产品可用。后续幕次使用九位场景数组加两组三牌数组的低延迟协议，只传对连续性、校验或可见故事有真实消费方的上下文，完整中文决定与结果仍由模型编写；常规幕次使用 4096 输出 token，并发双结局各使用 2048，全部走 V4 Flash 非思考快速路径；十秒只作为真实长测中的优化目标，不是运行时截止线，超过十秒的健康请求会继续流式生成，完整文案、字段修复和剧情连续性优先。Zod 继续校验结构化输出，也会在本地补齐无语义变化的句末标点、接纳完整的自然长度，并在模型多写身后时代时保留最早三段与最终 2026 段；人物结局中的死亡年份和年龄由客户端权威渲染，模型只提供纯地点，若新响应或旧存档在地点前重复年龄，schema 会在显示前去重。前端公式继续计算历史偏离度，本地 CC0 配乐以低响度随章节缓慢变化，八项交互音效作为前景反馈并在播放时短暂压低配乐；两页结局仍按完整滚动尺寸导出为 2x PNG，桌面端直接下载，移动 Web 通过第二次用户操作打开系统分享面板并保留 PNG 下载后备。当前局存档与永久解锁集合分别保存在浏览器 `localStorage`：局内状态可按版本淘汰，已解锁档案仍会恢复并参与后续随机优先级。

本地开发环境还提供独立的 `/tap.html` LLM Tap 调试页。浏览器端 DeepSeek 传输会通过同源 `BroadcastChannel("llm-tap-v1")` 旁路广播每次请求的完整输入、输出、状态、时序和 token 用量；调试页最多保存 200 条记录，支持请求翻页、输入/输出/指标切换、JSON 导出和清空。广播失败始终静默，不得影响游戏请求；`tap.html` 与 `src/tap/` 不进入普通生产构建和互动空间审核包。

项目只维护 `main` 上这一份完整 100 剧本源码。抖音互动空间包由 `npm run build:interactive` 从同一份代码即时生成：AI 传输在构建时替换为真实 `tt.callAIChatCompletion`，模型固定 `deepseek-v4-flash`，密钥只使用互动空间账号托管的火山引擎 API Key；全部 100 个历史开局、固定首幕和对应本地历史图均进入提交 ZIP。脚本检查完整剧本和图片数量、清理 macOS 元数据、优化全部移动资源、执行 8MB ZIP 闸门并生成待上传文件；首页标题栏角落持续显示小型 `AI 生成` 标识，成品事件和两页报告显示更完整的 AI 来源标识，互动空间用 `体验说明` 避免平台禁用词。`interactive-space.release.json` 把 AppID、竖屏、ZIP、AI 开启、火山平台凭据和模型写成机器可查的发布契约，`20107` 会阻断提审。此前平台 AppID 和提审记录只属于历史发布记录，本次没有上传或改变平台状态。

## 2. 代码结构是什么

- `src/data/`：100 张著名历史转折点、与其一一对应的固定第一幕、搜索筛选目录，以及按年份/阶段选取的视觉资产映射。
- `src/data/historySeeds/`：历史剧本模块边界；`scripts/<seed-id>/index.ts` 每个目录只拥有一个剧本，`shared.ts` 提供公共构造器与标签，`index.ts` 显式维护完整 100 节点的唯一聚合顺序。
- `src/data/fixedOpeningChoices.generated.ts`：100 个历史快照开发期 AI 生成并审校的两组 A/B；网页与互动空间共用这一份权威数据。
- `src/data/fixedPowerChoices.generated.ts`：100 个历史快照各六张开发期 AI 天外候选；网页与互动空间共用这一份权威数据。
- `src/game/`：游戏领域层，包含单一主角一生四决策时间计划、每幕首发六张牌与三次 Roll 状态、不可撤销世界正史、重大节点编排、结构化 schema、DeepSeek prompts、生成引擎、确定性偏离度、纯 reducer，以及 `playerFacingText.ts` 对机器字段和 50 个英文能力 ID 的中文边界。
- `src/game/powers.ts`：50 项权威超能力、随机洗牌、开局候选抽取、整局无放回发牌和模型能力说明入口。
- `src/game/playerFacingText.ts`：内部字段名、拼错的 `resverse cause` 和 50 个英文能力 ID 到权威中文能力名的唯一映射；仅用于固定数据与旧存档兼容，新 AI 输出必须在 schema 层直接通过中文文案校验。
- `src/hooks/`：`useGame.ts` 负责请求取消、下一幕预取、卡组 Roll、即时回响、存储、音频和重试编排。
- `src/services/`：DeepSeek 官方 / Sites Worker 传输、互动空间火山平台传输、带短时配乐 ducking 的前景卡牌音效、版本化当前局存储、独立永久解锁收藏、低响度史诗配乐，以及完整报告 PNG 的准备、系统分享、下载与资源回收。
- `tap.html` 与 `src/tap/`：仅供本地开发的 LLM Tap 独立 React 页面；通过同源 BroadcastChannel 接收 DeepSeek 输入、输出、时序、状态与 token 用量，并提供三视图、翻页、持久化、导出和清空。
- `app/`：vinext App Router 页面、中文 metadata，以及禁止服务端预渲染现有浏览器游戏的 client-only 边界。
- `worker/`：Sites Cloudflare Worker 入口、稳定游戏协议校验、DeepSeek 服务端密钥注入和无产品侧限流的透明 SSE 转发。
- `build/` 与 `.openai/hosting.json`：Sites 构建元数据、项目 ID 和无 D1 / R2 绑定的托管配置。
- `src/screens/` 和 `src/components/`：从命运抽取、游戏说明、解锁档案、三卡牌桌、三次 Roll、长按详情、上划提交，到同一主角死亡与 2026 身后历史报告的完整界面。
- `src/components/CardCommitFlight.tsx`：脱离事件页裁剪层的页面最高层飞行、距产品顶部约 8px 的居中停驻、连续弧线轨道，以及 GPU 卡面裁切配合轻量纸灰粒子的无栅格消散。
- `src/styles/`：煤黑、新闻纸、朱砂红、青绿和黄色构成的移动端视觉系统。
- `src/test/`：Vitest 初始化和可复用的幕次/结局夹具。
- `src/soak/`：显式运行的真实 DeepSeek 四决策完整局压力测试；至少以五个不同开局检验 20 个生成阶段中完成不少于 19 个、五局中完整双结局不少于四局，也支持用 `SOAK_ALL_ROLL=1` 对指定开局执行相同的全幕与成功率门槛。发布门禁通过 `SOAK_PROXY_BASE_URL` 让 Node 测试走浏览器同款本地 Worker 协议，并由 `SOAK_REQUIRE_PROXY=1` 强制拒绝误用直连模式；报告记录真实传输类型与每幕、双结局是否达到十秒优化目标，但不会因超过十秒中止健康生成，结果只写入被忽略的 `tmp/soak/`。第二、第三次实时 Roll 的请求、恢复与错误重试由 reducer、组件和应用集成测试覆盖。
- `design/`：历史视觉稿与 360×667 / 390×844 真实浏览器验收截图。
- `public/assets/` 与 `public/audio/`：历史场景图、三套原创透明卡面图标、CC0 史诗配乐、八项纸张/卡牌交互音效及完整授权来源记录。
- `scripts/package-interactive-review.mjs`、`scripts/prepare-interactive-build.mjs`、`scripts/verify-interactive-review-build.mjs` 与 `scripts/optimize-interactive-assets.mjs`：构建包含全部 100 个剧本的平台运行时、检查完整剧本和历史图、优化移动资源、执行未压缩与 ZIP 双体积闸门，并生成唯一待提交 ZIP。
- `interactive-space.release.json` 与 `docs/interactive-space-release-checklist.md`：互动空间 AppID、AI 开关、V4 Flash、平台火山凭据、竖屏、ZIP 上限、`20107` 阻断与提审前真机门禁。
- `scripts/generate-fixed-opening-choices.mjs`：批量生成、结构校验、历史语义审校并断点续跑 100 个固定开场 A/B；任何 AI 失败都会终止且不会写入本地模板兜底。
- `scripts/generate-fixed-power-choices.mjs`：批量生成、校验并可断点续跑 100×6 张固定开局天外候选，输出网页与互动空间共用的全量权威数据；正常运行时不会调用它。
- `docs/superpowers/`：Superpowers 收敛的产品规格和实施计划。

实际数据流是：未显影卡牌 -> 客户端从尚未解锁的 100 节点池随机选择并预载候选历史图 -> 完整 `HistoryCard` 通过九段固定 180ms 节奏的 3D 轮盘旋转停靠，中心卡保持清晰，旧卡向左后方退场，新卡从右后方旋入 -> 轮盘停稳后才挂载 `闯入这一刻` 与紧邻的 `换一个开局` -> 客户端读取该历史已经由 AI 生成并审校的两组 A/B，再从该历史专属六张 C 候选中随机取两项能力，同时打乱剩余 48 项能力并把整个牌堆写进当前局存档 -> 同步装载固定第一幕、固定主角与两组三张牌 -> 玩家可直接选首组，也可第一次 Roll 在约 1.2 秒实体洗牌后无网络地换成预生成第二组；第二、第三次 Roll 先无放回取一项能力，再把它、当前现场和所有已看牌提交给模型，只接收新的 A/B/C 三张，并在请求成功或失败前保持可见洗牌过渡，失败重试继续使用同一个 `powerId` -> 长按查看完整字段，向上划出一张 -> reducer 把完整 `label`、能力 ID、偏离类型与即时结果固化为不可撤销 `WorldCanon`；A 不新增偏离度，B/C 才会继续推高改变 -> 结果页为下一幕预取两项不同能力 -> 第 2 至第 4 幕把全部已选牌压成分层叙事上下文，本地/Sites 通过官方 `/v1/chat/completions` 发起 SSE 推演，互动空间只由 `tt.callAIChatCompletion` 使用平台托管的火山凭据 -> 本地/Sites DeepSeek 传输完成或失败时同步尝试向 `llm-tap-v1` 广播完整调试记录，但不等待调试页也不让广播失败干扰游戏 -> Zod 校验人物连续性、两组三档牌、指定能力和因果账本，缺失可见文案时仅补失败字段 -> 第 4 张牌成为最后决定时立即写入独立永久解锁集合 -> 并发生成自然普通话《一生纪事》与 2026 蝴蝶效应报告，四次决定列表由客户端权威时间线保留但不在报告重复展示，分享语使用稳定产品文案 -> 合并报告并导出完整 2x PNG；玩家从档案再次选择该历史时，清空上一局并重新随机发放该历史的固定天外候选。

## 3. 关键入口在哪里

- `app/page.tsx` 与 `app/game-client.tsx`：Sites 页面入口；用 `next/dynamic(..., { ssr: false })` 保证现有游戏只在浏览器挂载。
- `app/layout.tsx`：中文根布局、站点 metadata 和两份全局样式入口。
- `worker/index.ts`：Cloudflare Worker 总入口。
- `worker/deepseek-proxy.ts`：固定游戏协议、DeepSeek 服务端代理、SSE 透传、取消、localhost 配额旁路和 Sites 分钟级 D1 反滥用入口。
- `src/App.tsx`：根组件，负责首次游戏说明、命运抽取入口、游戏 phase 切换和结局导出。
- `src/hooks/useGame.ts`：运行时编排入口。
- `src/game/engine.ts`：结构化幕次与结局生成入口。
- `src/game/powers.ts`：50 项超能力定义、无放回抽取和模型注入格式入口。
- `src/game/schema.ts` 与 `src/game/reducer.ts`：六张首发牌、三次 Roll、动态牌组、永久解锁、存档状态和卡牌提交的权威入口。
- `src/components/ChoiceList.tsx` 与 `src/components/CardCommitFlight.tsx`：三卡牌桌、固定卡框/中部独立滚动的顶层长按详情、上划提交、三次 Roll、即时音效，以及顶层固定轨道飞行与纸灰消散入口。
- `src/services/audio.ts` 与 `src/services/cardAudio.ts`：低响度章节配乐、交互音效逐项增益、按音效时长自动压低并恢复配乐的混音入口。
- `src/screens/SeedPickerScreen.tsx` 与 `src/components/GameAnnouncement.tsx`：百节点 3D 轮盘随机停靠、未显影/揭晓卡、已解锁档案和首次玩法说明入口。
- `src/data/fixedOpenings.ts` 与 `src/data/fixedOpeningChoices.generated.ts`：100 张历史卡的固定第一幕，以及 AI 生成、历史语义审校后的两组循史/破局牌构建入口。
- `src/data/fixedPowerChoices.generated.ts`：100×6 张历史快照专属固定天外候选的运行时权威数据；只由生成脚本更新。
- `src/game/worldCanon.ts`：把玩家决定固化为世界正史，并生成下一幕的重大节点编排约束。
- `src/data/historySeeds/index.ts`：100 个单剧本模块的显式聚合与历史卡牌数据入口。
- `src/services/share.ts`：完整报告图片准备、移动系统分享、桌面下载和 object URL 回收入口。
- `src/services/storage.ts`：版本化当前局存档与独立永久解锁档案的保存、合并、旧版本迁移和损坏恢复入口。
- `src/services/deepseek.ts`、`src/services/deepseek.interactive.ts` 与 `docs/ai-transports.md`：DeepSeek 官方、Sites 同源 Worker 和互动空间火山平台双通道入口与说明。
- `tap.html` 与 `src/tap/main.tsx`：本地 LLM Tap 独立页面与 React 挂载入口；`src/tap/hooks/useTapChannel.ts` 负责调试广播、最多 200 条本地持久化、同步、导出和清空。
- `vite.config.ts`：vinext、Sites metadata 和 Cloudflare Worker 本地开发配置。
- `vite.interactive.config.ts`：互动空间纯静态 Vite 构建和 `tt.callAIChatCompletion` / 本地报告导出适配入口。
- `vitest.config.mjs` 与 `vitest.soak.config.mjs`：普通 jsdom 回归与真实 DeepSeek 长局配置；Node 长测可直连模型做上游诊断，发布门禁则必须通过本地 Worker 代理运行。
- `.openai/hosting.json`：Sites 项目 ID 与空 D1 / R2 绑定，绝不保存运行时密钥。
- `.trae/mcp.json`：比赛方 `interative_content_mcp` 的项目级发布配置。
- `scripts/package-interactive-review.mjs`：抖音提审前唯一允许的打包入口，最终输出 `release/i-changed-history-interactive-space.zip`。
- `interactive-space.release.json` 与 `docs/interactive-space-release-checklist.md`：火山 AI、模型、包体、AI 标识、官方校验与提审阻断规则入口。
- `scripts/generate-fixed-opening-choices.mjs`：固定开场循史/破局的开发期 AI 生成、结构/历史语义审校、断点续跑和全量权威数据输出入口。
- `scripts/generate-fixed-power-choices.mjs`：固定开局天外候选的开发期 AI 生成、校验、断点续跑和全量权威数据输出入口。
- `package.json`：`npm run dev`、`npm test`、`npm run test:soak`、`npm run typecheck`、`npm run build` 和 `npm run build:interactive` 命令入口；其中 `build:interactive` 已固定为完整 100 剧本互动空间打包链路。
- `design/selected-visual.md`：image-to-code 的目标稿和尺寸约束。
- `.env.example`：DeepSeek 模型和本地密钥变量模板，不包含真实密钥。

## 4. 最近改了什么

### 2026-07-30 00:03 - 移除产品侧 AI 限流并消除结局年龄重复

- 本次任务：解释并修复 Worker 400 与互动空间火山通道的边界，按用户要求彻底移除产品自建速率约束，同时修复人物结局中“70 岁 · 70 岁”一类死亡年龄重复显示。
- 改了哪些文件：修改 `worker/{deepseek-proxy,index}.ts`、`src/services/{deepseek,deepseek.test}.ts`、`src/server/deepseekProxyContract.test.ts`、`src/game/{prompts,prompts.test,schema,schema.test}.ts`、`src/components/ResultFrontPage.test.tsx`、`.env.example`、`.openai/hosting.json`、`package.json`、`package-lock.json`、`README.md`、`docs/ai-transports.md`、`AGENTS.md` 和本文档；删除 `db/`、`drizzle/` 与 `drizzle.config.ts` 的限流表、迁移和工具链。
- 改了什么：Worker 不再按中文 `task` 前缀做白名单判断，只验证同源、版本、系统 prompt、阶段、请求类型、消息结构、体积和非空 JSON 任务，因此 prompt 文案演进不会再制造产品侧 400。访客、IP、全站、分钟和每日限流及其 Cookie、HMAC、D1 预留/退款、内部 429、环境变量、托管绑定、依赖和数据表全部移除；有效 Web 游戏请求立即转发，供应商 429 仍按 `Retry-After` 有限重试。互动空间继续绕过 Worker，原样使用 `tt.callAIChatCompletion` 和平台火山凭据。结局 prompt 现在要求死亡地点不含年份或年龄；schema 以客户端权威年龄为准，对新结果和旧存档中的地点前缀（如 `70岁 · 顺天府…`）统一去重后再渲染。
- 为什么这样改：具体任务句子是会随产品迭代变化的内容，不是稳定安全协议，把它写进代理白名单会让合法产品请求被自己拒绝；用户规模目标也不应被产品自建配额误伤。真正需要服务端固定的是密钥、同源、协议身份、模型参数和请求形状。年龄、死亡年份同样已由客户端权威掌握，模型只需写地点，重复元数据既浪费输出也破坏报告阅读。
- 影响了哪些模块：影响本地和 Sites Web 的 Worker 校验、AI 请求容量、上游 429 语义、Sites 托管绑定、依赖和结局字段归一；不改变 DeepSeek 模型、输出预算、重试次数、四幕三卡三 Roll、故事内容、存档正史、100 剧本或互动空间火山传输。
- 验证：定向代理/传输/prompt/schema/报告回归 5 文件 135/135，全量 Vitest 39 文件 367/367、TypeScript、235 个运行时文件可移植性与 `git diff --check` 通过。强制经过本地 Worker 的五局真实长测为 5/5 完整局、20/20 生成阶段成功、29 次真实请求，无产品侧 400/429；首段可读 p50 3640ms，完整幕次 p50 8484ms。vinext 生产构建与完整 100 剧本互动空间构建通过；互动空间包仍固定 `tt.callAIChatCompletion`、`deepseek-v4-flash` 和平台火山凭据，ZIP 140 文件、5,938,347 字节、MD5 `9bd9d7c7cbf5e7e03faf402058e508bb`。本地 3003 冷启动返回 HTTP 200，最新页面控制台无 error/warning 并保持打开。

### 2026-07-29 23:44 - 修复浏览器续幕协议被 Worker 拒绝

- 本次任务：纠正用户首次实际游玩就出现“这条时间线还没有断”的严重回归，追到真实浏览器请求而不是继续用直连供应商的成功结果替产品链路背书，并建立无法绕过本地 Worker 的发布门禁。
- 改了哪些文件：修改 `src/game/{deepseekProtocol,prompts}.ts`、`worker/deepseek-proxy.ts`、`src/server/deepseekProxyContract.test.ts`、`src/services/{deepseek,deepseek.direct.test}.ts`、`src/soak/longRunSoak.soak.ts`、`README.md`、`docs/ai-transports.md`、`AGENTS.md` 和本文档。
- 改了什么：确认浏览器续幕请求在 4–31ms 内连续返回本地 400，原因是 Worker 仍只允许已经废弃的 `生成第 2 节点。` 假任务，而正式 prompt 发出无空格的 `生成第2幕。`。现将续幕任务前缀提取为 prompt 与 Worker 共用常量，Worker 只接受第 2–4 幕的真实格式；代理契约测试改为直接调用正式幕次、Roll、人物结局和 2026 报告构造器，并显式拒绝旧假协议。Node 长测新增本地 Worker 代理模式、匹配 Origin、传输类型报告和 `SOAK_REQUIRE_PROXY` 强制断言，不再允许直连供应商的长测冒充浏览器产品成功。
- 为什么这样改：玩家需要的是四幕都能稳定生成的真实产品，不是某个绕开代理的 API 脚本成功。让协议生产者与验证者共享边界、让契约测试消费正式 prompt、让完整局门禁经过浏览器同款 Worker，才能同时消除本次确定性 400，并防止同类 prompt/allowlist 漂移再次被假测试隐藏。
- 影响了哪些模块：影响本地浏览器和 Sites 的续幕代理验收、Node 真实长测传输模式、Worker 协议契约及发布流程；不改变四幕、三卡、三次 Roll、故事 prompt 内容、字段 schema、模型参数、重试策略、固定开场、视觉、音频、存档或互动空间火山通道。
- 验证：正式 prompt 定向契约与传输回归 57/57；使用 `SOAK_PROXY_BASE_URL=http://localhost:3003` 和 `SOAK_REQUIRE_PROXY=1` 的真实五局长测全部经过本地 Worker，5/5 局完成、20/20 个生成阶段成功，31 次真实请求均返回 200；其中发生一次自动修复/恢复但最终无需玩家重试。幕次首段可读 p50 2658ms/p90 3279ms，完整幕次 p50 6075ms/p90 7956ms，双结局 p50 7938ms。全量 Vitest 39 文件 367/367、TypeScript、236 个运行时文件可移植性、vinext 生产构建、完整 100 剧本互动空间构建和 `git diff --check` 均通过；互动空间 ZIP 140 文件、5,938,154 字节、MD5 `e35ff043c5db6e6e5ec6b66361df55f9`。本地 3003 冷启动返回 HTTP 200，全新页面控制台无 error/warning，并保持最新产品打开。

### 2026-07-29 23:28 - 压缩 AI 协议并消除结局格式失败

- 本次任务：从全局收紧喂给 DeepSeek 的输入与输出，删除没有真实体验价值的结局字段，修复终局常出现“这条时间线还没有断”的结构失败，同时保留四幕、三卡、三次 Roll、故事连续性和完整可读报告；以五局二十生成阶段检验至少 95% 成功率。
- 改了哪些文件：修改 `src/game/{deepseekProtocol,prompts,schema,engine}.ts` 及对应测试，修改 `src/services/{deepseek,deepseek.interactive}.ts`、`worker/deepseek-proxy.ts` 与传输契约测试，修改 `src/components/ResultFrontPage.tsx`、`src/screens/ErrorScreen.tsx`、`src/App.tsx`、样式与界面测试，修改 `src/soak/longRunSoak.soak.ts`、`README.md`、`docs/ai-transports.md`、`AGENTS.md` 和本文档。
- 改了什么：把幕次稳定系统协议压成只含身份连续、正史、A/B/C、存活和 JSON 边界的短协议；动态输入只保留紧凑四次决定索引、最新结果/代价、最近后果、有效因果账和近三幕去重线索。第 4 幕样本输入由约 10189 字降至 3019，Roll 由 6646 降至 1743，人物结局由 3449 降至 1259，2026 报告由 4379 降至 1389。幕次/结局输出上限分别改为 4096/2048。人物页删除重复的“一生四决”和文言文，改为自然普通话“一生纪事”；模型不再生成时间线列表、因果指标、得失排名、可信度或分享语。局部修复现在能正确覆盖紧凑别名、嵌套数组和单个根字段，第二次仍使用快速字段修复；客户端只做补句号、接受完整自然长度、五个身后时代收成前三段加最终 2026 段等无叙事改写的结构归一。终局失败页明确说明四次决定已保存，并提供“继续生成结局”。
- 为什么这样改：玩家付出的核心价值是四次不可撤销决定、自然有趣的因果故事和最终两页可读结果，不是让模型重复客户端已经拥有的时间线、生成不可见统计字段或为排版字数反复改写。旧链路把句号、18 字和紧凑别名合并错误误判成“整条时间线失败”，既增加 token 和延迟，也让已经完成的剧情看似丢失；新边界让 AI 专注创作，客户端负责确定性结构。
- 影响了哪些模块：影响 Web、Sites Worker 与互动空间共用的幕次/双结局协议、输出预算、字段修复、报告结构、分享文案、错误提示和真实长测门槛；不改变四幕三卡三 Roll、固定第一幕、超能力、玩家决定正史、历史偏离、存档、永久解锁、模型、请求并发、视觉主系统或 100 剧本目录。
- 验证：定向 schema/prompt/DeepSeek 回归 148/148；三轮五局真实 DeepSeek 长测均为 5/5 完整双结局、20/20 生成阶段成功。最终轮首段可读 p50 3017ms/p90 3670ms，幕次 p50 6117ms/p90 7609ms，健康结局约 5973–7560ms；少数时代地点或机器词内容安全重试仍可延长单局，但决定始终保存且未显示失败页。合入远端最新 Tap/重试提交后，全量 Vitest 39 文件 365/365、TypeScript、236 个运行时文件可移植性、vinext 生产构建、完整 100 剧本互动空间构建和 `git diff --check` 均通过；互动空间 ZIP 140 文件、5,938,125 字节、MD5 `d10f1eb49b9b2dcd4070f6ee7be257cf`，最终 commit 的本地 3003 冷启动返回 HTTP 200 并保持打开。

### 2026-07-29 22:48 - 让交互音效回到前景并重建详情牌阅读空间

- 本次任务：修复主配乐长期盖住翻页、发牌、Roll、长按和三类出牌音效的问题，同时解决长按详情把同一决定重复展示、文字撑破实体卡框、滚动后关闭按钮和操作提示消失的问题；保持四幕、三卡、三次 Roll 和完整决定不变。
- 改了哪些文件：修改 `src/services/{audio,cardAudio}.ts`、`src/hooks/useGame.ts`、`src/{App,App.integration.test}.tsx`、`src/screens/{SeedPickerScreen,TimelineEventScreen}.tsx`、`src/components/{ChoiceList,ChoiceList.test}.tsx`、`src/styles/game.css`、`src/services/audio.test.ts`、`src/hooks/useGame.test.tsx`、`AGENTS.md` 和本文档。
- 改了什么：把配乐默认/第四幕/结局增益从约 0.32/0.40/0.24 调整为 0.09/0.12/0.07，按素材实际响度分别提高八项前景音效，并为每种音效定义 360—900ms 的配乐让位窗口；操作声触发时配乐立即降至当前章节目标的 28%，随后用原渐变控制器自然恢复。详情牌删除与完整决定完全重复的“怎么做”，通过 portal 提升到事件页完整产品层；卡框固定在视口内，图腾、标题、45px 关闭按钮和底部上划提示保持固定，只有带细滚动条的中部完整决定/执行结果区域滚动，关闭后仍把焦点还给来源牌。
- 为什么这样改：配乐的职责是建立氛围，操作声的职责是确认玩家输入；持续背景比前景反馈高 18—37dB 会直接削弱可玩性，因此既要降低背景基线，也要在瞬时操作时自动让位。卡牌详情的职责是帮助玩家在提交前读懂决定，不应把同一句动作渲染两次或让可变长文字带着整个实体卡框滚走；固定物理外壳与内部阅读区同时保留了完整文案、收藏卡质感和退出可达性。
- 影响了哪些模块：影响浏览器与互动空间共用的配乐/交互音效混音、命运抽取/进入历史/出牌/Roll/发牌/长按声音、详情牌层级与滚动布局；不改变音频素材、静音存储、手势阈值、长按 320ms、出牌动效、四幕三 Roll、AI 请求、世界正史、存档、结局或 100 剧本打包。复核后第 1—3 节已同步刷新音频职责、服务层结构和关键入口。
- 验证：定向 6 文件 43/43、全量 Vitest 38 文件 385/385、TypeScript、234 个运行时文件可移植性、vinext 生产构建、完整 100 剧本互动空间构建和 `git diff --check` 全部通过；互动空间 ZIP 140 个文件、5,944,714 字节、MD5 `f9722369d71f57f54c43c20e3c209d4d`。真实浏览器在 390×844 和 390×667 验证长按详情、内部滚动、关闭与焦点归还：短屏卡框为 350×547、完整处于 667px 视口内，中部滚动 114.5px 后标题、关闭按钮和底部提示坐标保持不变，页面无纵向溢出；首次 Roll 正常从 3 次降到 2 次并换出第二组牌。

### 2026-07-29 22:25 - 以数百名重复玩家容量重建 AI 限流

- 本次任务：从产品第一性原理修复“同一 DeepSeek 账号和 Key 在其他平台正常、唯独本产品稳定 429”的问题，让本地开发不再被公开站点成本保护误伤，并让生产环境可以在一天内承载数百名用户反复完成多局游戏。
- 改了哪些文件：修改 `worker/deepseek-proxy.ts`、`src/server/deepseekProxyContract.test.ts`、`src/services/deepseek.test.ts`、`.env.example`、`README.md`、`docs/ai-transports.md`、`AGENTS.md` 和 `PROJECT_CONTEXT.md`。
- 改了什么：localhost 继续通过同源 Worker 保护 Key 和协议，但完全绕过公开 D1 配额；生产删除访客 80/日、IP 240/日和全站 1000/日三个硬封顶，改为每分钟访客 120、共享出口 IP 1800、全站 2400 个可配置加权单位，高推理恢复计 3、普通请求计 1。内部限流头从不可重试的 `quota` 改为短时可重试的 `burst`，最长一分钟恢复；Worker 启动时清理两天前的分钟桶，避免新粒度让 D1 长期膨胀。环境模板和运行文档改用三项分钟容量变量。
- 为什么这样改：真实故障时本地 `/api/deepseek/completions` 在 42ms 内返回 429，D1 当前访客桶正好为 80/80，而 IP 与全站只有 146；请求尚未抵达 DeepSeek，因此 API Key、余额和官方并发都不是根因。正常四幕若用满实时 Roll，健康路径已有约 13 次主请求，字段修复和高推理恢复还会增加计数；按天封死一个正常玩家违背产品可用性，IP 小限额也会误伤比赛现场或校园共享网络。新策略只拦截异常瞬时突发，不惩罚正常重复使用。
- 影响了哪些模块：影响 localhost 与 Sites Web 的 DeepSeek 代理、D1 限流窗口、429 重试语义、服务端环境变量和维护文档；不改变游戏四幕、三卡、三次 Roll、请求内容、模型、8192 token、存档、结局或互动空间 `tt.callAIChatCompletion` 通道。第 1—3 节已同步刷新当前容量与入口说明。
- 验证：定向代理/传输回归 39/39、全量 Vitest 38 文件 384/384、TypeScript、234 个运行时文件可移植性、普通 vinext 构建、完整 100 剧本互动空间构建和 `git diff --check` 全部通过；互动空间 ZIP 5,944,240 字节，MD5 `e05cdc83167e06d519d4220916ba023c`。真实本地 D1 保留旧 `guest=80/80`、`ip=146`、`global=146` 且不清库不换 Cookie，同一个合法续幕代理请求在 616ms 内返回 200 SSE、没有内部限流头，旧计数完全未增长。

### 2026-07-29 22:06 - 把顶层出牌动效与结果页优化合入本地主线

- 本次任务：把 `codex/card-dissolve-flight` 隔离 worktree 上已经完成的三次视觉优化合并进本地最新 `main`，自行处理与主线低延迟 AI、卡牌分类音效和完整互动空间构建之间的冲突，并形成一个可运行的新主线版本。
- 改了哪些文件：合入 `src/components/CardCommitFlight.tsx` 及其测试，修改 `src/components/ChoiceList.tsx`、`src/styles/game.css`、`src/screens/ButterflyEchoScreen.test.tsx`、`src/screens/TimelineEventScreen.test.tsx`、`src/App.integration.test.tsx`、`AGENTS.md` 和 `PROJECT_CONTEXT.md`。
- 改了什么：主线保留循史、破局、天外三种独立纸牌动作音效，移除旧的 480ms 巨幅位移与重复提交计时器，由页面最高层的 `CardCommitFlight` 单独负责连续弧线、距产品顶部 8px 的居中停驻、锯齿卡面侵蚀、轻量纸灰和完成回调；同时合入即时结果主标题的 23—26px 响应式字号。项目说明保留 `main` 当前完整 100 剧本互动空间包边界，并按真实时间整理两条并行分支的历史记录。
- 为什么这样改：直接选择任一分支都会丢失另一边已经完成的能力；按职责合并可以让新动效保持顶层、自然和流畅，同时不退回单一提交音效、旧 AI 协议或旧三剧本审核包，也避免旧计时器在新飞行动画结束前提前切页。
- 影响了哪些模块：影响三类决策卡的上划提交视觉、音效触发、提交等待、即时结果标题层级及对应测试；不改变四幕、三卡、三次 Roll、AI 请求、决定正史、存档、结局或完整 100 剧本互动空间构建。复核后第 1—3 节对当前产品、代码结构和关键入口的描述仍准确。
- 验证：Vitest 38 文件 380/380、TypeScript、234 个运行时文件可移植性、普通 vinext 构建、完整 100 剧本互动空间构建和 `git diff --check` 全部通过；互动空间包包含 100 个剧本和 100 张历史图，ZIP 5,944,240 字节，MD5 `4694e653e4ea659e22cd67bc6b95b884`，缺失剧本 0、禁止运行时标记 0。

### 2026-07-29 22:00 - 收小即时结果页的主结果字号

- 本次任务：根据用户在真实结果页截图中框出的区域，只收小“这件事已经发生”下方的主结果文字，保持其他信息层级不变。
- 改了哪些文件：修改 `src/styles/game.css`、`src/screens/ButterflyEchoScreen.test.tsx`、`AGENTS.md` 和 `PROJECT_CONTEXT.md`。
- 改了什么：把即时结果页主结果标题从固定 `32px` 改为随 320—430px 产品宽度变化的 `clamp(23px, 6.7vw, 26px)`，行高设为 `1.28`；新增样式回归断言。选择原文、代价、受益者、承担者和继续按钮字号不变。
- 为什么这样改：截图中的主结果在四行大字时压过了历史场景和后续证据，阅读重心过重；只缩这一级能让完整结果更快扫读，同时不把整张结果页一起缩成微字。
- 影响了哪些模块：只影响普通选择和遗留自定义结果页共用的直接结果标题排版，不改变结果内容、等待时间、事件状态、继续流程或结局生成。复核后第 1—3 节仍准确，无需调整。
- 验证：`ButterflyEchoScreen` 定向测试 2/2、TypeScript、普通 vinext 构建与 `git diff --check` 通过。

### 2026-07-29 21:56 - 把出牌飞行提升到画面最顶层并消除运行时卡顿源

- 本次任务：根据真实预览反馈继续修正卡牌仍未到达整组元素最顶部、飞行后段不够自然和移动端可能掉帧的问题，并在同一隔离 worktree 上提交新版。
- 改了哪些文件：修改 `src/components/CardCommitFlight.tsx`、`src/components/ChoiceList.test.tsx`、`src/screens/TimelineEventScreen.test.tsx`、`src/services/htmlToImage.interactive.ts`、`src/styles/game.css`、`AGENTS.md` 和 `PROJECT_CONTEXT.md`；新增 `src/components/CardCommitFlight.test.ts`。
- 改了什么：卡牌 portal 外再建立占满视口、`z-index: 2147483646` 的独立最高层，停驻位置由距顶部 56—88px 改为约 8px，进度栏、场景、文案与声音按钮在提交时同步后退；原来后半段突进的三段关键帧改成按 25% 间隔采样的连续二次弧线，520ms 内稳定收束到顶部中央。移除提交瞬间的 `html-to-image` DOM 栅格与数千像素粒子重建，改为 GPU 友好的锯齿 `clip-path` 自下而上侵蚀卡面，同时只绘制 220 个有界纸灰粒子；完整提交缩短到约 1.26 秒。
- 为什么这样改：此前 `targetTop` 仍保留约 60px 顶部空隙，视觉上没有真正越过进度栏；72% 到 88% 之间跨越大段距离会形成末段突冲，DOM 栅格和逐像素读取又可能在移动端主线程上制造掉帧。最高层容器、连续轨道和有界粒子把“永远盖在最上面”与“不卡顿”同时变成明确约束。
- 影响了哪些模块：只调整三类决策卡的提交动效、背景退场、消散实现和提交等待时长；不改变上划阈值、决定内容、世界正史、三次 Roll、AI 请求、存档或互动空间三剧本边界。第 1 节产品目的和第 3 节入口仍准确；第 2 节已刷新动效实现说明。
- 验证：Vitest 39 文件 378/378、TypeScript、239 个运行时文件可移植性、普通 vinext 构建、互动空间三剧本构建与 `git diff --check` 全部通过；审核 ZIP 35 个文件、2,731,694 字节、MD5 `4a2a110a5777ac196b858ae796343b37`，白名单外剧本泄漏 0。in-app browser 在 390×844 产品视口确认页面、三卡牌桌、资源和控制台健康，框架错误层为 0、错误与警告为 0；组件回归覆盖最高层 portal、8px 停驻、飞行/消散时序、连续轨道几何和最终只提交一次。

### 2026-07-29 21:47 - 低延迟 AI、首页 AI 标识、历史卡牌音效与完整互动空间包

- 本次任务：先提交此前的玩家中文本地化修复，再在不牺牲生成质量和现有玩法的前提下尽量把 AI 等待压近十秒；补齐首页小型 AI 生成标识和抽开局、闯入、三类上划、洗牌、发牌、长按读牌音效；按用户最终确认取消三剧本审核子集，互动空间直接提交完整 100 剧本，并把十秒改为性能目标而非强制截止。
- 改了哪些文件：修改 `src/game/{prompts,schema,engine}.ts`、`src/services/{deepseek,deepseek.interactive,cardAudio}.ts`、`src/screens/SeedPickerScreen.tsx`、`src/components/ChoiceList.tsx`、`src/hooks/useGame.ts`、`src/soak/longRunSoak.soak.ts`、对应测试与 `src/styles/game.css`；新增 `public/audio/sfx/*` 并更新 `public/audio/CREDITS.md`；修改 `vite.interactive.config.ts`、互动空间准备/优化/校验/打包脚本、固定开场生成脚本、`README.md`、发布清单与 `AGENTS.md`，删除三剧本聚合、三剧本固定数据、三剧本测试和三剧本白名单。
- 改了什么：后续幕次改用九位场景数组和两组三牌数组的紧凑传输，省去客户端已知的 actor、deadline、ID、能力元数据和重复键名，但完整决定、结果、代价、现场与报告仍由 V4 Flash 编写并接受原有 Schema、字段修复和完整恢复。续幕、实时 Roll、字段修复以及职责独立的双结局都优先走 0.7 温度非思考快速路径；传输继续保留 90 秒安全窗口和有限故障重试，绝不在十秒强制停止。长测报告新增十秒目标命中情况，但不会用它阻断健康生成。首页字标右下角新增不占布局的小型 `AI 生成`，完整无障碍名称为“本作品包含人工智能生成内容”。
- 音效与授权：把原合成蜂鸣替换为八个本地低音量 CC0 样本。抽开局使用纸张翻页，闯入历史使用厚重旧式提示音，循史/破局/天外三类上划分别使用三种不同纸牌动作，Roll 使用真实洗牌，发牌和长按读牌各有独立触感；所有资源、原作者、原链接、许可证、转码方式和取得日期写入 `public/audio/CREDITS.md`，加载或播放失败永远不阻断操作。
- 互动空间：构建不再通过别名切到三剧本入口，也不再删除 97 张历史图；网页和互动空间共同使用完整 100 剧本、100 份固定首幕数据和 100 张本地历史图。包内仍只使用相对本地资源，AI 只走 `tt.callAIChatCompletion`，模型固定 `deepseek-v4-flash`，密钥仅由平台火山配置托管，保留 AI 开关、8MB 预检、禁外链/网络/弹窗扫描和完整包校验。
- 为什么这样改：低延迟的正确做法是减少传输冗余、关闭不必要的思考并并发彼此独立的结局，不是缩短 token 上限、裁断中文、拆散同一场景或十秒杀掉仍在正常生成的结果。声音必须强化实体纸牌和档案桌隐喻而不抢占注意力；AI 标识需要满足平台披露又不打断首页主行动；最终提交内容应与正常玩家拿到的完整产品一致。
- 影响了哪些模块：影响 AI 线协议、幕次/结局解析、真实长测指标、首页合规标识、卡牌声音反馈和互动空间打包边界；不改变四幕、三卡 A/B/C、每幕三次 Roll、完整 canonical 决定、世界正史、存档、已解锁重玩、报告内容、玩家手势或视觉主系统。
- 验证：全量 Vitest 37 文件 379/379、TypeScript、232 个运行时文件可移植性、vinext 正式构建与 `git diff --check` 通过。最终真实赤壁完整局 1/1 通关、3/3 续幕、双报告完成、0 人工重试、0 幕次首答修复；续幕为 8.589 / 10.797 / 8.989 秒，平均 9.458 秒，首个可读内容 3.697—4.750 秒；两份结局主请求分别 6.616 / 8.689 秒，世界报告首答不可解析后按质量规则修复，完整结局 13.400 秒且未被十秒截断。互动空间完整包核对 100 个剧本、100 张历史图、缺失 0，140 个文件，未压缩 7,042,633 字节，ZIP 5,941,338 字节，MD5 `e74191ae0593760278ff5b031e58a57f`；仓库校验和用户提供的官方 `h5-validator` 对目录、ZIP 两轮均全部通过。390×844 本地产品停在首页，AI 标识可见且页面无纵向溢出。

### 2026-07-29 21:34 - 重做上划出牌的顶层轨道与纸灰消散

- 本次任务：基于本地最新 commit 新建隔离 worktree，修复循史、破局、天外卡上划后被事件图和文案层遮挡的问题，并把提交过程重做成类似肉鸽卡牌游戏的上方居中停驻与关键消散仪式。
- 改了哪些文件：新增 `src/components/CardCommitFlight.tsx`；修改 `src/components/ChoiceList.tsx`、`src/components/ChoiceList.test.tsx`、`src/screens/TimelineEventScreen.test.tsx`、`src/App.integration.test.tsx`、`src/services/htmlToImage.interactive.ts`、`src/styles/game.css`、`AGENTS.md` 和 `PROJECT_CONTEXT.md`。
- 改了什么：所选卡先测量自身与产品容器几何，再通过挂到 `document.body` 的顶层 portal 沿统一弧形轨道移动到产品容器上方正中；560ms 飞行后停驻 160ms，再把项目真实卡面栅格为像素，用噪声错开从下至上的碎裂时序，让循史金、破局朱砂、天外青绿各自化成向右上方飘散的纸灰。其他两卡和事件内容同步后退，完整提交约 1.46 秒后才进入结果页；卡面栅格与粒子循环只在实际出牌时运行，像素捕获失败走蒙版后备，降低移动端首屏与可靠性风险。
- 为什么这样改：单纯提高 `z-index` 无法越过祖先裁剪与层叠上下文，直线冲出顶部又会让实体卡牌突然消失；把飞行层放到页面顶层才能保证它永远在场景之上，而真实卡面像素消散比统一烟雾或透明度淡出更贴合档案纸张、历史被改写和三类收藏卡的物质感。
- 影响了哪些模块：只影响循史、破局、天外三类卡的上划提交视觉、提交等待时长、降级动画、互动空间同源 DOM 栅格能力和对应组件测试；不改变上划阈值、`pointercancel` 安全、长按详情、三次 Roll、决定正史、请求数量、AI 模型、存档、结局或互动空间三剧本边界。第 1 节产品目的仍准确；第 2—3 节已补充顶层飞行组件及入口。
- 验证：Vitest 38 文件 377/377、TypeScript、238 个运行时文件可移植性、普通 vinext 构建、互动空间三剧本构建与 `git diff --check` 全部通过；审核 ZIP 35 个文件、2,732,332 字节、MD5 `7ec17fa78e8e1486daaa6702ca4ca571`，白名单外剧本泄漏 0、密钥/普通网络标记 0。真实 in-app browser 在 390×844 验收循史卡、360×667 验收破局与天外卡，停驻卡中心与产品容器中心差小于 0.01px，三次均越过事件图/文案层并进入像素粒子消散，结果页正常接续，控制台错误与警告为 0。

### 2026-07-29 20:22 - 消除玩家界面的英文协议字段与能力 ID

- 本次任务：修复固定开场和实时 AI 文案中偶发露出 `deadline`、`actualHistory`、`reverse-cause` / `resverse cause` 等机器词的问题，同时保留 NASA、CERN、U-2 等合理的历史专名缩写。
- 改了哪些文件：`src/game/playerFacingText.ts`、`src/game/schema.ts`、`src/game/deepseekProtocol.ts`、`src/game/prompts.ts`、`src/data/fixedOpenings.ts`、两个固定牌生成脚本及对应测试、`AGENTS.md`、`PROJECT_CONTEXT.md`。
- 改了什么：新增覆盖 50 个能力 ID 和内部 schema 字段的权威中文映射；固定数据与旧存档在读取时只迁移这些确定机器词；新续幕、Roll 与结局输出一旦在玩家可见字段中泄漏机器词就校验失败并进入现有字段修复；两个开发期生成器也会拒绝并重生污染内容。
- 为什么这样改：`reverse-cause` 是内部 `powerId`，不是技能展示名；`deadline` 和 `actualHistory` 则来自开发期生成提示中的字段名。此前协议要求模型复制 ID，却没有同时禁止把 ID 写入文案，固定生成器也未检查输出值，导致面向中国玩家的沉浸感被内部实现细节破坏。
- 影响了哪些模块：固定第一幕、固定天外牌、实时第二/第三次 Roll、后续幕次、两页结局、旧存档恢复和互动空间审核包；不改变四幕、三卡、三次 Roll、请求次数、等待时长或交互。
- 验证：Vitest 38 文件 377/377、TypeScript、普通构建、互动空间三剧本构建和 `git diff --check` 全部通过；互动空间 ZIP 2,728,838 字节、MD5 `56e959b46c3e1c85953ba94f3f840830`，仓库门禁与官方 `h5-validator` 目录/ZIP 两轮全部通过。真实浏览器从命运抽取进入古腾堡固定开场并打开天外牌详情，页面、完整决定、最后期限、直接结果与隐藏代价均无内部英文命中，控制台警告/错误为 0。

### 2026-07-29 20:06 - 重建循史语义并完成互动空间火山 AI 发布门禁

- 本次任务：先把当时本地最新版本推到远端 `main`，再从根本上修复第一幕 A `循史` 经常反而破坏真实历史的问题；在不改变四幕、三卡、三次 Roll、等待仪式和玩家操作的前提下，提高全部开场与后续 AI 选择的合理性；最后根据用户提供的互动空间规范补齐 AI 标识、火山引擎 V4 Flash、8MB、离线资源与官方校验门禁，并保证重复 Roll 和完整结局真实可跑。
- 改了哪些文件：新增 `src/data/fixedOpeningChoices.{generated,interactive.generated}.ts`、`scripts/generate-fixed-opening-choices.mjs`、`interactive-space.release.json`、`docs/interactive-space-release-checklist.md` 与 `public/favicon.svg`；修改 `src/data/fixedOpenings.ts`、`src/game/{deepseekProtocol,prompts,schema,deviation}.ts`、`src/services/deepseek.ts`、`worker/deepseek-proxy.ts`、`src/screens/{SeedPickerScreen,TimelineEventScreen}.tsx`、`src/components/{ChoiceList,GameAnnouncement,ResultFrontPage}.tsx`、互动空间构建/校验脚本、对应测试、`package.json`、`AGENTS.md`、`docs/ai-transports.md` 与本文档。
- 改了什么：固定第一幕不再把 `seed.decision` 误当循史牌；100 个开场的首组/预备 Roll A/B 已全部由充值后的 DeepSeek V4 Flash 生成，A 再由独立语义审校对照真实结果，任何生成失败都会终止且没有本地假模板。A 被定义为让当前掌权者、命令和结果按时发生，B 才改变控制关系、命令或结果；A 偏离增量从 3 改为 0。续幕与实时 Roll prompt 同步携带当幕轨道契约，第一幕卡牌禁止让同一主角死亡或永久退场，固定简介删除字符硬截断，完整句子不再被切成“更多原始……”一类残句。DeepSeek 本地/Worker 端点统一改为真实可用的 `/v1/chat/completions`，本地与 Node 长测优先项目当前 Key，避免旧系统 Key 导致充值后仍 401；第二、第三次实时 Roll 继续走真实 AI。
- 互动空间适配：静态包只保留古腾堡、伽利略和阿波罗 11 号三段历史，首页如实显示 3；运行时只调用 `tt.callAIChatCompletion`，模型逐字为 `deepseek-v4-flash`，凭据模式为互动空间账号托管的火山引擎 API Key，源码和 ZIP 不含密钥或普通网络请求。成品固定幕显示 `AI 辅助创作 · 固定开场`，续幕和双报告显示 `AI 生成 · V4 Flash`，互动空间说明改为 `体验说明`；发布契约固定 `ai_enabled: true`、竖屏、ZIP 与 8MB，`20107` 会阻断提审。打包器新增 `.DS_Store` / `__MACOSX` 清理、本地图标和实际目录/脚本/AI 标识/外链/密钥扫描。
- 为什么这样改：原根因不是“循史牌写得不够温和”，而是固定 A 直接复用了本来就用于询问反事实的 `seed.decision`，同时公式还给 A 增加偏离度；另外本地后续幕使用旧 DeepSeek 地址且被失效系统 Key 覆盖，导致充值后重复 Roll 仍可能 401。把真实轨道、玩家决定和平台传输分别变成显式契约，才能同时消灭语义错位、假兜底和“代码里写了 AI 但玩家端没有可用调用”的发布风险。
- 影响了哪些模块：影响 100 个固定开场 A/B、后续幕和实时 Roll 的 A/B 语义、偏离度、本地/Worker DeepSeek 传输、AI 标识、互动空间三历史构建和发布检查；不改变四次决定、三张牌、三次 Roll、第一轮预生成、第二/第三轮实时生成、50 项超能力、长按/上划、永久解锁、重复游玩、双报告或普通产品 100 剧本。互动空间仍不嵌入本地 DeepSeek Key，真实玩家调用必须由平台托管火山凭据。
- 验证：DeepSeek V4 Flash 100/100 个固定开场全部生成并通过结构与 A 语义审校；Vitest 37 文件 373/373、TypeScript、235 个运行时文件可移植性、默认 vinext 构建通过。真实三历史全 Roll 门禁覆盖赤壁、罗马大火和阿波罗 11 号，3/3 完整跑满四幕、12/12 Roll、3/3 双报告，9/9 续幕生成成功，人工重试 0、主场景无效输出/修复 0。真实浏览器完成 100 卡抽取、武则天循史长按/上划、第二幕 V4 Flash 生成、第一次预备 Roll、第二和第三次实时 AI Roll；360×667、390×844、430×932 无横向溢出，控制台错误 0。最终互动空间包 35 个文件、2,727,835 字节、MD5 `91e04bd478ecad42f76b760d72fcd418`，白名单外剧本泄漏 0、密钥 0、普通网络 0，仓库门禁和官方 `h5-validator` 的目录/ZIP 两轮全部通过。
- 平台状态：只读回查 AppID `ttbb15cda8243f100b21` 仍为旧包审核拒绝状态 `3`，拒绝原因“涉及违反法律法规”，但 `AIEnabled: true`、竖屏和 ZIP 类型都已开启；本次按用户当前范围没有上传新 ZIP、修改平台作品或重新提审，避免在真机扫码验证火山凭据前误触发外部发布。

### 2026-07-29 18:41 - 合入 LLM Tap 请求调试面板

- 本次任务：刷新并检查除 `main` 以外的远端分支，确认 `origin/feat/llm-tap-inspector` 是唯一建立在当前远端基线之上的新功能提交，再把它与本地超能力和历史文案优化合并为最新本地版本。
- 改了哪些文件：合入 `tap.html`、`src/tap/` 全部调试页面与组件、`src/services/deepseek.ts`、`README.md` 和两份 `docs/superpowers/` 设计/实施文档；同步更新本文档。
- 改了什么：新增独立 LLM Tap 页面，通过同源 BroadcastChannel 捕获每次 DeepSeek 请求的完整 messages、模型响应、请求类型、成功/失败状态、总耗时、首 token 时序和 token/cache 用量；页面提供输入、结构化输出、原始 JSON、指标、前后翻页、导出、清空以及最多 200 条 localStorage 持久化。游戏侧只在请求完成或失败时尝试广播，所有广播异常静默吞掉；普通产品构建不打包调试页面，互动空间继续使用独立传输并保持三剧本边界。
- 为什么这样改：实时 Roll、字段修复和高推理恢复已经形成多段 AI 请求链，只看最终卡面无法快速判断问题来自输入、首答、修复还是恢复。把请求证据放到独立本地页面，可以在不改变玩家页面和请求结果的前提下直接定位模型行为；先核对分叉基线、合并树和完整差异，避免误把两个旧互动空间分支重新并入当前单一 `main`。
- 影响了哪些模块：影响本地/Sites DeepSeek 请求后的旁路调试记录与本地开发入口；不改变请求 payload、模型、重试、校验、四幕玩法、50 项能力、互动空间传输、生产路由或平台状态。第 1—3 节已补充 LLM Tap 的产品边界、代码结构、数据流与关键入口。
- 验证：合并树预检查无冲突；Vitest 37 文件 371/371、TypeScript、232 个运行时文件可移植性、vinext 生产构建和 `git diff --check` 通过；互动空间包仍仅含古腾堡、伽利略和阿波罗 11 号三个剧本，非白名单泄漏 0，ZIP 2,725,353 字节。真实浏览器中主产品首页、固定开场与第一次预备 Roll 正常，第二次实时 AI Roll 成功生成新牌；同源 `/tap.html` 捕获主请求、字段修复和高推理恢复共 3 条真实记录，输入、输出和指标视图均可切换，主产品与调试页控制台错误/警告均为 0。

### 2026-07-29 18:20 - 用 50 项指定超能力重建所有天外牌

- 本次任务：从根本上删除“让历史现场所有谎言化为黑烟”一类抽象、模板化且不像人说话的天外选项，建立 50 项截然不同的具体超能力，并让每一张 C 牌由 AI 深度结合当前历史快照使用客户端指定能力，同时保持四幕、三卡、三次 Roll、请求数和可见等待完全不变。
- 改了哪些文件：新增 `src/game/powers.ts`、`src/game/powers.test.ts`、`src/data/fixedPowerChoices.generated.ts`、`src/data/fixedPowerChoices.interactive.generated.ts` 和 `scripts/generate-fixed-power-choices.mjs`；修改 `src/data/fixedOpenings.ts`、`src/game/{schema,reducer,prompts,engine,narrativeContext}.ts`、`src/hooks/useGame.ts`、`src/services/storage.ts`、`src/soak/longRunSoak.soak.ts`、`vite.interactive.config.ts`、`package.json`、对应测试、`AGENTS.md` 和本文档；本地忽略文件 `.env.local` 切换为用户指定的有效 DeepSeek 密钥。
- 改了什么：权威能力库覆盖空间、时间、生命、身体、动物、资源、物质、自然、心智、信息与因果等 50 种一次性能力；客户端整局无放回抽取并持久化剩余/已用能力、下一幕两项能力与失败实时 Roll 的待用能力。续幕同一次模型响应仍生成原有两组三张，但两张 C 必须逐字复制不同的指定 `powerId`、由 `你` 亲自发动，A/B 禁止携带能力；实时 Roll 同理只注入一项能力。100 个固定第一幕各自拥有六张开发期 AI 写成且落到历史快照的 C 候选，运行时随机取两张，因此固定开场仍零网络等待；旧的八条 `SURREAL_TEMPLATES` 与“让谎言现形”等抽象拼接已删除。存档升级到 v16，能力选择在刷新、失败和重试后保持一致；互动空间构建只别名打包三个审核历史的候选数据。
- 为什么这样改：想象力不应来自一句抽象“现实规则改变”模板，而应来自一个明确、可理解、彼此不同的能力撞进具体历史矛盾。能力由客户端先抽、AI 只负责把它真正用进历史快照，可以同时避免模型偷换能力、反复复用同一奇想、让历史人物代替玩家发动，以及刷新重试后牌面承诺变化；预生成固定开局候选则保证这次质量升级不增加首幕等待。
- 影响了哪些模块：影响所有固定开局 C、第一轮预备 Roll C、第 2—4 幕两张 C、第二/第三次实时 Roll C、已选能力的连续性上下文、当前局存档版本、真实长测与互动空间构建别名；不增加运行时 AI 请求，不改变 A/B/C 数量、四幕、每幕三次 Roll、洗牌时长、DeepSeek V4 Flash 快速模式、8192 token、SSE、长按/上划、结局字段或永久解锁规则。第 1—3 节已同步补充能力子系统、固定候选数据和生成脚本入口。
- 验证：全量 Vitest 37 文件 371/371、TypeScript、222 个运行时文件可移植性、vinext 完整构建、互动空间三剧本边界与 8MB ZIP 闸门全部通过；互动空间包非白名单泄漏 0，34 个文件，ZIP 2,725,353 字节，MD5 `3fbed16d9cf94b0c4e66859d14e74e37`。真实 DeepSeek 三历史全 Roll 门禁覆盖赤壁、罗马大火和阿波罗 11 号，3/3 完整通关、9/9 续幕、12/12 预备 Roll 与 3/3 双报告结局成功，无人工重试，首段可读 P50/P90 为 3.26/3.79 秒，完整局 P50 132.27 秒。真实 390×844 浏览器在牛顿《原理》开局依次看到“号令皇家学会的老鼠”“交换哈雷与排版工”“熄灭印刷车间蜡烛暗换校样”“隔空质问牛顿本尊”四种不同天外方案，实时请求全部成功，产品控制台错误为 0。

### 2026-07-29 16:52 - 只用提示词与固定开场文案提升历史现场感

- 本次任务：在不改变输出速度、等待节奏和现有玩法的前提下，解决故事选项重复、没有吃透当前历史快照、表达像模板而不像人话的问题。
- 改了哪些文件：修改 `src/game/deepseekProtocol.ts`、`src/game/prompts.ts`、`src/game/prompts.test.ts`、`src/data/fixedOpenings.ts`、`src/data/fixedOpenings.test.ts`、`AGENTS.md` 和本文档。
- 改了什么：系统协议把历史快照从背景资料提升为每张牌的行动边界，要求六张牌分别抓住本幕已经出现的人物、机构、地点、器物、命令或程序，禁止把同一动作写成温和、强硬和魔法三个档位；续幕与第二、第三次实时 Roll 都先做不输出的现场盘点，再用不同杠杆写出能当场说出口的动作，并禁止“原定方案、现场众人、接管现场、另起人马”等万能占位话术。固定第一幕不会调用 AI，因此同步把 100 个开场的行动者绑定到玩家真实历史身份，让循史、破局和预备 Roll 的牌名与完整决定直接带出具体历史事件，而不是复用无名执行者模板。
- 为什么这样改：产品需要的是“同一个历史现场还能突然冒出三条真正不同的路”，不是把抽象策略换词重写。让模型先识别现场可动用的人、物、程序和债务，再一次性生成原有六张牌，可以提高具体感与变化度，同时不增加任何请求、等待或运行步骤。
- 影响了哪些模块：只影响固定第一幕可见文案、续幕一次性六牌提示词、第二与第三次实时 Roll 提示词及其合同测试；四幕、A/B/C、每幕三次 Roll、请求次数、DeepSeek V4 Flash 非思考模式、8192 token 上限、SSE、字段 schema、状态机、洗牌动效、长按/上划、存档与结局均不变。复核后第 1—3 节对产品目标、代码结构和关键入口的描述仍准确，无需改写。
- 验证：定向提示词与固定开场测试 20/20、全量 Vitest 36 文件 360/360、TypeScript、217 个运行时文件可移植性、vinext 完整产品构建和 `git diff --check` 通过。真实 in-app browser 在武则天第一幕连续完成两次实时 AI Roll，模型分别给出“问武则天李旦去留 / 偷换金简掉包传位 / 拉狄仁杰当众反对”和“在则天门内密告狄仁杰 / 在登基诏上加注限定条款 / 则天门内鸣登闻鼓，称诏书有误”两组新牌，请求均只发出一次并返回 200（7.4 秒、8.4 秒），控制台错误与警告为 0。中国古代、古代世界、现代航天三开局四幕全 Roll 真实门禁 3/3 完整通关、9/9 续幕首答有效且无字段修补，续幕 P50/P90 为 17.7/19.9 秒、首段可读 P50/P90 为 3.1/3.8 秒、预备 Roll P90 为 1ms；互动空间包仍只有三个白名单剧本，非白名单泄漏 0，34 个文件，ZIP 2,716,595 字节，MD5 `b2ff6a72b5ab2b641174e979c8402199`。

### 2026-07-29 16:20 - 接通第二、第三次 Roll 的真实 AI 代理协议

- 本次任务：调查玩家重复 Roll 总是失败的问题，确认第二、第三次重抽必须真实调用 AI，并把完整请求链路修通。
- 改了哪些文件：修改 `worker/deepseek-proxy.ts`、`src/server/deepseekProxyContract.test.ts` 和本文档。
- 改了什么：确认前端 `generateRerolledChoices` 已经会在第二、第三次 Roll 发起 `roll-primary` 请求，但 Worker 的请求类型集合只登记了 `turn-*` / `ending-*`，turn 阶段校验也只接受 `turn-*`，任务白名单同时漏掉了 `为当前同一历史现场发出第 ... 次 Roll`，因此真实请求在抵达 DeepSeek 前稳定返回 400。现在代理完整登记 `roll-primary`、`roll-repair`、`roll-recovery`，允许它们作为 turn 阶段的卡牌生成请求，并放行限定格式的 Roll 任务；代理契约测试直接使用真实 `buildRerollMessages` 产物，锁定请求必须被接受且继续由服务端固定为 `deepseek-v4-flash`、JSON 流式输出和关闭思考模式。
- 为什么这样改：第一次 Roll 读取本幕已经生成的备用三张牌，第二、第三次的产品价值则是模型结合当前现场和所有已看卡牌现场发出新牌；客户端虽已实现这条路径，但网关协议遗漏让功能事实上不可用。用真实 prompt 构造器测试代理边界，才能防止组件模拟测试再次把断裂的接口掩盖掉。
- 影响了哪些模块：本地与 Sites Worker 的第二、第三次实时 AI Roll、Roll 字段修复和恢复请求恢复可用；第一次预生成 Roll、当前现场冻结、三次次数持久化、互动空间 `tt.callAIChatCompletion` 通道、普通续幕、双报告结局与 100 个剧本不变。复核后第 1—3 节对产品目标、代码结构和关键入口的描述仍准确，无需改写。
- 验证：代理契约、生成引擎与游戏 hook 定向测试 14/14、TypeScript 和 `git diff --check` 通过。真实 in-app browser 在武则天固定第一幕连续使用三次 Roll：第一次立即揭示预生成牌；第二、第三次分别经 DeepSeek 生成两组互不相同的新 A/B/C 牌，服务端请求均返回 200（8.5 秒、7.5 秒），剩余次数依次变为 1 和已用完。

### 2026-07-29 16:14 - 让第四次决定立即永久解锁并支持档案重复游玩

- 本次任务：调查完整跑完一局后“已解锁档案”未及时更新的问题，并把已解锁档案明确实现为可反复进入的通关收藏。
- 改了哪些文件：修改 `src/game/reducer.ts`、`src/services/storage.ts`、`src/components/HistoryGridCard.tsx`、`src/screens/SeedPickerScreen.tsx`、`src/styles/game.css`、`src/components/GameAnnouncement.tsx`、对应 reducer / storage / picker / App 集成测试、`README.md`、`AGENTS.md` 和本文档。
- 改了什么：解锁时机从“两份 AI 结局报告成功返回”前移到“第四次决定成为客户端正史”，因此结局请求失败、刷新或退出不再阻止通关落档；新增独立于当前局存档的 `i-changed-history:unlocked:v1` 永久收藏，加载时与当前/旧版会话合并并过滤退役剧本，当前局损坏或存档版本迁移也能恢复已解锁 ID。档案卡新增明确的 `再次闯入` 文案和可访问名称，点击后清空上一局并同步装载该历史的固定第一幕；档案说明和游戏说明同步解释解锁时机及重复游玩。
- 为什么这样改：玩家已经做完第四次不可撤销选择时，玩法本身就已通关，外部模型是否及时写完身后报告不应决定收藏奖励；永久收藏也不应与容易随玩法版本重置的当前局存档共用同一个故障边界。档案作为通关资产必须能再次游玩，否则只是没有功能价值的静态陈列。
- 影响了哪些模块：第四次 AI 选择与旧存档自定义选择的解锁时机、浏览器持久化、旧版本迁移、损坏会话恢复、档案卡视觉/文案和重复开局路径发生变化；100 个剧本、随机优先未解锁算法、四幕三 Roll、canonical 决定、续幕/结局协议、双报告内容与互动空间三剧本边界不变。复核后第 1 节已补充永久收藏和重玩定义，第 2 节已补充独立收藏存储，第 3 节已增加 `storage.ts` 维护入口。
- 验证：定向 reducer / storage / picker / App 集成测试 40/40、全量 Vitest 36 文件 357/357、TypeScript、217 个运行时文件可移植性、vinext 生产构建和 `git diff --check` 通过。真实 in-app browser 在 `http://localhost:3001/` 看到 `已解锁 1 个瞬间`、永久点亮说明与 `再次闯入`；点击武则天档案后直接进入同一历史的 `固定历史开场` 和四节点牌桌，控制台错误/警告为 0。

### 2026-07-29 16:07 - 让命运轮盘匀速停靠并重做主抽取按钮

- 本次任务：快速修正首页历史节点轮盘末段减速、停稳时整张卡尺寸跳变，以及 `随机抽一个开局` 主按钮视觉粗糙的问题。
- 改了哪些文件：修改 `src/screens/SeedPickerScreen.tsx`、`src/styles/game.css`、`src/screens/SeedPickerScreen.test.tsx`、`src/components/GameAnnouncement.tsx`、`README.md`、`AGENTS.md` 和本文档。
- 改了什么：把九段抽取统一为每段 180ms 的固定节奏和线性进出场，不再逐段拉长间隔；将抽取中与停稳后的卡宽、场景高、档案区高和中心缩放统一，移除停稳卡的二次缩放动画，并让最后一张完成运动后保留短暂稳定态再揭晓操作。主抽取按钮重构为带铜色内框、圆形骰子印章、双层文案、方向提示和真实按压深度的朱砂实体控制，同时保持原可访问名称。游戏说明、README 与当前项目概述同步改为匀速抽取口径。
- 为什么这样改：抽取的关键反馈应来自连续经过不同历史现场，而不是用末段减速拖长等待；旋转态和停稳态如果使用不同几何或重新播放缩放，会让用户把揭晓理解成页面卡顿。新的实体触发器延续现有煤黑、旧报纸、朱砂与铜色体系，并用更明确的层级把唯一主行动从档案背景中提出来。
- 影响了哪些模块：首页命运抽取的节奏、中心卡停靠过渡、主按钮视觉和玩法说明发生变化；随机命中算法、100 个剧本、解锁档案、固定第一幕、三次 Roll、AI 请求、存档、双报告与互动空间三剧本边界不变。复核后第 1 节已更新为当前匀速规则，第 2—3 节结构和入口仍准确。
- 验证：定向首页测试 5/5、全量 Vitest 36 文件 356/356、TypeScript、217 个运行时文件可移植性、vinext 生产构建和 `git diff --check` 通过。真实 in-app browser 完成抽取并采样九个节点；最后一张旋转卡与停稳卡的海报区域均为 344 × 367，宽高变化为 0；360 × 667 短屏主按钮位于 589–639px、整页高度 667px 且无滚动，控制台错误/警告为 0。

### 2026-07-29 15:47 - 修复第四次选择后结局请求被 Worker 稳定拒绝

- 本次任务：调查产品为何总在第四幕末尾生成失败，修复真实根因，并验证固定第一幕、第二至第四幕、第四次决定、双报告结局和互动空间打包的完整链路。
- 改了哪些文件：修改 `src/game/deepseekProtocol.ts`、`src/game/prompts.ts`、`worker/deepseek-proxy.ts`、`src/server/deepseekProxyContract.test.ts` 和本文档。
- 改了什么：确认四幕重构后，人物列传与 2026 世界报告已经发送以“`四次选择已经结束`”开头的任务，但 Worker 安全白名单仍只接受旧“`十二次选择已经结束`”前缀，导致第四次选择后的两条 `ending-primary` 请求在到达 DeepSeek 前就被 400 拒绝。现在把两类结局任务前缀提升为 `deepseekProtocol.ts` 的共享协议常量，prompt 构造器和 Worker 白名单共同引用同一来源；代理契约测试直接使用真实 `buildBiographyMessages` / `buildWorldReportMessages` 产物，锁定两条四决结局请求必须通过，并继续拒绝已废弃的十二决协议。
- 为什么这样改：这不是第四幕模型能力或 schema 偶发问题，而是客户端与服务端在十二幕缩减为四幕时只改了一侧。单独再改一次 Worker 字符串仍可能在下次玩法改版时复发；让生成端与安全门共享同一协议常量，才能从结构上消除版本漂移，同时保持代理只允许本产品任务的安全边界。
- 影响了哪些模块：Sites / 本地 Worker 的人物列传和 2026 世界报告请求恢复正常，第四次选择后可以进入双报告结局；第二至第四幕场景生成、结构修复、四决状态机、存档恢复、100 个开局、三次 Roll 和互动空间 `tt.callAIChatCompletion` 通道的行为不变。复核后第 1—3 节仍准确，无需改写。
- 验证：新增代理协议回归先稳定复现失败，修复后真实人物列传与世界报告封包均通过；全量 Vitest 36 文件 356/356、TypeScript、217 个运行时文件可移植性、vinext 生产构建和 `git diff --check` 通过。完整四次选择 UI 集成测试确认第四次决定后合并双报告、进入人物列传与 2026 页面并解锁历史；390 × 844 in-app browser 实测游戏说明、随机抽取、停稳揭晓和固定第一幕牌桌，应用控制台错误/警告为 0。互动空间包仍只含古腾堡、伽利略和阿波罗 11，非白名单泄漏 0，34 个文件，ZIP 2,714,398 字节，MD5 `ec8bc043d791e746e3c593a137ee812c`。真实 DeepSeek soak 未能使用本机 `.env.local` 的旧 Key（服务端返回 401），因此没有把外部凭据失败冒充为真实模型长跑通过。

### 2026-07-29 15:38 - 同步远端协作成果并归档赛事海报资产

- 本次任务：把 `origin/main` 的最新协作提交快进到本地当前 `main`，并将此前尚未纳入版本控制的赛事海报成品、可复现制作脚本和补充主视觉整理为当前本地最新版本。
- 改了哪些文件：远端新增 `src/data/generatingPhrases.ts`、`docs/superpowers/specs/2026-07-30-loading-phrases-design.md` 与三份历史玩法/剧本设计文档，修改 `src/screens/GeneratingScreen.tsx`、`src/styles/game.css`；本地修改 `src/screens/GeneratingScreen.test.tsx`，新增 `design/posters/2026-07-29/{poster-01-destiny-flip-a3,poster-02-roguelike-table-a3,poster-03-butterfly-effect-a3,a3-safe-zone-guide,generated-destiny-table-key-visual}.png`、`design/posters/2026-07-29/imagegen-prompts.md` 和 `scripts/build-hackathon-posters.mjs`；更新本文档。
- 改了什么：本地 `main` 从 `f5c21ea` 纯快进到远端 `bd234c1`，生成页的等待氛围语、草稿打磨语和首幕三段进度语由固定文案改为分类随机文案，其中草稿打磨语每秒平滑轮换；同步把仍锁死旧固定文案的两条回归测试改为校验实际显示值属于受控文案池，避免随机结果造成误报；同时把三张 3508 × 4961 的 A3 海报、安全区参考、生成提示词、Sharp 重建脚本和额外竖版主视觉统一归档到 `design/posters/2026-07-29/`，不把无语义 UUID 文件留在项目根目录。
- 为什么这样改：当前分支需要先吸收协作者已经提交的最新产品表达，再把本地已完成但尚未入库的比赛交付物纳入同一条权威代码线；生成页文案轮换降低长等待的机械重复感，海报资产集中归档则让成品、来源和复现路径可一起追踪。
- 影响了哪些模块：生成中的首幕等待文案、草稿状态提示及动效发生变化，新增赛事设计交付物和历史玩法设计资料；不改变实际 SSE 进度、四决三 Roll、100 个剧本、玩家正史、AI 请求协议、存档、结局或互动空间三剧本打包边界。复核后第 1—3 节仍准确，无需改写。
- 验证：海报重建脚本成功生成三张 A3 成品与安全区参考；全量 Vitest 36 文件 355/355、TypeScript、217 个运行时文件可移植性、vinext 生产构建和 `git diff --check` 全部通过。

### 2026-07-29 15:15 - 将平面闪动卡带重构为舒适的 3D 历史轮盘

- 本次任务：保留“在历史卡片中随机抽取”的核心形式，但解决多张完整卡同时横向闪过造成的晃眼、缺少 3D 旋转感、卡片上下高度不足，以及停稳前就出现闯入/重抽操作、`换一个开局` 远离主行动的问题。
- 改了哪些文件：修改 `src/screens/SeedPickerScreen.tsx`、`src/components/{HistoryCard,GameAnnouncement}.tsx`、`src/styles/game.css`、`src/screens/SeedPickerScreen.test.tsx`、`README.md`、`AGENTS.md`、`design-qa.md` 和本文档。
- 改了什么：抽取候选从 16 次平面整组重挂载收敛为九段约 3.2 秒的先快后慢轮转；每次只让下一张完整档案卡从右后方旋入清晰中心，旧卡转向左后方退场，背景卡只保留低亮度轮廓，并提前把候选本地图设为 eager / 预载，避免图片延迟造成白闪。抽取中的 `HistoryCard` 不再渲染假的 `闯入这一刻`，底部也不再保留禁用的 `正在抽取` 按钮，只留一句安静的减速状态。停稳后才挂载完整主行动，并把 176px 的次级 `换一个开局` 收进同一个揭晓卡组、紧邻主行动；主行动和重抽分别延迟进入，形成先停卡、再给操作的节奏。短屏中心卡从原 316px 宽提升到 332px，并增加场景与纸质 dossier 的垂直高度；玩法说明同步改成“沿时间旋转、逐渐停稳”，不再用平面滑动的旧说法。
- 为什么这样改：随机抽取需要“经过很多历史”的电影感，但玩家视觉系统只能稳定追踪一个主焦点。中心卡清晰、进出卡沿不同 Z 轴旋转、速度逐段减慢，比三张同亮度卡片反复闪现更容易预判；先完成停靠再出现按钮，也把“看结果”和“做决定”拆成两个明确时刻。
- 影响了哪些模块：首页抽取的候选节奏、图片预载、3D 几何、响应式卡高、操作显隐和相关结构测试改变；随机算法、100 个剧本、已解锁逻辑、历史卡内容、活动牌桌、Roll、AI 请求、存档、结局、互动空间三剧本边界和发布入口均未改变。复核后第 2 节代码结构无需调整，第 3 节只更新 `SeedPickerScreen` 的职责表述。
- 验证与打包：全量 Vitest 36 文件 355/355、TypeScript、216 个运行时文件可移植性、vinext 生产构建和 `git diff --check` 通过。真实 in-app browser 在 360 × 667、390 × 844、430 × 932 实际完成抽取和停靠：抽取中不存在闯入/重抽按钮，停稳后三个尺寸都同时显示完整档案、`闯入这一刻` 和紧邻其下的 `换一个开局`，页面无横向或纵向溢出，应用控制台错误/警告为 0。互动空间包仍只含古腾堡、伽利略和阿波罗 11 三个白名单剧本，非白名单泄漏 0，34 个文件，ZIP 2,713,556 字节，MD5 `24b9495b3a59f4c527af2a890f80569f`。

### 2026-07-29 14:26 - 生成三套赛事 A3 产品海报

- 本次任务：读取 2026 抖音 AI 创变者大区赛海报规范，基于本地最新的命运抽取、三牌肉鸽和四决蝴蝶效应产品形态，生成三张风格区分明确且可直接套官方模板的 A3 竖版海报。
- 改了哪些文件：新增 `design/posters/2026-07-29/poster-{01-destiny-flip,02-roguelike-table,03-butterfly-effect}-a3.png`、`design/posters/2026-07-29/a3-safe-zone-guide.png`、`design/posters/2026-07-29/imagegen-prompts.md` 与 `scripts/build-hackathon-posters.mjs`；更新本文档。
- 改了什么：三张成品统一输出为 `3508 × 4961 px`，并将所有关键内容限制在垂直 11%–86%、水平 6.5%–93.5% 的官方安全区内。第一张以未翻开的黑金命运牌和秦统一、古腾堡、阿波罗历史碎片表现随机穿越；第二张使用项目原创黄/朱砂/铜绿实体卡框表现循史、破局、天外与每幕三次 Roll；第三张用秦地图、印刷书页、登月和 2026 城市组成四决蝴蝶，表现同一人一生的因果扩散。脚本复用项目自有艺术字、卡框、历史场景和档案舞台，可无损重建三张成品；同时保存三套无文字 ImageGen 主视觉提示词。
- 为什么这样改：赛事模板会用边框、Logo 和底部文字条覆盖画面，海报必须先保证安全区和远距离可读，再表达产品差异。把准确中文、产品艺术字和真实卡牌结构留给本地排版，可以避免生成式中文错字，并确保“穿越、随机、肉鸽、蝴蝶效应”分别获得清晰视觉锚点。
- 影响了哪些模块：只新增离线海报交付物、复现脚本和设计提示词，不改变游戏运行时、100 个剧本、四决三 Roll、AI 请求、存档、互动空间包或 Sites 部署。已明确复核第 1—3 节仍与当前项目一致，无需改写。内置 ImageGen 的参考图和纯新图接口本轮共五次返回网络错误，因此未采用生成结果，也没有擅自切换到需要 API Key 的 CLI；三张当前成品全部来自项目已有原创素材的本地合成。

### 2026-07-29 14:00 - 让完整历史卡真正参与随机抽取，并统一洗牌节奏与玩家文案

- 本次任务：修正首页只动时间线、不动历史卡造成的假随机感，恢复历史档案卡的主体尺寸；把入口说明改成真正面向玩家的游戏说明；给三次 Roll 建立一致的实体洗牌过渡，并清理牌桌重复提示和不像人说话的卡牌文案。
- 改了哪些文件：重构 `src/screens/SeedPickerScreen.tsx`、`src/components/{HistoryCard,GameAnnouncement,ChoiceList}.tsx`、`src/screens/TimelineEventScreen.tsx`、`src/hooks/useGame.ts`、`src/data/fixedOpenings.ts`、`src/game/prompts.ts` 和 `src/styles/game.css`；同步更新相关组件、hook、prompt、固定开场与应用集成测试，以及 `README.md`、`AGENTS.md`、`design-qa.md` 和本文档。
- 改了什么：首页删除脱离卡片单独运动的顶部时间轴，抽取时直接让三张完整 `HistoryCard` 卡带以 16 个 staged 节点先快后慢连续滑动；中心档案在常规屏保持 344px、360px 短屏保持 316px，并固定露出右侧下一张预览。公告改名 `游戏说明`，围绕“随机抽历史开局、每幕选一张、每幕三次 Roll、四次选择走完一生并看见 2026”解释核心玩法。活动页只在牌桌上方保留一次 `上划打出 · 按住读牌 · 每幕可 Roll 3 次`，删除卡内重复手势和 `抽一张，改写这一刻`。第一次 Roll 虽然使用预生成牌，也先完成 1.2 秒实体洗牌；第二、第三次请求前先收牌并显示 `正在为这一刻换一手牌…`，成功或失败至少经过 0.9 秒，重试时立即隐藏旧错误。固定开场与模型协议都改成可执行的自然动宾短语，禁止抽象套话。
- 为什么这样改：随机入口的主角应该是玩家正在抽取的历史档案，而不是一条脱离主体的进度装饰；让完整卡片高速掠过、逐渐减速，才能把“从一百段历史里抽中这一生”变成可感知的物理事件。Roll 的等待也必须先给出收牌与洗牌反馈，玩家才会把 1-2 秒理解为游戏仪式而不是卡顿；同一指令只出现一次，能把短屏空间还给真正需要辨认的三张决定。
- 影响了哪些模块：首页随机抽取视觉与节奏、公告内容、三卡牌桌密度、首次与实时 Roll 状态、固定第一幕六张牌和续幕发牌提示协议发生改变；随机算法、100 个独立剧本、四幕人生、canonical 决定、模型传输、存档、双报告和互动空间三白名单打包边界没有改变。
- 验证与打包：全量 Vitest 36 文件 355/355、TypeScript、215 个运行时文件可移植性、vinext 生产构建和 `git diff --check` 通过。真实 in-app browser 在 360 × 667、390 × 844、430 × 932 验证了游戏说明、完整卡带抽取、停稳揭晓、活动牌桌、首次 1.2 秒洗牌和实时 Roll 等待/失败/重试；短屏中心卡宽 316px、下一张预览可见，活动页全部主控件在首屏且重复卡内提示为 0，控制台错误/警告为 0。互动空间构建仍只包含古腾堡、伽利略和阿波罗 11 三个白名单剧本，非白名单泄漏 0，34 个文件，ZIP 2,712,598 字节，MD5 `394d8b34c9a756dc902071ad48fc5862`。

### 2026-07-29 13:00 - 用命运抽取贯穿开局，并将完整人生压缩为四决三 Roll

- 本次任务：取消开局面对 100 个历史节点的自由选择，把 Roll 的爽感提前到“从哪里开始”；完成历史节点后才解锁档案；首次进入用玩家口吻说明规则；把单局从十二次决定压缩为四次，并让每幕拥有三次 Roll，最后仍输出一生与 2026 的双报告。
- 改了哪些文件：新增 `src/components/GameAnnouncement.tsx`；重构 `src/screens/SeedPickerScreen.tsx`、`src/App.tsx`、`src/components/ChoiceList.tsx`、`src/screens/TimelineEventScreen.tsx`、`src/hooks/useGame.ts`、`src/game/{timelinePlan,reducer,schema,prompts,engine,deepseekProtocol,deviation,worldCanon}.ts`、`src/services/{storage,deepseek-contract}.ts`、`src/data/fixedOpenings.ts`、`src/styles/game.css` 与相关单元/集成/soak 测试；同步更新 `README.md`、`AGENTS.md`、`design-qa.md` 和本文档。
- 改了什么：首页默认是一张阴影中的实体命运牌和一条遮蔽的 100 节点时间轴，抽取时经过 18 个 staged 落点后停在唯一节点，优先未解锁且尽量避开上次结果；停稳后原样复用既有历史档案卡，完整结局才把 seed ID 写入持久化解锁集合。首次挂载弹出四步玩法公告，设置菜单可重看。权威时间计划改为四幕，偏离倍率重新分配到四次决定，结局 schema 固定接收四条人生选择。每幕 `rollCount` 上限为 3：第一次直接发预生成 `rollChoices`，后两次经新增 `choice_set` 协议现场生成并避开所有已看牌；请求可刷新恢复，失败保留当前牌并在 Roll 原位重试。天外牌提示与固定开场扩展为时间、语言、记忆、物质、空间、制度感知和因果等多类奇想，不再默认聚焦坦克或神兽。
- 为什么这样改：开局的一百选一让玩家在真正体验游戏前先承担决策成本；把“随机但有仪式感”的抽取放到入口，把“有限但可主动追求惊喜”的三次 Roll 放到每一幕，能让随机性成为统一机制。四次重大抉择保留完整人生弧线，同时把单局时长压到适合移动端反复游玩的范围；完成才解锁则把通关结果变成明确的收藏反馈。
- 影响了哪些模块：首页导航与持久化解锁、玩法公告、完整幕次数、偏离度、牌组状态、两次实时发牌请求、模型协议、固定开场奇想、结局输入、长测门禁与产品文档全部改变；100 个剧本内容与模块结构、既有历史档案卡视觉、活动牌桌的藏品级卡面/长按/上划交互、完整 canonical 决定、双报告内容和互动空间三剧本打包边界保持不变。真实 in-app browser 已在 360 × 667、390 × 844、430 × 932 完成公告、未显影卡、随机停靠、历史卡揭晓、进入第一幕、第一次零等待 Roll、实时 Roll 错误原位重试与空档案路径；短屏页面无纵向溢出，四节点和全部主控件同屏。
- 验证与打包：全量 Vitest 36 文件 355/355、TypeScript、215 个运行时文件可移植性、vinext 生产构建和 `git diff --check` 通过；互动空间包仍只含古腾堡、伽利略、阿波罗 11 三个白名单剧本，非白名单泄漏 0，34 个文件，ZIP 2,711,059 字节，MD5 `c7b3d0b571bb87959e4c72a334dd62ae`。按门禁启动了三开局四幕真实 soak，但本地已保存的 DeepSeek 凭证被官方返回 `unauthorized`，三局都在第二幕请求前停止；没有把这次外部凭证失败计作模型链路通过，脱敏证据保存在已忽略的 `tmp/soak/destiny-four-turn-20260729/`。

### 2026-07-29 12:08 - 将三卡牌桌升级为藏品级实体牌并补齐按住蓄力

- 本次任务：继续针对“卡牌设计丑、长按没有游戏反馈、整体布局仍像网页”做完整美术与交互收口，把核心三卡从多层 CSS 装饰框升级为统一的实体收藏牌，并在短屏内重排牌桌、Roll 和历史入口。
- 改了哪些文件：新增 `public/assets/cards/frame-{regular,radical,surreal}-v2.webp` 三张原创材质框，以及 `design/validation/collector-card-*.png` 四份实机/对照证据；修改 `src/components/{ChoiceList,ChoiceList.test}.tsx`、`src/screens/{TimelineEventScreen,TimelineEventScreen.test}.tsx`、`src/services/cardAudio.ts`、`src/styles/game.css`、`public/assets/CREDITS.md`、`AGENTS.md`、`design-qa.md` 与本文档。
- 改了什么：三类牌分别使用黄铜档案、朱砂封印和铜绿异物材质，整张 2:3 牌框以连续 WebP 表达皮革、金属、磨损和底沿厚度，实时 HTML 继续负责可访问的分类、徽章、短牌名和手势文案；牌桌把中牌放大前置、侧牌内倾，把 94 × 40px Roll 留在三牌下方。长按从指针落下立即进入 320ms 蓄力：来源牌直立、前移、增亮，顶部进度丝填充、徽章抬升，另外两牌后退降亮；超过 8px 位移便取消蓄力并切成上划。详情沿用来源牌的同一材质，圆形黄铜关闭扣和完整 canonical 字段都能在 390 × 720 短屏内看完；新增轻量检查音效，页面提示统一为 `按住读牌`。
- 为什么这样改：卡牌的第一性任务是让玩家在一秒内看懂“这是一件能拿起、能读、能打出的游戏物件”。分散的 CSS 花边只会增加网页感，按住期间没有视觉因果又会让 320ms 感觉成卡顿。统一实体表面和连续蓄力状态让牌面材质、交互意图与详情结果成为同一个物理隐喻，同时把空间优先级继续留给三张决定而不是 Roll。
- 影响了哪些模块：只影响活动事件页的卡牌材质、桌面几何、长按状态、详情动效、短音效和对应测试；不改变 A/B/C 语义、六张牌协议、一次 Roll、canonical 决定、上划提交阈值、世界正史、模型请求、100 剧本、十二节点、结局或存档结构。
- 真实浏览器验证：在 390 × 720 产品壳中，场景、完整事件、三张牌、紧凑 Roll 与正史入口都在首屏；真实 Roll 完成旧牌收拢、第二组三张发出和 `已用` 状态，真实快速上划进入 `这件事已经发生`。蓄力截图显示来源牌抬升且另外两牌退后，详情完整露出且关闭控件不裁切；控制台错误/警告为 0。源稿与实机的 390px 等宽并排证据在 `design/validation/collector-card-reference-comparison.png`。
- 验证与打包：全量 Vitest 36 文件 363/363、TypeScript、214 个运行时文件可移植性、vinext 生产构建与 `git diff --check` 全部通过；互动空间审核包仍只包含古腾堡、伽利略、阿波罗 11 三个白名单剧本，非白名单泄漏 0，34 个文件，ZIP 2,703,760 字节，MD5 `0d19ef94dcfd7aa319af86ac20315742`。

### 2026-07-29 11:12 - 修复快速上划失效并收紧牌桌核心交互

- 本次任务：解决实机游玩中 Roll 横向占位过大、快速上划偶发不能进入结果页、出牌与换页硬切、长按详情响应迟缓且关闭控件缺少游戏质感的问题。
- 改了哪些文件：修改 `src/components/{ChoiceList,ChoiceList.test}.tsx`、`src/screens/{TimelineEventScreen,TimelineEventScreen.test}.tsx`、`src/styles/game.css`、`AGENTS.md`、`design-qa.md` 与本文档。
- 改了什么：Roll 从短屏 100% 宽、常规 82% 宽的牌匣收成 88-94px 朱砂按钮，把纵向和横向空间还给三张牌；旧牌仍在 180ms 内朝按钮收拢，第二组三张在同一次 reducer 切换后重新发出。上划手势的拖动真值从 React 异步 state 改成同步 pointer/offset refs，快速 `pointerdown -> move -> up` 即使被 React 批处理也能按 48px 阈值可靠提交；`pointercancel` 单独复位，不再沿用可能误提交的结束分支。选中牌用 480ms 连续飞出顶部，另外两牌后退降亮，历史场景和正文同时退场，结果页再以场景聚焦和裁决卡上移接入。长按阈值从 430ms 降到 320ms，详情根据原牌真实位置做 FLIP 式起身/回落，移除高开销背景模糊，关闭按钮改为 38px 圆形黄铜扣并保留 Escape、键盘入口和焦点返回。
- 为什么这样改：核心动作必须在玩家手指离开的一瞬间可靠成立，不能让框架状态调度决定是否出牌；同时“拿牌、打出、重抽、读牌”应该是一套连续物理语言，而不是若干网页弹窗和页面硬切。Roll 只是低频辅助操作，不能挤压每一幕真正需要快速辨认的三张决定牌。
- 影响了哪些模块：只改变三卡牌桌的手势状态、Roll/详情/出牌动效、结果页入场以及对应测试和设计约束；不改变六张牌协议、一次 Roll、canonical 决定、世界正史、模型调用、100 剧本、十二节点、结局或存档结构。TDD 新增同一 `act` 中快速按下/移动/抬起、浏览器取消手势不提交、事件页先进入离场态再写入选择等回归；真实 in-app browser 连续两次快速上划均进入结果页，Roll 完成收牌/发牌且第二次禁用，详情完成打开、关闭与焦点路径。全量 Vitest 36 文件 362/362、TypeScript、214 个运行时文件可移植性、vinext 生产构建与 `git diff --check` 通过；互动空间审核包仍只有三个白名单剧本，非白名单泄漏 0，31 个文件，ZIP 2,639,815 字节，MD5 `7e1a0d67d42cd1921518c4bb184af5fa`。

### 2026-07-29 10:42 - 按选定历史档案牌桌稿重做三卡质感与物理交互

- 本次任务：把用户确认的 3D 化历史档案牌桌效果图作为活动玩法的视觉真值，完整重做三张决定牌、Roll 牌匣和长按详情，让核心选择从平面网页控件变成可拿起、可推出、可收回重发的实体牌桌体验。
- 改了哪些文件：修改 `src/components/ChoiceList.tsx`、`src/components/ChoiceList.test.tsx`、`src/styles/game.css`、`AGENTS.md`、`design-qa.md` 和本文档；新增 `design/validation/archive-card-*.png` 的 360 × 667、390 × 844、430 × 932 静态态、上划提交态、Roll 收牌/发牌态、长按详情态与源图并排对照证据。
- 改了什么：三张牌改为左右内倾、中牌前置的扇形实体布局，使用既有档案桌面、朱砂织物和三类原创牌徽，补齐双层金属边、纸面颗粒、底部厚边、压桌阴影和事件场景旧纸调色。上划超过阈值后选中牌升到前景并飞出顶部，其他两牌同步后退；Roll 先把当前三牌收进朱砂牌匣，再显示 reducer 已预备的第二组三牌并重新发牌，整个过程仍然零网络等待且本节点只能一次；长按把原牌抬成居中的完整实体详情，展示 canonical 决定与全部执行字段，关闭时回落并恢复原牌焦点。减少动态模式压缩位移时长但不删除状态反馈。
- 为什么这样改：产品的核心不是阅读三个按钮，而是在同一历史压力下迅速“出一张牌”。视觉质感、出牌、重抽和读牌必须共用同一套实体隐喻，用户才能在极短时间内理解可操作物、当前状态和不可撤销的选择。
- 影响了哪些模块：只改变活动事件页的三卡视觉与交互表现、对应回归测试和设计维护约束；不改变六张牌协议、A/B/C 语义、canonical 决定、一次 Roll 状态、模型调用、世界正史、100 剧本、十二节点、结局或存档结构。真实 in-app browser 已在 360 × 667、390 × 844、430 × 932 验证首屏完整性，并真实完成上划提交、Roll 收牌/发牌、长按详情和焦点返回，控制台错误/警告 0。Vitest 36 文件 360/360、TypeScript、214 个运行时文件可移植性、vinext 生产构建与 `git diff --check` 通过；互动空间审核包仍只含三个白名单剧本，非白名单泄漏 0，31 个文件，ZIP 2,639,062 字节，MD5 `90381a547193efcfb7485362739de203`。

### 2026-07-29 02:13 - 将主玩法改造成单次预生成六张牌的历史肉鸽

- 本次任务：在保留 100 个历史入口、十二节点同一主角和双结局的前提下，彻底取消当前玩家自由输入，把每一幕改造成三卡牌桌；模型每幕一次生成两组三张，玩家可无等待 Roll 一次，长按看完整决定并向上划出牌；同时保留抖音火山平台与本地 DeepSeek 官方 V4 Flash 两种运行方式。
- 改了哪些文件：修改 `src/game/{schema,reducer,prompts,engine}.ts`、`src/data/fixedOpenings.ts`、`src/{App,App.integration.test}.tsx`、`src/hooks/useGame.ts`、`src/components/{ChoiceList,ChoiceList.test}.tsx`、`src/screens/{TimelineEventScreen,TimelineEventScreen.test}.tsx`、`src/styles/game.css`、`src/services/cardAudio.ts`、`src/services/deepseek.direct.test.ts`、`src/services/deepseek.interactive.test.ts`、`src/soak/{longRunSoak.soak,soakCases,soakCases.test}.ts`、`src/test/fixtures.ts`、`.env.example`、`README.md`、`AGENTS.md` 和本文档；新增 `public/assets/cards/*.png`、`docs/ai-transports.md` 与 `design/validation/roguelike-*.png`。
- 改了什么：幕次协议新增严格的 `rollChoices` 三元组，首组与 Roll 组都强制 A 循史、B 破局、C 天外，短 `displayLabel` 与完整 canonical `label` 分离；存档升级 v14，`rollUsed` 每幕持久化并在进入下一幕时重置。事件页删除自由输入入口，换成三张带原创透明卡面图标的煤黑/新闻纸牌、54px 上划阈值、430ms 长按详情、一次性 Roll 和 Web Audio 即时牌声；Roll 只切 reducer，不发模型请求。固定第一幕也拥有六张牌，后续提示一次请求六张并允许坦克、神兽等超现实天外牌。长测从“自由改写”改成四到五幕 Roll，并支持 `SOAK_ALL_ROLL=1` 十二幕全 Roll。Node 直连测试验证 DeepSeek 官方地址、Bearer、V4 Flash 与 fast 非思考模式，互动空间测试继续验证 `tt.callAIChatCompletion` 火山平台流。
- 为什么这样改：玩家的主要乐趣应来自迅速识别三种风险并“出牌”，不是停在输入框组织长文本；把备用三张与首组三张放进同一响应，才能让重抽有肉鸽随机感但不制造第二次网络等待。短牌面降低首屏阅读成本，完整详情和 canonical label 又保证后续模型推演不会因摘要丢失因果。
- 影响了哪些模块：改变所有活动局的决定 UI、幕次 Schema、状态机、存档、固定开场、模型 prompt、长局测试和产品文档；保留旧存档中已经存在的玩家事实只为连续性兼容，但当前 UI 不再能创建自由输入。历史 100 卡目录、互动空间只打包三个审核剧本、十二节点、人物连续性、双结局、报告导出和发布状态不变。真实浏览器已在 390×844 与 360×667 完成长按、一次 Roll、第二次禁用和上划；短屏 `scrollHeight === innerHeight === 667`，控制台错误/警告 0。真实 DeepSeek 官方调用把“召来钢铁巨兽”续成第二幕“巨兽惊王城”，一次返回“以礼祭退兽 / 借兽立威 / 纵兽西驱”和备用“忍辱迁都 / 联诸侯制兽 / 开兽腹探秘”六张牌，Roll 无二次等待。单局真实 12/12 全 Roll 长测完成 11 个实时续幕和双报告，0 人工重试，Roll P50/P90 均为 0ms，首段可读 P50/P90 为 3.52/3.81 秒，续幕 P50/P90 为 20.52/22.87 秒，整局 259.98 秒，首答字段修复 1/11 且成功恢复。Vitest 36 文件 360/360、TypeScript、214 个运行时文件可移植性、vinext 生产构建与 `git diff --check` 全部通过；互动空间审核包仍只含古腾堡、伽利略、阿波罗三个剧本，非白名单泄漏 0，31 个文件，ZIP 2,637,193 字节，MD5 `62cffd7c1da9d5d80036bbb8a1cb166f`。

### 2026-07-29 00:57 - 收敛为单一 main 并固定三剧本审核打包

- 本次任务：取消完整 100 剧本版与 10 剧本审核版的双分支维护，在唯一 `main` 中保留完整剧本源码，并让每次抖音互动空间提审打包自动只包含三个低敏剧本。
- 改了哪些文件：新增 `src/data/historySeeds/interactive.ts`、`src/data/historySeeds.interactive.test.ts`、`scripts/{interactive-review-catalog,verify-interactive-review-build,package-interactive-review}.mjs`；修改 `vite.interactive.config.ts`、`scripts/prepare-interactive-build.mjs`、`package.json`、`package-lock.json`、`src/screens/{SeedPickerScreen,SeedPickerScreen.test}.tsx`、`AGENTS.md`、`README.md` 与 `PROJECT_CONTEXT.md`；本地删除四个旧 worktree 与对应 `codex/*` 分支，只保留 `main`。
- 改了什么：普通产品继续从 `historySeeds/index.ts` 聚合全部 100 个独立剧本；互动空间 Vite 构建通过精确别名改用只导入古腾堡印刷、伽利略《星空使者》和阿波罗 11 号的聚合入口。统一脚本随后删除其他 97 张历史图，扫描最终文本产物中全部 97 个非审核 ID，发现任何泄漏即失败；完成资源优化后用跨平台 ZIP 库生成根级 `index.html` 包，并再次检查 8MB 上限。时间轴无障碍名称改为动态节点数，审核包不再残留“一百个历史年份”。本地主工作区快进吸收完整互动空间适配和 100 剧本模块化提交，旧 10 节点审核分支没有合入。
- 为什么这样改：产品功能与剧本只应有一个事实来源；长期维护两份卡组会让修复、测试和审核规则逐渐分叉。审核差异属于可重复的构建约束，应由脚本自动选择、删除和验证，不能依赖人工从 100 个剧本中手工复制或压缩。
- 影响了哪些模块：影响本地 Git 协作边界、互动空间卡组别名、历史图片清理、审核 ZIP 生成、包体与剧本泄漏门禁、时间轴无障碍文案和维护文档；不改变普通产品的 100 个剧本、顺序、内容、固定第一幕、AI 协议、直接改写、十二节点、双结局或 Sites 构建。本地仅剩 `main` 一个工作树和一个本地分支，远端旧分支未删除。全量 Vitest 35 文件 354/354、TypeScript、212 个运行时文件可移植性、vinext 完整产品构建与 `git diff --check` 通过；审核产物源码基线 100、实际剧本 3、历史图 3、非白名单 ID 泄漏 0，未压缩 2,782,308 字节，ZIP 2,397,813 字节，MD5 `56a2547cad20e0a5defef6143ff15338`。390×844 真实浏览器确认 `1 / 3`、三个年份节点、三张卡和阿波罗图片正常，控制台 0 错误、0 警告。

### 2026-07-29 00:43 - 将一百个历史剧本拆成独立模块

- 本次任务：在完整 100 节点分支中把单体历史卡牌文件重构为“一剧本一模块”，方便单独删除、增加和测试，同时保证剧本内容、数量与顺序不变。
- 改了哪些文件：删除 `src/data/historySeeds.ts`；新增 `src/data/historySeeds/{index,shared}.ts`、`src/data/historySeeds/scripts/<seed-id>/index.ts` 共 100 个剧本模块与 `src/data/historySeeds.modules.test.ts`；更新 `AGENTS.md` 和 `PROJECT_CONTEXT.md`。
- 改了什么：公共 `moment` 构造器和标签迁入 `shared.ts`；每个历史节点按自己的稳定 ID 拥有独立目录；聚合入口显式导入全部 100 个模块并保留原顺序；新增结构测试，强制活动节点集合与模块目录一一对应，并证明单个剧本可直接导入测试。
- 为什么这样改：原先 100 个剧本挤在一个文件中，单独删减、审查或回归测试容易误伤其他节点；模块化边界让每次操作的代码范围可见，并通过聚合测试及时发现“只删数据没删目录”或“有目录没接入卡组”的残缺状态。
- 影响了哪些模块：历史卡牌源码组织、卡组聚合入口、单剧本测试方式和后续维护约束；不改变任何运行时剧本字段、卡组顺序、固定开场、图片映射、筛选逻辑或玩家行为。

### 2026-07-28 22:23 - 提交互动空间审核

- 本次任务：按用户确认把互动空间 AppID `ttbb15cda8243f100b21` 从草稿正式提交审核，并回查服务端状态。
- 改了哪些文件：仅更新 `PROJECT_CONTEXT.md`；未修改产品代码、配置、构建产物或已上传 ZIP。
- 改了什么：通过 `interative_content_mcp` 提交审核；平台返回“审核提交成功”，随后精确查询同一 AppID，确认 `Status: 2`（审核中）、`AIEnabled: true`、`ScreenDirection: 1`，包 MD5 仍为 `dbffca9b61207b39c9edc59d51df3043`。
- 为什么这样改：提交审核是用户明确确认的发布动作，需要以服务端回查而不是只以提交接口成功文案作为最终证据，并把真实外部状态同步给后续维护者。
- 影响了哪些模块：只改变互动空间平台作品状态和项目交接记录；不影响本地代码、100 张历史卡、AI 协议、玩家正史、视觉、Sites 正式版或比赛包内容。`PROJECT_CONTEXT.md` 第 1 节已同步审核状态，第 2—3 节仍与实际结构一致。

### 2026-07-28 22:20 - 压入真实 8MB 门槛并创建互动空间 AI 草稿

- 本次任务：接续互动空间比赛版发布，在真实 MCP 上传端验证产物边界，修复原 21MB ZIP 被服务端拒绝的问题，并把完整产品创建为平台竖屏 AI 草稿。
- 改了哪些文件：新增 `scripts/optimize-interactive-assets.mjs`；修改 `package.json`、`AGENTS.md` 与 `PROJECT_CONTEXT.md`。被 Git 忽略的 `dist-interactive/` 与 `release/i-changed-history-interactive-space.zip` 已重新生成。
- 改了什么：`npm run build:interactive` 在原 Vite 构建和合规清理后新增比赛产物专用图片优化：100 张历史图按移动容器实际显示尺寸重采样，纸张和朱砂透明纹理在产物中改为 WebP，透明书法字标保留原路径并压缩；原始 `public/` 素材和 Sites 构建不变。脚本逐文件只接受更小的结果，并对完整未压缩产物设置 7,500,000 字节闸门。最终构建为 5,677,310 字节，ZIP 为 5,280,378 字节，MD5 `dbffca9b61207b39c9edc59d51df3043`，保留 100/100 张本地历史图、音乐、双报告、十二章和直接改写。ZIP 与 300×300 图标通过一次性上传凭证写入平台，创建 AppID `ttbb15cda8243f100b21`；只读回查确认状态 `1`（草稿）、`ScreenDirection: 1`、`AIEnabled: true`、包 MD5 一致，未调用提审。
- 为什么这样改：比赛方校验器只验证单文件和代码规则，原 21MB 包虽全部绿灯，真实上传接口仍以 `413` 明确拒绝并返回最大 8,388,608 字节。为了同时满足稳定性、完整玩法和真实平台门槛，资源优化必须限定在移动端比赛构建，且把尺寸失败前移到本地构建阶段，不能删历史节点、音乐或依赖人工记忆检查 ZIP。
- 影响了哪些模块：影响互动空间静态产物的图片编码、包体门禁和平台草稿状态；不改变历史数据、固定开场、玩家正史、AI prompt/schema、运行时 UI、音频、Sites / Worker、原始高清素材或默认生产构建。官方校验器对目录和 ZIP 全部通过；ZIP 完整性 125 个文件无错误；Vitest 33 文件 350/350、TypeScript、105 个运行时文件可移植性和 `git diff --check` 通过。真实浏览器在 390×844 与 360×667 验证字标、胶片纸张、100 张网格图、搜索、武昌起义固定开场和直接改写，破图 0、控制台错误/警告 0。平台容器中的真实 `tt.callAIChatCompletion` 生成仍需在草稿扫码或后续提审前验收。

### 2026-07-28 21:05 - 新增互动空间专用离线构建与平台 AI 传输

- 本次任务：在独立 `codex/interactive-space-adaptation` worktree 中，把完整《哎！我改变了历史？》适配为抖音互动空间可上传作品；工作人员已明确无需删减内容节点和文字录入，因此保留全部 100 个历史入口、直接改写、十二次决定、完整双报告、音乐和本地历史美术。工作人员当时称包体可超过 8MB，但 22:20 的真实上传随后证实服务端仍硬性限制 8MB，当前边界以上一条记录为准。
- 改了哪些文件：新增 `vite.interactive.config.ts`、`.trae/mcp.json`、`src/services/{deepseek-contract,deepseek.interactive,deepseek.interactive.test,htmlToImage.interactive}.ts`、`scripts/{prepare-interactive-build,create-interactive-icon}.mjs`；修改 `package.json`、`.gitignore`、`index.html`、`scripts/check-portability.mjs`、`src/services/deepseek.ts`、`src/App.tsx`、`src/data/fixedOpenings.ts`、`src/game/{engine,narrativeContext,prompts,schema,worldCanon}.ts` 与 `AGENTS.md`。
- 改了什么：新增完全相对路径的 `dist-interactive` 构建目标，通过别名只在互动空间包中把原同源 HTTP/SSE 传输替换为 `tt.callAIChatCompletion`，固定调用用户确认的 `deepseek-v4-flash`、8192 token、平台 SSE 增量解析、90 秒超时、有限重试、取消、刷新恢复和字段修复；把 DeepSeek 类型契约抽成共享模块，原 Sites / Worker 传输逻辑保持不变。互动空间包不含任何 API Key、远程 URL、普通网络请求或外部资源；报告图片改用本地 DOM/SVG/Canvas 渲染，并先把已加载的本地图片和 CSS 背景在内存中嵌入，避免 `foreignObject` 让 Canvas 误判跨域，仍导出完整 2x PNG。补充 Safari 13.4 不支持的 `.at`、`Object.hasOwn` 与 `Intl.Segmenter` 兼容路径，构建后移除非运行时授权清单并只把根资源路径改成相对路径。项目和 Codex 全局均已写入比赛方要求的 `interative_content_mcp`；发布 ZIP 和 300×300 项目字标图标已生成到被 Git 忽略的 `release/`。
- 为什么这样改：互动空间要求作品资源完全内置、禁止普通网络与外链，并只能通过容器注入的 `tt.*` 能力调用 AI；同时现有 Web / Sites 版已经稳定，不能为比赛发布破坏其服务端密钥、限额、流式体验或公开托管能力。因此采用同一领域层与 UI、两种构建时传输适配器的边界，避免复制玩法或在运行时猜测环境。
- 影响了哪些模块：新增互动空间打包、平台 AI 调用、离线报告导出、MCP 发布配置和兼容性分支；历史牌库、固定开场、玩家逐字正史、主角连续性、十二节点节奏、AI prompt/schema、存档、音乐、双报告、Sites Worker 及默认构建均保持。全量 Vitest 33 文件 350/350、TypeScript、默认 vinext 构建、互动空间 Vite 构建、可移植性与 `git diff --check` 通过；互动空间官方校验器对目录和 21MB ZIP 的必需文件、单文件大小、动态代码、网络、跳转、外链、内联事件、XSS、不支持/废弃 API 和浏览器兼容性全部通过。390×844 真实浏览器已验证胶片、百卡网格/筛选、固定开场、直接改写、断网兜底、刷新恢复及模拟平台 SSE 生成第 2 幕，控制台 0 错误、0 警告，非静态请求为 0；带真实本地历史图、完整中文文案和朱砂样式的 320×720 报告样本成功导出为 640×1440 PNG，图片像素和品牌色均真实存在。真实十局 soak 已尝试，但现有本地旧 DeepSeek 直连密钥统一返回 401，未收到任何模型正文；这属于旧 Web 直连凭证，不会写入互动空间包，平台账号的真实 AI 调用仍需在 MCP 认证和互动空间 AI 服务配置完成后做最终在线验证。

### 2026-07-28 14:04 - 收敛海报年份轨并固定竖排字序

- 本次任务：修复历史海报红色年份轨把月日等精确日期塞入窄栏后出现字符拆散、遮挡，以及四位数公元年份可能把“公元”显示成“元公”的格式问题。
- 改了哪些文件：`src/components/HistoryCard.tsx`、`src/screens/SeedPickerScreen.test.tsx`、`src/styles/game.css`、`AGENTS.md`、`PROJECT_CONTEXT.md`。
- 改了什么：年份轨从完整 `dateLabel` 收敛为唯一稳定格式 `公元前/公元 + 年份 + 年`，月、日、季节和其他精确时间不再渲染；纪元文字与每一位年份数字改为显式的逐字纵向 DOM 和 flex 排列，不再依赖可能因可用高度而换列、倒序的 CSS `writing-mode`；无障碍名称同步使用标准格式化年份。
- 为什么这样改：海报年份轨的职责是让玩家迅速识别历史年代，不是承载完整日历；窄栏里继续堆精确日期既没有增加有效决策信息，又会因三位数、四位数及长纪元组合产生不稳定排版。显式字序比依赖浏览器竖排算法更可控，也能保证各浏览器显示一致。
- 影响了哪些模块：只影响首页胶片卡的年份轨呈现、对应回归测试和长期设计约束，不改动历史数据中的完整日期、顶部时间轴、网格浏览、固定开场、AI 请求、正史、存档或 Worker。项目目的、结构和关键入口未变化，`PROJECT_CONTEXT.md` 第 1—3 节仍准确。真实浏览器验证公元前 770 年、公元 476 年与公元 1347 年，全部按自上而下的正确字序显示且无月日；在 360 × 667、390 × 844、430 × 932 三档逐一审计 100 张卡，格式异常 0、年份轨溢出 0，主按钮与相邻卡预览仍完整，控制台无错误或警告。首页定向测试 14/14、全量 Vitest 32 文件 347/347、TypeScript、97 个运行时文件可移植性、vinext 生产构建与 `git diff --check` 全部通过。

### 2026-07-28 13:59 - 首页胶片完整适配主流手机首屏

- 本次任务：修复首页在短屏手机上一页内看不完当前历史卡、必须向下滑动才能看到完整资料和 `闯入这一刻` 的问题，同时保留时间轴与右侧相邻卡预览。
- 改了哪些文件：`src/styles/game.css`、`AGENTS.md`、`PROJECT_CONTEXT.md`。
- 改了什么：删除短屏下写死的 `78px + 72px + 728px` 首页三段高度，改为由动态视口高度共同分配品牌、时间轴和胶片剩余空间；场景图随可用高度在 236—378px 间变化，760px 以下统一使用 260px 场景并收紧纯装饰留白、年份轨和纸张内边距，完整地点、身份、抉择、时限继续以不低于 11px 的字号显示，朱砂主按钮仍与档案分离；首页自身禁止纵向滚动，横向相邻卡继续露出。
- 为什么这样改：用户进入产品后的第一件事是理解当前历史节点并开始游玩，首页主操作不能被固定海报高度推到首屏之外；适配应以实际可用高度和全 100 张卡中的最长文案为边界，而不是只针对一张短卡或单一 iPhone 画布。
- 影响了哪些模块：只影响首页胶片模式的响应式布局和长期产品约束，不改变网格浏览、历史数据、时间轴同步、开局状态、AI 请求、玩家正史、存档或 Sites Worker。项目目的、代码结构和关键入口没有变化，`PROJECT_CONTEXT.md` 第 1—3 节仍准确。真实浏览器逐张审计全部 100 张卡：360 × 667 与 375 × 667 的最长卡底部余量均为 35px，390 × 844 为 12px，430 × 932 为 66px；四档均无纵向或横向溢出，相邻卡分别可见约 28—51px。点击公元 690 年后，年份、活动节点和“武则天称帝前的最后一道诏书”同步，主按钮底部为 830 / 844px，控制台无错误或警告。首页定向测试 14/14、全量 Vitest 32 文件 347/347、TypeScript、97 个运行时文件可移植性、vinext 生产构建与 `git diff --check` 全部通过。

### 2026-07-28 13:41 - 主流手机一屏游玩与历史对照二级化

- 本次任务：把游玩主流程从单一 390 × 844 适配升级为主流手机动态视口适配，消除事件页常驻历史对照和生成草稿页固定顶部空白造成的首屏挤压，让正常长度事件、全部决定和关键按钮无需上下滑动即可完成。
- 改了哪些文件：`src/screens/{TimelineEventScreen,TimelineEventScreen.test,GeneratingScreen,GeneratingScreen.test}.tsx`、`src/styles.css`、`src/styles/game.css`、`app/layout.tsx`、`AGENTS.md`、`PROJECT_CONTEXT.md`。
- 改了什么：续幕的“你的时间线 / 正史原本 / 为何改变”和固定开场的真实历史切入口统一改为主页面紧凑按钮加底部二级阅读页，完整文本只在玩家主动打开时占用空间；事件页新增动态安全区、场景高度、覆盖量、选择行高和短屏密度规则；生成页在出现可读草稿后切换为 `generating-screen--draft`，把固定 96-112px 空白改成 10-26px 动态节奏并停止会制造滚动溢出的背景缩放；移动容器动态高度上限从 844 扩展到 932，metadata 开启 `viewport-fit=cover`。
- 为什么这样改：当前主流直板手机物理比例集中在约 19.5:9 到 20:9，但浏览器真实可用高度还会受地址栏、刘海和安全区影响，不能继续用一个固定 iPhone 13 画布推导所有布局。历史对照是解释性信息，不应与三项决定争抢主流程空间；生成页一旦已有可读内容，也不应继续为纯氛围保留大块空白。
- 影响了哪些模块：影响固定开场、DeepSeek 续幕、历史对照阅读、生成中草稿、场景完成确认、短屏与大屏安全区；不改变历史数据、AI 文本、玩家正史、选择语义、状态机、存档、请求协议或 Sites Worker。真实浏览器在 375 × 667、360 × 800、390 × 844、430 × 932 验证：事件页、续幕页与普通决定结果页主内容区均 `scrollHeight === clientHeight`，三项决定、直接改写、历史入口和按钮全部可见；真实 149 字左右生成场景在 375 × 667 内连同“下一步”和“放弃本局”完整显示。历史二级页完整显示三项对照。Vitest 32 个文件 347/347、TypeScript、97 个运行时文件可移植性、vinext 生产构建和 `git diff --check` 全部通过。

### 2026-07-28 13:12 - 修复 vinext 开发模式下游戏样式未加载

- 本次任务：修复本地最新版本首屏只显示基础黑色背景、默认白色年份按钮，完整胶片时间轴与历史海报样式没有生效的问题，并重新进行真实浏览器验收。
- 改了哪些文件：`app/layout.tsx`、`src/App.tsx`、`PROJECT_CONTEXT.md`。
- 改了什么：`app/layout.tsx` 继续只加载全站基础样式 `src/styles.css`；把 83KB 游戏视觉样式 `src/styles/game.css` 移到真实客户端入口 `src/App.tsx` 导入，使它随动态加载的游戏组件进入 vinext 开发模式的客户端资源链，同时在生产构建中继续由 bundler 正常收集。
- 为什么这样改：vinext 生产构建会合并 `layout.tsx` 中的两份全局 CSS，但本地 `vinext dev` 实际只注入第一份，导致 DOM、数据和基础色存在却丢失 703 条游戏规则。把游戏样式绑定到拥有这些 class 的客户端组件入口，可以让开发与生产都沿各自可靠的模块依赖加载样式，并避免依赖开发模式会漏掉的第二个布局级 CSS import。
- 影响了哪些模块：影响本地开发服务器的首屏历史选择器、时间轴、海报卡、设置按钮以及后续所有游戏界面的样式加载；不改变历史数据、组件结构、状态机、AI 请求、存档、Sites Worker 或产品视觉规范。真实浏览器确认首屏恢复连续时间轴、居中海报和相邻卡片预览，点击公元前 490 年后读数、活动节点、`2 / 100` 与“马拉松战役”同步；浏览器控制台无错误。Vitest 32 个文件 347/347、TypeScript、vinext 生产构建和 `git diff --check` 全部通过。

### 2026-07-25 11:41 - 将完整游戏迁入可公开分享的 Sites 托管架构

- 本次任务：把现有《哎！我改变了历史？》完整创建为可分享网站，不牺牲 100 卡浏览、固定第一幕、十二次决策、玩家正史、流式 AI、刷新恢复、配乐、双报告和 PNG 分享能力。
- 改了哪些文件：新增 `app/`、`worker/`、`build/`、`db/`、`drizzle/`、`.openai/hosting.json`、`vite.config.ts`、`vitest.config.mjs`、`next.config.ts` 与 `scripts/clean-build.mjs`；修改 `package.json`、`package-lock.json`、`tsconfig.json`、`.env.example`、`.gitignore`、`src/game/{deepseekProtocol,prompts}.ts`、`src/services/{deepseek,deepseek.test}.ts`、`src/soak/longRunSoak.soak.ts`、`vitest.soak.config.mjs`、`scripts/check-portability.mjs`、`README.md` 与 `PROJECT_CONTEXT.md`；删除旧 `vite.config.mjs`。
- 改了什么：在 vinext App Router 外壳中用真正 `ssr:false` 的 client-only 边界复用整个现有 React 游戏；把浏览器直连 DeepSeek 改成版本化同源协议，由 Worker 固定重建模型、流式 JSON、8192 token 与 thinking 参数并注入运行时 secret；原样透传 SSE、状态、`Retry-After` 和取消；新增 D1 分钟突发、匿名会话、IP 与全站日用量限制，硬额度 429 不再被客户端重复重试；Node soak 继续使用服务端变量直连官方端点；构建前强制清理旧 `dist`，避免历史 Vite bundle 把旧 Key 混入发布包。Sites 项目 ID 已固化在 `.openai/hosting.json`，访问模式设为公开，DeepSeek Key 与限额盐值只写入 Sites 生产环境 secret。普通回归的单用例超时提高到 15 秒，使完整十二幕 jsdom 路径在共享 CI 资源上不会因略超 5 秒被误判，同时不改变任何产品等待或网络时限。
- 为什么这样改：原纯前端结构在本地可用，但公开分享会让任何访问者从浏览器 bundle 读取并消耗 DeepSeek Key；直接让现有 Client Component 参与服务端预渲染又会撞上 `localStorage`、`navigator` 与 `document`。本次只替换托管边界与网络出口，既保护密钥和额度，也避免重写成熟状态机造成玩法回归。
- 影响了哪些模块：影响正式页面入口、构建与部署、DeepSeek transport、运行时密钥、用量保护、长测环境加载和维护文档；不改变历史牌库、固定开场、玩家正史、prompt 内容、schema、reducer、十二节点节奏、视觉、配乐、浏览器存档、双报告或导出交互。迁移后 32 个 Vitest 文件 347/347 通过，TypeScript、96 个运行时文件可移植性扫描、Sites 生产构建和 `git diff --check` 通过；`dist/server/index.js`、D1 migration、100 张历史 WebP、音频和 wordmark 全部存在，完整构建产物扫描确认没有真实 DeepSeek Key；本地 Worker 实测返回 200 SSE，并在完整响应结束前收到首个流式字节。

### 2026-07-19 16:42 - 三历史十二轮全自定义稳定性与提速验收

- 本次任务：按照真实玩家路径深度点击至少三个历史节点，并让每一轮都使用不同、开放且充满想象力的直接改写；以真实模型样本验证成功率至少 95%，同时保持或提升生成速度，达到门槛后提交最终产品代码。
- 改了哪些文件：`src/game/{prompts,prompts.test}.ts`、`src/soak/{longRunSoak.soak,soakCases,soakCases.test}.ts`、`README.md`、`AGENTS.md`、`design-qa.md` 与 `PROJECT_CONTEXT.md`；真实运行结果只保存在被忽略的 `tmp/soak/`。
- 改了什么：长测工具新增按 ID 选择历史、12/12 全自定义、可配置最低成功率与小批次强制延迟验收；测试素材以十二种行动基础和三种制度余波组合出 36 条互不重复的开放事实，覆盖纸鹤货币、风筝通信、镜面信号、公民粮仓、移动医院、女兵后勤、技术开源等方向。续幕提示增加提交前清单，显式复核三项 A/B/C、2-4 个历史锚点、时代地点、末句完整性与行动对象；世界报告增加 2026 生活细节和身后时代文案的留余量写作示例，减少超长后修复。
- 为什么这样改：三局最终成功不等于体验稳定。第一批虽然 3/3 通关，但 5/33 个续幕首答因漏字段、残句或时代地点触发修复，15.15% 高于门槛；用通用输出前复核解决结构漂移，比放松 schema、缩短玩家事实或为单一案例加特殊规则更符合产品稳定性。
- 影响了哪些模块：影响 DeepSeek 续幕与世界报告的提示协议、真实长局验收选择与统计；不改变玩家正史、客户端结构校验、十二节点玩法、100 张开局、界面、存档或报告字段契约。
- 浏览器实测：在 `http://127.0.0.1:4174/` 真实点击赤壁火攻、罗马大火与阿波罗 11 号，分别提交机关火船与女兵战马、镜面火光与获释奴隶消防军、会唱歌太阳能种子与导航代码开源三种复合事实；3/3 都逐字写入回执并生成完整第二幕，底部 `下一步` 可用。
- 最终长测：赤壁、罗马大火、阿波罗三局全部 12/12 完成，36/36 条自定义事实唯一且保留，33/33 个实时续幕成功，三份双报告完整，成功率 100%（门槛 95%）。续幕首答修复由 5/33 降为 0/33；续幕 P50/P90 为 13.77/17.21 秒，首段可读 P50/P90 为 3.64/4.57 秒，完整三局 P50 为 207.62 秒，较首批 219.84 秒快 5.6%，最慢结局由 161.47 秒降至 75.03 秒。强制成功率、延迟与修复率验收全部通过。

### 2026-07-19 15:50 - 以客户端权威正史取代正向词面判定

- 本次任务：排查玩家直接写入正史后持续落入“AI 返回的幕次结构仍不完整”的问题，并把最初针对“炸桥”措辞的局部补丁升级为适用于任意玩家自然语言的产品级机制。
- 改了哪些文件：`src/game/{engine,worldCanon,worldCanon.test}.ts`、`src/services/deepseek.test.ts`、`AGENTS.md`、`design-qa.md` 与 `PROJECT_CONTEXT.md`；诊断期间临时加入的开发日志已全部删除，没有进入最终代码。
- 改了什么：删除续幕解析中的正向语义门禁，以及为它服务的中文分词、二元词组、手工概念同义表和短字符信号规则。玩家原文继续逐字进入可见回执、不可撤销事实、三幕活跃命令、权威因果账本和模型请求；提示词继续要求模型显式推演它，但缺少相同关键词不再触发字段修复或终止。客户端仍拒绝带有事实锚点的明确否定，并继续执行结构、人物、时代和幕次校验。
- 为什么这样改：玩家可以输入无限种新事实，客户端无法凭字符重叠或有限同义词表可靠判断自然语言蕴含关系。用“桥 + 炸”解决一次截图，只会把相同误杀推迟到下一种表达；而玩家事实本就已经由客户端作为权威数据保存和注入，再用脆弱的文案匹配决定它是否成立，既重复又违背“玩家钦定”的产品契约。
- 影响了哪些模块：影响第 2-12 幕直接改写后的连续性验证与错误恢复触发条件；不改变玩家原文、活跃命令和因果账本的保存，不放松明确矛盾、无效结构、人物连续性、时代地点或结局契约。
- 真实浏览器验证：在 `http://127.0.0.1:4174/` 复用原失败存档；真实响应已经自然写出炸桥造成的车队改道。完整刷新后页面保留逐字玩家回执并进入 `现场已经写成 / 场景已经完成`，底部 `下一步` 完整可点，没有再进入错误页。
- 测试过程：以完全陌生的“蓝色纸鹤成为唯一合法货币”作为回归事实，旧实现预期 RED 并在三次请求后终止；通用修复后单次响应通过，原文同时保留在请求和权威账本。独立测试继续拒绝“蓝色纸鹤并未成为合法货币”的明确矛盾。完整 Vitest 31 文件 340/340 通过，TypeScript、83 个运行时文件可移植性扫描、Vite 生产构建和 `git diff --check` 全部通过；构建仅保留既有的 500kB chunk 提示。

### 2026-07-16 01:05 - 修复完整 AI 幕次被非正文字段字数上限误判

- 本次任务：针对玩家实际遇到的“AI 返回的幕次结构仍不完整”中断页，亲自续跑一局并追踪三段生成链路，修复完整幕次因为标题、地点、角色、因果说明、行动或即时回响稍长而被客户端误判失败的问题。
- 改了哪些文件：`src/game/{schema,schema.test}.ts`、`AGENTS.md`、`design-qa.md` 与 `PROJECT_CONTEXT.md`。
- 改了什么：移除所有 AI 幕次可见文本字段的客户端字符上限和本地裁短/摘句，包括标题、地点、角色、即时目标、时间压力、因果桥、世界变化、偏离证据、历史基线、历史锚点、选项文案、行动规格和即时回响；提示词仍负责引导精简。结构校验、完整句、条件句不得冒充既成事实、时代地点、A/B/C 完整性和正史连续性继续保留。`displayLabel` 只在能得到完整短语时做不超过 36 字的展示副本，否则保留全文并走显式确认；玩家直接改写 160 字上限与结局页 `2026，普通人的一天` 三条 12-18 字契约保持不变。
- 为什么这样改：上一轮只放开了 `narrative` 正文，但同一响应里的其他字段仍会被 18/24/36/48/54/160 字上限拒绝或在校验前静默改写。一个内容完整、结构正确的幕次只要某个附属字段稍长，就会依次经历主请求、字段补丁和高推理恢复；三次仍超长便错误落入截图中的终止页。字数应是模型写作目标，不是客户端判断历史是否成立的依据。
- 影响了哪些模块：影响第 2-12 幕 AI 响应的归一化、Zod 校验和 A/B/C 展示副本；不改变固定第一幕、玩家正史、请求重试次数、模型 token 上限、结局报告契约、100 卡首页或存档格式。
- 真实跑局：严格只跑一次，复用第 3 幕存档一路完成至第 12 幕和两页结局。第 4-12 幕九个延续场景均由主响应直接通过；结局的 2026 三条普通生活细节因每条超过 18 字先后触发主校验与字段补丁失败，最终高推理恢复成功。这证实模型会稳定返回语义完整但超出客户端写作目标的文本，也复现了同一类“三段校验”风险；本次没有开启第二局或压力测试。
- 测试过程：TDD 先得到 13 个预期失败，覆盖因果字段、历史基线、长角色/地点/标题、十句完整正文、选项标签/行动规格和即时回响被拒绝或裁短；修复后 `src/game/schema.test.ts` 97/97 通过，完整 Vitest 31 文件 340/340 通过。TypeScript、Vite 生产构建、83 个运行时文件可移植性扫描和 `git diff --check` 全部通过；构建仅保留既有的 500kB chunk 提示。
- Git 交付：本次修复已作为 `fix: accept complete timeline scene text` 推送到 GitHub `origin/main`。

### 2026-07-15 23:49 - 放开现场文案字数并保证确认页完整可滚动

- 本次任务：继续修复已完成场景确认页，保留提示词的 `80-180` 字目标，但取消客户端对 AI 现场正文的字符上下限；让任意完整正文和底部 `下一步` 始终可通过上下滑动抵达；将玩家直接改写从 80 字扩大到 160 字，并减轻弹层对背景的压暗。
- 改了哪些文件：`src/game/{limits,schema,schema.test,prompts,reducer,reducer.test,customCanon,fallbackTurn}.ts`、`src/screens/{GeneratingScreen.test,TimelineEventScreen,TimelineEventScreen.test}.tsx`、`src/styles/game.css`、`AGENTS.md`、`design-qa.md` 与 `PROJECT_CONTEXT.md`。
- 改了什么：新增单一 `CUSTOM_ACTION_MAX_LENGTH=160` 契约，UI `maxlength`/计数、状态机、Zod、正史回执、失败保护和模型契约全部共用；`narrative` 不再按 80/230 字做客户端拒绝，只继续校验完整句与结构；ready 确认页改为 `height:100% + min-height:0 + overflow-y:auto` 的真实视口内滚动层，按钮仍在正文后的正常文档流；自定义弹层遮罩由 72% 降至 50%，上投影由 45% 降至 32%。
- 为什么这样改：原实现把提示词目标误做成了客户端硬门槛，同时确认页虽然写了 `overflow-y:auto`，但自身高度随内容增长并被固定高度外壳裁掉，实际没有滚动差值；80 字还被六处重复常量约束，容易再次漂移。现在“模型尽量简洁”和“客户端完整保留”分离，长内容通过滚动解决而不是截断或拒绝。
- 影响了哪些模块：影响第 2-12 幕 AI 现场正文的校验与确认页展示、直接改写输入和正史保存，以及自定义弹层视觉；不改变固定开场、玩家正史不可撤销语义、选项提交、模型输出 token 上限、100 卡首页或两页结局。
- 浏览器验证：真实 390 × 844、现有 198 字场景下，ready 容器严格为 844px，`scrollHeight=916`、最大滚动 72px、`overflow-y=auto`；滚到底后 `下一步` 位于 y=703.9..747.9，完整可点。弹层实测 `maxlength=160`、计数 `160/160`、按钮可提交，遮罩为 `rgba(0,0,0,.5)`、阴影为 32%。只复用现有存档并揭示已生成场景，没有启动新游戏或新模型请求。
- 自动验证：31 个 Vitest 文件 340/340 通过；TypeScript、Vite 生产构建、83 个运行时文件可移植性扫描和 `git diff --check` 全部通过。构建仅保留既有的 500kB chunk 提示。

### 2026-07-15 22:14 - 压缩已完成场景确认页的两处无效留白

- 本次任务：按用户截图移除“下一幕”确认页顶部整块空白，并将玩家改写回执与新场景之间的空白严格压缩一半，确保 390 × 844 下方 `下一步` 按钮无需先滚动即可点击。
- 改了哪些文件：`src/screens/{GeneratingScreen,GeneratingScreen.test}.tsx`、`src/styles/game.css`、`AGENTS.md`、`design-qa.md` 与 `PROJECT_CONTEXT.md`。
- 改了什么：仅在 `ready` 场景增加 `generating-screen--ready` 状态类，将确认页顶部 padding 从 72px 调为 0；`developing-draft--with-canon` 的 margin-top 从 68px 调为 34px。生成进行中的状态不使用 ready 类，因此原有加载动效和呼吸空间保持不变。回归测试同时锁定 ready 状态类、玩家正史回执层和两个精确间距契约。
- 为什么这样改：两处用户框选空白分别由固定的 72px 上内边距与 68px 上外边距直接造成，共把底部确认按钮向下推了 140px。按要求移除第一处并减半第二处后，整页有效内容上移 106px，而不是缩小正文或浮动覆盖按钮。
- 影响了哪些模块：只影响已校验场景的生成确认页垂直排布；不改变生成中的加载页、AI 文案、玩家正史、下一步逻辑、事件页、存档或模型请求。
- 浏览器验证：在真实 390 × 844 页面中，顶部间距为 0、第二间距为 34px，`下一步` 位于 y=791.9..835.9，完整落在 844px 视口内且可直接点击；页面没有通过裁切或浮动隐藏正文。
- 自动验证：31 个 Vitest 文件 338/338 通过，TypeScript、Vite 生产构建、82 个运行时文件可移植性扫描和 `git diff --check` 全部通过；构建仅保留既有的 500kB chunk 提示。本次只验证当前确认页，没有启动新的十二节点真实游戏或 `test:soak`。

### 2026-07-15 21:24 - 修复桌面容器撑宽与时间轴切卡错位

- 本次任务：深挖用户截图中“时间轴有年份但卡片区空白”和“当前年份已切换、画面仍停在其他暗卡”的真实原因，并修复、回归验证后发布。
- 改了哪些文件：`src/screens/{SeedPickerScreen,SeedPickerScreen.test}.tsx`、`src/styles/game.css`、`AGENTS.md`、`design-qa.md` 与 `PROJECT_CONTEXT.md`。
- 改了什么：胶片卡宽与首尾居中空隙改为相对 390px 产品容器计算，不再用外层浏览器的 `vw/100vw`；卡片本体继续保持 390px 下 294px、320px 下 252px，首尾通过 margin 居中并保留邻卡预览。时间轴点击与上下文恢复改为根据目标卡真实 `offsetLeft/clientWidth` 求居中位置，并使用原子滚动，避免活动节点先切换、卡片仍在长距离平滑移动的中间态；手势滚动继续按实测卡距同步年份。
- 为什么这样改：桌面浏览器虽然只展示 390px 产品壳，旧公式却按整个浏览器视口计算左右 padding，最小内容宽度被撑到 986px 后再被外壳裁掉；与此同时，平滑滚动先更新 active seed，造成“年份是 9 年，眼前却仍是前面几张暗卡”的可见状态撕裂。两者叠加正好复现用户的两张截图。
- 影响了哪些模块：只影响历史选择器胶片模式的响应式横向几何、时间轴点击定位和卡片手势同步；不影响卡片数据、网格筛选、设置菜单、固定开场、DeepSeek、存档、结局或导出。
- 浏览器验证：桌面 718px 外层中，产品壳、时间轴与轮播均严格为 390px，文档无横向溢出；点击 `公元 9 年` 后 `王莽建新` 立即成为第 12 张活动卡，卡片中心与轮播中心差为 0，`scrollLeft=3366`。390 × 844 下主卡为 294px 且 x=48..342；320 × 700 下主卡为 252px、水平居中、无横向溢出，选择页 `scrollHeight=878` 可正常纵向浏览到底部入口。
- 自动验证：新增容器实测偏移与原子跳转回归；31 个 Vitest 文件 337/337 通过，TypeScript、Vite 生产构建、82 个运行时文件可移植性扫描和 `git diff --check` 全部通过。构建仅保留既有的 500kB chunk 提示，不影响成功。本次仅测试首页浏览与切卡，没有启动新的十二节点真实游戏或 `test:soak`。

### 2026-07-15 20:38 - 将胶片首页收敛为长时间轴与一体化档案海报

- 本次任务：继续以用户指定的手游档案海报图为视觉真相，修复上一版时间轴过短/点线错位，以及场景和信息纸被看成“上方大方块 + 下方小方块”的核心问题；只改胶片首页设计，保持 100 卡数据、网格、设置和游戏逻辑不变。
- 改了哪些文件：`src/components/HistoryCard.tsx`、`src/screens/{SeedPickerScreen,SeedPickerScreen.test}.tsx`、`src/styles/game.css`、`public/assets/picker/{dossier-ragged-v3,action-slab-v3}.png`、`design/captures/2026-07-15-picker-poster-v2-*.png`、`design-qa.md`、`AGENTS.md`、`docs/superpowers/{specs,plans}/2026-07-15-picker-poster-fidelity-v2*` 与 `PROJECT_CONTEXT.md`。
- 改了什么：时间轴改成横跨手机中部的独立连续轴线，节点不再各自拼线；390px 下轴长 326px，活动点与轴中心都严格落在 y=122px，年份独占轴下行。历史卡增加 `history-card__poster-stack`，场景与毛边信息纸同为 294px 宽，信息纸向上压住场景 26px 并以 212px 最小高度自然随内容增长；场景高 378px、年份书脊宽 50px、主行动为 280 × 68px。轮播高度扩大到 728px，保证 100 张卡中最长内容也不被轮播自己的纵向边界裁切。
- ImageGen 资产：内置 ImageGen 使用 `stylized-concept` 模式。信息纸最终提示词为“正面平铺、暖象牙色空白档案纸、撕裂毛边、纤维折痕和克制污痕、中心保持安静可读，纯 #00ff00 色键背景，无文字/符号/UI/物体/阴影”；按钮最终提示词为“正面平铺的长条朱砂牌、染纸或薄漆木质感、磨损崩边、暗角、细纤维与金色内框、中心留给暖白中文，纯 #00ff00 色键背景，无文字/箭头/UI/人物/物体/水印”。两张图均经 soft matte、despill 和 alpha trim 后写入项目。
- 为什么这样改：历史首页的首要任务是让玩家把“年代、事件、身份、抉择、进入动作”读成一张完整海报。时间轴必须是一条稳定导航基线，信息纸必须属于场景而不是另起一个缩窄卡片；材质层由真实光栅资产承担，动态内容仍由 React 渲染，兼顾风格、清晰度和功能稳定性。
- 影响了哪些模块：仅历史选择器胶片模式的时间轴 DOM、卡片结构、响应式几何、两张视觉材质和相关结构测试；不影响 100 张历史卡内容、筛选网格、当前节点同步、音频、固定开场、DeepSeek、存档、报告或导出。
- 视觉验证：真实内置浏览器在 390 × 844 捕获最终首页，并与指定参考图归一后放入 `design/captures/2026-07-15-picker-poster-v2-comparison.png`；焦点对照见 `...-focus.png`。390/360/350/320px 均无横向溢出，点线中心完全重合，所有 dossier 无溢出、100 张本地图零失败；320 × 700 正常纵向滚动后主按钮位于 y=550..618，完整可达。浏览器控制台 0 error / 0 warning，无 P0/P1/P2 遗留。
- 自动验证：31 个 Vitest 文件 336/336 通过；TypeScript、Vite 生产构建、82 个运行时文件可移植性扫描和 `git diff --check` 全部通过。构建只有既有的 500kB chunk 提示，不影响成功。本次没有再启动真实 12 节点游戏或 `test:soak`。

### 2026-07-15 17:36 - 按选定参考图重做历史海报卡并完成真实跑局

- 本次任务：以用户指定的第三张手游参考图为唯一视觉基准，不折不扣修复上一版卡片层级、材质、可读性、邻卡预览、计数遮挡、主按钮弱化和短屏入口被裁切等问题，同时保留后来确认的同步时间轴与单一设置二级菜单。
- 改了哪些文件：`src/components/HistoryCard.tsx`、`src/screens/{SeedPickerScreen,SeedPickerScreen.test}.tsx`、`src/styles/game.css`、`public/assets/picker/{archive-stage-v2,dossier-paper-v2,vermilion-cloth-v2}.webp`、`design/captures/2026-07-15-picker-*.png`、`design-qa.md`、`AGENTS.md`、`docs/superpowers/plans/2026-07-15-mobile-picker-fidelity-repair.md` 与 `PROJECT_CONTEXT.md`。
- 改了什么：使用 ImageGen 生成无文字、无 UI 的煤黑档案舞台、暖象牙旧纸和深朱砂材质；胶片卡拆成独立场景、竖排年代、卡序计数、纸质信息单和独立朱砂行动五层，地点/身份/抉择/时限不再叠在第二张背景图上；卡序移到纸层上方，`闯入这一刻` 改为 68px 独立主按钮；相邻卡保持暗化预览。公元后的月日/季节细节不再被年份解析丢弃，历史日期也改用普通文本容器而非无效机器日期；设置键严格恢复为 44px，二级菜单支持自动聚焦、方向键、Home/End、Escape 回焦以及 Tab/Shift+Tab 离开时自动收起；时间提示、节点年份与日期细节均不低于 11px。320–390px 宽度使用自适应卡宽与窄屏信息单高度，700px 短屏保留正常文档流滚动，保证各窄度主按钮完整可达。结构测试新增单图、年代拆分、精确日期、计数、dossier/action 兄弟层级、完整四行事实和菜单键盘操作断言。
- 为什么这样改：手机首页的第一任务是让玩家一眼读懂“哪个历史瞬间、我是谁、必须做什么、从哪里开始”。场景、年代、任务简报和行动必须形成清楚的物理层级，不能再把不相关图片压在文字后面，也不能为了塞进首屏隐藏内容或牺牲入口可达性。
- 影响了哪些模块：历史选择器的胶片卡结构、移动端高度与滚动、生成材质资产、设置与网格视觉验收、可访问名称和结构回归测试；不改变 100 张历史数据、当前节点同步、筛选逻辑、固定第一幕、DeepSeek 协议、存档或两页结局。
- 视觉验证：真实内置浏览器在相同 `马拉松战役 / 公元前 490 年` 状态以 390 × 844 截图，并与参考图放入同一张 `design/captures/2026-07-15-picker-fidelity-comparison.png` 检查；设置菜单和两列网格分别有独立截图。100/100 张卡的 card、dossier、facts、action 和精确日期均无纵向裁切；390/360/350/320px 下下一张卡均露出 24.6–25.9px，页面水平溢出均为 0；390/360/350/320 × 700 短屏滚到底后主按钮均完整可见，底部分别留 7/16/16/16px 安全距离。
- 真实体验：严格只新开一局 `周平王东迁`，完成 12/12 个决定，覆盖一次长决定完整确认、11 个 DeepSeek 续幕、主角死亡、《许闻列传》和独立的 `九鼎归秦` 2026 报告；随后用“再改一次历史”清除测试局并恢复 100 卡胶片首页，没有启动第二局或 `test:soak`。
- 自动验证：31 个 Vitest 文件 336/336 通过；TypeScript、Vite 生产构建、82 个运行时文件可移植性扫描与 `git diff --check` 全部通过。构建只有 515.82kB chunk 提示，不影响成功。

### 2026-07-15 14:07 - 手游化历史首页与设置二级菜单

- 本次任务：采用第三套 ImageGen 手游首页方向重做历史选择器，保留原有同步时间轴，并把胶片、表格和声音三个顶部控制收进一个设置二级菜单。
- 改了哪些文件：`src/screens/{SeedPickerScreen,SeedPickerScreen.test}.tsx`、`src/components/HistoryCard.tsx`、`src/{App,App.integration.test}.tsx`、`src/styles/game.css`、`AGENTS.md`、`design-qa.md`、`docs/superpowers/plans/2026-07-15-mobile-picker-settings-redesign.md` 与 `PROJECT_CONTEXT.md`。
- 改了什么：选择页顶部继续使用项目自有艺术字，但右侧仅保留一个 44px 设置按钮；菜单以可访问的单选/复选语义承接胶片、表格和声音，支持 Escape 与外部点击关闭，模式切换继续复用 `PickerContext`，不会替换当前节点或筛选。胶片卡改成大幅历史图、朱红竖向日期、重叠新闻纸信息层、地点/身份/抉择/时限四行完整简报与底部主行动；时间轴仍位于标题和卡片之间，右侧继续露出下一张卡。表格页压缩搜索、筛选和卡片留白，提高两列浏览密度。选择阶段不再渲染独立悬浮声音键，游戏阶段的声音入口保持原样。
- 为什么这样改：手机游戏首页首先应让玩家看清“正在闯入哪个时刻”和“按下后要做什么”，模式与音频属于低频偏好，不应与主内容争夺首屏空间；单一设置入口降低顶部噪声，同时保持胶片、表格、声音功能完整可达。
- 影响了哪些模块：历史选择页品牌区、时间轴下方胶片卡、两列浏览密度、选择阶段音频入口、浏览模式可访问语义与相关回归测试；不影响 100 张历史数据、固定第一幕、游戏状态机、DeepSeek 请求、存档或两页结局。
- 验证：31 个 Vitest 文件共 334/334 通过，TypeScript、Vite 生产构建、82 个运行时文件可移植性扫描和 `git diff --check` 全部通过。已观察设置菜单与卡片结构测试按 TDD 先 RED 后 GREEN。本地浏览器自动采集受 URL 安全策略阻止，且策略禁止改用其他浏览器表面绕过，因此本次 390 × 844 视觉对照在 `design-qa.md` 中如实标记为 blocked，未虚构浏览器截图或控制台结论。
- 核查：项目定位、代码结构与关键入口仍与当前实现一致，仅“选择器顶部控制形态”由三个并列入口调整为设置二级菜单，无需改写前三节。

### 2026-07-15 01:49 - 下架旧 v13 现代中国存档并收紧苏伊士固定第一幕

- 本次任务：修复最终审查发现的两个遗留边界：已移除的 1949/1978 中国节点仍可能从当前 v13 存档恢复，以及苏伊士运河国有化固定开场的即时目标和 A 行动未保持同一条完整精简命令。
- 改了哪些文件：`src/services/{storage,storage.test}.ts`、`src/data/{historySeeds,historySeeds.test,fixedOpenings.test}.ts`、`.superpowers/sdd/final-fix-report.md` 与 `PROJECT_CONTEXT.md`。
- 改了什么：存储层从当前 `HISTORY_SEEDS` 建立现役 ID 集，v13 envelope 校验通过后若场景指向已下架 ID，立即删除当前 key 并保留 `nextRequestId` 回到干净选择页；苏伊士决策精简为“是否在纳赛尔广播时同步发出运河公司立即接管密令”，并用精确断言锁定 seed、固定开场即时目标和 A 行动。
- 为什么这样改：内容下架必须同时覆盖新牌库和已落盘的旧会话，否则用户刷新后仍会进入已删除节点；固定第一幕的核心命令必须在移动端紧凑展示与完整行动语义之间保持一致。
- 影响了哪些模块：仅影响当前 v13 存档的场景恢复边界、苏伊士卡片决策文案与固定第一幕回归测试；不升级存储版本，不改通用固定开场构建逻辑，不影响现役节点存档、模型请求或界面结构。
- 核查：已重新确认第 1-3 节的项目定位、代码结构和关键入口仍与当前实现一致，无需改写。
- 验证：指定 3 个 Vitest 文件共 40/40 通过，TypeScript 和 `git diff --check` 通过；两组回归都先观察到预期 RED 再进入 GREEN。

### 2026-07-15 01:26 - 移除 1949 年及以后中国节点并调整为 58/42 牌库

- 本次任务：在保持 100 张固定牌库、双浏览模式和完整游戏流程不变的前提下，移除两张 1949 年及以后中国节点，并建立长期内容边界：所有中国节点都必须早于 1949 年，不收录以中国共产党、中华人民共和国或“新中国”为主题的政治题材，苏联史仍作为世界史保留。
- 改了哪些文件：`src/data/{historySeeds,historySeeds.test,fixedOpenings.test}.ts`、`src/services/{storage,storage.test}.ts`、`scripts/fetch-history-images.mjs`、`public/assets/history/{manifest.json,CREDITS.md,suez-nationalization-1956.webp,web-public-domain-1993.webp}`，删除 `public/assets/history/{prc-founded-1949.webp,reform-opening-1978.webp}`，并更新 `AGENTS.md`、`README.md`、`PROJECT_CONTEXT.md` 与 `docs/superpowers/specs/2026-07-15-remove-post-1949-china-design.md`。
- 改了什么：牌库从中国 60 / 世界 40 调整为中国 58 / 世界 42；删除“新中国成立”和“改革开放决策”，新增“苏伊士运河国有化”和“万维网免费开放”；同步更新数据回归约束、本地图片与来源清单、固定首幕完整行动断言，以及产品规则、公开说明和项目上下文。CERN 节点最终采用“负责起草万维网开放声明的授权主管”角色，并以送交两位主任共同签署且当日发布为完整行动杠杆；苏伊士固定第一幕完整保留“广播时同步接管”。恢复 v13 存档时会校验当前牌库，命中任意已退役 seed ID 就删除旧局并回到选择页，避免旧节点通过本地存档重新出现。
- 为什么这样改：公开体验需要从数据源、资产、测试和长期文档同时排除明确不再允许的现代中国政治内容；用普通中国玩家熟悉的去殖民化与互联网开放节点补位，可以保持 100 张牌库规模、年代跨度和题材多样性，同时不误删苏联等允许的世界史。
- 影响了哪些模块：历史卡牌数据与地域计数、固定第一幕、当前版本存档恢复、图片抓取与运行时本地资产、来源授权清单、内容防回归测试、README 产品说明、长期产品规则和项目交接上下文；不改变选择器交互、模型协议、存档结构或正常游戏流程。
- 验证：31 个 Vitest 文件共 332/332 通过，TypeScript、Vite 生产构建、82 个运行时文件可移植性扫描、100 条图片 manifest / 100 张本地 WebP 集合校验、运行时敏感题材零命中扫描及 `git diff --check` 全部通过。390 × 844 真实浏览器验证网格为 100 个结果、中国 58、世界 42；两张新卡搜索均为 1 个结果且图片分别以 900 × 648、900 × 675 完整加载，两个旧题材搜索均为 0，控制台 0 error / 0 warning。本次未进入游戏，因此没有触发新的 DeepSeek 真实生成。

### 2026-07-15 00:21 - 历史选择页艺术字品牌与统一工具栏

- 本次任务：只调整首屏历史选择器的前端设计，放大游戏品牌、移除旧引导副标题，并重新整理胶片、网格和声音三个控制键。
- 改了哪些文件：`public/assets/brand/history-wordmark.png`、`src/screens/{SeedPickerScreen,SeedPickerScreen.test}.tsx`、`src/{App,App.integration.test}.tsx`、`src/styles/game.css`、`design/captures/2026-07-15-picker-header-*.png`、`design-qa.md`、`AGENTS.md` 及本次 Superpowers 规格与实施计划。
- 改了什么：使用 ImageGen 生成精确文字为“哎！我改变了历史？”的单行行书艺术字，以透明 PNG 作为项目自有品牌资产；标题保留可访问名称但不再显示小号文本和“选择你要闯入的瞬间”；右侧胶片/网格分段切换与声音按钮统一为 44px 高、8px 间距、同一边框和圆角体系，390px 视口保持一行且无横向溢出；声音按钮只在选择页加入共享工具栏样式，其他游戏阶段保持原设计。
- 为什么这样改：玩家进入产品时首先需要识别游戏品牌，而不是先读一条重复的操作说明；三枚等高、同基线的工具键能把浏览模式和声音明确组织为同一组全局控制，减少视觉噪声，同时保留既有煤黑、新闻纸、朱砂红和黄色体系。
- 影响了哪些模块：历史选择页顶部品牌区、浏览模式入口、选择页声音入口、移动端首屏高度分配、可访问名称和相关回归测试；没有改历史数据、游戏规则、生成流程或报告内容。
- 验证：390 × 844 真实浏览器测得品牌图 210 × 48.65px，模式组 88 × 44px且内部两个按钮均为完整的 44 × 44px，声音键为 44 × 44px；模式组与声音键同基线且间距 8px，页面横向溢出为 0，旧副标题不存在，胶片/网格可切换，浏览器控制台 0 错误、0 警告。31 个 Vitest 文件共 320 项、TypeScript、Vite 生产构建、82 个运行时文件可移植性检查和 `git diff --check` 全部通过。

### 2026-07-14 23:52 - 分离事件正文生成目标与客户端容错上限

- 本次任务：修复 DeepSeek 流式草稿起初显示完整、校验后却被客户端截掉尾文的问题；将模型目标控制在 180 字内，同时给真实输出保留到 230 字的容错空间，并让生成完成页可下滑阅读后再确认。
- 改了哪些文件：`src/game/{prompts,schema}.ts` 及对应测试、`src/screens/{GeneratingScreen,TimelineEventScreen}.test.tsx`、`src/styles/game.css`、`AGENTS.md`、`docs/superpowers/{specs,plans}/2026-07-14-complete-event-narrative*` 与 `PROJECT_CONTEXT.md`。
- 改了什么：静态提示词把 `narrative` 目标由 80—160 改为 80—180；运行时和兼容存档 schema 按 Unicode 字符计数接收完整正文至 230 字；删除 `trimNarrative` 及其 160 字静默切片，181—230 字原样保存，231 字以上、无终止标点或以条件残句收尾都进入既有字段修复；生成卡禁止 flex 收缩，页面保持纵向滚动，`下一步` 固定在正文与地点身份之后的普通文档流；事件页内容层在 181—230 字正文造成高度溢出时也可纵向滚动，保证正文、行动和历史对照都不被裁掉。
- 为什么这样改：180 是约束模型简洁写作的目标，不应成为客户端删改模型原文的刀口；230 是应对模型小幅越界的稳定性缓冲。只有超过真实安全边界或句子不完整时才应请求模型重写，客户端不能在用户看到草稿后悄悄砍字。
- 影响了哪些模块：DeepSeek 续幕静态协议、结构化校验与字段修复、存档兼容、生成完成页阅读和下一步确认、产品长期约束与回归测试。
- 验证：31 个 Vitest 文件共 318 项、TypeScript、Vite 生产构建、82 个运行时文件可移植性检查和 `git diff --check` 全部通过；边界测试证明 230 个 Unicode 字符逐字保留、231 字拒绝、无标点半句和带句号的条件残句均拒绝。按要求只执行一次真实 DeepSeek 体验：周平王东迁第一幕选择后成功生成 160 字三日续幕，完整正文与底部 `下一步` 同时存在，运行态 `overflow-y: auto`，没有再次触发真实生成。

### 2026-07-14 20:42 - 合并一百节点功能版到 main 并保留稳定性能力

- 本次任务：对比本地 `main` 与 `codex/history-100-grid-reports-save`，将功能分支合并进 `main`，形成可推送到 GitHub 的新版本。
- 改了哪些文件：合并功能分支涉及的历史数据、100 张图片资产、双模式选择器、结局报告、图片保存、对应测试与产品文档；重点手工收敛 `src/game/{prompts,schema}.ts`、`src/services/share.ts`、`src/screens/AlternatePresentScreen.test.tsx`、`src/test/fixtures.ts`、`AGENTS.md` 与 `PROJECT_CONTEXT.md`。
- 改了什么：完整合入 100 个历史节点、中国 60 / 世界 40、两列筛选网格、紧凑 2026 报告及跨端高清保存；同时保留 `main` 原有的下一幕手动揭晓、完整报告不截断、中文完整句校验、长决定正史与刷新恢复。合并后的 2026 生活细节同时满足 12—18 字、终止标点与语义完整三项约束；报告保存继续按完整滚动尺寸 2x 渲染，移动端采用系统分享面板并保留 PNG 后备，桌面端直接下载。
- 为什么这样改：目标分支的稳定性修复和功能分支的产品扩展都属于新版本的必要组成，不能通过简单选边覆盖其中一套；合并必须让新浏览能力不破坏既有游戏连续性、报告完整性与保存可靠性。
- 影响了哪些模块：历史牌库与图片、选择器状态和筛选、DeepSeek 结局协议与 schema、结局阅读和保存、测试夹具、项目文档及发布分支状态。
- 验证：31 个 Vitest 文件共 315 项全部通过，TypeScript、Vite 生产构建、82 个运行时文件可移植性扫描与 `git diff --check` 通过。真实浏览器确认胶片为 100 / 100、网格为 100 个结果、搜索“改革开放”为 1 个结果、地域“中国”为 60 个结果；先在胶片定位 1991，再切换网格并返回胶片后仍保持公元 1991 年与 100 / 100，控制台无错误。遵守用户限制，本次合并没有再次运行真实 DeepSeek 长局。

### 2026-07-14 20:11 - 一百节点、双模式浏览、2026 报告与跨端保存

- 本次任务：把历史入口从 50 扩展到 100，并新增共享当前节点的两列网格浏览、组合筛选；同时让 2026 普通生活成为紧凑自然段，放大报告文字并去掉表格式空白，完善两页报告在移动端与桌面端的完整高清保存。
- 改了哪些文件：`src/data/{historySeeds,historyCatalog,fixedOpenings}.ts`、`src/components/{HistoryGridCard,ResultFrontPage}.tsx`、`src/screens/{SeedPickerScreen,AlternatePresentScreen}.tsx`、`src/services/share.ts`、`src/game/{prompts,schema}.ts`、`src/App.tsx`、`src/styles/game.css` 及对应测试；`scripts/fetch-history-images.mjs`、`scripts/history-image-policy.mjs`、`public/assets/history/` 与图片来源清单；`AGENTS.md`、`README.md`、`design-qa.md` 和 Superpowers 规格/计划。
- 改了什么：牌库固定为中国 60 / 世界 40，100 张卡都有独立本地 WebP、来源和固定第一幕；模式 A 保留横向时间胶片，模式 B 提供两列网格、关键词、年代、地域和政治/军事/经济/科技/文化筛选，两种模式与退出后共享同一当前节点；2026 三条生活细节改为一个 `；` 连接的自然段，模型生成约束收紧到每条 12—18 字完整短句，完整报告文案不再本地切片；报告时代列改为 `24px 82px minmax(0,1fr)`，正文不低于 11px、尾声与分享句 14px；导出按实际滚动宽高 2x 渲染，桌面下载 PNG，移动端先准备图片再通过第二次点击打开系统分享面板，并保留下载后备和完整 URL 回收。
- 为什么这样改：玩家首先需要快速找到自己熟悉、真正想改变的历史节点，并在两种浏览密度之间无成本切换；最终报告必须先可读、再可保存，不能靠微型字号、空白表格或截断内容凑进一屏。Web 浏览器没有跨平台统一的相册写入权限，因此移动端采用符合用户激活要求的系统面板，而不做无法兑现的“静默直存相册”承诺。
- 影响了哪些模块：历史数据与图片资产、固定开场、选择器上下文与筛选、最终报告生成契约和 schema 修复、报告布局、移动分享与桌面下载、可访问性、项目文档和跨平台构建。
- 验证：100 张节点满足中国 60 / 世界 40，100 张 WebP 哈希唯一且来源信息完整；全量 Vitest 258/258、TypeScript、生产构建、82 个运行时文件可移植性扫描和 `git diff --check` 通过。390 × 844 真实浏览器验证 100/100 图片、两列网格、组合筛选与空态、1991 节点 A→B→A 保持、44px 时间按钮、三条 17 字生活细节稳定为两行及零控制台错误；桌面实际下载 780 × 1482 的 2026 PNG 和 780 × 2448 的完整列传 PNG，移动模拟验证准备态、系统面板失败后备与 PNG 下载。按用户要求只跑一次真实 DeepSeek 长局：赤壁开局 12/12 节点、5 条唯一直接改写和双报告全部完成，用时 218.01 秒，11 个续幕及 2 个结局请求均首答成功，0 人工重试、0 无效输出/修复、0 本地场景或结局兜底；该局发现的 24—31 字生活细节随后改为 schema 强制 12—18 字并以自动化边界测试收口，没有再跑第二局。最终整体验收细节见 `design-qa.md` 本版本条目。

### 2026-07-14 19:30 - 手动揭晓下一幕并彻底消除 2026 报告截断

- 本次任务：解决下一幕刚生成完便自动跳转、打断玩家阅读的问题，并定位“被改变的 2026”多段文字生成到半句即结束的根因。
- 改了哪些文件：`src/game/{reducer,schema,prompts}.ts`、`src/hooks/useGame.ts`、`src/services/{storage,share}.ts`、`src/screens/GeneratingScreen.tsx`、`src/components/ChoiceList.tsx`、`src/App.tsx`、`src/styles/game.css`、生成流程、报告、存档和导出相关测试、`AGENTS.md` 与 `PROJECT_CONTEXT.md`。
- 改了什么：生成完成后先把严格校验通过的幕次保存为 `pendingTurn`，等待页完整展示场景并出现“下一步”，只有玩家点击才进入事件页；普通 A/B/C 在结果页提前预生成完成时也不能绕过确认，等待确认期间刷新会恢复同一幕。删除 2026 报告四类文案的本地硬截断，时代叙事、继承结果、三条普通生活与尾声都必须以完整句结束；失败只触发对应根字段的 AI 修复。提示词继续要求简洁，但报告 schema 不再静默裁字；旧存档若已经保存半句或超出新显示上限的报告，会完整保留十二次决定并只重新生成结局。报告导出按完整滚动宽高展开，不再只保存手机当前可见区域；因果桥与架空状态等短扫描文案只从模型原文中选择独立完整分句或删除不改变事实的时态赘词，条件从句不能被当成已发生结果，无法安全收紧时仍请求字段修复。A/B/C 的完整 `label` 永远作为正史保存，36 字内 `displayLabel` 只负责移动端展示；长决定首次点击会先展示完整原文并要求确认，无法可靠生成短标题时直接修复该字段。中文完整句校验改为基于 `Intl.Segmenter` 的词级上下文：依赖从句必须拥有独立主句，只拦截高置信度残缺的 `把/将` 结构，同时不会误伤“法案通过、晋升上将、毕生志向、两派火并”等完整表达，也不会用有限动词表拒绝生僻但完整的历史文案。
- 为什么这样改：完成生成不等于玩家已经读完，页面节奏必须由玩家掌控；2026 文案缺字的根因不是当前 CSS，而是 schema 在渲染前用固定字符数切断了模型原文。完整性应由模型约束与字段修复保证，不能以静默裁字换取版面整齐。
- 影响了哪些模块：续幕状态机、A/B/C 预生成竞态与正史写入、等待页交互、刷新恢复、本地存档兼容、DeepSeek 结局协议、2026 报告校验、移动端报告阅读与高清图片导出。
- 验证：26 个 Vitest 文件共 249 项、TypeScript、生产构建和 73 个运行时文件的跨平台扫描全部通过；390 x 844 真实浏览器中，普通 A 选项在结果页提前生成完成后，点击“看看接下来”仍停在完整场景页，等待 4 秒后状态保持 `generating`，刷新后仍为同一场景，点击“下一步”才进入第 2 节点，页面 `844 === 844` 无滚动。长于旧上限的 2026 时代叙事、继承结果、生活细节与 200 字尾声均原文完整，段落 `overflow: visible`，报告区以 `741/820px` 正常滚动。最终代码结构的真实模型抽样 `manual-reveal-canonical-label-smoke` 为 3/3 完整通关、33 个实时续幕、14 次全局唯一直接改写、首答字段修复率 6.06%、0 次人工重试；此前完整十局批次 `manual-reveal-complete-report-release` 为 10/10 通关、110 个实时续幕和 45 次直接改写。最后一次重复十局实测按用户要求中止，没有把未完成批次计入验收结果。

### 2026-07-14 13:40 - 现场扫码版生成加速、玩家正史强化与十局验收

- 本次任务：在不减少十二次决定、不使用本地假剧情、不牺牲历史锚点与行动质量的前提下，显著缩短现场扫码玩家每幕等待；同时让玩家直接改写成为无需 AI 审批、说一不二的既成事实，并提高 DeepSeek 短时 429/503/断网时的恢复能力。
- 改了哪些文件：`src/services/deepseek.ts`、`src/game/{engine,prompts,schema,reducer,worldCanon}.ts`、`src/hooks/useGame.ts`、`src/screens/GeneratingScreen.tsx`、`src/data/fixedOpenings.ts`、`src/styles/game.css` 及对应测试；删除未使用的 `WorldMetrics` 与固定题材路由；扩展 `src/soak/`；新增 `docs/superpowers/{specs,plans}/2026-07-14-live-event-latency.md`；更新 `AGENTS.md`、依赖与存储版本。
- 改了什么：普通续幕改为 V4 Flash 非思考流式快路径，字段修复也走快路径，只有失败恢复和并发双结局使用高推理；SSE 在完整 JSON 校验前即可展示已闭合的标题与前情；稳定静态协议前缀复用 DeepSeek 上下文缓存。直接改写在 reducer 内同步逐字写入权威正史，不再发起单独裁决请求；最新玩家事实被顶层注入下一幕并做矛盾/可见兑现校验。结构校验只补失败根字段，完整短角色名与回响参与方不再因 24 字硬阈值浪费整次请求。429、5xx 与网络故障增加最多两次带抖动的指数退避并支持有界 `Retry-After`。第 4 幕后允许提及开场事件作为因果来源，但标题、目标、身份和当前冲突不得继续以它为主线。紧凑续幕的场景图高度和正文覆盖量同步调整，在不缩小字号的前提下为最长历史对照多留 24px。
- 为什么这样改：基线十局真实长测中单局平均 8.36 分钟、续幕 P50 36.51 秒、45 次自由改写每次还多花约 7.96 秒裁决，且约 31% 续幕需要结构修复。用户现场扫码最需要的是尽快看到有意义内容、网络抖动不丢局，以及玩家明确写下的结果立刻成立；盲目把一幕拆成三个并发文案接口会破坏上下文一致性，因此保留一幕一个完整模型请求，只并发职责互不重叠的最终双报告。
- 实测结果：`tmp/soak/release-acceptance-final-10-20260714/` 的十个不同开局全部完成 12 节点和双报告，45/45 条不同自由改写逐字入正史，0 次整幕人工重试、0 个本地场景/结局兜底；单局 P50 153.81 秒，较 8.36 分钟基线降低 69.3%；续幕 P50/P90 为 10.55/14.98 秒，首段可读 P50/P90 为 3.15/4.16 秒，首答修复率 6.36%，提示缓存命中 token 比例 46.8%。随后 `tmp/soak/causal-source-verification-2-20260714/` 补跑赤壁与玄武门 2/2，22 个续幕首答修复率 0，验证后半生已进入粮荒、突厥使团、塞外驿道和边镇制度等新冲突。
- 影响了哪些模块：DeepSeek 传输与重试、结构化生成和字段恢复、玩家正史与叙事上下文、等待页首屏反馈、固定开场文案完整性、长局稳定性测试、浏览器存档兼容和现场演示性能。390 x 844 实际浏览器又完整点通普通行动、结果确认、DeepSeek 下一幕、无限直接改写和自定义事实续幕；自定义事实提交约 0.27 秒，下一幕约 13 秒，内容区由溢出 18px 降为 0px，控制台 0 错误/0 警告。正式公开扫码前仍应把 API key 迁移到边缘代理，加入服务端限流和匿名 `user_id`，不能把当前纯前端密钥方案当生产安全架构。

### 2026-07-14 02:43 - 修复节点七中断并完成十局真实长程压测

- 本次任务：定位多次直接改写后节点七附近反复生成失败的问题，持续调整正史上下文、提示词注入、字段恢复和测试条件，并实际跑十个不同历史开局；每局十二个节点、四到五次不同直接改写，目标至少九局到达双报告结局。
- 改了哪些文件：`src/game/{worldCanon,narrativeContext,prompts,schema,engine}.ts` 及测试、`src/services/deepseek.test.ts`、新增 `src/soak/{soakCases,longRunSoak.soak}.ts`、`vitest.soak.config.mjs`、`package.json`、`package-lock.json`、`docs/superpowers/{specs,plans}/2026-07-14-long-run-stability*`、`AGENTS.md` 与 `PROJECT_CONTEXT.md`。
- 改了什么：消除“账本最多三项、却要求所有历史改写永久逐字占位”的不可满足合同；全部决定继续永久保存在 `lifeIndex/playerCanon`，只有最近三幕的玩家改写进入 `activePlayerCanon`，并由客户端权威注入当前因果账本；续幕首答失败后先只补无效根字段，补丁仍失败时允许一次带精确证据的完整恢复，三轮都无效才保留存档并显式重试；玩家原文、主角、年龄、年份和账本继续由客户端保护；无害的解释字段超长与内部枚举近义词在本地规范化，缺失可见历史文案仍必须由 AI 修复；提示词增加必填字段提交前检查；新增真实生产链路 soak 工具和脱敏诊断。
- 为什么这样改：原合同在第四条自定义正史出现后数学上无法同时满足，盲目重试只会在节点越深时越来越慢。分层正史既保住玩家全部选择，又把当前模型负担限制在稳定窗口；有限且可观测的恢复能提高成功率而不允许本地伪造可玩场景或 2026 报告。
- 影响了哪些模块：十二节点连续性、直接改写正史、DeepSeek 续幕与结局、Zod 解析、字段修复、错误恢复、生成诊断、长局验收和公开仓库开发命令。
- 实测结果：`deepseek-v4-flash` 十个不同开局全部成功，成功率 10/10；共完成 120 个可玩节点、45/45 条全局唯一直接改写和 20 份结局子报告；人工式整步重试 1 次，本地可玩场景/结局兜底 0 次；平均每局 8.36 分钟，单局 7.24-10.08 分钟。普通测试 26 个文件共 176 项通过，TypeScript 通过。390 x 844 真实浏览器实际完成罗马大火开局、无限直接改写、动态等待、第 2 节点 DeepSeek 生成和退出返回时间轴；三张页面截图均无重叠，控制台 0 错误。
- 后续性能证据：十局虽全部通关，仍发生 45 次首答字段修复，主要是内部 `rippleLens` 近义词、漏写现场目标/倒计时和世界报告字数超限；这些没有破坏正史或导致中断，但仍是下一轮降低等待时长的明确对象。

### 2026-07-14 00:36 - 删除自定义改写的固定分析与模型播报

- 本次任务：解决玩家提交自定义结果后反复看到相同“代价、受益者、承担者”和传播说明，以及等待页直接播报 DeepSeek 工作过程的问题；同时把 README 改成以游戏产品为主的完整介绍。
- 改了哪些文件：`src/game/{customCanon,engine,reducer}.ts`、`src/screens/{ButterflyEchoScreen,TimelineEventScreen,GeneratingScreen}.tsx`、`src/styles/game.css`、相关测试、`README.md`、`AGENTS.md` 与 `PROJECT_CONTEXT.md`。
- 改了什么：自定义结果完成后不再进入固定分析确认页，而是直接生成下一幕；玩家原文仍是不可撤销正史，模型返回的具体后果在不否定原文时保留给后续上下文，矛盾返回继续由客户端保护；输入抽屉删除传播、受益者和代价的机制说明；等待页删除 DeepSeek 品牌句和系统工作播报，改成简短的剧情内文案；README 新增产品定位、核心体验和完整一局流程。
- 为什么这样改：固定分析既没有新信息，又让不同决定看起来得到同一种结论，还会暴露内部实现。玩家真正需要的是确认自己写下的结果不会被推翻，并尽快看到它如何改变下一次重大历史冲突。
- 影响了哪些模块：自定义结果状态流、后续模型上下文、等待页文案、旧存档回响兼容、README 产品表达和移动端交互测试。
- 验证：26 个 Vitest 文件共 163 项、TypeScript、生产构建、73 个运行时文件跨平台扫描与 `git diff --check` 通过；390 x 844 真实浏览器中提交“我接管消防队并成功拆出贯穿全城的防火带”后，页面跳过固定结果分析，直接进入无 DeepSeek 播报的等待页，再生成三日后的“尼禄的替罪羊”；新幕明确保留防火带已成功的事实，控制台 0 错误、0 警告。

### 2026-07-14 00:30 - 固定五十张卡片第一幕并后移 AI 起点

- 本次任务：取消选择历史卡片后的首幕模型等待，让 50 张卡片直接进入固定第一幕；保留第 2 至第 12 幕与双结局的真实 DeepSeek 推演，并补全公开仓库 README 和跨平台运行说明。
- 改了哪些文件：新增 `src/data/fixedOpenings.ts` 及测试；修改 `src/game/{schema,reducer,engine,prompts}.ts`、`src/hooks/useGame.ts`、`src/services/{deepseek,storage}.ts`、`src/screens/TimelineEventScreen.tsx`、`src/styles/game.css`、相关测试、`README.md`、`AGENTS.md`、`PROJECT_CONTEXT.md` 与本次 Superpowers 规格/计划。
- 改了什么：每张历史种子同步构建一个稳定、可重复、严格校验的第一幕；选卡后状态机直接进入 `event`，删除 `opening` 请求、`OPENING_RESOLVED` 与 `generateOpening`；来源标记区分“固定历史开场”和“DeepSeek 实时生成”；存档升级 v12，旧 v11 会话按既有迁移策略安全回到历史胶片；README 写明完整玩法、AI 边界、技术结构、三平台启动、验证命令与前端密钥风险；`VITE_DEEPSEEK_MODEL` 现在真实控制模型名。
- 为什么这样改：第一幕内容完全由已知历史卡片决定，运行时模型只增加等待和失败点，并没有创造足够价值；固定首幕能让玩家立即开始，而把模型预算集中到真正需要开放推理的蝴蝶效应续幕和结局。
- 影响了哪些模块：50 卡开局速度、DeepSeek 调用次数、状态机、存档版本、来源标记、公开仓库安装文档、跨平台协作和测试契约。

### 2026-07-13 23:59 - 全产品移动端字号与场景覆盖布局

- 本次任务：解决选择、等待、游玩、回响和结局页面在手机上字号过小的问题，并在不裁切 160 字事件正文、三条行动和历史对照的前提下扩大字号。
- 改了哪些文件：`src/styles/game.css`、`src/screens/TimelineEventScreen.tsx`、`src/screens/TimelineEventScreen.test.tsx`、`AGENTS.md`、`PROJECT_CONTEXT.md` 和 `design-qa.md`。
- 改了什么：选择页卡片图片缩短 38px，把空间交给 11-26px 的卡片文案；游玩页新增稳定的 `image-overlay` 布局，半透明煤黑正文层覆盖场景图约 35-40%，事件正文提高到 13-14px、行动提高到 14-15px、对照提高到 11-13px；同步扩大等待、改写抽屉、结果回响和错误页字号；两份最终报告移除 7-9px 微型正文与省略，改用 11-15px 完整排版，并在报告阅读区容纳自然滚动。
- 为什么这样改：原先把 300px 左右完整交给图片，只能通过微型字号和截断维持 844px 一屏，手机上实际不可读；让正文覆盖图片约三分之一，可在保留历史画面氛围的同时把有限高度交给真正需要阅读和点击的内容。
- 影响了哪些模块：50 张历史卡浏览、DeepSeek 等待状态、所有 12 节点事件页、自由改写抽屉、选择结果回响、错误恢复和两页最终报告。
- 验证：390 x 844 下逐个点开选择、等待、真实 DeepSeek 开场、自由改写、选择结果、列传和 2026 报告；真实开场正文层覆盖图片 37%，无滚动；极限续幕使用 160 字正文、三条 32 字行动和 36/48/36 字历史对照，正文 `clientHeight === scrollHeight === 614px`，最底内容为 833.85px；事件页最小可见字号为 11px。

### 2026-07-13 23:48 - 把事件前情扩成三层完整现场

- 本次任务：解决事件标题下方只有一句背景、玩家不了解前因各方与失败代价的问题，同时保证丰富文案不会降低 DeepSeek 成功率或挤出一屏。
- 改了哪些文件：`src/game/{schema,prompts}.ts`、`src/services/{storage,deepseek.test}.ts`、`src/screens/TimelineEventScreen.tsx`、`src/styles/game.css`、相关测试与夹具、`AGENTS.md`、`PROJECT_CONTEXT.md` 和 `design-qa.md`。
- 改了什么：新幕次前情从 88 字两句提高为 96-160 字三句，依次承担历史来路、真实各方与现场证据、主角筹码与失败代价；把前情长度和句数校验下沉到字段层，使漏字段与超长前情能在同一次 AI 补丁中修复；存档改用兼容 schema，旧的一句或两句原文仍可恢复；事件页按前情长度进入密集模式，长前情首幕使用 330px 场景、续幕使用 300px 场景，并压紧底部对照间距。
- 为什么这样改：这段文字是玩家理解“我为什么在这里、谁在争什么、我能做什么”的唯一主要入口，必须比底部历史对照更丰富；生成校验又必须一次暴露全部可修字段，否则丰富度约束会把原本可修的幕次变成中断。
- 影响了哪些模块：DeepSeek 幕次协议、字段级结构修复、旧存档恢复、事件页密度判定、场景图片高度、移动端历史对照和测试夹具。
- 验证：25 个 Vitest 文件共 165 项、TypeScript、生产构建、71 个运行时文件的跨平台扫描与 `git diff --check` 通过；真实 DeepSeek 为 1939 年开场生成 154 字三句前情，经一次紧凑字段修复后成功进入事件页，两次 API 均返回 200；390 x 844 下真实幕次和 160 字前情、三个 32 字行动、三条顶格历史对照的压力幕次均为 `scrollHeight === clientHeight === 844`，最底正文为 834.96px，保留 8px 安全区，控制台 0 错误、0 警告。

### 2026-07-13 23:18 - 把场景时间与地点拆成两行

- 本次任务：解决场景图注把时间与长地点强行放在左右两端，导致“24 岁”被拆行、地点挤成孤字的问题。
- 改了哪些文件：`src/screens/TimelineEventScreen.tsx`、`src/screens/TimelineEventScreen.test.tsx`、`src/styles/game.css`、`AGENTS.md`、`PROJECT_CONTEXT.md` 与 `design-qa.md`。
- 改了什么：为场景图注增加独立的时间行和地点行；图注改为单列网格，时间完整居上、地点获得全宽并左对齐；高度固定为 52px，不改变场景图和正文的整体分配。
- 为什么这样改：时间与地点是两种信息，不应在移动端上争抢同一行宽度；纵向排列能同时保证时间完整性和具体地点的可读性。
- 影响了哪些模块：游戏事件场景图注、390 x 844 移动端布局和组件回归测试。
- 验证：25 个 Vitest 文件共 162 项通过，TypeScript、生产构建、跨平台路径扫描与 `git diff --check` 通过；使用“1939年 · 六周后 · 24岁”与“上海法租界霞飞路 549 号咖啡馆二楼雅座”实测，两行的垂直边界不重叠；场景页与正文容器仍分别为 `844 === 844` 和 `504 === 504`，控制台 0 错误。

### 2026-07-13 23:12 - 把历史对照从长文压成三条结论

- 本次任务：修复底部历史对照在长文时变成窄列文章、一屏读不完的问题。
- 改了哪些文件：`src/game/{schema,prompts}.ts`、`src/screens/TimelineEventScreen.tsx`、`src/App.tsx`、`src/styles/game.css`、相关测试、`AGENTS.md`、`PROJECT_CONTEXT.md` 与 `design-qa.md`。
- 改了什么：对照改为“你的时间线 / 正史原本 / 为何改变”三条全宽结论；删除对上一选择的整句重复；将架空结果、正史对照和因果媒介分别限制为 36、48、36 字；清除旧 `.change-proof p` 的跨列定位，所有子项强制占据独立整行；顶格文案使用密集布局。
- 为什么这样改：这一区的职责是让玩家几秒内确认“变了什么”，而不是再读一段历史文章。上一选择在操作和结果页已经出现，没有理由在这里第三次复述。
- 影响了哪些模块：DeepSeek 幕次字段上限、续幕密度选择、历史对照组件、旧 CSS 级联兼容和移动端回归测试。
- 验证：25 个 Vitest 文件共 161 项通过，TypeScript、生产构建、71 个运行时文件跨平台扫描与 `git diff --check` 通过；390 x 844 下实际存档和所有字段顶格的压力存档均为 `scrollHeight === clientHeight === 844`；三条正文各不超过两行，对照底边 836px，没有省略号、裁切或控制台错误。

### 2026-07-13 22:55 - 补全事件前情并建立明确历史对照

- 本次任务：解决事件页前情不足、真实历史与架空结果混在一起、文字被省略以及底部对照排版拥挤的问题。
- 改了哪些文件：`src/game/{schema,prompts}.ts`、`src/screens/TimelineEventScreen.tsx`、`src/styles/game.css`、相关测试与夹具、`AGENTS.md`、`PROJECT_CONTEXT.md`、`design-qa.md` 与本次 Superpowers 规格/计划。
- 改了什么：事件前情扩为两句完整叙事，首句交代著名事件来路或上一决定如何导致当前局面，次句交代现场人物、证物与迫近冲突；底部纵向展示“被你改变后 / 真实历史中 / 变化来自”；schema 禁止真实历史字段夹带当前架空线，并清理模型重复输出的标签前缀；合法长文和 32 字行动不再使用省略号或行数裁切；续幕统一使用至少紧凑密度。
- 为什么这样改：玩家必须同时读懂“我为什么到了这里、当下要决定什么、真实历史原本怎么发展、我的上一步改了哪里”。对照必须来自同一次完整 DeepSeek 推演，不新增拆分请求和等待时延。
- 影响了哪些模块：DeepSeek 幕次契约、字段语义校验、事件页信息层级、自适应移动端密度、历史对照可读性和回归测试。
- 验证：25 个 Vitest 文件共 161 项通过，TypeScript、生产构建、71 个运行时文件的跨平台路径扫描与 `git diff --check` 通过；390 x 844 真实浏览器中页面与正文容器的 `scrollHeight === clientHeight`，对照底边为 836px，可见正文中无省略号、无裁切，控制台 0 错误。

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
