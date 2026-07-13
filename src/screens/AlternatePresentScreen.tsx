import { useState } from "react";
import { ArrowCounterClockwise, CheckCircle, CircleNotch, DownloadSimple } from "@phosphor-icons/react";
import type { AlternatePresent } from "../game/schema";
import { ResultFrontPage, type ResultReportPage } from "../components/ResultFrontPage";
import type { SaveFrontPageResult } from "../services/share";

export function AlternatePresentScreen({
  result,
  deviation: _deviation,
  onSave,
  onRestart,
}: {
  result: AlternatePresent;
  deviation: number;
  onSave: (result: AlternatePresent) => Promise<SaveFrontPageResult>;
  onRestart: () => void;
}) {
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [page, setPage] = useState<ResultReportPage>("biography");

  const save = async () => {
    setSaveState("saving");
    try {
      const saveResult = await onSave(result);
      setSaveState(saveResult === "cancelled" ? "idle" : "saved");
    } catch {
      setSaveState("error");
    }
  };

  const saveLabel = saveState === "saving"
    ? "正在生成报告"
    : saveState === "saved"
      ? "报告已保存"
      : saveState === "error"
        ? "重新保存报告"
        : "保存这一页";

  return (
    <main className={`result-screen is-${page}`}>
      <nav className="result-report-tabs" aria-label="切换最终报告">
        <button type="button" className={page === "biography" ? "is-active" : ""} onClick={() => { setPage("biography"); setSaveState("idle"); }}>穿越者列传</button>
        <button type="button" className={page === "world" ? "is-active" : ""} onClick={() => { setPage("world"); setSaveState("idle"); }}>被改变的 2026</button>
      </nav>
      <ResultFrontPage result={result} page={page} reportId="result-capture" />
      <div className="result-actions">
        <button className="primary-command" type="button" onClick={() => void save()} disabled={saveState === "saving"}>
          {saveState === "saving" ? <CircleNotch className="button-spinner" size={22} weight="bold" /> : saveState === "saved" ? <CheckCircle size={22} weight="fill" /> : <DownloadSimple size={22} weight="bold" />}
          {saveLabel}
        </button>
        {saveState === "error" && <p className="result-actions__status" role="status">报告生成失败，请重试</p>}
        <button className="secondary-command" type="button" onClick={onRestart}><ArrowCounterClockwise size={20} />再改一次历史</button>
      </div>
    </main>
  );
}
