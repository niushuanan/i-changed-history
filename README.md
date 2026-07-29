# 哎！我改变了历史？

如果你真的站在玄武门、赤壁江面、萨拉热窝街头或阿波罗登月指挥席上，历史还会照原来的方向发生吗？

《哎！我改变了历史？》是一款面向移动端的 AI 架空历史游戏。它不是历史知识问答，也不是让玩家旁观一段随机续写。玩家先从一百个真实历史瞬间中抽取命运，再成为那个转折点里的具体参与者，在同一个人的一生里做出四次决定，看一个选择怎样改变下一场冲突、一个时代，以及自己死后直到 2026 年的世界。

## 游戏的核心体验

- **从熟悉的真实历史开始**：100 个真实转折点按时间排列，其中 58 个来自中国史、42 个来自中国玩家熟悉的世界史，覆盖公元前到现代。中国史节点全部早于 1949 年，不收录 1949 年及以后发生在中国的事件，也不收录以中国共产党、中华人民共和国或“新中国”为主题的政治题材；苏联史仍按世界史正常收录。
- **让命运替你做第一道选择**：按下抽取后，完整历史档案卡会在 3D 轮盘中以固定节奏从右后方旋入、从左后方退场，随后揭晓唯一一个现场；优先抽中还没有通关解锁的历史，避免面对一百张卡片纠结。
- **通关才能点亮档案**：第四次抉择成为正史时，该节点立即永久进入“已解锁档案”，不受结局报告生成成败影响；点开任意已解锁档案，都能从固定第一幕重新游玩。
- **活完一个人的一生**：主角在四个节点中保持同一个名字和身体，从命运当日、三日余波走到人生转折和最后抉择。
- **像肉鸽一样出牌**：每一幕只出现三张牌——循史、破局、天外。向上划出一张就把它写入时间线，不提供自由输入，也没有隐藏的第四选项。
- **天外真的换一种现实**：客户端从 50 项具体超能力中整局无放回抽取，AI 只能把指定能力用进当前历史快照；不会再用“让谎言现形”一类抽象模板，也不会在刷新或重试后偷换能力。
- **每幕可以 Roll 三次**：第一次经过约 1.2 秒洗牌后翻出已经准备好的第二组三张；第二、第三次由 AI 针对当前现场实时发出新牌，并避开已经看过的手段和奇想。
- **短牌面、完整决定**：牌面只保留 4-12 个字，长按可查看完整决定、执行者、目标、期限、直接结果和隐藏代价；后续推演始终使用完整决定，不用短标题代替因果。
- **每一幕都由此前决定推出来**：故事不会永远困在开场事件，也不会随机换题。过去的选择会进入新的战争、制度、技术、城市与普通人生活。
- **得到属于这一局的两份结局**：一份是白话与文言双版本的穿越者列传；另一份是主角死后到 2026 年的小说式平行世界报告。
- **把完整报告带走**：桌面端直接下载当前报告的高清 PNG；移动端先准备完整图片，再由系统面板选择保存到相册，也可随时改用 PNG 下载。

## 一局怎样展开

1. 首页先显示一张未显影的命运牌。按下抽取，完整历史档案卡会在有纵深的轮盘中按固定节奏连续旋转，并随机揭晓一个历史节点；抽取期间不显示闯入操作。
2. 揭晓后仍使用完整历史档案卡；确认闯入便立即进入固定第一幕，不需要等待模型。
3. 每幕从循史、破局、天外三张牌中选择一张；本幕可以 Roll 三次，第一次用约 1.2 秒完成预生成洗牌仪式，后两次实时生成。
4. 长按牌面查看完整决定，向上划出后提交。第 2 至第 4 幕根据此前完整决定、近期后果和不可撤销的世界正史实时生成。
5. 第 4 次决定后，游戏并发生成白话/文言人物列传，以及主角死后延伸到 2026 年的小说式世界报告；完成后点亮该历史档案。

## AI 如何参与

| 环节 | 实现方式 |
| --- | --- |
| 100 张历史卡、随机入口与第一幕 | 本地固定数据，抽中后立即可玩 |
| 第 2-4 幕 | DeepSeek `deepseek-v4-flash` 实时生成 |
| 六张决定牌 | 每幕同一次调用生成首组三张和 Roll 组三张；每组固定为循史、破局、天外，两张天外分别绑定不同的客户端指定能力 |
| 第 2、3 次 Roll | DeepSeek 在当前现场实时生成全新的循史、破局、天外三张牌 |
| 牌面与详情 | `displayLabel` 用于短牌面；完整 `label`、行动规格和即时结果用于长按详情与下一幕推演 |
| 最终人物列传 | DeepSeek 独立生成 |
| 2026 平行世界报告 | DeepSeek 与人物列传并发生成 |

第一幕固定，是为了让玩家抽中历史后立刻开始；每个历史快照预先拥有六张 AI 写成的天外候选，运行时随机取两张而不增加网络等待。真正需要开放推理的第 2 至第 4 幕、第二与第三次 Roll、以及最终报告由模型生成。实时 Roll 只换牌、不改写当前现场，失败时保留原牌、同一能力和次数并可直接重试。所有模型结果都使用 JSON Schema 风格契约和 Zod 校验。轻微字段错误只修复失败字段；无法修复时保留游戏进度并提供重试，不在本地伪造后续剧情。

## 技术结构

- React 19 + TypeScript + vinext（Next App Router / Vite）
- Sites / Cloudflare Worker 同源代理 DeepSeek Chat Completions，SSE 流式响应、高推理模式、8192 token 输出上限
- D1 匿名会话、IP 与全站三层用量限制；浏览器永远拿不到 DeepSeek API Key
- Zod 结构校验与字段级 AI 修复
- reducer 驱动的可恢复游戏状态机
- localStorage 存档、Web Audio 配乐、完整滚动尺寸的 2x PNG 结局导出
- Vitest + Testing Library 自动化测试
- Windows 与 Linux GitHub Actions 构建门禁

主要入口：

- `app/page.tsx` 与 `app/game-client.tsx`：Sites 页面入口与纯浏览器游戏边界
- `worker/index.ts` 与 `worker/deepseek-proxy.ts`：Cloudflare Worker、透明流式模型代理和用量保护
- `src/data/historySeeds/index.ts`：100 个独立剧本模块的完整卡组聚合入口（中国 58 / 世界 42；中国节点全部早于 1949 年，并排除中共、中华人民共和国与“新中国”政治题材；苏联史保留在世界史中）
- `src/data/historySeeds/scripts/<seed-id>/index.ts`：单个历史剧本，可独立删除、审查和测试
- `src/screens/SeedPickerScreen.tsx`：随机命运抽取、匀速 3D 历史轮盘与可重复游玩的已解锁档案
- `src/components/GameAnnouncement.tsx`：首次进入与设置菜单可重看的游戏说明
- `src/data/fixedOpenings.ts`：固定第一幕
- `src/data/fixedPowerChoices.generated.ts`：100 个历史快照各六张固定天外候选
- `src/game/powers.ts`：50 项能力与整局无放回抽取
- `src/game/reducer.ts`：游戏状态机
- `src/game/prompts.ts`：六张决定牌、续幕和结局提示协议
- `src/game/engine.ts`：模型生成、校验和修复
- `src/services/deepseek.ts`：浏览器同源代理传输、SSE 解析与 Node 长测直连传输
- `src/services/deepseek.interactive.ts`：抖音互动空间 `tt.callAIChatCompletion` / 火山平台传输
- `src/components/ChoiceList.tsx`：三张卡牌、三次 Roll、长按详情和上划提交
- `src/services/share.ts`：完整报告图片准备、移动系统分享与桌面下载
- `src/hooks/useGame.ts`：请求、存档、音频与恢复编排

## 本地运行

准备环境：

- Node.js 22.13 或更高版本
- npm 10 及以上版本
- 可用的 DeepSeek API Key

### macOS / Linux

```bash
git clone https://github.com/niushuanan/i-changed-history.git
cd i-changed-history
npm ci
cp .env.example .env.local
```

编辑 `.env.local`：

```dotenv
DEEPSEEK_API_KEY=你的_DeepSeek_API_Key
DEEPSEEK_MODEL=deepseek-v4-flash
RATE_LIMIT_SALT=一段只放在服务端的随机长字符串
DEEPSEEK_GLOBAL_DAILY_LIMIT=1000
```

启动：

```bash
npm run dev
```

### Windows PowerShell

```powershell
git clone https://github.com/niushuanan/i-changed-history.git
Set-Location i-changed-history
npm ci
Copy-Item .env.example .env.local
notepad .env.local
npm run dev
```

vinext 会在终端显示访问地址，默认通常为 `http://localhost:3000/`。项目不依赖作者电脑的绝对路径，可以放在任意普通目录、中文目录或带空格目录中运行。

## 验证

```bash
npm run check:portability
npm test
npm run typecheck
npm run build
```

`check:portability` 会扫描运行时文件并拒绝开发者个人目录。GitHub Actions 会在 Windows 和 Linux 上执行 `npm ci`、测试、类型检查和生产构建。

需要真实验证四次人生抉择、每幕预生成 Roll 和双报告时，可在配置限额测试 Key 后显式运行 `npm run test:soak`。默认十个不同开局都在四幕使用 Roll；设置 `SOAK_ALL_ROLL=1` 可对指定开局执行同样的全幕门禁。长测在 Node 环境读取同一组服务端变量并直连 DeepSeek，把脱敏结果写入已忽略的 `tmp/soak/`，不会随普通 `npm test` 自动执行；第二、第三次实时 Roll 的请求与失败重试由组件和应用集成测试独立覆盖。

## 抖音互动空间审核包

仓库只维护完整 100 剧本版本。提交抖音审核前统一运行：

```bash
npm run build:interactive
```

该命令只在互动空间构建阶段把运行时卡组替换为古腾堡印刷、伽利略《星空使者》和阿波罗 11 号三个低敏剧本；完整源码和普通产品构建仍保留全部 100 个。脚本会删除其余 97 张历史图、扫描最终 JS 是否泄漏其他剧本、优化移动端资源、检查 ZIP 不超过 8MB，并生成 `release/i-changed-history-interactive-space.zip`。不要手工压缩普通构建并提交审核。

## 密钥与部署

`.env.local` 已加入 `.gitignore`，不会提交到 GitHub。DeepSeek Key 只由 Worker 在请求时读取；浏览器只访问同源 `/api/deepseek/completions`，不会携带或下载 Bearer Key。构建前会清空旧产物，避免历史 Vite bundle 把旧 Key 带进发布包。

Sites 部署通过运行时环境变量保存 Key 和限额盐值，不把秘密写进 `.openai/hosting.json`。代理只接受本游戏的固定协议，保留 SSE、取消、上游状态与 `Retry-After`，并用 D1 对分钟突发、匿名会话、IP 与全站日用量做原子计数。公开分享仍建议使用单独的低预算 Key，并在 DeepSeek 账户侧设置余额上限和告警。

两种运行环境的 AI 传输矩阵和测试边界见 [`docs/ai-transports.md`](docs/ai-transports.md)：本地与 Sites 走 DeepSeek 官方接口，抖音互动空间走平台注入的 `tt.callAIChatCompletion`，二者复用同一套游戏协议和 Schema。

## License

代码用于黑客松原型展示。历史图片与音频的来源和授权说明见 `public/assets/CREDITS.md`、`public/assets/history/CREDITS.md` 和 `public/audio/CREDITS.md`。
