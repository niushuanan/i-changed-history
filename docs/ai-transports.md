# AI 双通道

产品只维护一套游戏协议、Schema、修复策略与 8192 token 上限，但按运行环境使用两条传输通道。

| 运行环境 | 通道 | 密钥位置 | 模型 | 用户等待策略 |
| --- | --- | --- | --- | --- |
| 抖音互动空间审核包 | `tt.callAIChatCompletion`，由平台转发至火山方舟 | 抖音平台 AI 服务配置 | `deepseek-v4-flash` | 第一幕固定；后续幕在结果页预取 |
| 本地开发、Node 长测、Sites Worker | DeepSeek 官方 `https://api.deepseek.com/v1/chat/completions` | 本地 `.env.local` 或服务端运行时变量 | `deepseek-v4-flash` | 第一幕固定；后续幕在结果页预取 |

两条通道都一次生成六张决定牌：首组三张立即展示，第二组三张供本节点第一次 Roll 使用。第二、第三次 Roll 会分别发起一次新的 A/B/C 三牌请求。

## 本地配置

复制 `.env.example` 为不会进入 Git 的 `.env.local`，填写：

```dotenv
DEEPSEEK_API_KEY=你的本地测试密钥
DEEPSEEK_MODEL=deepseek-v4-flash
```

普通浏览器只请求同源 `/api/deepseek/completions`；本地 Worker 从环境变量读取密钥并请求 DeepSeek 官方接口。密钥不会写入卡牌数据、浏览器请求体或构建产物。

localhost 使用开发者自己的 Key，因此完全绕过面向公开站点的 D1 反滥用配额。Sites 生产环境不设置访客、IP 或全站每日硬封顶，只保留一分钟窗口：默认每位访客 120、同一出口 IP 1800、全站 2400 个加权请求单位；高推理恢复按 3 个单位计，其余按 1 个单位计。短时命中只返回可重试的 `burst` 429，最长一分钟恢复。三个阈值分别可由 `DEEPSEEK_GUEST_MINUTE_LIMIT`、`DEEPSEEK_IP_MINUTE_LIMIT` 与 `DEEPSEEK_GLOBAL_MINUTE_LIMIT` 调整。

## 自动验证

- `src/services/deepseek.direct.test.ts`：Node 环境验证 DeepSeek 官方地址、Bearer 鉴权、V4 Flash、JSON 流式协议与 fast 非思考模式。
- `src/services/deepseek.test.ts`：浏览器环境验证同源 Worker 代理不会暴露密钥。
- `src/services/deepseek.interactive.test.ts`：互动空间环境验证 `tt.callAIChatCompletion`、平台 SSE 和固定 V4 Flash。
