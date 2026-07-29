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
      {!!card.label && (
        <div style={{ color: "#999", fontSize: "12px", marginBottom: "4px", fontFamily: "system-ui, sans-serif" }}>
          {String(card.label)}
        </div>
      )}
      {(!!card.actionSpec || !!card.instantEcho) && (
        <details style={{ marginTop: "4px" }}>
          <summary style={{ color: "#666", fontSize: "11px", cursor: "pointer", fontFamily: "system-ui, sans-serif" }}>详情</summary>
          <div style={{ padding: "6px 0 0 8px" }}>
            {!!card.actionSpec && (
              <JsonBlock value={card.actionSpec} />
            )}
            {!!card.instantEcho && (
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
            <div style={{ color: "#c55" }}>{String(parsed.error)}</div>
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
