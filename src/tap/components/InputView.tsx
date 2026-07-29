import { useState, type CSSProperties } from "react";
import type { TapRecord } from "../types";
import { JsonTree } from "./JsonTree";

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
  const [view, setView] = useState<"tree" | "raw">("tree");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [treeVersion, setTreeVersion] = useState(0);

  // Per-role counts for numbering (e.g. SYSTEM 1/2, USER 1/1)
  const roleCounts: Record<string, number> = {};
  for (const msg of record.messages) {
    roleCounts[msg.role] = (roleCounts[msg.role] ?? 0) + 1;
  }

  // Identify messages whose content is parseable JSON
  const parsed: Record<number, Record<string, unknown>> = {};
  for (let i = 0; i < record.messages.length; i++) {
    try {
      const obj = JSON.parse(record.messages[i].content);
      if (typeof obj === "object" && obj !== null) {
        parsed[i] = obj;
      }
    } catch { /* not JSON, show as text */ }
  }

  // Find first user message for special USER structured display
  let userPayload: unknown = null;
  let userIndex = -1;
  for (let i = 0; i < record.messages.length; i++) {
    if (record.messages[i].role === "user") {
      userIndex = i;
      userPayload = parsed[i] ?? record.messages[i].content;
    }
  }

  const roleIndex: Record<string, number> = {};

  const toggleExpand = () => {
    setIsCollapsed(v => !v);
    setTreeVersion(v => v + 1);
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "10px" }}>
        <button onClick={() => setView("tree")}
          style={{
            padding: "4px 12px", border: "1px solid #444", borderRadius: "4px",
            background: view === "tree" ? "#2a2a2a" : "transparent",
            color: view === "tree" ? "#e0e0e0" : "#888", cursor: "pointer", fontSize: "12px",
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
        <div style={{ flex: 1 }} />
        {view === "tree" && (
          <button onClick={toggleExpand}
            style={{
              padding: "4px 12px", border: "1px solid #444", borderRadius: "4px",
              background: "transparent", color: "#888", cursor: "pointer", fontSize: "12px",
            }}>
            {isCollapsed ? "全部展开" : "全部折叠"}
          </button>
        )}
      </div>
      {view === "raw" ? (
        record.messages.map((msg, i) => {
          const rawLabel = MSG_LABELS[msg.role]?.label ?? msg.role.toUpperCase();
          return (
          <div key={i} style={{ marginBottom: "16px" }}>
            <div style={{
              display: "inline-block", padding: "1px 8px", borderRadius: "3px",
              background: "#569cd622", color: "#569cd6", fontSize: "10px",
              fontWeight: 600, marginBottom: "6px", fontFamily: "monospace",
            }}>
              {MSG_LABELS[msg.role]?.label ?? msg.role.toUpperCase()}
            </div>
            <div style={{
              background: "#111", padding: "10px", borderRadius: "4px",
              whiteSpace: "pre-wrap", fontSize: "11px", lineHeight: 1.5,
              maxHeight: "calc(100vh - 200px)", overflow: "auto",
              fontFamily: "monospace", color: "#ccc",
            }}>
              {msg.content}
            </div>
          </div>
        )})
      ) : (
        <div key={treeVersion}>
        {record.messages.map((msg, i) => {
        roleIndex[msg.role] = (roleIndex[msg.role] ?? 0) + 1;
        const style = MSG_LABELS[msg.role] ?? { label: msg.role.toUpperCase(), color: "#888" };
        const jsonObj = parsed[i];
        const isUserPayload = i === userIndex && typeof userPayload === "object" && userPayload !== null;
        const isJsonMessage = jsonObj !== undefined && !isUserPayload;

        return (
          <div key={i} style={{ marginBottom: "12px" }}>
            <div style={{
              display: "inline-block", padding: "1px 8px", borderRadius: "3px",
              background: style.color + "22", color: style.color, fontSize: "10px",
              fontWeight: 600, marginBottom: "6px", fontFamily: "monospace",
            }}>
              {style.label} {roleIndex[msg.role]}/{roleCounts[msg.role]}
            </div>

            {isJsonMessage ? (
              Object.entries(jsonObj).map(([key, val]) => (
                typeof val === "object" && val !== null ? (
                  <CollapsibleSection key={key} title={key} defaultOpen={false}>
                    <JsonTree value={val} />
                  </CollapsibleSection>
                ) : (
                  <div key={key} style={{ color: "#ccc", fontSize: "12px", lineHeight: 1.6, marginBottom: "4px" }}>
                    <span style={{ color: "#9cdcfe", marginRight: "6px" }}>{key}</span>
                    {String(val)}
                  </div>
                )
              ))
            ) : isUserPayload ? (
              Object.entries(userPayload as Record<string, unknown>).map(([key, val]) => (
                <CollapsibleSection key={key} title={key} defaultOpen={key === "task" || key === "historyMoment"}>
                  <JsonTree value={val} />
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
      )}
    </div>
  );
}
