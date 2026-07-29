# LLM Tap 解析视图不显示紧凑格式卡片

## 问题

在 `tap.html` 的「输出」→「解析」视图中，含有紧凑单字母 key 的请求只能看到「其他字段」，看不到卡片结构化展示。

## 根因

LLM 响应使用紧凑单字母 key 以减少 token（turn 类用 `s`/`c`/`r`，ending 类用 `b`/`s`/`d`/`n`/`h`/`p`/`o`/`e`），而 `OutputView` 硬编码查找全名 key（`choices`/`rollChoices`/`headline` 等），匹配不上则所有字段落入「其他字段」。

## 紧凑 key 映射

### Turn 紧凑格式 — `s`（场景数组）+ `c`/`r`（选择集）

`s` 数组（9 或 11 元素）：

| 索引 | 含义 |
|------|------|
| 0 | headline |
| 1 | narrative |
| 2 | location |
| 3 | role |
| 4 | timePressure |
| 5 | causalBridge |
| 6 | worldStateChange |
| 7 | divergenceProof |
| 8 | historicalAnchors（9元素版本 = `[location, role]`）|
| 9 | visualTone（11元素版本）|
| 10 | protagonistName（11元素版本）|

`c` / `r` 数组 — 每项 `[displayLabel, label, target, [directResult, unexpectedCost, beneficiary, payer]]`：

| 索引 | 含义 |
|------|------|
| 0 | displayLabel（短名） |
| 1 | label（完整决定） |
| 2 | target（对象） |
| 3 | echo 四元组: `[结果, 代价, 受益者, 承担者]` |

### 传记（ending biography）紧凑格式

| 紧凑 key | 含义 | 类型 |
|----------|------|------|
| `b` | 一生纪事 | 190-250 字叙事 |
| `s` | 一生总述 | 22-36 字短句 |
| `d` | 死亡场景 | 三元组: `[地点, 临终场景, 身后遗产]` |

### 世界报告（ending world report）紧凑格式

| 紧凑 key | 含义 | 类型 |
|----------|------|------|
| `n` | 世界名 | ≤16 字 |
| `h` | 头版标题 | ≤28 字 |
| `p` | 身后时代记 | `[[时期, 标题, 叙事, 继承结果]]×4` |
| `o` | 2026 生活三景 | `[生活句×3]` |
| `e` | 小说尾声 | 45-70 字 |

### 其他额外字段（schema 未定义，格式不稳定）

`c`, `t`, `g`, `x`, `z`, `i`, `l`, `r`, `q`, `u`, `a`

## 修复

`src/tap/components/OutputView.tsx` 新增两个检测分支：

1. **Turn 紧凑格式**: 检测 `s` 为数组且 `c` 为数组 → `expandScene()` 展开 scene，`CompactTurnCard` 渲染选择卡
2. **Ending 紧凑格式**: 检测 `b` 或 `n` 为字符串 → `COMPACT_RENDERERS` 映射表按 label 渲染

检测优先级：error → compact turn → compact ending → 原始全名格式。

`useTapChannel.ts` 的 `clear()` 同时广播 `{ type: "clear" }` 到所有标签页。

**未完成**：游戏标签页（`src/services/deepseek.ts` 的 BroadcastChannel listener）不处理 `clear` 消息，清空后游戏页面的内存里仍保留旧记录。刷新 tap 页面后发送 `sync-request`，游戏页面回复全部旧数据，tap 又重新加载。需要给 `deepseek.ts` 的 broadcast listener 也添加 `clear` 消息处理才能彻底解决。
