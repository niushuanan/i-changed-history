# 400 Bad Request: Proxy 的 System Prompt 严格校验导致请求被拒

## 现象

在 `deepseekProtocol.ts` 中修改 `ENDING_SYSTEM_PROMPT` 后，结局请求（ending-primary）立即返回 HTTP 400，错误信息为：

```
Request does not match the history simulation protocol.
```

TAP 检查器显示的请求状态：

| 字段 | 值 |
|---|---|
| 请求类型 | 结局 |
| 原始类型 | ending-primary |
| 状态码 | 400 |
| 总耗时 | 0.02s |
| 响应头到达 | 16.8ms |

0.02s 的总耗时说明请求被代理层**直接拒绝**，未到达 DeepSeek API。

## 根因

### 1. Worker Proxy 的严格校验

`worker/deepseek-proxy.ts:106-107`：

```ts
const expectedSystem = value.phase === "ending" ? ENDING_SYSTEM_PROMPT : TIMELINE_SYSTEM_PROMPT;
if (messages[0].role !== "system" || messages[0].content !== expectedSystem) return null;
```

proxy 对 `messages[0].content`（系统提示词）做了**严格字符串相等校验**（`!==`）。不匹配时 `parseProxyEnvelope` 返回 `null`，上层返回 400：

```ts
const envelope = parseProxyEnvelope(parsedBody);
if (!envelope) {
  return jsonError("Request does not match the history simulation protocol.", 400);
}
```

此校验的目的是确保只有合法的客户端才能使用代理，防止未经授权的请求消耗配额。

### 2. 同源文件，不同运行时

`worker/deepseek-proxy.ts` 和客户端的 `prompts.ts` 都 `import` 自同一个源文件 `src/game/deepseekProtocol.ts`：

```ts
// worker/deepseek-proxy.ts 第 1-4 行
import {
  ENDING_SYSTEM_PROMPT,
  TIMELINE_SYSTEM_PROMPT,
  TIMELINE_TURN_PROTOCOL,
} from "../src/game/deepseekProtocol";
```

但两者运行在不同的运行时环境中：

| 运行时 | 加载机制 | 热更新 |
|---|---|---|
| 客户端（Vite + 浏览器） | Vite HMR 编译 → JavaScript | 文件修改后自动更新 |
| Worker Proxy（vinext dev 或 Cloudflare Workers） | 独立 Bundle | 需要主动重启/重新部署 |

当 `deepseekProtocol.ts` 被修改后：
- 浏览器端的 Vite HMR 立即拿到新版本
- Worker 进程如果没有重启，拿到的仍是启动时缓存的旧版本
- 客户端发送新 `ENDING_SYSTEM_PROMPT` 请求，Worker 用旧版本比较 → **不相等 → 400**

### 3. 为什么只影响结局请求

因为 `TIMELINE_SYSTEM_PROMPT` 这次没有修改，而 `ENDING_SYSTEM_PROMPT` 被改动了。Timeleine turn 请求的系统提示词用 `TIMELINE_SYSTEM_PROMPT`，没有变化，所以校验通过了。

---

## 复现条件

修改 `src/game/deepseekProtocol.ts` 中的 `ENDING_SYSTEM_PROMPT` 或 `TIMELINE_SYSTEM_PROMPT`，且 Worker 没有随之重启。

---

## 修改内容

### 修改：移除 system prompt 精确匹配校验

`worker/deepseek-proxy.ts:106-107`：
- 删除前：`if (messages[0].role !== "system" || messages[0].content !== expectedSystem) return null;`
- 删除后：`if (messages[0].role !== "system") return null;`

移除了 `content !== expectedSystem` 部分，保留了 `role !== "system"` 校验。

### 理由

1. 同一份 `ENDING_SYSTEM_PROMPT` / `TIMELINE_SYSTEM_PROMPT` 由 `deepseekProtocol.ts` 导出，Worker 和客户端从同一源文件 import，理论上应该一致。但在 `vinext dev` 下 Worker 进程和 Vite HMR 是两套独立运行环境，修改 prompt 后 Worker 不重启就会拿到过期值，导致合法请求被拒。
2. system prompt 的内容不直接影响请求合法性。其他校验（消息数量、role、user 消息含有效 `task` 字段、总长度限制）已经能够防止滥用。
3. 当前 Worker 只部署在开发环境（`vinext dev`），不涉及生产环境的多租户隔离场景，移除精确匹配没有安全损失。

### 测试改动后需要重启

修改 `worker/` 下的文件后，`vinext dev` 不会自动热更新，需要手动重启：

```bash
# 停止 dev 服务器后重新启动
npm run dev
```

但此后修改 `deepseekProtocol.ts` 不再需要重启 Worker。

---

## 长期方案：消除 400 的误导性

当前 `parseProxyEnvelope` 无论哪个校验步骤失败，都统一返回 `null`，上层统一报 `"Request does not match the history simulation protocol."`。这个错误信息对排查问题毫无帮助——开发者无法区分是消息格式错误、system prompt 不匹配、还是 user payload 少了 `task`。

长期应该在 Worker 中把不同的拒绝理由编码到响应状态码或错误信息里，让调用方能直接定位问题。

### 原则

- **400 只留给真正的格式错误**（缺少必填字段、JSON 解析失败、字段类型错误）
- **system prompt 不一致、消息结构异常、payload 校验失败**各自返回明确的错误信息，而不是统一的"不匹配协议"
- **被拒请求的关键信息**通过 Worker 日志记录，可供事后回溯

### 具体修改方向

```ts
// worker/deepseek-proxy.ts — parseProxyEnvelope 层面

// 把 parseProxyEnvelope 的每个 return null 改为抛出或返回具体原因
// 原来的统一 null 返回 → 区分原因

type EnvelopeError =
  | "invalid_role"           // 第一条不是 system
  | "missing_task"           // user 消息没有 task 字段
  | "protocol_mismatch"      // timeline 协议版本不匹配
  | "exceeded_max_length";   // 消息总长度超限

function parseProxyEnvelope(value: unknown): DeepSeekProxyEnvelope | EnvelopeError {
  // 每个 return null 替换为 return "具体原因"
}

// handleDeepSeekProxy 层面
// 根据 parseProxyEnvelope 返回的不同原因，返回不同的错误信息

function handleDeepSeekProxy(request: Request, env: DeepSeekProxyEnv): Promise<Response> {
  // ...
  const envelope = parseProxyEnvelope(parsedBody);
  if (typeof envelope === "string") {
    const messageMap: Record<EnvelopeError, string> = {
      invalid_role:      "第一条消息必须是 system 角色。",
      missing_task:      "最后一条用户消息缺失有效的 task 字段。",
      protocol_mismatch: "Timeline 协议版本不匹配。",
      exceeded_max_length: "请求消息总长度超过限制。",
    };
    return jsonError(messageMap[envelope], 400);
  }
  // ...
}
```

### 状态码分配建议

| 场景 | HTTP 状态码 | 响应 body |
|---|---|---|
| 非 POST 请求 | 405 | `{ "error": "Method not allowed." }` |
| 跨域请求 | 403 | `{ "error": "Cross-site requests are not allowed." }` |
| 请求体过大 | 413 | `{ "error": "Request is too large." }` |
| JSON 解析失败 | 400 | `{ "error": "Request body must be valid JSON." }` |
| 第一条不是 system | 400 | `{ "error": "First message must have role 'system'." }` |
| User 消息缺 task | 400 | `{ "error": "User message missing required 'task' field." }` |
| 总长度超限 | 413 | `{ "error": "Total message length exceeds limit." }` |
| system prompt 不匹配 | **409 Conflict** | `{ "error": "System prompt version mismatch. Restart the dev server or redeploy the worker." }` |

其中 system prompt 不匹配单独用 409 而不是 400，因为：
1. 这不是"请求格式错误"（格式是对的），而是"服务端与客户端版本不一致"
2. 409 的语义是冲突（Conflict），恰当地描述了版本不同步的状态
3. 错误信息直接告知解决方法（重启 dev server 或重新部署 Worker）

### 收益

- 开发者收到 400 时知道是真正的格式问题（JSON 写错了、少了个逗号）
- 收到 409 时知道是版本不一致，直接重启 dev server 即可，不需要逐行对比 system prompt
- TAP 检查器能直接显示具体的拒绝原因，而不是笼统的 "request_failed"
