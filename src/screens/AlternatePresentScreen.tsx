import { useState } from "react";
import {
  ArrowCounterClockwise,
  CheckCircle,
  CircleNotch,
  DownloadSimple,
} from "@phosphor-icons/react";
import type { AlternatePresent } from "../game/schema";
import { ResultFrontPage } from "../components/ResultFrontPage";
import type { SaveFrontPageResult } from "../services/share";

export function AlternatePresentScreen({
  playerResult,
  instinctResult,
  playerDeviation,
  instinctDeviation,
  onSave,
  onRestart,
}: {
  playerResult: AlternatePresent;
  instinctResult: AlternatePresent;
  playerDeviation: number;
  instinctDeviation: number;
  onSave: (result: AlternatePresent) => Promise<SaveFrontPageResult>;
  onRestart: () => void;
}) {
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [activeReport, setActiveReport] = useState<"player" | "instinct">("player");
  const result = activeReport === "player" ? playerResult : instinctResult;
  const deviation = activeReport === "player" ? playerDeviation : instinctDeviation;

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
        : "保存历史报告";

  return (
    <main className="result-screen">
      <nav className="parallel-report-tabs" aria-label="选择历史报告">
        <button type="button" className={activeReport === "player" ? "is-active" : ""} onClick={() => { setActiveReport("player"); setSaveState("idle"); }}>你亲手选择的世界</button>
        <button type="button" className={activeReport === "instinct" ? "is-active" : ""} onClick={() => { setActiveReport("instinct"); setSaveState("idle"); }}>如果你始终听从第一反应</button>
      </nav>
      <ResultFrontPage result={result} deviation={deviation} reportId="result-capture" />
      <div className="result-actions">
        <button
          className="primary-command"
          type="button"
          onClick={() => void save()}
          disabled={saveState === "saving"}
        >
          {saveState === "saving" ? (
            <CircleNotch className="button-spinner" size={22} weight="bold" />
          ) : saveState === "saved" ? (
            <CheckCircle size={22} weight="fill" />
          ) : (
            <DownloadSimple size={22} weight="bold" />
          )}
          {saveLabel}
        </button>
        {saveState === "error" && (
          <p className="result-actions__status" role="status">报告生成失败，请重试</p>
        )}
        <button className="secondary-command" type="button" onClick={onRestart}>
          <ArrowCounterClockwise size={20} />再改一次历史
        </button>
      </div>
    </main>
  );
}
