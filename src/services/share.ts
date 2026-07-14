import { toBlob } from "html-to-image";

export type ReportExportPage = "biography" | "world";
export type SharePreparedReportResult = "shared" | "cancelled" | "unsupported";

export type PreparedReportImage = {
  blob: Blob;
  file: File;
  objectUrl: string;
  fileName: string;
  page: ReportExportPage;
  shareLine: string;
};

type RenderOptions = {
  backgroundColor: string;
  cacheBust: boolean;
  pixelRatio: number;
  width: number;
  height: number;
  style: Record<string, string>;
};

type ShareNavigator = {
  canShare?: (data: ShareData) => boolean;
  share?: (data: ShareData) => Promise<void>;
};

type PrepareDependencies = {
  renderToBlob: (node: HTMLElement, options: RenderOptions) => Promise<Blob | null>;
  document: Document;
  url: Pick<typeof URL, "createObjectURL" | "revokeObjectURL">;
};

type ShareDependencies = {
  navigator: ShareNavigator;
};

type DownloadDependencies = {
  document: Document;
};

type DisposeDependencies = {
  url: Pick<typeof URL, "revokeObjectURL">;
};

type MobileSaveEnvironment = {
  navigator: {
    userAgent?: string;
    maxTouchPoints?: number;
    userAgentData?: { mobile?: boolean };
  };
  matchMedia: (query: string) => { matches: boolean };
};

const DEFAULT_PREPARE_DEPENDENCIES: PrepareDependencies = {
  renderToBlob: toBlob,
  document: globalThis.document,
  url: globalThis.URL,
};

function pageName(page: ReportExportPage): string {
  return page === "biography" ? "穿越者列传" : "被改变的2026";
}

function fileNameFor(worldName: string, page: ReportExportPage): string {
  const safeWorldName = worldName
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "新历史";
  return `哎-我改变了历史-${pageName(page)}-${safeWorldName}.png`;
}

function isAbortError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "AbortError"
  );
}

export async function prepareReportImage(
  node: HTMLElement,
  content: { worldName: string; shareLine: string; page: ReportExportPage },
  overrides: Partial<PrepareDependencies> = {},
): Promise<PreparedReportImage> {
  const dependencies = { ...DEFAULT_PREPARE_DEPENDENCIES, ...overrides };
  await dependencies.document.fonts?.ready;

  const width = node.scrollWidth || node.clientWidth;
  const height = node.scrollHeight || node.clientHeight;
  if (width <= 0 || height <= 0) throw new Error("无法读取完整报告尺寸，请重试。");

  const blob = await dependencies.renderToBlob(node, {
    backgroundColor: "#efede6",
    cacheBust: true,
    pixelRatio: 2,
    width,
    height,
    style: {
      overflow: "visible",
      overflowX: "visible",
      overflowY: "visible",
      height: `${height}px`,
      maxHeight: "none",
    },
  });
  if (!blob) throw new Error("无法生成完整报告图片，请重试。");

  const fileName = fileNameFor(content.worldName, content.page);
  const file = new File([blob], fileName, { type: "image/png" });
  return {
    blob,
    file,
    objectUrl: dependencies.url.createObjectURL(blob),
    fileName,
    page: content.page,
    shareLine: content.shareLine,
  };
}

export async function sharePreparedReport(
  prepared: PreparedReportImage,
  overrides: Partial<ShareDependencies> = {},
): Promise<SharePreparedReportResult> {
  const shareNavigator = overrides.navigator ?? globalThis.navigator;
  const shareData: ShareData = {
    title: "哎！我改变了历史？",
    text: prepared.shareLine,
    files: [prepared.file],
  };

  try {
    if (!shareNavigator.share || !shareNavigator.canShare?.(shareData)) return "unsupported";
    await shareNavigator.share(shareData);
    return "shared";
  } catch (error) {
    return isAbortError(error) ? "cancelled" : "unsupported";
  }
}

export function downloadPreparedReport(
  prepared: PreparedReportImage,
  overrides: Partial<DownloadDependencies> = {},
): "downloaded" {
  const targetDocument = overrides.document ?? globalThis.document;
  const anchor = targetDocument.createElement("a");
  anchor.href = prepared.objectUrl;
  anchor.download = prepared.fileName;
  anchor.rel = "noopener";
  targetDocument.body.append(anchor);
  anchor.click();
  anchor.remove();
  return "downloaded";
}

export function disposePreparedReport(
  prepared: PreparedReportImage,
  overrides: Partial<DisposeDependencies> = {},
): void {
  (overrides.url ?? globalThis.URL).revokeObjectURL(prepared.objectUrl);
}

export function isMobileSavePlatform(overrides: Partial<MobileSaveEnvironment> = {}): boolean {
  const currentNavigator = (overrides.navigator ?? globalThis.navigator) as MobileSaveEnvironment["navigator"];
  const matchMedia = overrides.matchMedia
    ?? ((query: string) => globalThis.matchMedia?.(query) ?? { matches: false });
  const mobileHint = currentNavigator.userAgentData?.mobile;
  if (mobileHint === true) return true;

  const userAgent = currentNavigator.userAgent ?? "";
  const coarsePointer = matchMedia("(pointer: coarse)").matches;
  const mobileUserAgent = /Android|iPhone|iPad|iPod|Mobile|IEMobile|Opera Mini/i.test(userAgent);
  const touchMac = /Macintosh/i.test(userAgent) && (currentNavigator.maxTouchPoints ?? 0) > 1;
  return mobileUserAgent || (coarsePointer && touchMac);
}
