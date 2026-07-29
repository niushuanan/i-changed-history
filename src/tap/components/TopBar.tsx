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
  totalRecords: number;
  onPrev: () => void;
  onNext: () => void;
  onExport: () => void;
  onClear: () => void;
};

export function TopBar({ records, currentIndex, totalRecords, onPrev, onNext, onExport, onClear }: TopBarProps) {
  const record = records[currentIndex];

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
      <button onClick={onNext} disabled={currentIndex >= totalRecords - 1}
        style={{ background: "none", border: "1px solid #444", color: "#ccc", borderRadius: "4px", padding: "2px 8px", cursor: "pointer", fontSize: "14px", opacity: currentIndex >= totalRecords - 1 ? 0.3 : 1 }}>
        ▶
      </button>
      <span style={{ fontWeight: 600, color: "#aaa", marginLeft: "4px", fontFamily: "system-ui, sans-serif" }}>LLM Tap</span>
      <span style={{ color: "#666", fontFamily: "system-ui, sans-serif" }}>
        {totalRecords > 0 ? `第 ${currentIndex + 1}/${totalRecords} 请求` : "等待请求…"}
      </span>
      {record && (
        <>
          <span style={{ color: "#666", fontFamily: "system-ui, sans-serif", fontSize: "12px" }}>
            {new Date(record.timing.requestedAt ?? (record.timestamp - record.timing.totalMs)).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            {" → "}
            {new Date(record.timestamp).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
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
      {totalRecords > 0 && (
        <div style={{ display: "flex", gap: "4px", marginLeft: record ? "0" : "auto" }}>
          <button onClick={onExport}
            style={{ background: "none", border: "1px solid #444", color: "#888", borderRadius: "4px", padding: "2px 8px", cursor: "pointer", fontSize: "11px", fontFamily: "system-ui, sans-serif" }}>
            导出
          </button>
          <button onClick={onClear}
            style={{ background: "none", border: "1px solid #444", color: "#888", borderRadius: "4px", padding: "2px 8px", cursor: "pointer", fontSize: "11px", fontFamily: "system-ui, sans-serif" }}>
            清空
          </button>
        </div>
      )}
    </div>
  );
}
