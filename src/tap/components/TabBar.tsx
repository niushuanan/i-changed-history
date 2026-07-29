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
