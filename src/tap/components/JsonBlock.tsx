import { type CSSProperties } from "react";

type JsonBlockProps = {
  value: unknown;
  indent?: number;
  maxInitialLength?: number;
};

function JsonPrimitive(value: unknown): React.ReactElement {
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
