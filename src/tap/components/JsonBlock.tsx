import { useState, type CSSProperties, type ReactElement } from "react";

type JsonBlockProps = {
  value: unknown;
  /** Nesting depth — controls whether this block defaults open (level < 2) or closed (level >= 2) */
  level?: number;
};

function JsonPrimitive(value: unknown): ReactElement {
  if (value === null) return <span style={{ color: "#569cd6" }}>null</span>;
  if (typeof value === "string") return <span style={{ color: "#ce9178" }}>"{value}"</span>;
  if (typeof value === "number") return <span style={{ color: "#b5cea8" }}>{value}</span>;
  if (typeof value === "boolean") return <span style={{ color: "#569cd6" }}>{String(value)}</span>;
  return <span>{String(value)}</span>;
}

const KEY_STYLE: CSSProperties = { color: "#9cdcfe", marginRight: "6px" };
const INDENT = 16;
const TOGGLE_STYLE: CSSProperties = {
  color: "#666", cursor: "pointer", fontFamily: "monospace",
  fontSize: "12px", marginRight: "4px", userSelect: "none",
};

function ellipsis(value: unknown): string {
  if (Array.isArray(value)) return `[${value.length} 项]`;
  if (typeof value === "object" && value !== null) {
    const keys = Object.keys(value as Record<string, unknown>);
    return `{${keys.length} 键}`;
  }
  return String(value);
}

export function JsonBlock({ value, level = 0 }: JsonBlockProps) {
  if (value === null || typeof value !== "object") {
    return JsonPrimitive(value);
  }

  // Objects and arrays get a collapsible wrapper
  const defaultOpen = level < 2;
  const [open, setOpen] = useState(defaultOpen);
  const entries = Array.isArray(value)
    ? value.map((item, i) => ({ key: String(i), value: item }))
    : Object.entries(value as Record<string, unknown>).map(([k, v]) => ({ key: k, value: v }));

  return (
    <span>
      <span
        role="button"
        tabIndex={0}
        onClick={() => setOpen(o => !o)}
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(o => !o); } }}
        style={TOGGLE_STYLE}
      >
        {open ? "▼" : "▶"}
      </span>
      {open ? (
        <span>
          {Array.isArray(value) ? "[" : "{"}
          <br />
          {entries.map(({ key, value: val }, i) => (
            <span key={key}>
              <span style={{ display: "inline-block", width: INDENT * (level + 1) }} />
              {!Array.isArray(value) && <span style={KEY_STYLE}>"{key}"</span>}
              {!Array.isArray(value) && <span style={{ color: "#888" }}>: </span>}
              <JsonBlock value={val} level={level + 1} />
              {i < entries.length - 1 ? "," : ""}<br />
            </span>
          ))}
          <span style={{ display: "inline-block", width: INDENT * level }} />
          {Array.isArray(value) ? "]" : "}"}
        </span>
      ) : (
        <span style={{ color: "#888" }}>
          {Array.isArray(value) ? "[" : "{"}
          {ellipsis(value)}
          {Array.isArray(value) ? "]" : "}"}
        </span>
      )}
    </span>
  );
}
