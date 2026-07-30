# outputContract 格式问题

## 问题

`outputContract` 是 prompt payload 里的一个对象，被 `JSON.stringify` 序列化后发给模型。模型看到的实际文本类似：

```json
{
  "outputContract": {
    "compactShape": "{\"b\":\"一生纪事\",\"s\":\"一生概括\",\"d\":[\"死亡地点\",\"临终场景\",\"身后遗产\"]}",
    "exactFields": "只输出 b、s、d",
    "lifeStory": "190-250字，自然普通话，连贯有起伏，以主角死亡和完整句号收束",
    "lifespanSummary": "22-36字完整短句",
    "deathScene": "d 恰好三项：纯地点（不含年份、年龄或分隔符）、18-30字临终完整句、14-26字身后遗产完整句"
  }
}
```

有三个结构性问题：

### 1. `compactShape` 被双重 JSON 编码

`compactShape` 的值本身就是一个 JSON 对象，但被作为 JSON 字符串嵌入在 payload 里。模型需要先解析外层 JSON，再把 `compactShape` 的值当 JSON 二次解析。对能力较弱的模型，这个值就是一段难以理解的转义文本。

### 2. 输出规范以 KV 对散列分布而非连贯自然语言

各条约束散落在不同的键里，模型需要自行拼成完整的格式理解。

### 3. `outputContract` 被 repair pipeline 耦合

`buildJsonRepairMessages` 会从 `outputContract` 对象中按字段名读取规则。这个设计耦合导致不能直接把 `outputContract` 改成纯文本——代码依赖它的对象结构来索引字段。因此问题 3 是独立的，不会因为下面的方案而消失，只是被绕过了。

---

## 方案：在构建提示词时提取值，拼成字符串

`outputContract` 对象本身不动，repair pipeline 照常读它的键。但在 `messages()` / `endingMessages()` / `turnMessages()` 构建提示词内容时，遍历 `outputContract` 的 entries，把值提取出来拼成一段自然语言字符串，替换掉原对象再序列化。

```ts
function stringifyPayload(raw: unknown): string {
  const payload = raw as Record<string, unknown> | null;
  if (!payload || typeof payload.outputContract !== "object" || payload.outputContract === null || Array.isArray(payload.outputContract)) {
    return JSON.stringify(payload);
  }
  const contract = payload.outputContract as Record<string, unknown>;
  const lines: string[] = [];
  for (const [key, value] of Object.entries(contract)) {
    if (key === "compactShape" || key === "shape") {
      lines.push(`必须以以下格式输出：${String(value)}`);
    } else if (key === "example" || key === "rules") {
      lines.push(`${key}：${JSON.stringify(value, null, 2)}`);
    } else if (Array.isArray(value)) {
      lines.push(`${key}：${(value as unknown[]).join("、")}`);
    } else if (typeof value === "string") {
      lines.push(`${key}：${value}`);
    }
  }
  return JSON.stringify({ ...payload, outputContract: lines.join("\n") });
}
```

模型收到的结果：

```json
{
  "outputContract": "必须以以下格式输出：{\"b\":\"一生纪事\",\"s\":\"一生概括\",\"d\":[\"死亡地点\",\"临终场景\",\"身后遗产\"]}\nexactFields：只输出 b、s、d\nlifeStory：190-250字，自然普通话，连贯有起伏，以主角死亡和完整句号收束\nlifespanSummary：22-36字完整短句\ndeathScene：d 恰好三项：纯地点（不含年份、年龄或分隔符）、18-30字临终完整句、14-26字身后遗产完整句"
}
```

改动范围：
- `prompts.ts`：`messages()` / `endingMessages()` / `turnMessages()` 中把 `JSON.stringify(payload)` 换成 `stringifyPayload(payload)`
- `prompts.test.ts`：调整断言，因为 `outputContract` 不再以对象形式出现在序列化结果中

---

## 涉及的全部 outputContract 位置

| 函数 | outputContract 结构 | 改不改 |
|---|---|---|
| `turnContract()` → `TURN_PROTOCOL` | shape、cardShape、rules、example | 不改，system message |
| `buildContinuationMessages` | shape、lengths、order、injected | 改 |
| `buildCustomActionMessages` | requiredFields、declaredOutcome 等 | 改 |
| `buildBiographyMessages` | compactShape、exactFields、lifeStory 等 | 改 |
| `buildWorldReportMessages` | compactShape、exactFields、titles 等 | 改 |
