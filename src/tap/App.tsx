import { useState } from "react";
import { useTapChannel } from "./hooks/useTapChannel";
import { TopBar } from "./components/TopBar";
import { TabBar } from "./components/TabBar";
import { InputView } from "./components/InputView";
import { OutputView } from "./components/OutputView";
import { MetricsView } from "./components/MetricsView";
import type { TapTab } from "./types";

export function App() {
  const { records, currentIndex, goNext, goPrev, clear, exportJson } = useTapChannel(true);
  const [tab, setTab] = useState<TapTab>("input");
  const record = records[currentIndex] ?? null;

  return (
    <>
      <TopBar records={records} currentIndex={currentIndex} totalRecords={records.length} onPrev={goPrev} onNext={goNext} onExport={exportJson} onClear={clear} />
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
