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
