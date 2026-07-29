# LLM Tap 使用说明

独立调试页面，捕获并展示每次 DeepSeek 生成的完整输入（prompt messages）和输出（模型响应）。

## 启动

项目 dev server 启动后，打开 `http://localhost:{port}/tap.html`。

游戏和 tap 页面必须在**同一个端口**下（BroadcastChannel 跨端口不通）。

## 功能

### 顶栏

- **◀ ▶**：切换历史请求
- **第 N/M 请求**：当前查看的位置
- **请求类型标签**：续幕·主请求 / 字段修复 / Roll / 结局 等
- **耗时**：总耗时（秒）
- **✅/❌**：成功/失败

### Tab：输入

展示发给 DeepSeek 的 messages 数组：

- **SYSTEM**：系统身份和写作规则
- **Protocol**：输出合约（字段说明 + exactShapeExample）
- **USER**：任务 payload，各字段可折叠展开（task、historyMoment、narrativeContext、authoritativeTimelineNode 等）

### Tab：输出

- **解析视图**（默认）：展示模型响应的结构化内容——标题、叙事、地点/角色/时限、六张卡牌（含 actionSpec 和 instantEcho 详情）
- **原始 JSON**：模型返回的完整字符串

### Tab：指标

请求类型、状态码、时序（首次 reasoning token / 首次 content token / 总耗时）、token 用量（prompt / completion / reasoning / cache）。

### 操作

- **导出**：顶栏右侧"导出"按钮，下载完整日志为 JSON 文件
- **清空**：顶栏右侧"清空"按钮，清除所有历史记录（localStorage 同步清除）

## 数据流

```
deepseek.ts → BroadcastChannel("llm-tap-v1")
                    ↓
tap.html ← onmessage → 内存数组 + localStorage 持久化 → 翻页展示
```

历史记录自动保存至 localStorage（最多 200 条），刷新页面不丢失。

## 不包含在生产构建中

- `npm run build` 默认不打包 `tap.html` 和 `src/tap/` 下的代码
- 交互审核包使用 `vite.interactive.config.ts` + `deepseek.interactive.ts`，完全与此无关
