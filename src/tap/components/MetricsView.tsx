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
