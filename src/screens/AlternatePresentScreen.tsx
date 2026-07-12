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
  result,
  deviation,
  onSave,
  onRestart,
}: {
  result: AlternatePresent;
  deviation: number;
  onSave: () => Promise<SaveFrontPageResult>;
  onRestart: () => void;
}) {
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const save = async () => {
    setSaveState("saving");
    try {
      const result = await onSave();
      setSaveState(result === "cancelled" ? "idle" : "saved");
    } catch {
      setSaveState("error");
    }
  };

  const saveLabel = saveState === "saving"
    ? "正在制版"
    : saveState === "saved"
      ? "头版已保存"
      : saveState === "error"
        ? "重新保存头版"
        : "保存这张头版";

  return (
    <main className="result-screen">
      <ResultFrontPage result={result} deviation={deviation} />
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
          <p className="result-actions__status" role="status">制版失败，请重试</p>
        )}
        <button className="secondary-command" type="button" onClick={onRestart}>
          <ArrowCounterClockwise size={20} />再改一次历史
        </button>
      </div>
    </main>
  );
}
