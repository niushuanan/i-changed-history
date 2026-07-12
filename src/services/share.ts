import { toBlob } from "html-to-image";

export type SaveFrontPageResult = "shared" | "downloaded" | "cancelled";

type RenderOptions = {
  backgroundColor: string;
  cacheBust: boolean;
  pixelRatio: number;
};

type ShareNavigator = {
  canShare?: (data: ShareData) => boolean;
  share?: (data: ShareData) => Promise<void>;
};

type SaveFrontPageDependencies = {
  renderToBlob: (node: HTMLElement, options: RenderOptions) => Promise<Blob | null>;
  navigator: ShareNavigator;
  document: Document;
  url: Pick<typeof URL, "createObjectURL" | "revokeObjectURL">;
  schedule: (callback: () => void) => void;
};

const DEFAULT_DEPENDENCIES: SaveFrontPageDependencies = {
  renderToBlob: toBlob,
  navigator: globalThis.navigator,
  document: globalThis.document,
  url: globalThis.URL,
  schedule: (callback) => window.setTimeout(callback, 0),
};

function fileNameFor(worldName: string): string {
  const safeWorldName = worldName.replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, "-");
  return `I-我改变了历史-${safeWorldName}.png`;
}

function isAbortError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "AbortError"
  );
}

export async function saveFrontPage(
  node: HTMLElement,
  content: { worldName: string; shareLine: string },
  overrides: Partial<SaveFrontPageDependencies> = {},
): Promise<SaveFrontPageResult> {
  const dependencies = { ...DEFAULT_DEPENDENCIES, ...overrides };
  await dependencies.document.fonts?.ready;

  const blob = await dependencies.renderToBlob(node, {
    backgroundColor: "#efede6",
    cacheBust: true,
    pixelRatio: 2,
  });
  if (!blob) throw new Error("无法生成头版图片，请重试。");

  const file = new File([blob], fileNameFor(content.worldName), { type: "image/png" });
  const shareData: ShareData = {
    title: "I！我改变了历史",
    text: content.shareLine,
    files: [file],
  };

  if (
    dependencies.navigator.share &&
    dependencies.navigator.canShare?.(shareData)
  ) {
    try {
      await dependencies.navigator.share(shareData);
      return "shared";
    } catch (error) {
      if (isAbortError(error)) return "cancelled";
    }
  }

  const objectUrl = dependencies.url.createObjectURL(blob);
  const anchor = dependencies.document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = file.name;
  anchor.rel = "noopener";
  dependencies.document.body.append(anchor);
  anchor.click();
  anchor.remove();
  dependencies.schedule(() => dependencies.url.revokeObjectURL(objectUrl));
  return "downloaded";
}
