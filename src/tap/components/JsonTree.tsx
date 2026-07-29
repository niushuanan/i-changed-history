import { useState, type ReactNode } from "react";

type JsonTreeProps = {
  value: unknown;
  /** Nesting level — shallow levels default open, deeper levels default closed */
  level?: number;
  /** Override default open state for all collapsible sections */
  defaultOpenOverride?: boolean;
};

const INDENT = 12;
const KEY_STYLE = { color: "#9cdcfe", marginRight: "6px" };
const PRIM_STYLE = { color: "#ce9178" };
const NUM_STYLE = { color: "#b5cea8" };
const NULL_STYLE = { color: "#569cd6" };
const SEP_STYLE = { color: "#888" };

function Primitive({ value }: { value: unknown }): ReactNode {
  if (value === null) return <span style={NULL_STYLE}>null</span>;
  if (typeof value === "string") return <span style={PRIM_STYLE}>"{value}"</span>;
  if (typeof value === "number") return <span style={NUM_STYLE}>{value}</span>;
  if (typeof value === "boolean") return <span style={NULL_STYLE}>{String(value)}</span>;
  return <span>{String(value)}</span>;
}

export function JsonTree({ value, level = 0, defaultOpenOverride }: JsonTreeProps) {
  if (value === null || typeof value !== "object") {
    return <Primitive value={value} />;
  }

  if (Array.isArray(value)) {
    return (
      <>
        {value.map((item, i) => (
          <div key={i} style={{ paddingLeft: INDENT }}>
            <span style={SEP_STYLE}>[{i}]</span> <JsonTree value={item} level={level + 1} defaultOpenOverride={defaultOpenOverride} />
          </div>
        ))}
      </>
    );
  }

  const entries = Object.entries(value as Record<string, unknown>);
  return (
    <>
      {entries.map(([key, val]) => (
        typeof val === "object" && val !== null ? (
          <CollapsibleSection key={key} title={key} defaultOpen={defaultOpenOverride ?? level < 2}>
            {Array.isArray(val) ? (
              val.length > 0 ? (
                val.map((item, i) => (
                  <div key={i} style={{ paddingLeft: INDENT }}>
                    <span style={SEP_STYLE}>[{i}]</span> <JsonTree value={item} level={level + 1} defaultOpenOverride={defaultOpenOverride} />
                  </div>
                ))
              ) : (
                <span style={SEP_STYLE}>[]</span>
              )
            ) : (
              <JsonTree value={val} level={level + 1} defaultOpenOverride={defaultOpenOverride} />
            )}
          </CollapsibleSection>
        ) : (
          <div key={key} style={{ marginBottom: "2px", paddingLeft: INDENT }}>
            <span style={KEY_STYLE}>{key}</span>
            <span style={SEP_STYLE}>: </span>
            <Primitive value={val} />
          </div>
        )
      ))}
    </>
  );
}

type CollapsibleSectionProps = {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

function CollapsibleSection({ title, defaultOpen = true, children }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: "4px" }}>
      <button onClick={() => setOpen(!open)}
        style={{ background: "none", border: "none", color: "#8af", cursor: "pointer", fontSize: "12px", fontFamily: "system-ui, sans-serif", padding: "4px 0", display: "block" }}>
        {open ? "▼" : "▶"} {title}
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}
