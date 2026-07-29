# LLM Tap：DeepSeek 请求输入输出调试工具

## 设计目标

一个快捷小巧的独立调试页面，捕获并展示每次 DeepSeek 生成的完整输入（messages）和输出（响应 JSON），让开发者在游戏中随时回溯每次模型调用发生了什么。

## 为什么需要这个工具

当前项目对 DeepSeek 的调用已经高度封装：prompt 构建在 `prompts.ts`、网络请求在 `deepseek.ts`、解析和校验在 `engine.ts`。开发时想确认"发出去的 prompt 到底长什么样""返回的 JSON 为什么解析失败"没有直接手段——只能加 `console.log` 或者到网络面板里翻 Payload。

这个工具解决三件事：
1. 每次请求的完整消息随时可查，不在控制台里丢失
2. 输入/输出并排对比，快速定位 prompt 设计和模型响应之间的偏差
3. 天然按"一次请求一页"组织，匹配游戏按章节推进的结构

## 架构

### 数据流

```
游戏主进程                           LLM Tap 页面（localhost:5173/tap.html）
─────────────────                   ──────────────────────────────────────────
prompts.ts 构建 messages
        ↓
engine.ts 调用 requestCompletion
        ↓
deepseek.ts 发送 fetch
        ↓ 成功拿到结果后
   BroadcastChannel.postMessage({       ←── import.meta.env.DEV 才执行
     kind: req.metrics.requestKind,
     messages: 完整 ChatMessage[],
     response: 模型返回的原始 JSON 字符串,
     parsed: 解析后的结构化对象,
     timing: { totalMs, firstTokenMs, ... },
     usage: 模型用量,
     error: 如果有,
   })
                                            ↙ BroadcastChannel.onmessage
                                       Tap 收到消息 →
                                      存储到内存数组 →
                                      跳转到最新一条 /
                                      保持当前页不变
```

### 通信机制

- **频道名**：`"llm-tap-v1"`
- **消息类型**：`{ type: "request" | "sync-reply" | "sync-request", payload: ... }`
- `"request"`：新的请求完成记录
- `"sync-request"`：tap 页面打开时向游戏 tab 请求历史记录
- `"sync-reply"`：游戏 tab 回应历史记录数组

### 游戏端注入

在 `deepseek.ts` 的 `requestCompletion` 内，成功获取响应或失败后，增加一段 DEV-only 的广播：

```typescript
if (import.meta.env.DEV) {
  channel.postMessage({
    type: "request",
    payload: {
      id: crypto.randomUUID(),
      kind: requestKind,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      response: result.content,
      parsed: parsedObject,  // 尝试 parse，失败则为 null
      timing: { totalMs, firstTokenMs, firstReasoningTokenMs },
      usage: result.usage,
      status: responseStatus,
      error: error ? { code, message } : null,
      timestamp: Date.now(),
    },
  });
}
```

改动最小：只加一段无副作用的广播，ENV guard 确保 production build 中被 tree-shake 掉。

交互审核包 (`deepseek.interactive.ts`) 完全不涉及，零改动。

## UI 设计

### 页面结构

tap 页面是独立 HTML 入口，不依赖游戏主应用任何样式或组件。

```
┌──────────────────────────────────────────────────────────┐
│  ◀ ▸  LLM Tap  第 3/12 请求  续幕·第 2 幕  12.3s  ✅   │  ← 顶栏
├──────────────────────────────────────────────────────────┤
│  [输入]  [输出]  [指标]                                  │  ← Tab
├──────────────────────────────────────────────────────────┤
│                                                          │
│  （内容区域，取决于选中 Tab）                              │
│                                                          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 顶栏

- **◀ ▸**：翻页按钮，左右切换历史请求
- **LLM Tap**：标识
- **第 N/M 请求**：当前位置 / 总数
- **请求类型标签**：续幕·第2幕 / Roll第2次 / 修复 / 列传 / 世界报告 等
- **耗时**：总耗时
- **状态图标**：✅ 成功 / ❌ 失败 / ⏳ 重试

### Tab：输入

展示 `messages` 数组，按 role 分组折叠：

- **System**：系统身份（TIMELINE_SYSTEM_PROMPT）
- **Protocol**：输出合约（TURN_PROTOCOL）
- **User**：任务 payload（JSON 格式化展示，各字段可折叠）

User payload 可展开 `task`、`historyMoment`、`authoritativeTimelineNode`、`authoritativeProtagonist`、`narrativeContext`、`latestPlayerFactForThisScene`、`submissionChecklist` 等字段。

如果包含 `narrativeContext.playerCanon`，展示为可读的表格。

### Tab：输出

- **原始 JSON**：模型返回的完整字符串，语法高亮
- **解析结果**（如果成功 parse）：结构化展示
  - timeline turn：headline、narrative、choices（六张牌展开）、causalLedger 等
  - choices 中的每张牌展示 displayLabel、label、intent、actionSpec、instantEcho
  - ending report：列传/世界报告各字段

### Tab：指标

- 请求类型、重试次数、状态码
- 第一次 reasoning token 时间
- 第一次 content token 时间
- 总耗时
- Token 用量：prompt、completion、reasoning
- Cache 命中率（如有）

## 文件结构

```
项目根目录
├── tap.html                    # 独立入口页面
└── src/tap/
    ├── main.tsx                # React 入口
    ├── App.tsx                 # 主应用：频道监听 + 状态管理 + UI 框架
    ├── types.ts                # 消息类型定义
    ├── components/
    │   ├── TopBar.tsx          # 翻页 + 请求信息
    │   ├── TabBar.tsx          # 输入/输出/指标 Tab
    │   ├── InputView.tsx       # messages 展示 + 折叠
    │   ├── OutputView.tsx      # 原始 JSON + 解析视图
    │   ├── MetricsView.tsx     # 性能指标面板
    │   └── JsonBlock.tsx       # JSON 格式化 + 语法高亮组件
    └── hooks/
        └── useTapChannel.ts    # BroadcastChannel 封装
```

## 构建与部署

- **开发中**：`tap.html` 在项目根目录，Vite dev 自动 serve 为 `localhost:5173/tap.html`
- **生产构建**：Vite 默认只构建 `rollupOptions.input` 中的入口，`tap.html` 不会被包含
- **交互审核包**：使用 `vite.interactive.config.ts` + `dist-interactive` 目录，完全无关
- **Git 仓库**：`tap.html` 和 `src/tap/` 正常提交，不影响生产代码

## 边界情况

| 场景 | 行为 |
|------|------|
| 先开游戏再开 tap | tap 打开时发送 `sync-request`，游戏 tab 回复完整历史 |
| 先开 tap 再开游戏 | tap 显示"等待第一个请求…」，请求到达后自动展示 |
| 两个游戏 tab | 各自广播自己的请求；tap 混合同一频道，按 tab + 时间排序 |
| 游戏刷新 / 重开 | 内存历史清空，新请求重新累积 |
| tap 页面刷新 | 同源游戏 tab 仍在时，sync 恢复历史 |
| 无游戏 tab 在线 | tap 显示"未检测到游戏进程，请打开游戏页面" |
| 请求失败 | 记录 error 信息，输出 Tab 显示错误原因和状态码 |
| 多个连续请求 | 正确 append 到历史数组，不覆盖 |

## 不改动的部分

- `deepseek.ts` 的请求逻辑：只加一行无副作用的广播
- `deepseek.interactive.ts`：完全不动
- 构建配置：不需要修改 vite.config.ts 或 interactive build 配置
- 游戏样式：tap 页面完全独立
- 依赖：不新增 npm 包
