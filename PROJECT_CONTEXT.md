# Project Context

## 1. 这个项目是干什么的

《哎！我改变了历史？》是一款移动端 AI 穿越历史肉鸽卡牌游戏。100 个著名真实历史转折点（中国 58、世界 42，覆盖公元前到现代）不再作为自由选择目录直接压给玩家：首页先显示未显影命运牌，玩家按下抽取后，完整档案海报卡像胶片一样快速掠过、逐渐减速，并随机停在一个历史现场；系统优先命中尚未通关的节点。揭晓仍复用完整档案海报卡，玩家进入后立即装载该节点固定且经过 schema 校验的第一幕。每幕先展示循史、破局、天外三张牌并允许 Roll 三次：第一次经过约 1.2 秒实体洗牌仪式换成预生成第二组，第二和第三次在保持现场不变的前提下由 DeepSeek 实时生成新三张。牌面是 4-12 字摘要，长按显示完整决定、行动规格、结果与代价，向上划出一张后把完整决定写入时间线；产品不提供自由输入或第四路径。同一位固定姓名和身体的主角只经历命运当日、三日后、人生转折、最后抉择四次重大决定，第四次后生成《史记》式人物列传和延伸至 2026 的小说式蝴蝶效应报告；完整结局会永久解锁该开局并收入“已解锁档案”。产品没有人格测试、MBTI 标签或隐藏的自动选择时间线。

当前版本保留完整的浏览器端游戏，同时已经具备可公开分享的 Sites / Cloudflare Worker 托管架构：浏览器只向同源 `/api/deepseek/completions` 发送固定游戏协议，Worker 从运行时 secret 读取 DeepSeek `deepseek-v4-flash` 密钥，原样流式转发 SSE，并用 D1 对分钟突发、匿名会话、IP 与全站日用量做原子限额；浏览器产物不再包含 API Key。Zod 继续校验结构化输出，前端公式继续计算历史偏离度，本地音频继续构建史诗氛围；两页结局仍按完整滚动尺寸导出为 2x PNG，桌面端直接下载，移动 Web 通过第二次用户操作打开系统分享面板并保留 PNG 下载后备。游戏存档仍按设备和站点域名保存在浏览器 `localStorage`。

项目只维护 `main` 上这一份完整 100 剧本源码，不再维护独立的审核精简版本。抖音互动空间审核包由 `npm run build:interactive` 从同一份代码即时生成：AI 传输在构建时替换为 `tt.callAIChatCompletion`，历史入口只打包古腾堡印刷、伽利略《星空使者》和阿波罗 11 号三个低敏剧本，其他 97 个剧本仍完整保留在源码和普通产品中但不得进入审核 ZIP；脚本同时删除非白名单历史图、扫描最终 JS 的剧本 ID 泄漏、优化移动资源、执行 8MB ZIP 闸门并生成待上传文件。此前平台 AppID 和提审记录只属于历史发布记录，本次没有上传或改变平台状态。

## 2. 代码结构是什么

- `src/data/`：100 张著名历史转折点、与其一一对应的固定第一幕、搜索筛选目录，以及按年份/阶段选取的视觉资产映射。
- `src/data/historySeeds/`：历史剧本模块边界；`scripts/<seed-id>/index.ts` 每个目录只拥有一个剧本，`shared.ts` 提供公共构造器与标签，`index.ts` 显式维护完整 100 节点的唯一聚合顺序。
- `src/data/historySeeds/interactive.ts`：只供互动空间构建别名使用的三个低敏剧本聚合；普通产品和测试默认不经过该入口。
- `src/game/`：游戏领域层，包含单一主角一生四决策时间计划、每幕首发六张牌与三次 Roll 状态、不可撤销世界正史、重大节点编排、结构化 schema、DeepSeek prompts、生成引擎、确定性偏离度和纯 reducer。
- `src/hooks/`：`useGame.ts` 负责请求取消、下一幕预取、卡组 Roll、即时回响、存储、音频和重试编排。
- `src/services/`：DeepSeek 官方 / Sites Worker 传输、互动空间火山平台传输、卡牌即时音效、版本化本地存储、史诗配乐，以及完整报告 PNG 的准备、系统分享、下载与资源回收。
- `app/`：vinext App Router 页面、中文 metadata，以及禁止服务端预渲染现有浏览器游戏的 client-only 边界。
- `worker/`：Sites Cloudflare Worker 入口、固定协议校验、D1 用量限制、DeepSeek 服务端密钥注入和透明 SSE 转发。
- `db/` 与 `drizzle/`：AI 请求限额表定义及 Sites 部署迁移。
- `build/` 与 `.openai/hosting.json`：Sites 构建元数据打包和 D1 / R2 逻辑绑定。
- `src/screens/` 和 `src/components/`：从命运抽取、游戏说明、解锁档案、三卡牌桌、三次 Roll、长按详情、上划提交，到同一主角死亡与 2026 身后历史报告的完整界面。
- `src/styles/`：煤黑、新闻纸、朱砂红、青绿和黄色构成的移动端视觉系统。
- `src/test/`：Vitest 初始化和可复用的幕次/结局夹具。
- `src/soak/`：显式运行的真实 DeepSeek 四决策完整局压力测试；默认覆盖十个不同开局并在每幕选择预生成 Roll 组，也支持用 `SOAK_ALL_ROLL=1` 对指定开局执行相同的全幕、最低成功率与强制延迟门槛，结果只写入被忽略的 `tmp/soak/`。第二、第三次实时 Roll 的请求、恢复与错误重试由 reducer、组件和应用集成测试覆盖。
- `design/`：历史视觉稿与 360×667 / 390×844 真实浏览器验收截图。
- `public/assets/` 与 `public/audio/`：历史场景图、三套原创透明卡面图标、CC0 史诗配乐及授权记录。
- `scripts/package-interactive-review.mjs`、`scripts/interactive-review-catalog.mjs`、`scripts/prepare-interactive-build.mjs`、`scripts/verify-interactive-review-build.mjs` 与 `scripts/optimize-interactive-assets.mjs`：定义三个审核剧本、构建平台运行时、删除其他历史图、扫描非白名单剧本泄漏、优化移动资源、执行未压缩与 ZIP 双体积闸门，并生成唯一待提交 ZIP；Sites 正式版继续使用全部 100 剧本和原始资源。
- `docs/superpowers/`：Superpowers 收敛的产品规格和实施计划。

实际数据流是：未显影卡牌 -> 客户端从尚未解锁的 100 节点池随机选择，并驱动完整 `HistoryCard` 卡带先快后慢地连续滑动停靠 -> 揭晓既有历史档案海报 -> 同步装载该卡固定第一幕、固定主角与两组三张牌 -> 玩家可直接选首组，也可第一次 Roll 在约 1.2 秒实体洗牌后无网络地换成预生成第二组；第二、第三次 Roll 把当前现场和所有已看牌提交给模型，只接收新的 A/B/C 三张，并在请求成功或失败前保持可见洗牌过渡 -> 长按查看完整字段，向上划出一张 -> reducer 把完整 `label`、偏离类型与即时结果固化为不可撤销 `WorldCanon`，并在结果页预取下一幕 -> 第 2 至第 4 幕把全部已选牌压成分层叙事上下文，Sites/本地由 Worker 向 DeepSeek 官方接口发起 SSE 推演，互动空间由 `tt.callAIChatCompletion` 走火山平台 -> Zod 校验人物连续性、两组三档牌和因果账本，缺失可见文案时仅补失败字段 -> 第 4 张牌成为最后决定 -> 主角死亡 -> 并发生成《史记》式白话/文言列传与 2026 蝴蝶效应报告 -> 客户端解锁该开局、合并报告并导出完整 2x PNG。

## 3. 关键入口在哪里

- `app/page.tsx` 与 `app/game-client.tsx`：Sites 页面入口；用 `next/dynamic(..., { ssr: false })` 保证现有游戏只在浏览器挂载。
- `app/layout.tsx`：中文根布局、站点 metadata 和两份全局样式入口。
- `worker/index.ts`：Cloudflare Worker 总入口。
- `worker/deepseek-proxy.ts`：固定游戏协议、DeepSeek 服务端代理、SSE 透传、取消和 D1 用量保护入口。
- `src/App.tsx`：根组件，负责首次游戏说明、命运抽取入口、游戏 phase 切换和结局导出。
- `src/hooks/useGame.ts`：运行时编排入口。
- `src/game/engine.ts`：结构化幕次与结局生成入口。
- `src/game/schema.ts` 与 `src/game/reducer.ts`：六张首发牌、三次 Roll、动态牌组、永久解锁、存档状态和卡牌提交的权威入口。
- `src/components/ChoiceList.tsx`：三卡牌桌、长按详情、上划提交、三次 Roll 与即时音效入口。
- `src/screens/SeedPickerScreen.tsx` 与 `src/components/GameAnnouncement.tsx`：百节点随机停靠、未显影/揭晓卡、已解锁档案和首次玩法说明入口。
- `src/data/fixedOpenings.ts`：100 张历史卡的固定第一幕与两组三张牌构建入口。
- `src/game/worldCanon.ts`：把玩家决定固化为世界正史，并生成下一幕的重大节点编排约束。
- `src/data/historySeeds/index.ts`：100 个单剧本模块的显式聚合与历史卡牌数据入口。
- `src/data/historySeeds/interactive.ts`：互动空间构建专用三剧本入口；由 Vite 别名替换普通聚合，不改变源码主卡组。
- `src/services/share.ts`：完整报告图片准备、移动系统分享、桌面下载和 object URL 回收入口。
- `src/services/deepseek.ts`、`src/services/deepseek.interactive.ts` 与 `docs/ai-transports.md`：DeepSeek 官方、Sites 同源 Worker 和互动空间火山平台双通道入口与说明。
- `vite.config.ts`：vinext、Sites metadata 和 Cloudflare Worker / D1 本地绑定配置。
- `vite.interactive.config.ts`：互动空间纯静态 Vite 构建和 `tt.callAIChatCompletion` / 本地报告导出适配入口。
- `vitest.config.mjs` 与 `vitest.soak.config.mjs`：普通 jsdom 回归与真实 DeepSeek 长局配置；Node 长测继续读取服务端变量直连模型。
- `.openai/hosting.json`：Sites 项目 ID 与 D1 / R2 逻辑绑定，绝不保存运行时密钥。
- `.trae/mcp.json`：比赛方 `interative_content_mcp` 的项目级发布配置。
- `scripts/package-interactive-review.mjs`：抖音提审前唯一允许的打包入口，最终输出 `release/i-changed-history-interactive-space.zip`。
- `package.json`：`npm run dev`、`npm test`、`npm run test:soak`、`npm run typecheck`、`npm run build`、`npm run build:interactive` 和 `npm run db:generate` 命令入口；其中 `build:interactive` 已固定为三剧本审核打包链路。
- `design/selected-visual.md`：image-to-code 的目标稿和尺寸约束。
- `.env.example`：DeepSeek 模型和本地密钥变量模板，不包含真实密钥。

## 4. 最近改了什么

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
