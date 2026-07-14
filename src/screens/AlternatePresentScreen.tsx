import { useEffect, useRef, useState } from "react";
import {
  ArrowCounterClockwise,
  CheckCircle,
  CircleNotch,
  DownloadSimple,
  ShareNetwork,
} from "@phosphor-icons/react";
import type { AlternatePresent } from "../game/schema";
import { ResultFrontPage, type ResultReportPage } from "../components/ResultFrontPage";
import type { PreparedReportImage, SharePreparedReportResult } from "../services/share";

type SaveState =
  | "idle"
  | "preparing"
  | "prepared"
  | "sharing"
  | "shared"
  | "cancelled"
  | "unsupported"
  | "downloaded"
  | "error";

export function AlternatePresentScreen({
  result,
  deviation: _deviation,
  isMobileSave,
  onPrepare,
  onShare,
  onDownload,
  onDispose,
  onRestart,
}: {
  result: AlternatePresent;
  deviation: number;
  isMobileSave: boolean;
  onPrepare: (result: AlternatePresent, page: ResultReportPage) => Promise<PreparedReportImage>;
  onShare: (prepared: PreparedReportImage) => Promise<SharePreparedReportResult>;
  onDownload: (prepared: PreparedReportImage) => "downloaded";
  onDispose: (prepared: PreparedReportImage) => void;
  onRestart: () => void;
}) {
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [status, setStatus] = useState<string | null>(null);
  const [page, setPage] = useState<ResultReportPage>("biography");
  const preparedRef = useRef<PreparedReportImage | null>(null);
  const preparationIdRef = useRef(0);

  useEffect(() => () => {
    preparationIdRef.current += 1;
    if (preparedRef.current) {
      onDispose(preparedRef.current);
      preparedRef.current = null;
    }
  }, [onDispose]);

  const releasePrepared = () => {
    if (!preparedRef.current) return;
    onDispose(preparedRef.current);
    preparedRef.current = null;
  };

  const prepare = async () => {
    const preparationId = preparationIdRef.current + 1;
    preparationIdRef.current = preparationId;
    releasePrepared();
    setSaveState("preparing");
    setStatus(null);
    try {
      const image = await onPrepare(result, page);
      if (preparationIdRef.current !== preparationId) {
        onDispose(image);
        return;
      }
      preparedRef.current = image;
      if (isMobileSave) {
        setSaveState("prepared");
        setStatus("图片已准备好。点击后请在系统面板选择“存储图像/保存到相册”；若没有该选项，可下载 PNG。");
      } else {
        onDownload(image);
        setSaveState("downloaded");
        setStatus("PNG 已下载到本地。");
      }
    } catch {
      if (preparationIdRef.current !== preparationId) return;
      setSaveState("error");
      setStatus("完整图片生成失败，请重试。");
    }
  };

  const openSystemSave = async () => {
    const image = preparedRef.current;
    if (!image) {
      await prepare();
      return;
    }
    setSaveState("sharing");
    setStatus("正在打开系统保存面板…");
    const shareResult = await onShare(image);
    if (preparedRef.current !== image) return;
    const nextState: Record<SharePreparedReportResult, SaveState> = {
      shared: "shared",
      cancelled: "cancelled",
      unsupported: "unsupported",
    };
    setSaveState(nextState[shareResult]);
    setStatus(shareResult === "shared"
      ? "系统操作已完成；是否存入相册取决于你在系统面板中的选择。"
      : shareResult === "cancelled"
        ? "已取消，图片仍可保存。"
        : "当前浏览器无法打开系统保存，可下载 PNG。");
  };

  const downloadFallback = () => {
    const image = preparedRef.current;
    if (!image) return;
    onDownload(image);
    setSaveState("downloaded");
    setStatus(isMobileSave
      ? "PNG 已下载，可在系统的“文件/下载”中查看。"
      : "PNG 已下载到本地。");
  };

  const changePage = (nextPage: ResultReportPage) => {
    if (nextPage === page) return;
    preparationIdRef.current += 1;
    releasePrepared();
    setPage(nextPage);
    setSaveState("idle");
    setStatus(null);
  };

  const restart = () => {
    preparationIdRef.current += 1;
    releasePrepared();
    onRestart();
  };

  const primaryAction = isMobileSave && preparedRef.current
    ? openSystemSave
    : saveState === "downloaded" && !isMobileSave
      ? downloadFallback
      : prepare;
  const primaryLabel = saveState === "preparing"
    ? "正在生成完整图片"
    : saveState === "sharing"
      ? "正在打开系统保存"
      : saveState === "downloaded" && !isMobileSave
        ? "PNG 已下载"
        : saveState === "error"
          ? "重新生成图片"
          : isMobileSave && preparedRef.current
            ? saveState === "prepared" ? "打开系统保存" : "再次打开系统保存"
            : "保存这一页";
  const busy = saveState === "preparing" || saveState === "sharing";

  return (
    <main className={`result-screen is-${page}`}>
      <nav className="result-report-tabs" aria-label="切换最终报告">
        <button type="button" disabled={busy} className={page === "biography" ? "is-active" : ""} onClick={() => changePage("biography")}>穿越者列传</button>
        <button type="button" disabled={busy} className={page === "world" ? "is-active" : ""} onClick={() => changePage("world")}>被改变的 2026</button>
      </nav>
      <ResultFrontPage result={result} page={page} reportId="result-capture" />
      <div className="result-actions">
        <button className="primary-command" type="button" onClick={() => void primaryAction()} disabled={busy}>
          {busy
            ? <CircleNotch className="button-spinner" size={22} weight="bold" />
            : isMobileSave && preparedRef.current
              ? <ShareNetwork size={22} weight="bold" />
              : saveState === "downloaded"
                ? <CheckCircle size={22} weight="fill" />
                : <DownloadSimple size={22} weight="bold" />}
          {primaryLabel}
        </button>
        {status && <p className="result-actions__status" role="status">{status}</p>}
        {isMobileSave && preparedRef.current && (
          <button className="result-actions__download" type="button" onClick={downloadFallback} disabled={busy}>
            <DownloadSimple size={18} weight="bold" />下载 PNG
          </button>
        )}
        <button className="secondary-command" type="button" onClick={restart}><ArrowCounterClockwise size={20} />再改一次历史</button>
      </div>
    </main>
  );
}
