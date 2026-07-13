# 哎！我改变了历史？

一款面向移动端的 AI 架空历史游戏。玩家从 50 个真实历史转折点中选择入口，在同一个历史人物的一生里完成 12 次决定，最后得到一份人物列传和一份延伸到 2026 年的平行世界报告。

## 现在怎么玩

1. 沿时间轴横向浏览 50 个真实历史瞬间，其中 30 个来自 1840 年前的中国史，20 个来自中国玩家熟悉的世界史。
2. 选择卡片后立即进入固定第一幕，不需要等待模型生成。
3. 在每一幕选择 A、B、C，或直接写下一个已经发生的历史结果。
4. 第 2 至第 12 幕由 DeepSeek 根据全部决定、近期后果和不可撤销的玩家正史实时推演。
5. 第 12 次决定后，游戏并发生成白话/文言人物列传，以及主角死后延伸到 2026 年的小说式世界报告。

## AI 在哪里

| 环节 | 实现方式 |
| --- | --- |
| 50 张历史卡与第一幕 | 本地固定数据，点击后立即可玩 |
| 第 2-12 幕 | DeepSeek `deepseek-v4-flash` 实时生成 |
| A/B/C 即时结果 | 随当前 AI 幕次一起生成 |
| 玩家直接改写 | 玩家原文立即成为正史；DeepSeek 判断影响级别，下一幕继续推演 |
| 最终人物列传 | DeepSeek 独立生成 |
| 2026 平行世界报告 | DeepSeek 与人物列传并发生成 |

所有模型结果都使用 JSON Schema 风格契约和 Zod 校验。轻微字段错误只修复失败字段；无法修复时保留游戏进度并提供重试，不在本地伪造后续剧情。

## 技术结构

- React 19 + TypeScript + Vite
- DeepSeek Chat Completions，SSE 流式响应、高推理模式、8192 token 输出上限
- Zod 结构校验与字段级 AI 修复
- reducer 驱动的可恢复游戏状态机
- localStorage 存档、Web Audio 配乐、PNG 结局导出
- Vitest + Testing Library 自动化测试
- Windows 与 Linux GitHub Actions 构建门禁

主要入口：

- `src/data/historySeeds.ts`：50 张历史卡
- `src/data/fixedOpenings.ts`：固定第一幕
- `src/game/reducer.ts`：游戏状态机
- `src/game/prompts.ts`：续幕、自由改写和结局提示协议
- `src/game/engine.ts`：模型生成、校验和修复
- `src/services/deepseek.ts`：唯一 DeepSeek 网络出口
- `src/hooks/useGame.ts`：请求、存档、音频与恢复编排

## 本地运行

准备环境：

- Node.js 20、22，或 24 及以上版本
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
VITE_DEEPSEEK_API_KEY=你的_DeepSeek_API_Key
VITE_DEEPSEEK_MODEL=deepseek-v4-flash
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

Vite 会在终端显示访问地址，默认通常为 `http://localhost:5173/`。项目不依赖作者电脑的绝对路径，可以放在任意普通目录、中文目录或带空格目录中运行。

## 验证

```bash
npm run check:portability
npm test
npm run typecheck
npm run build
```

`check:portability` 会扫描运行时文件并拒绝开发者个人目录。GitHub Actions 会在 Windows 和 Linux 上执行 `npm ci`、测试、类型检查和生产构建。

## 密钥与部署

`.env.local` 已加入 `.gitignore`，不会提交到 GitHub。但这是纯前端比赛原型，`VITE_*` 变量最终会进入浏览器代码，因此浏览器使用者能够查看 API Key。

本地试玩请使用限额测试 Key。若要公开部署，必须把 DeepSeek 调用迁移到服务端代理，并在服务端增加鉴权、限流、用量控制和密钥轮换。

## License

代码用于黑客松原型展示。历史图片与音频的来源和授权说明见 `public/assets/CREDITS.md`、`public/assets/history/CREDITS.md` 和 `public/audio/CREDITS.md`。
