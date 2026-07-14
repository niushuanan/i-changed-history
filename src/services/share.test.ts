import { afterEach, describe, expect, it, vi } from "vitest";
import {
  disposePreparedReport,
  downloadPreparedReport,
  isMobileSavePlatform,
  prepareReportImage,
  sharePreparedReport,
} from "./share";

const blob = new Blob(["png"], { type: "image/png" });

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

describe("report image preparation", () => {
  it("renders the complete scroll area at two-times resolution", async () => {
    const node = document.createElement("article");
    Object.defineProperties(node, {
      scrollWidth: { configurable: true, value: 390 },
      scrollHeight: { configurable: true, value: 1800 },
    });
    const renderToBlob = vi.fn().mockResolvedValue(blob);
    const createObjectURL = vi.fn().mockReturnValue("blob:complete-report");

    const prepared = await prepareReportImage(node, {
      worldName: "城网纪元",
      shareLine: "我把历史改写到了 2026。",
      page: "world",
    }, {
      renderToBlob,
      document,
      url: { createObjectURL, revokeObjectURL: vi.fn() },
    });

    expect(renderToBlob).toHaveBeenCalledWith(node, {
      backgroundColor: "#efede6",
      cacheBust: true,
      pixelRatio: 2,
      width: 390,
      height: 1800,
      style: {
        overflow: "visible",
        overflowX: "visible",
        overflowY: "visible",
        height: "1800px",
        maxHeight: "none",
      },
    });
    expect(prepared).toMatchObject({
      blob,
      objectUrl: "blob:complete-report",
      page: "world",
      fileName: expect.stringContaining("被改变的2026"),
      file: expect.any(File),
    });
    expect(createObjectURL).toHaveBeenCalledWith(blob);
  });

  it("names the biography export for the page being saved", async () => {
    const node = document.createElement("article");
    Object.defineProperties(node, {
      scrollWidth: { configurable: true, value: 390 },
      scrollHeight: { configurable: true, value: 844 },
    });

    const prepared = await prepareReportImage(node, {
      worldName: "城/网:纪元",
      shareLine: "头版",
      page: "biography",
    }, {
      renderToBlob: vi.fn().mockResolvedValue(blob),
      document,
      url: { createObjectURL: vi.fn().mockReturnValue("blob:biography"), revokeObjectURL: vi.fn() },
    });

    expect(prepared.fileName).toContain("穿越者列传");
    expect(prepared.fileName).not.toMatch(/[\\/:*?"<>|]/);
  });

  it("fails clearly when the complete page cannot be rendered", async () => {
    const node = document.createElement("article");
    Object.defineProperties(node, {
      scrollWidth: { configurable: true, value: 390 },
      scrollHeight: { configurable: true, value: 844 },
    });
    await expect(
      prepareReportImage(node, {
        worldName: "城网纪元",
        shareLine: "头版",
        page: "world",
      }, {
        renderToBlob: vi.fn().mockResolvedValue(null),
        document,
        url: { createObjectURL: vi.fn(), revokeObjectURL: vi.fn() },
      }),
    ).rejects.toThrow("无法生成完整报告图片");
  });
});

describe("prepared report delivery", () => {
  const prepared = {
    blob,
    file: new File([blob], "report.png", { type: "image/png" }),
    objectUrl: "blob:prepared-report",
    fileName: "report.png",
    page: "world" as const,
    shareLine: "我把历史改写到了 2026。",
  };

  it("shares a prepared file only when file sharing is supported", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const canShare = vi.fn().mockReturnValue(true);

    await expect(sharePreparedReport(prepared, { navigator: { share, canShare } })).resolves.toBe("shared");

    expect(share).toHaveBeenCalledWith({
      title: "哎！我改变了历史？",
      text: prepared.shareLine,
      files: [prepared.file],
    });
  });

  it("keeps a cancelled prepared image available", async () => {
    const abortError = new DOMException("cancelled", "AbortError");
    const share = vi.fn().mockRejectedValue(abortError);

    await expect(sharePreparedReport(prepared, {
      navigator: { share, canShare: () => true },
    })).resolves.toBe("cancelled");
  });

  it("reports unsupported sharing without downloading implicitly", async () => {
    const share = vi.fn();

    await expect(sharePreparedReport(prepared, {
      navigator: { share, canShare: () => false },
    })).resolves.toBe("unsupported");
    expect(share).not.toHaveBeenCalled();
  });

  it("downloads and disposes the same prepared object URL explicitly", () => {
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const revokeObjectURL = vi.fn();

    expect(downloadPreparedReport(prepared, { document })).toBe("downloaded");
    expect(click).toHaveBeenCalledOnce();
    expect(document.querySelector("a")).not.toBeInTheDocument();

    disposePreparedReport(prepared, { url: { revokeObjectURL } });
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:prepared-report");
  });
});

describe("mobile save platform detection", () => {
  it("uses the user-agent mobile hint when available", () => {
    expect(isMobileSavePlatform({
      navigator: { userAgent: "Desktop", userAgentData: { mobile: true } },
      matchMedia: () => ({ matches: false }),
    })).toBe(true);
  });

  it("recognizes a coarse mobile browser without treating a desktop as mobile", () => {
    expect(isMobileSavePlatform({
      navigator: { userAgent: "Mozilla/5.0 (Linux; Android 15) Mobile" },
      matchMedia: () => ({ matches: true }),
    })).toBe(true);
    expect(isMobileSavePlatform({
      navigator: { userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X)" },
      matchMedia: () => ({ matches: false }),
    })).toBe(false);
  });
});
