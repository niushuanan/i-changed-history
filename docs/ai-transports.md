# AI 双通道

产品只维护一套紧凑游戏协议、Schema 与字段修复策略；完整幕次使用 4096 token 输出上限，并发的两份结局各使用 2048，但按运行环境使用两条传输通道。互动空间流式接口以官方定义的 `onSSE(event.data)` 文本分片为主，同时兼容旧基础库透传的 OpenAI `choices[].delta` 包；流式完成不读取 `success.data`。

| 运行环境 | 通道 | 密钥位置 | 模型 | 用户等待策略 |
| --- | --- | --- | --- | --- |
| 抖音互动空间审核包 | `tt.callAIChatCompletion`，由平台转发至火山方舟 | 抖音平台 AI 服务配置 | `deepseek-v4-flash-260425` | 第一幕固定；后续幕在结果页预取 |
| 本地浏览器、发布长测、Sites Worker | 浏览器/长测先请求同源 `/api/deepseek/completions`，Worker 再转发 DeepSeek 官方接口 | 本地 `.env.local` 或服务端运行时变量 | `deepseek-v4-flash` | 第一幕固定；后续幕在结果页预取 |
| Node 诊断长测 | DeepSeek 官方 `https://api.deepseek.com/v1/chat/completions` | 本地 `.env.local` | `deepseek-v4-flash` | 只用于区分供应商与产品代理故障，不作为发布门禁 |

两条通道都一次生成六张决定牌：首组三张立即展示，第二组三张供本节点第一次 Roll 使用。第二、第三次 Roll 会分别发起一次新的 A/B/C 三牌请求。

## 本地配置

复制 `.env.example` 为不会进入 Git 的 `.env.local`，填写：

```dotenv
DEEPSEEK_API_KEY=你的本地测试密钥
DEEPSEEK_MODEL=deepseek-v4-flash
```

普通浏览器只请求同源 `/api/deepseek/completions`；本地 Worker 从环境变量读取密钥并请求 DeepSeek 官方接口。密钥不会写入卡牌数据、浏览器请求体或构建产物。

localhost 使用开发者自己的 Key，Sites 使用服务端 Key。两者都不设置产品侧访客、IP、全站、分钟或每日请求限额，也不再依赖 D1 用量桶；每个通过稳定游戏协议校验的请求都会立即转发。Worker 的 400 只保留给无效 JSON、错误版本、跨站请求、错误系统协议、阶段或请求类型，具体中文 `task` 文案只要求存在，不参与白名单匹配。DeepSeek 上游仍可能因账户或供应商容量返回 429，客户端按其 `Retry-After` 做有限重试。互动空间完全绕过该 Worker，只使用平台注入的 `tt.callAIChatCompletion` 和火山凭据。

## 自动验证

- `src/services/deepseek.direct.test.ts`：Node 环境验证 DeepSeek 官方地址、Bearer 鉴权、V4 Flash、JSON 流式协议与 fast 非思考模式，也验证发布长测能切换到本地 Worker 且不携带密钥或供应商参数。
- `src/services/deepseek.test.ts`：浏览器环境验证同源 Worker 代理不会暴露密钥。
- `src/services/deepseek.interactive.test.ts`：互动空间环境验证 `tt.callAIChatCompletion`、官方原始文本 SSE、旧版 provider SSE、平台信息事件和固定 V4 Flash。
- `src/server/deepseekProxyContract.test.ts`：使用正式的幕次、Roll 和双结局 prompt 构造器生成请求，验证 Worker 接受产品真实协议和任务文案演进、拒绝错误系统协议，并确认公开请求不经过产品侧限流。

涉及 prompt、幕次任务、DeepSeek 传输或 Worker 协议的发布，先启动本地产品，再执行：

```bash
SOAK_LIMIT=5 \
SOAK_CONCURRENCY=2 \
SOAK_MIN_RUN_SUCCESS_RATE=0.8 \
SOAK_MIN_GENERATION_SUCCESS_RATE=0.95 \
SOAK_PROXY_BASE_URL=http://localhost:3003 \
SOAK_REQUIRE_PROXY=1 \
npm run test:soak
```

`SOAK_REQUIRE_PROXY=1` 会在报告中强制确认 `transport.kind` 为 `local-worker-proxy`，避免直连 DeepSeek 的成功结果掩盖 Worker 拒绝浏览器请求的问题。
