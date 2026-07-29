# LLM Tap Inspector Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A standalone debug page (`/tap.html`) that captures and displays every DeepSeek API request's input (messages) and output (response JSON) during development.

**Architecture:** Game side injects a DEV-only BroadcastChannel postMessage in `deepseek.ts`; tap page is a self-contained React SPA at `tap.html` served by Vite dev server, listening on the same BroadcastChannel.

**Tech Stack:** React 18, TypeScript, Vite (existing), BroadcastChannel API

## Global Constraints

- Inject in `src/services/deepseek.ts` only (NOT `deepseek.interactive.ts`)
- Guard broadcast with `import.meta.env.DEV` for tree-shaking in production
- tap page must be completely independent — no imports from game's `src/` beyond types
- No new npm dependencies
- BroadcastChannel channel name: `"llm-tap-v1"`

---

### Task 1: Inject BroadcastChannel into deepseek.ts

**Files:**
- Modify: `src/services/deepseek.ts` (two injection points: success and error paths in `performRequest`)

**Interfaces:**
- Consumes: `requestKind: DeepSeekRequestKind`, `messages: readonly ChatMessage[]`, `result: CompletionReadResult`, `timing`, `attempt`, `responseStatus`
- Produces: BroadcastChannel messages at `"llm-tap-v1"` with type `TapRequestMessage`
- Defines type `TapRequestPayload` in the file's local scope (or imported from a shared type — but since tap is independent, duplicate the type definition in both sides)

- [ ] **Add BroadcastChannel setup at top of performRequest**

```typescript
// Near the top of performRequest, after the reasoning/requestKind lines
const TAP_CHANNEL = import.meta.env.DEV ? "llm-tap-v1" : null;
```

- [ ] **Add broadcast helper inside performRequest (local function)**

```typescript
const broadcast = (payload: {
  kind: string;
  messages: readonly ChatMessage[];
  response: string | null;
  timing: { totalMs: number; responseHeadersMs?: number; firstReasoningTokenMs?: number; firstContentTokenMs?: number };
  usage?: DeepSeekUsage;
  status?: number;
  error?: { code: string; message: string } | null;
}) => {
  if (!TAP_CHANNEL) return;
  try {
    const channel = new BroadcastChannel(TAP_CHANNEL);
    channel.postMessage({
      type: "request",
      payload: {
        id: crypto.randomUUID(),
        kind: payload.kind,
        messages: payload.messages.map(m => ({ role: m.role, content: m.content })),
        response: payload.response,
        timing: payload.timing,
        usage: payload.usage ?? null,
        status: payload.status ?? 0,
        error: payload.error ?? null,
        timestamp: Date.now(),
      },
    });
    channel.close();
  } catch {
    // Broadcast must never interrupt the request.
  }
};
```

- [ ] **Add success broadcast before the return at line ~515**

```typescript
    reportMetrics(options.onMetrics, {
      phase: options.phase,
      requestKind,
      reasoning,
      attempt,
      outcome: "success",
      responseHeadersMs,
      firstReasoningTokenMs: result.firstReasoningTokenMs,
      firstContentTokenMs: result.firstContentTokenMs,
      totalMs: clockNow() - startedAt,
      status: responseStatus,
      usage: result.usage,
    });
    // Add after the reportMetrics call, before `return result.content;`:
    broadcast({
      kind: requestKind,
      messages,
      response: result.content,
      timing: { totalMs: clockNow() - startedAt, responseHeadersMs, firstReasoningTokenMs: result.firstReasoningTokenMs, firstContentTokenMs: result.firstContentTokenMs },
      usage: result.usage,
      status: responseStatus,
    });
    return result.content;
```

- [ ] **Add error broadcast in the catch block (~line 516)**

```typescript
  } catch (error) {
    const normalized = error instanceof DeepSeekError
      ? error
      : new DeepSeekError("request_failed", "推演请求失败，请重新推演这一幕。");
    reportMetrics(options.onMetrics, {
      phase: options.phase,
      requestKind,
      reasoning,
      attempt,
      outcome: "error",
      responseHeadersMs,
      totalMs: clockNow() - startedAt,
      status: responseStatus ?? normalized.status,
      errorCode: normalized.code,
    });
    // Add after the reportMetrics call:
    broadcast({
      kind: requestKind,
      messages,
      response: null,
      timing: { totalMs: clockNow() - startedAt, responseHeadersMs },
      status: responseStatus ?? normalized.status,
      error: { code: normalized.code, message: normalized.message },
    });
    throw error;
  }
```

- [ ] **Verify**

Run: `npx tsc --noEmit`
Expected: TypeScript passes with no errors related to the broadcast injection.

---

### Task 2: Scaffold tap.html and src/tap/ entry

**Files:**
- Create: `tap.html`
- Create: `src/tap/main.tsx`
- Create: `src/tap/types.ts`

**Interfaces:**
- Consumes: nothing from game code
- Produces: `tap.html` as Vite dev entry; `main.tsx` renders `<App />` into `#root`; `types.ts` exports shared types for the rest of the tap app

- [ ] **Create tap.html**

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="dark" />
    <title>LLM Tap</title>
    <style>
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "SF Mono", "Fira Code", monospace;
        background: #0d0d0d;
        color: #e0e0e0;
        font-size: 13px;
        line-height: 1.5;
        height: 100vh;
        overflow: hidden;
      }
      #root { height: 100vh; display: flex; flex-direction: column; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/tap/main.tsx"></script>
  </body>
</html>
```

- [ ] **Create src/tap/types.ts**

```typescript
export type TapRecord = {
  id: string;
  kind: string;
  messages: readonly { role: "system" | "user"; content: string }[];
  response: string | null;
  timing: {
    totalMs: number;
    responseHeadersMs?: number;
    firstReasoningTokenMs?: number;
    firstContentTokenMs?: number;
  };
  usage: {
    promptTokens?: number;
    promptCacheHitTokens?: number;
    promptCacheMissTokens?: number;
    completionTokens?: number;
    reasoningTokens?: number;
    totalTokens?: number;
  } | null;
  status: number;
  error: { code: string; message: string } | null;
  timestamp: number;
};

export type TapChannelMessage =
  | { type: "request"; payload: TapRecord }
  | { type: "sync-request" }
  | { type: "sync-reply"; payload: TapRecord[] };

export type TapTab = "input" | "output" | "metrics";
```

- [ ] **Create src/tap/main.tsx**

```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Verify**

Run: `npx tsc --noEmit`
Visit: `http://localhost:5173/tap.html` in dev mode
Expected: page loads, renders empty state (App not yet implemented, so may be blank — that's fine)

---

### Task 3: Create useTapChannel hook

**Files:**
- Create: `src/tap/hooks/useTapChannel.ts`

**Interfaces:**
- Consumes: `TapChannelMessage`, `TapRecord` from types
- Produces: `{ records: TapRecord[], currentIndex: number, goNext: () => void, goPrev: () => void, latestStamp: number }`

- [ ] **Create the hook**

```typescript
import { useCallback, useEffect, useRef, useState } from "react";
import type { TapRecord, TapChannelMessage } from "../types";

const CHANNEL_NAME = "llm-tap-v1";

function isTapMessage(data: unknown): data is TapChannelMessage {
  if (typeof data !== "object" || data === null) return false;
  const msg = data as Record<string, unknown>;
  return msg.type === "request" || msg.type === "sync-request" || msg.type === "sync-reply";
}

export function useTapChannel(initialGoLatest = true) {
  const [records, setRecords] = useState<TapRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const recordsRef = useRef<TapRecord[]>([]);

  const goNext = useCallback(() => {
    setCurrentIndex(i => Math.min(i + 1, recordsRef.current.length - 1));
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex(i => Math.max(i - 1, 0));
  }, []);

  const goLatest = useCallback(() => {
    setCurrentIndex(Math.max(0, recordsRef.current.length - 1));
  }, []);

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    channel.onmessage = (event: MessageEvent<unknown>) => {
      if (!isTapMessage(event.data)) return;

      if (event.data.type === "request") {
        const record = event.data.payload;
        recordsRef.current = [...recordsRef.current, record];
        setRecords(recordsRef.current);
        if (initialGoLatest) {
          setCurrentIndex(recordsRef.current.length - 1);
        }
      } else if (event.data.type === "sync-request") {
        // Reply with all records we have
        channel.postMessage({
          type: "sync-reply",
          payload: recordsRef.current,
        } satisfies TapChannelMessage);
      } else if (event.data.type === "sync-reply") {
        const incoming = event.data.payload;
        if (incoming.length > recordsRef.current.length) {
          recordsRef.current = incoming;
          setRecords(incoming);
          if (initialGoLatest) {
            setCurrentIndex(incoming.length - 1);
          }
        }
      }
    };

    // Request sync from any game tabs that already have history
    channel.postMessage({ type: "sync-request" } satisfies TapChannelMessage);

    return () => channel.close();
  }, [initialGoLatest]);

  return { records, currentIndex, goNext, goPrev, goLatest } as const;
}
```

- [ ] **Verify**

Run: `npx tsc --noEmit`
Expected: TypeScript passes.

---

### Task 4: Create App shell with TopBar and TabBar

**Files:**
- Create: `src/tap/App.tsx`
- Create: `src/tap/components/TopBar.tsx`
- Create: `src/tap/components/TabBar.tsx`

**Interfaces:**
- Consumes: `useTapChannel` hook, `TapRecord`, `TapTab` from types
- Produces: Full app shell with navigation and tab switching

- [ ] **Create TopBar.tsx**

```tsx
import type { TapRecord } from "../types";

function kindLabel(kind: string): string {
  if (kind.includes("turn-primary")) return "续幕·主请求";
  if (kind.includes("turn-repair")) return "续幕·字段修复";
  if (kind.includes("turn-recovery")) return "续幕·高推理恢复";
  if (kind.includes("roll-primary")) return "Roll · 主请求";
  if (kind.includes("roll-repair")) return "Roll · 字段修复";
  if (kind.includes("roll-recovery")) return "Roll · 高推理恢复";
  if (kind.includes("ending-primary")) return "结局·主请求";
  if (kind.includes("ending-repair")) return "结局·字段修复";
  if (kind.includes("ending-recovery")) return "结局·高推理恢复";
  return kind;
}

function statusIcon(record: TapRecord): string {
  if (record.error) return "❌";
  if (record.status >= 400) return "⚠️";
  return "✅";
}

type TopBarProps = {
  records: readonly TapRecord[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
};

export function TopBar({ records, currentIndex, onPrev, onNext }: TopBarProps) {
  const record = records[currentIndex];
  const total = records.length;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "8px",
      padding: "10px 14px", background: "#1a1a1a", borderBottom: "1px solid #333",
      userSelect: "none", flexShrink: 0,
    }}>
      <button onClick={onPrev} disabled={currentIndex <= 0}
        style={{ background: "none", border: "1px solid #444", color: "#ccc", borderRadius: "4px", padding: "2px 8px", cursor: "pointer", fontSize: "14px", opacity: currentIndex <= 0 ? 0.3 : 1 }}>
        ◀
      </button>
      <button onClick={onNext} disabled={currentIndex >= total - 1}
        style={{ background: "none", border: "1px solid #444", color: "#ccc", borderRadius: "4px", padding: "2px 8px", cursor: "pointer", fontSize: "14px", opacity: currentIndex >= total - 1 ? 0.3 : 1 }}>
        ▶
      </button>
      <span style={{ fontWeight: 600, color: "#aaa", marginLeft: "4px", fontFamily: "system-ui, sans-serif" }}>LLM Tap</span>
      <span style={{ color: "#666", fontFamily: "system-ui, sans-serif" }}>
        {total > 0 ? `第 ${currentIndex + 1}/${total} 请求` : "等待请求…"}
      </span>
      {record && (
        <>
          <span style={{
            background: "#2a2a2a", color: "#8af", padding: "1px 8px",
            borderRadius: "3px", fontSize: "11px", fontFamily: "system-ui, sans-serif",
          }}>
            {kindLabel(record.kind)}
          </span>
          <span style={{ color: "#888", fontFamily: "system-ui, sans-serif" }}>
            {(record.timing.totalMs / 1000).toFixed(1)}s
          </span>
          <span style={{ marginLeft: "auto" }}>{statusIcon(record)}</span>
        </>
      )}
    </div>
  );
}
```

- [ ] **Create TabBar.tsx**

```tsx
import type { TapTab } from "../types";

type TabBarProps = {
  active: TapTab;
  onChange: (tab: TapTab) => void;
};

const TABS: { key: TapTab; label: string }[] = [
  { key: "input", label: "输入" },
  { key: "output", label: "输出" },
  { key: "metrics", label: "指标" },
];

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <div style={{ display: "flex", borderBottom: "1px solid #333", flexShrink: 0, fontFamily: "system-ui, sans-serif" }}>
      {TABS.map((tab) => (
        <button key={tab.key} onClick={() => onChange(tab.key)}
          style={{
            flex: 1, padding: "8px 0", background: active === tab.key ? "#222" : "none",
            border: "none", borderBottom: active === tab.key ? "2px solid #8af" : "2px solid transparent",
            color: active === tab.key ? "#e0e0e0" : "#666", cursor: "pointer",
            fontSize: "12px", fontWeight: 500,
          }}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Create App.tsx**

```tsx
import { useState } from "react";
import { useTapChannel } from "./hooks/useTapChannel";
import { TopBar } from "./components/TopBar";
import { TabBar } from "./components/TabBar";
import { InputView } from "./components/InputView";
import { OutputView } from "./components/OutputView";
import { MetricsView } from "./components/MetricsView";
import type { TapTab } from "./types";

export function App() {
  const { records, currentIndex, goNext, goPrev } = useTapChannel(true);
  const [tab, setTab] = useState<TapTab>("input");
  const record = records[currentIndex] ?? null;

  return (
    <>
      <TopBar records={records} currentIndex={currentIndex} onPrev={goPrev} onNext={goNext} />
      {record ? (
        <>
          <TabBar active={tab} onChange={setTab} />
          <div style={{ flex: 1, overflow: "auto", padding: "10px 14px" }}>
            {tab === "input" && <InputView record={record} />}
            {tab === "output" && <OutputView record={record} />}
            {tab === "metrics" && <MetricsView record={record} />}
          </div>
        </>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontFamily: "system-ui, sans-serif" }}>
          等待第一个请求…
        </div>
      )}
    </>
  );
}
```

- [ ] **Verify**

Run: `npx tsc --noEmit`
Visit: `http://localhost:5173/tap.html`
Expected: TopBar renders with "等待请求…" state; play the game, requests appear with navigation.

---

### Task 5: Create InputView and JsonBlock

**Files:**
- Create: `src/tap/components/InputView.tsx`
- Create: `src/tap/components/JsonBlock.tsx`

**Interfaces:**
- Consumes: `TapRecord` from types
- Produces: Message tree view with collapsible sections; JSON syntax highlighting component

- [ ] **Create JsonBlock.tsx**

```tsx
import { type CSSProperties, Fragment } from "react";

type JsonBlockProps = {
  value: unknown;
  indent?: number;
  maxInitialLength?: number;
};

function JsonPrimitive(value: unknown): JSX.Element {
  if (value === null) return <span style={{ color: "#569cd6" }}>null</span>;
  if (typeof value === "string") return <span style={{ color: "#ce9178" }}>"{value}"</span>;
  if (typeof value === "number") return <span style={{ color: "#b5cea8" }}>{value}</span>;
  if (typeof value === "boolean") return <span style={{ color: "#569cd6" }}>{String(value)}</span>;
  return <span>{String(value)}</span>;
}

const KEY_STYLE: CSSProperties = { color: "#9cdcfe", marginRight: "4px" };
const INDENT = 16;

export function JsonBlock({ value, indent = 0 }: JsonBlockProps) {
  if (value === null || typeof value !== "object") {
    return JsonPrimitive(value);
  }

  if (Array.isArray(value)) {
    return (
      <span>
        [<br />
        {value.map((item, i) => (
          <span key={i}>
            <span style={{ display: "inline-block", width: INDENT * (indent + 1) }} />
            <JsonBlock value={item} indent={indent + 1} />
            {i < value.length - 1 ? "," : ""}
            <br />
          </span>
        ))}
        <span style={{ display: "inline-block", width: INDENT * indent }} />]
      </span>
    );
  }

  const entries = Object.entries(value as Record<string, unknown>);
  return (
    <span>
      {"{"}<br />
      {entries.map(([key, val], i) => (
        <span key={key}>
          <span style={{ display: "inline-block", width: INDENT * (indent + 1) }} />
          <span style={KEY_STYLE}>"{key}"</span>: <JsonBlock value={val} indent={indent + 1} />
          {i < entries.length - 1 ? "," : ""}
          <br />
        </span>
      ))}
      <span style={{ display: "inline-block", width: INDENT * indent }} />{"}"}
    </span>
  );
}
```

- [ ] **Create InputView.tsx**

```tsx
import { useState, type CSSProperties } from "react";
import type { TapRecord } from "../types";
import { JsonBlock } from "./JsonBlock";

type CollapsibleSectionProps = {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

function CollapsibleSection({ title, defaultOpen = true, children }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: "8px" }}>
      <button onClick={() => setOpen(!open)}
        style={{ background: "none", border: "none", color: "#8af", cursor: "pointer", fontSize: "12px", fontFamily: "system-ui, sans-serif", padding: "4px 0", display: "block" }}>
        {open ? "▼" : "▶"} {title}
      </button>
      {open && <div style={{ paddingLeft: "12px" }}>{children}</div>}
    </div>
  );
}

const MSG_LABELS: Record<string, { label: string; color: string }> = {
  system: { label: "SYSTEM", color: "#569cd6" },
  user: { label: "USER", color: "#ce9178" },
};

export function InputView({ record }: { record: TapRecord }) {
  let userPayload: unknown = null;
  let userIndex = -1;

  // Try to parse the USER message content as JSON for structured display
  for (let i = 0; i < record.messages.length; i++) {
    const msg = record.messages[i];
    if (msg.role === "user") {
      userIndex = i;
      try { userPayload = JSON.parse(msg.content); } catch { userPayload = msg.content; }
    }
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      {record.messages.map((msg, i) => {
        const style = MSG_LABELS[msg.role] ?? { label: msg.role.toUpperCase(), color: "#888" };
        const isUserPayload = i === userIndex && typeof userPayload === "object" && userPayload !== null;

        return (
          <div key={i} style={{ marginBottom: "12px" }}>
            <div style={{
              display: "inline-block", padding: "1px 8px", borderRadius: "3px",
              background: style.color + "22", color: style.color, fontSize: "10px",
              fontWeight: 600, marginBottom: "6px", fontFamily: "monospace",
            }}>
              {style.label} {i + 1}/{record.messages.length}
            </div>

            {isUserPayload ? (
              Object.entries(userPayload as Record<string, unknown>).map(([key, val]) => (
                <CollapsibleSection key={key} title={key} defaultOpen={key === "task" || key === "historyMoment"}>
                  {typeof val === "object" && val !== null ? (
                    <JsonBlock value={val} />
                  ) : (
                    <div style={{ color: "#ccc", whiteSpace: "pre-wrap", fontSize: "12px", lineHeight: 1.6 }}>{String(val)}</div>
                  )}
                </CollapsibleSection>
              ))
            ) : (
              <div style={{
                color: "#ccc", whiteSpace: "pre-wrap", fontSize: "12px",
                lineHeight: 1.6, maxHeight: "300px", overflow: "auto",
                background: "#111", padding: "8px", borderRadius: "4px",
              }}>
                {msg.content.length > 2000 ? msg.content.slice(0, 2000) + "\n\n...（截断，完整内容共 " + msg.content.length + " 字符）" : msg.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Verify**

Run: `npx tsc --noEmit`
Expected: TypeScript passes; Input tab in tap page shows messages with collapsible sections.

---

### Task 6: Create OutputView

**Files:**
- Create: `src/tap/components/OutputView.tsx`

**Interfaces:**
- Consumes: `TapRecord` from types
- Produces: Two sub-views — raw JSON with syntax highlight, and parsed structured view

- [ ] **Create OutputView.tsx**

```tsx
import { useMemo, useState, type CSSProperties } from "react";
import type { TapRecord } from "../types";
import { JsonBlock } from "./JsonBlock";

type ParsedTurn = {
  headline?: string;
  narrative?: string;
  choices?: Array<Record<string, unknown>>;
  rollChoices?: Array<Record<string, unknown>>;
  causalLedger?: unknown[];
  location?: string;
  role?: string;
  timePressure?: string;
  [key: string]: unknown;
};

function parseResponse(content: string): ParsedTurn | { error: string } | null {
  try {
    const parsed = JSON.parse(content);
    if (typeof parsed === "object" && parsed !== null) return parsed as ParsedTurn;
    return null;
  } catch {
    return { error: "JSON 解析失败" };
  }
}

function ChoiceCard({ card, index }: { card: Record<string, unknown>; index: number }) {
  const labels: Record<string, string> = { A: "循史", B: "破局", C: "天外" };
  const id = String(card.id ?? index);
  return (
    <div style={{
      border: "1px solid #333", borderRadius: "6px", padding: "10px",
      marginBottom: "8px", background: "#151515",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
        <span style={{
          background: id === "C" ? "#8a3a3a" : id === "B" ? "#3a5a3a" : "#3a3a5a",
          color: "#ddd", padding: "0 6px", borderRadius: "3px", fontSize: "11px",
          fontWeight: 600, fontFamily: "system-ui, sans-serif",
        }}>
          {id} · {labels[id] ?? id}
        </span>
        <span style={{ color: "#ddd", fontWeight: 600, fontFamily: "system-ui, sans-serif" }}>
          {String(card.displayLabel ?? card.label ?? "")}
        </span>
      </div>
      {card.label && (
        <div style={{ color: "#999", fontSize: "12px", marginBottom: "4px", fontFamily: "system-ui, sans-serif" }}>
          {String(card.label)}
        </div>
      )}
      {(card.actionSpec || card.instantEcho) && (
        <details style={{ marginTop: "4px" }}>
          <summary style={{ color: "#666", fontSize: "11px", cursor: "pointer", fontFamily: "system-ui, sans-serif" }}>详情</summary>
          <div style={{ padding: "6px 0 0 8px" }}>
            {card.actionSpec && (
              <JsonBlock value={card.actionSpec} />
            )}
            {card.instantEcho && (
              <div style={{ marginTop: "4px" }}>
                <JsonBlock value={card.instantEcho} />
              </div>
            )}
          </div>
        </details>
      )}
    </div>
  );
}

export function OutputView({ record }: { record: TapRecord }) {
  const [view, setView] = useState<"raw" | "parsed">("parsed");
  const parsed = useMemo(() => {
    if (!record.response) return null;
    return parseResponse(record.response);
  }, [record.response]);

  if (!record.response) {
    return (
      <div style={{ color: "#c55", fontFamily: "system-ui, sans-serif" }}>
        {record.error ? `请求失败: ${record.error.code} — ${record.error.message}` : "无响应"}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "10px" }}>
        <button onClick={() => setView("parsed")}
          style={{
            padding: "4px 12px", border: "1px solid #444", borderRadius: "4px",
            background: view === "parsed" ? "#2a2a2a" : "transparent",
            color: view === "parsed" ? "#e0e0e0" : "#888", cursor: "pointer", fontSize: "12px",
          }}>
          解析
        </button>
        <button onClick={() => setView("raw")}
          style={{
            padding: "4px 12px", border: "1px solid #444", borderRadius: "4px",
            background: view === "raw" ? "#2a2a2a" : "transparent",
            color: view === "raw" ? "#e0e0e0" : "#888", cursor: "pointer", fontSize: "12px",
          }}>
          原始 JSON
        </button>
      </div>

      {view === "raw" ? (
        <div style={{
          background: "#111", padding: "10px", borderRadius: "4px",
          whiteSpace: "pre-wrap", fontSize: "11px", lineHeight: 1.5,
          maxHeight: "calc(100vh - 200px)", overflow: "auto",
          fontFamily: "monospace", color: "#ccc",
        }}>
          {record.response}
        </div>
      ) : (
        <>
          {parsed && "error" in parsed ? (
            <div style={{ color: "#c55" }}>{parsed.error}</div>
          ) : parsed ? (
            <div>
              {/* 基本信息 */}
              {parsed.headline && (
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ color: "#888", fontSize: "11px", marginBottom: "2px" }}>标题</div>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: "#e0e0e0" }}>{parsed.headline}</div>
                </div>
              )}
              {parsed.narrative && (
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ color: "#888", fontSize: "11px", marginBottom: "2px" }}>叙事</div>
                  <div style={{ color: "#ccc", fontSize: "13px", lineHeight: 1.6 }}>{parsed.narrative}</div>
                </div>
              )}
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "12px", fontSize: "12px", color: "#999" }}>
                {parsed.location && <span>📍 {parsed.location}</span>}
                {parsed.role && <span>🎭 {parsed.role}</span>}
                {parsed.timePressure && <span>⏱ {parsed.timePressure}</span>}
              </div>

              {/* Choices */}
              {parsed.choices && (
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ color: "#888", fontSize: "11px", marginBottom: "6px", fontWeight: 600 }}>choices（首发三张）</div>
                  {parsed.choices.map((card, i) => (
                    <ChoiceCard key={i} card={card} index={i} />
                  ))}
                </div>
              )}
              {parsed.rollChoices && (
                <div>
                  <div style={{ color: "#888", fontSize: "11px", marginBottom: "6px", fontWeight: 600 }}>rollChoices（备选三张）</div>
                  {parsed.rollChoices.map((card, i) => (
                    <ChoiceCard key={i} card={card} index={i} />
                  ))}
                </div>
              )}

              {/* Other fields as JSON */}
              {(() => {
                const extras: Record<string, unknown> = {};
                for (const [key, val] of Object.entries(parsed)) {
                  if (["headline", "narrative", "location", "role", "timePressure", "choices", "rollChoices", "causalLedger"].includes(key)) continue;
                  extras[key] = val;
                }
                if (Object.keys(extras).length > 0) {
                  return (
                    <details style={{ marginTop: "12px" }}>
                      <summary style={{ color: "#666", fontSize: "11px", cursor: "pointer" }}>其他字段</summary>
                      <div style={{ padding: "8px 0 0 8px" }}>
                        <JsonBlock value={extras} />
                      </div>
                    </details>
                  );
                }
                return null;
              })()}
            </div>
          ) : (
            <div style={{ color: "#888" }}>无法解析响应内容</div>
          )}
        </>
      )}
    </div>
  );
}
```

- [ ] **Verify**

Run: `npx tsc --noEmit`
Expected: TypeScript passes; Output tab shows parsed card view and raw JSON toggle.

---

### Task 7: Create MetricsView

**Files:**
- Create: `src/tap/components/MetricsView.tsx`

**Interfaces:**
- Consumes: `TapRecord` from types
- Produces: Performance metrics table

- [ ] **Create MetricsView.tsx**

```tsx
import type { TapRecord } from "../types";

type MetricProps = {
  label: string;
  value: string | number | undefined | null;
  unit?: string;
};

function Metric({ label, value, unit }: MetricProps) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #222" }}>
      <span style={{ color: "#888", fontFamily: "system-ui, sans-serif" }}>{label}</span>
      <span style={{ color: "#e0e0e0", fontFamily: "monospace" }}>
        {value ?? "—"}
        {unit && value != null ? <span style={{ color: "#666", marginLeft: "4px" }}>{unit}</span> : null}
      </span>
    </div>
  );
}

export function MetricsView({ record }: { record: TapRecord }) {
  const t = record.timing;
  const u = record.usage;
  const kindLabel = (kind: string) => {
    if (kind.includes("turn-primary")) return "续幕主请求";
    if (kind.includes("repair")) return "字段修复";
    if (kind.includes("recovery")) return "高推理恢复";
    if (kind.includes("roll")) return "Roll";
    if (kind.includes("ending")) return "结局";
    return kind;
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <div style={{ fontSize: "13px", fontWeight: 600, color: "#e0e0e0", marginBottom: "8px" }}>请求信息</div>
      <div style={{ background: "#111", padding: "8px 12px", borderRadius: "6px", marginBottom: "16px" }}>
        <Metric label="请求类型" value={kindLabel(record.kind)} />
        <Metric label="原始类型" value={record.kind} />
        <Metric label="状态码" value={record.status} />
        <Metric label="状态" value={record.error ? "失败" : "成功"} />
        {record.error && (
          <>
            <Metric label="错误代码" value={record.error.code} />
            <Metric label="错误信息" value={record.error.message} />
          </>
        )}
      </div>

      <div style={{ fontSize: "13px", fontWeight: 600, color: "#e0e0e0", marginBottom: "8px" }}>时序</div>
      <div style={{ background: "#111", padding: "8px 12px", borderRadius: "6px", marginBottom: "16px" }}>
        <Metric label="总耗时" value={t.totalMs ? (t.totalMs / 1000).toFixed(2) : undefined} unit="s" />
        <Metric label="响应头到达" value={t.responseHeadersMs} unit="ms" />
        <Metric label="首次 reasoning token" value={t.firstReasoningTokenMs} unit="ms" />
        <Metric label="首次 content token" value={t.firstContentTokenMs} unit="ms" />
      </div>

      {u && (
        <>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#e0e0e0", marginBottom: "8px" }}>Token 用量</div>
          <div style={{ background: "#111", padding: "8px 12px", borderRadius: "6px" }}>
            <Metric label="Prompt" value={u.promptTokens} />
            <Metric label="Completion" value={u.completionTokens} />
            <Metric label="Reasoning" value={u.reasoningTokens} />
            <Metric label="Total" value={u.totalTokens} />
            <Metric label="Cache Hit" value={u.promptCacheHitTokens} />
            <Metric label="Cache Miss" value={u.promptCacheMissTokens} />
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Verify**

Run: `npx tsc --noEmit`
Expected: TypeScript passes.

---

### Task 8: Ship-ready cleanup

**Files:**
- All created files

- [ ] **Run full typecheck**

Run: `npx tsc --noEmit`
Expected: No errors in any file, including the modified `deepseek.ts`.

- [ ] **Dev-mode smoke test**

Run: `npm run dev`
Visit `http://localhost:5173/tap.html` - page loads with "等待第一个请求…"
Open game in another tab, play through a chapter
Switch back to tap - requests should appear with proper data

- [ ] **Verify production build exclusion**

Run: `npm run build`
Run: `npm run build:interactive` (if available)
Check that `dist/` contains no `tap.html` and no `src/tap/` artifacts
Expected: Only game production bundle, no tap files.

- [ ] **Commit**

```bash
git add tap.html src/tap/ src/services/deepseek.ts
git commit -m "feat: add LLM Tap debug inspector for DeepSeek requests"
```
